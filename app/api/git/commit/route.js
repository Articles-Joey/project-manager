import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req) {
  try {
    const { folderPath, message } = await req.json();

    if (!folderPath || !message) {
      return NextResponse.json(
        { error: 'Missing folderPath or message' },
        { status: 400 }
      );
    }

    // Escape double quotes in the message to prevent shell injection/errors
    const safeMessage = message.replace(/"/g, '\\"');

    // Chain commands: add all changes, commit with message, and push
    const command = `git add . && git commit -m "${safeMessage}" && git push`;

    const { stdout, stderr } = await execAsync(command, { cwd: folderPath });

    return NextResponse.json({ 
      success: true, 
      output: stdout,
      errorOutput: stderr 
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
