import { NextResponse } from 'next/server';
import { settingsService } from '@/services/settingsService';

export async function POST() {
  try {
    await settingsService.backupDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to backup database' },
      { status: 500 }
    );
  }
} 