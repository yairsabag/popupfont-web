import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query, ID } from 'node-appwrite';

function daysLeftUntil(dateValue: string | null | undefined): number {
  if (!dateValue) return 0;

  const end = new Date(dateValue).getTime();
  const now = Date.now();

  if (Number.isNaN(end)) return 0;

  const diff = end - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function makeUserNumber(deviceId: string): string {
  // Keep a readable user/device number for desktop users.
  // Example: MAC-8C9923D90196EF9A -> 8C9923D9
  const clean = deviceId.replace(/[^a-zA-Z0-9]/g, '');
  return clean.slice(-8).toUpperCase() || ID.unique().slice(0, 8).toUpperCase();
}

/**
 * POST /api/trial
 *
 * Desktop app calls this on startup.
 *
 * Body:
 * {
 *   device_id: string,
 *   device_name?: string,
 *   platform?: "macos" | "windows" | string
 * }
 *
 * Returns:
 * {
 *   valid: boolean,
 *   days_left: number,
 *   trial_ends_at?: string,
 *   user_number?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const device_id = String(body.device_id || '').trim();
    const device_name = String(body.device_name || '').trim();
    const platform = String(body.platform || 'unknown').trim();

    if (!device_id) {
      return NextResponse.json(
        { valid: false, days_left: 0, reason: 'Missing device_id' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    const { databaseId, collections } = APPWRITE_CONFIG;

    const now = new Date();
    const nowIso = now.toISOString();
    const trialEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // In this desktop-only trial flow, we use device_id as user_id.
    // This matches check-by-device, which queries subscriptions by user_id=device_id.
    const userId = device_id;
    const userNumber = makeUserNumber(device_id);

    // 1. Look for existing subscription/trial for this device/user.
    const subRes = await databases.listDocuments(databaseId, collections.subscriptions, [
      Query.equal('user_id', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(10),
    ]);

    let subscription: any | null = null;

    if (subRes.documents.length > 0) {
      subscription = subRes.documents[0];

      const expiresAt =
        subscription.status === 'trialing'
          ? subscription.trial_ends_at
          : subscription.current_period_end;

      const daysLeft = daysLeftUntil(expiresAt);
      const isValid =
        ['active', 'trialing', 'on_trial', 'past_due'].includes(subscription.status) &&
        daysLeft > 0;

      // Update or create device row.
      const existingDevice = await databases.listDocuments(databaseId, collections.devices, [
        Query.equal('user_id', userId),
        Query.equal('device_id', device_id),
        Query.limit(1),
      ]);

      if (existingDevice.documents.length > 0) {
        await databases.updateDocument(
          databaseId,
          collections.devices,
          existingDevice.documents[0].$id,
          {
            last_seen_at: nowIso,
            device_name: device_name || existingDevice.documents[0].device_name || `${platform} device`,
          }
        );
      } else {
        await databases.createDocument(databaseId, collections.devices, ID.unique(), {
          user_id: userId,
          device_id,
          device_name: device_name || `${platform} device`,
          platform,
          is_main: true,
          last_seen_at: nowIso,
        });
      }

      return NextResponse.json({
        valid: isValid,
        days_left: daysLeft,
        reason: isValid ? '' : 'Trial expired',
        user_number: userNumber,
        trial_ends_at: expiresAt,
        plan: subscription.plan,
        status: subscription.status,
      });
    }

    // 2. No subscription exists — create a new 30-day trial subscription.
    const newSub = await databases.createDocument(databaseId, collections.subscriptions, ID.unique(), {
      user_id: userId,
      plan: 'trial',
      status: 'trialing',
      max_devices: 1,
      trial_starts_at: nowIso,
      trial_ends_at: trialEnd,
      current_period_start: nowIso,
      current_period_end: trialEnd,
    });

    // 3. Create device row.
    await databases.createDocument(databaseId, collections.devices, ID.unique(), {
      user_id: userId,
      device_id,
      device_name: device_name || `${platform} device`,
      platform,
      is_main: true,
      last_seen_at: nowIso,
    });

    return NextResponse.json({
      valid: true,
      days_left: 30,
      reason: '',
      user_number: userNumber,
      trial_ends_at: trialEnd,
      plan: newSub.plan,
      status: newSub.status,
    });
  } catch (error: any) {
    console.error('Trial API error:', error);

    return NextResponse.json(
      {
        valid: false,
        days_left: 0,
        reason: error?.message || 'Server error',
      },
      { status: 500 }
    );
  }
}
