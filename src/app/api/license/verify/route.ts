import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query } from 'node-appwrite';

/**
 * POST /api/license/verify
 * 
 * Desktop app calls this on startup to check if the license is valid.
 * 
 * Body: { license_key: string, device_id: string }
 * 
 * Returns:
 *   { valid: true, plan, status, expires_at, max_devices, devices_used }
 *   { valid: false, reason: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key, device_id } = body;

    if (!license_key || !device_id) {
      return NextResponse.json(
        { valid: false, reason: 'Missing license_key or device_id' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    const { databaseId, collections } = APPWRITE_CONFIG;

    // 1. Find the license
    const licenseRes = await databases.listDocuments(databaseId, collections.licenses, [
      Query.equal('license_key', license_key),
      Query.limit(1),
    ]);

    if (licenseRes.documents.length === 0) {
      return NextResponse.json({ valid: false, reason: 'Invalid license key' });
    }

    const license = licenseRes.documents[0];

    if (!license.is_active) {
      return NextResponse.json({ valid: false, reason: 'License has been deactivated' });
    }

    const userId = license.user_id;

    // 2. Find active subscription
    const subRes = await databases.listDocuments(databaseId, collections.subscriptions, [
      Query.equal('user_id', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(1),
    ]);

    if (subRes.documents.length === 0) {
      return NextResponse.json({ valid: false, reason: 'No subscription found' });
    }

    const sub = subRes.documents[0];
    const activeStatuses = ['active', 'trialing'];

    if (!activeStatuses.includes(sub.status)) {
      return NextResponse.json({
        valid: false,
        reason: `Subscription is ${sub.status}`,
        plan: sub.plan,
        status: sub.status,
      });
    }

    // 3. Check expiry
    const expiresAt = sub.status === 'trialing' ? sub.trial_ends_at : sub.current_period_end;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        reason: 'Subscription has expired',
        plan: sub.plan,
        status: 'expired',
      });
    }

    // 4. Check if this device is registered
    const deviceRes = await databases.listDocuments(databaseId, collections.devices, [
      Query.equal('user_id', userId),
    ]);

    const devices = deviceRes.documents;
    const thisDevice = devices.find((d: any) => d.device_id === device_id);

    if (!thisDevice && devices.length >= (sub.max_devices || 1)) {
      return NextResponse.json({
        valid: false,
        reason: 'Device limit reached',
        max_devices: sub.max_devices || 1,
        devices_used: devices.length,
      });
    }

    // 5. Update last_seen if device exists
    if (thisDevice) {
      await databases.updateDocument(databaseId, collections.devices, thisDevice.$id, {
        last_seen_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      valid: true,
      plan: sub.plan,
      status: sub.status,
      expires_at: expiresAt,
      max_devices: sub.max_devices || 1,
      devices_used: devices.length,
      device_registered: !!thisDevice,
    });

  } catch (error: any) {
    console.error('License verify error:', error);
    return NextResponse.json(
      { valid: false, reason: 'Server error' },
      { status: 500 }
    );
  }
}
