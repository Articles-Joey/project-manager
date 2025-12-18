import { NextResponse } from 'next/server';
import { performAudit, getCurrentPackageVersion } from '@/lib/audit';

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get('path');
    const auditHistory = searchParams.get('auditHistory') === 'true';
    const fix = searchParams.get('fix') === 'true';

    if (!targetPath) {
        return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

    try {
        const currentPackageVersion = await getCurrentPackageVersion();
        const auditResult = await performAudit(targetPath, auditHistory, currentPackageVersion, fix);
        return NextResponse.json(auditResult);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to run npm audit: ' + error.message }, { status: 500 });
    }
}
