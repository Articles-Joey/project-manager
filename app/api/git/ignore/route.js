import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const folderPath = searchParams.get('path');

  if (!folderPath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  const gitIgnorePath = path.join(folderPath, '.gitignore');
  const targetLine = '/am_project_manager';

  try {
    let content = '';
    try {
      content = await fs.readFile(gitIgnorePath, 'utf-8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, content remains empty string
    }

    let lines = content.split(/\r?\n/);
    const exists = lines.some(line => line.trim() === targetLine);
    let action = '';

    if (exists) {
      // Remove the line(s)
      lines = lines.filter(line => line.trim() !== targetLine);
      action = 'removed';
    } else {
      // Add the line
      lines.push(targetLine);
      action = 'added';
    }

    // Clean up potential multiple empty lines at the end if desired, 
    // but simple join is usually sufficient.
    const newContent = lines.join('\n');
    await fs.writeFile(gitIgnorePath, newContent, 'utf-8');

    return NextResponse.json({ 
      success: true, 
      action, 
      message: `Successfully ${action} ${targetLine} in .gitignore` 
    });

  } catch (error) {
    console.error('Error updating .gitignore:', error);
    return NextResponse.json({ error: 'Failed to update .gitignore: ' + error.message }, { status: 500 });
  }
}
