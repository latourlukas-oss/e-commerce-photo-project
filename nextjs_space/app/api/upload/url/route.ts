import { NextRequest, NextResponse } from 'next/server';
import { getFileUrl } from '@/lib/s3';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cloud_storage_path, isPublic } = body ?? {};

    if (!cloud_storage_path) {
      return NextResponse.json(
        { error: 'cloud_storage_path is required' },
        { status: 400 }
      );
    }

    const url = await getFileUrl(cloud_storage_path, isPublic ?? false);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error getting file URL:', error);
    return NextResponse.json(
      { error: 'Failed to get file URL' },
      { status: 500 }
    );
  }
}
