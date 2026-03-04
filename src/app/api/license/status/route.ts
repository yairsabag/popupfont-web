import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query } from 'node-appwrite';

/**
 * POST /api/license/status
 * 
 * Full account status for the desktop app settings panel.
 * 
 * Body: { license_key: string }
 * 
 * Returns full profile, subscription, devices, and license info.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key } = body;

    if (!license_key) {
      return NextResponse.json(
        { success: false, reason: 'Missing license_key' },
        { status: 400 }
      );
    }

    const { databases } = createAdminClient();
    const { databaseId, collections } = APPWRITE_CONFIG;

    // 1. Find license
    const licenseRes = await databases.listDocuments(databaseId, collections.licenses, [
      Query.equal('license_key', license_key),
      Query.limit(1),
    ]);

    if (licenseRes.documents.length === 0) {
      return NextResponse.json({ success: false, reason: 'Invalid license key' });
    }

    const license = licenseRes.documents[0];
    const userId = license.user_id;

    // 2. Get profile
    const profileRes = await databases.listDocuments(databaseId, collections.profiles, [
      Query.equal('user_id', userId),
      Query.limit(1),
    ]);
    const profile = profileRes.documents[0] || null;

    // 3. Get subscription
    const subRes = await databases.listDocuments(databaseId, collections.subscriptions, [
      Query.equal('user_id', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(1),
    ]);
    const sub = subRes.documents[0] || null;

    // 4. Get devices
    const deviceRes = await databases.listDocuments(databaseId, collections.devices, [
      Query.equal('user_id', userId),
    ]);

    const expiresAt = sub?.status === 'trialing' ? sub?.trial_ends_at : sub?.current_period_end;
    const isActive = sub && ['active', 'trialing'].includes(sub.status);
    const isExpired = expiresAt && new Date(expiresAt) < new Date();

    return NextResponse.json({
      success: true,
      account: {
        email: profile?.email || '',
        full_name: profile?.full_name || '',
        referral_code: profile?.referral_code || '',
      },
      subscription: {
        plan: sub?.plan || 'none',
        status: isExpired ? 'expired' : (sub?.status || 'none'),
        is_active: isActive && !isExpired,
        max_devices: sub?.max_devices || 1,
        expires_at: expiresAt || null,
        trial_ends_at: sub?.trial_ends_at || null,
      },
      license: {
        license_key: license.license_key,
        is_active: license.is_active,
      },
      devices: deviceRes.documents.map((d: any) => ({
        device_id: d.device_id,
        device_name: d.device_name,
        platform: d.platform,
        is_main: d.is_main,
        last_seen_at: d.last_seen_at,
      })),
    });

  } catch (error: any) {
    console.error('License status error:', error);
    return NextResponse.json(
      { success: false, reason: 'Server error' },
      { status: 500 }
    );
  }
}
