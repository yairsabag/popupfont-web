import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query, ID } from 'node-appwrite';
import crypto from 'crypto';

/**
 * POST /api/webhook/lemonsqueezy
 *
 * Receives webhook events from Lemon Squeezy and updates the database.
 *
 * Events handled:
 *   - subscription_created
 *   - subscription_updated
 *   - subscription_cancelled
 *   - license_key_created
 */

const PLAN_BY_VARIANT: Record<string, { name: string; maxDevices: number; priceCents: number }> = {
  '1575477': { name: 'basic', maxDevices: 1, priceCents: 900 },
  '1575461': { name: 'pro',   maxDevices: 3, priceCents: 1500 },
};

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(
      Buffer.from(digest, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

    if (!secret) {
      console.error('LEMONSQUEEZY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    if (!verifySignature(rawBody, signature, secret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const data = event.data;
    const customData = event.meta?.custom_data || {};

    console.log('LS webhook:', eventName);

    const { databases } = createAdminClient();
    const { databaseId, collections } = APPWRITE_CONFIG;

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        const attrs = data.attributes;
        const subscriptionId = String(data.id);
        const variantId = String(attrs.variant_id);
        const productId = String(attrs.product_id || '');
        const customerId = String(attrs.customer_id || '');
        const plan = PLAN_BY_VARIANT[variantId] || { name: 'basic', maxDevices: 1, priceCents: 900 };

        const userIdFromCustom = customData.device_id || customData.user_id || attrs.user_email;

        const existing = await databases.listDocuments(databaseId, collections.subscriptions, [
          Query.equal('ls_subscription_id', subscriptionId),
          Query.limit(1),
        ]);

        const subData: Record<string, any> = {
          ls_subscription_id: subscriptionId,
          ls_customer_id: customerId,
          ls_variant_id: variantId,
          ls_product_id: productId,
          status: attrs.status,
          plan: plan.name,
          max_devices: plan.maxDevices,
          price_cents: plan.priceCents,
          currency: 'USD',
          current_period_start: attrs.created_at || null,
          current_period_end: attrs.renews_at || null,
          cancelled_at: attrs.ends_at || null,
        };

        if (existing.documents.length > 0) {
          await databases.updateDocument(
            databaseId,
            collections.subscriptions,
            existing.documents[0].$id,
            subData
          );
        } else {
          await databases.createDocument(
            databaseId,
            collections.subscriptions,
            ID.unique(),
            { ...subData, user_id: userIdFromCustom }
          );
        }
        break;
      }

      case 'subscription_cancelled': {
        const subscriptionId = String(data.id);
        const attrs = data.attributes;
        const existing = await databases.listDocuments(databaseId, collections.subscriptions, [
          Query.equal('ls_subscription_id', subscriptionId),
          Query.limit(1),
        ]);
        if (existing.documents.length > 0) {
          await databases.updateDocument(
            databaseId,
            collections.subscriptions,
            existing.documents[0].$id,
            {
              status: 'cancelled',
              cancelled_at: attrs.ends_at || new Date().toISOString(),
            }
          );
        }
        break;
      }

      case 'license_key_created': {
        const attrs = data.attributes;
        const licenseKey = attrs.key;
        const customerEmail = attrs.user_email;
        const userIdFromCustom = customData.device_id || customData.user_id || customerEmail;

        const existing = await databases.listDocuments(databaseId, collections.licenses, [
          Query.equal('license_key', licenseKey),
          Query.limit(1),
        ]);

        if (existing.documents.length === 0) {
          await databases.createDocument(
            databaseId,
            collections.licenses,
            ID.unique(),
            {
              license_key: licenseKey,
              user_id: userIdFromCustom,
              is_active: true,
            }
          );
        }
        break;
      }

      default:
        console.log('Unhandled LS event:', eventName);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
