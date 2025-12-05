const delayBetweenCalls = 2000; // milliseconds

import { NextResponse } from 'next/server';
import { performAudit, getCurrentPackageVersion } from '@/lib/audit';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {

    const body = await request.json();
    const { projects, limit, auditHistory } = body;

    if (!projects || !Array.isArray(projects)) {
        return NextResponse.json({ error: 'Projects array is required' }, { status: 400 });
    }

    const projectsToProcess = limit ? projects.slice(0, limit) : projects;
    const results = [];

    const currentPackageVersion = await getCurrentPackageVersion();

    for (let i = 0; i < projectsToProcess.length; i++) {
        const targetPath = projectsToProcess[i];

        try {
            const auditResult = await performAudit(targetPath, auditHistory, currentPackageVersion);
            console.log(`[📜 Audit Output] ${targetPath}: Audit completed.`);
            results.push({ path: targetPath, status: 'success', audit: auditResult });

        } catch (error) {
            console.error(`Failed to audit ${targetPath}:`, error);
            results.push({ path: targetPath, status: 'error', error: error.message });
        }

        if (i < projectsToProcess.length - 1) {
            await delay(delayBetweenCalls);
        }
    }

    return NextResponse.json({ message: 'Audit complete', results });

}
