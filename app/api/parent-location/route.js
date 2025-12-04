import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        const currentDir = process.cwd();
        const parentDir = path.resolve(currentDir, '..');

        return NextResponse.json({ path: parentDir });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to determine parent location' }, { status: 500 });
    }
}
