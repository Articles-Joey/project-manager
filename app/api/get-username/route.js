import { NextResponse } from 'next/server';
import os from 'os';

export async function GET() {
  try {
    const userInfo = os.userInfo();
    return NextResponse.json({ username: userInfo.username });
  } catch (error) {
    // Fallback for environments where os.userInfo() might fail
    const username = process.env.USERNAME || process.env.USER || 'Unknown';
    return NextResponse.json({ username });
  }
}
