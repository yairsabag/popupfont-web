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
 *   - subscription_created: create subscription + license key
 *   - subscription_updated: update subscription status
 *   - subscription_cancelled: mark subscription as cancelled
 *   - license_key_created: store the generated license key
 */

const PLAN_BY_VARIANT: Record<string, { name: string; deviceLimit: number }> = {
  '1575477': { name: 'basic', deviceLimit: 1 },
  '1575461': { name: 'pro', deviceLimit: 3 },
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
        const plan = PLAN_BY_VARIANT[variantId] || { name: 'basic', deviceLimit: 1 };

        // Find existing subscription by ls_subscription_id
        const existing = await databases.listDocuments(databaseId, collections.subscriptions, [
          Query.equal('ls_subscription_id', subscriptionId),
          Query.limit(1),
        ]);

        const subData = {
          ls_subscription_id: subscriptionId,
          status: attrs.status,
          plan: plan.name,
          device_limit: plan.deviceLimit,
          customer_email: attrs.user_email,
          variant_id: variantId,
          renews_at: attrs.renews_at,
          ends_at: attrs.ends_at,
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
            { ...subData, user_id: customData.device_id || attrs.user_email }
          );
        }
        break;
      }

      case 'subscription_cancelled': {
        const subscriptionId = String(data.id);
        const existing = await databases.listDocuments(databaseId, collections.subscriptions, [
          Query.equal('ls_subscription_id', subscriptionId),
          Query.limit(1),
        ]);
        if (existing.documents.length > 0) {
          await databases.updateDocument(
            databaseId,
            collections.subscriptions,
            existing.documents[0].$id,
            { status: 'cancelled' }
          );
        }
        break;
      }

      case 'license_key_created': {
        const attrs = data.attributes;
        const licenseKey = attrs.key;
        const orderId = String(attrs.order_id);
        const customerEmail = attrs.user_email;
        const variantId = String(attrs.variant_id);
        const plan = PLAN_BY_VARIANT[variantId] || { name: 'basic', deviceLimit: 1 };

        // Check if license already exists
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
              user_id: customData.device_id || customerEmail,
              customer_email: customerEmail,
              ls_order_id: orderId,
              ls_license_id: String(data.id),
              plan: plan.name,
              device_limit: plan.deviceLimit,
              is_active: true,
              activations: 0,
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
