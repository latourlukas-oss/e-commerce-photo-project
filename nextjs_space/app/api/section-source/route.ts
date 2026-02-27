import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const SECTION_TO_FILE: Record<string, string> = {
  'hero': 'components/hero-section.tsx',
  'mission-cards': 'components/mission-section.tsx',
  'product-showcase': 'components/product-showcase.tsx',
  'impact': 'components/impact-section.tsx',
  'cta': 'components/cube-upload-section.tsx',
  'merch-stories': 'components/merch-stories-section.tsx',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  if (!section || !SECTION_TO_FILE[section]) {
    return NextResponse.json({ error: 'Unknown section' }, { status: 400 });
  }
  const filePath = path.join(process.cwd(), SECTION_TO_FILE[section]);
  try {
    const content = await readFile(filePath, 'utf-8');
    return NextResponse.json({ file: SECTION_TO_FILE[section], content });
  } catch (e) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
