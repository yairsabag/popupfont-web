import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query, ID } from 'node-appwrite';

/**
 * POST /api/license/activate
 * 
 * Desktop app calls this to register a new device on the license.
 * 
 * Body: { license_key: string, device_id: string, device_name: string, platform: "macos" | "windows" }
 * 
 * Returns:
 *   { success: true, device_id, is_main, plan, expires_at }
 *   { success: false, reason: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key, device_id, device_name, platform } = body;

    if (!license_key || !device_id || !platform) {
      return NextResponse.json(
        { success: false, reason: 'Missing required fields: license_key, device_id, platform' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    const { databaseId, collections } = APPWRITE_CONFIG;

    // 1. Validate license
    const licenseRes = await databases.listDocuments(databaseId, collections.licenses, [
      Query.equal('license_key', license_key),
      Query.limit(1),
    ]);

    if (licenseRes.documents.length === 0) {
      return NextResponse.json({ success: false, reason: 'Invalid license key' });
    }

    const license = licenseRes.documents[0];
    if (!license.is_active) {
      return NextResponse.json({ success: false, reason: 'License has been deactivated' });
    }

    const userId = license.user_id;

    // 2. Check subscription
    const subRes = await databases.listDocuments(databaseId, collections.subscriptions, [
      Query.equal('user_id', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(1),
    ]);

    if (subRes.documents.length === 0) {
      return NextResponse.json({ success: false, reason: 'No subscription found' });
    }

    const sub = subRes.documents[0];
    const activeStatuses = ['active', 'trialing'];

    if (!activeStatuses.includes(sub.status)) {
      return NextResponse.json({ success: false, reason: `Subscription is ${sub.status}` });
    }

    // Check expiry
    const expiresAt = sub.status === 'trialing' ? sub.trial_ends_at : sub.current_period_end;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return NextResponse.json({ success: false, reason: 'Subscription has expired' });
    }

    // 3. Check if device already registered
    const existingDevice = await databases.listDocuments(databaseId, collections.devices, [
      Query.equal('user_id', userId),
      Query.equal('device_id', device_id),
      Query.limit(1),
    ]);

    if (existingDevice.documents.length > 0) {
      // Device already exists — update last_seen
      const dev = existingDevice.documents[0];
      await databases.updateDocument(databaseId, collections.devices, dev.$id, {
        last_seen_at: new Date().toISOString(),
        device_name: device_name || dev.device_name,
      });

      return NextResponse.json({
        success: true,
        device_id,
        is_main: dev.is_main,
        plan: sub.plan,
        status: sub.status,
        expires_at: expiresAt,
        message: 'Device already registered, updated last seen',
      });
    }

    // 4. Check device limit
    const allDevices = await databases.listDocuments(databaseId, collections.devices, [
      Query.equal('user_id', userId),
    ]);

    const maxDevices = sub.max_devices || 1;
    if (allDevices.documents.length >= maxDevices) {
      return NextResponse.json({
        success: false,
        reason: 'Device limit reached',
        max_devices: maxDevices,
        devices_used: allDevices.documents.length,
        devices: allDevices.documents.map((d: any) => ({
          device_id: d.device_id,
          device_name: d.device_name,
          platform: d.platform,
          last_seen_at: d.last_seen_at,
        })),
      });
    }

    // 5. Register new device
    const isMain = allDevices.documents.length === 0; // First device is main
    const newDevice = await databases.createDocument(databaseId, collections.devices, ID.unique(), {
      user_id: userId,
      device_name: device_name || `${platform} device`,
      device_id,
      platform,
      is_main: isMain,
      last_seen_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      device_id,
      is_main: isMain,
      plan: sub.plan,
      status: sub.status,
      expires_at: expiresAt,
      max_devices: maxDevices,
      devices_used: allDevices.documents.length + 1,
      message: 'Device activated successfully',
    });

  } catch (error: any) {
    console.error('License activate error:', error);
    return NextResponse.json(
      { success: false, reason: 'Server error' },
      { status: 500 }
    );
  }
}
