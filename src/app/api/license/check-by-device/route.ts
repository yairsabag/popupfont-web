import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query } from 'node-appwrite';

/**
 * POST /api/license/check-by-device
 *
 * Desktop app calls this on startup and periodically to check if a subscription
 * is active for this device's user_number (device_id).
 *
 * Body: { device_id: string }
 *
 * Returns:
 *   { active: true, plan, status, expires_at, max_devices }
 *   { active: false, reason }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { device_id } = body;

    if (!device_id) {
      return NextResponse.json({ active: false, reason: 'Missing device_id' }, { status: 400 });
    }

    const { databases } = createAdminClient();
    const { databaseId, collections } = APPWRITE_CONFIG;

    // Find all subscriptions for this device, prefer active ones
    const subRes = await databases.listDocuments(databaseId, collections.subscriptions, [
      Query.equal('user_id', device_id),
      Query.orderDesc('$createdAt'),
      Query.limit(20),
    ]);

    if (subRes.documents.length === 0) {
      return NextResponse.json({ active: false, reason: 'No subscription found' });
    }

    // Prefer active/trialing, then "cancelled but still in paid period"
    const now = new Date();
    const activeStatuses = ['active', 'trialing', 'on_trial', 'past_due'];
    const isStillUsable = (d: any) => {
      if (activeStatuses.includes(d.status)) return true;
      if (d.status === 'cancelled' && d.current_period_end && new Date(d.current_period_end) > now) return true;
      return false;
    };
    const sub = subRes.documents.find(isStillUsable) || subRes.documents[0];
    const validStatuses = ['active', 'trialing', 'on_trial', 'past_due'];
    const isActive = validStatuses.includes(sub.status);

    if (!isActive) {
      return NextResponse.json({
        active: false,
        reason: `Subscription is ${sub.status}`,
        status: sub.status,
      });
    }

    // Check if not expired
    const now = new Date();
    if (sub.current_period_end && new Date(sub.current_period_end) < now) {
      return NextResponse.json({
        active: false,
        reason: 'Subscription expired',
        status: 'expired',
      });
    }

    return NextResponse.json({
      active: true,
      plan: sub.plan,
      status: sub.status,
      expires_at: sub.current_period_end,
      max_devices: sub.max_devices,
    });
  } catch (err: any) {
    console.error('check-by-device error:', err);
    return NextResponse.json({ active: false, reason: err.message }, { status: 500 });
  }
}
