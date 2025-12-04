import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import fs from 'fs/promises';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderPath = searchParams.get('path');

  if (!folderPath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    // Verify path exists
    await fs.access(folderPath);
    
    // Open folder in Windows Explorer
    exec(`explorer "${folderPath}"`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error opening folder:', error);
    return NextResponse.json({ error: 'Failed to open folder or path does not exist' }, { status: 500 });
  }
}
