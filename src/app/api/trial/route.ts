import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/server';
import { APPWRITE_CONFIG } from '@/lib/config';
import { Query, ID } from 'node-appwrite';

const TRIAL_DAYS = 30;

export async function POST(req: NextRequest) {
  try {
    const { device_id, device_name, platform } = await req.json();

    if (!device_id) {
      return NextResponse.json({ error: 'device_id required' }, { status: 400 });
    }

    const { databases } = createAdminClient();
    const { databaseId } = APPWRITE_CONFIG;

    // בדוק אם המכשיר כבר קיים
    const existing = await databases.listDocuments(databaseId, 'trials', [
      Query.equal('device_id', device_id),
    ]);

    if (existing.documents.length > 0) {
      const doc = existing.documents[0];
      const installDate = new Date(doc.install_date);
      const now = new Date();
      const daysUsed = Math.floor((now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);

      return NextResponse.json({
        valid: daysLeft > 0,
        days_left: daysLeft,
        install_date: doc.install_date,
        expired: daysLeft === 0,
      });
    }

    // מכשיר חדש — שמור
    const installDate = new Date().toISOString();
    await databases.createDocument(databaseId, 'trials', ID.unique(), {
      device_id,
      device_name: device_name || 'Unknown',
      platform: platform || 'macos',
      install_date: installDate,
    });

    return NextResponse.json({
      valid: true,
      days_left: TRIAL_DAYS,
      install_date: installDate,
      expired: false,
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
