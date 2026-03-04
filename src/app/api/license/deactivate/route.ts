import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query } from 'node-appwrite';

/**
 * POST /api/license/deactivate
 * 
 * Remove a device from the license (e.g. when user uninstalls or wants to move to new machine).
 * 
 * Body: { license_key: string, device_id: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key, device_id } = body;

    if (!license_key || !device_id) {
      return NextResponse.json(
        { success: false, reason: 'Missing license_key or device_id' },
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

    const userId = licenseRes.documents[0].user_id;

    // 2. Find and delete the device
    const deviceRes = await databases.listDocuments(databaseId, collections.devices, [
      Query.equal('user_id', userId),
      Query.equal('device_id', device_id),
      Query.limit(1),
    ]);

    if (deviceRes.documents.length === 0) {
      return NextResponse.json({ success: false, reason: 'Device not found' });
    }

    await databases.deleteDocument(databaseId, collections.devices, deviceRes.documents[0].$id);

    return NextResponse.json({
      success: true,
      message: 'Device deactivated successfully',
      device_id,
    });

  } catch (error: any) {
    console.error('License deactivate error:', error);
    return NextResponse.json(
      { success: false, reason: 'Server error' },
      { status: 500 }
    );
  }
}
