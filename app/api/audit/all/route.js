const delayBetweenCalls = 1000; // milliseconds

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = util.promisify(exec);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {

    const body = await request.json();
    const { projects, limit, auditHistory } = body;

    if (!projects || !Array.isArray(projects)) {
        return NextResponse.json({ error: 'Projects array is required' }, { status: 400 });
    }

    // console.log("Test???")

    // return NextResponse.json({ 
    //     projects, limit, auditHistory
    //  }, { status: 400 });

    const projectsToProcess = limit ? projects.slice(0, limit) : projects;
    const results = [];

    // return NextResponse.json({
    //     projectsToProcess
    // }, { status: 400 });

    // Fetch current project's package.json to get the version
    let currentPackageVersion = 'unknown';
    try {
        const currentPackagePath = path.join(process.cwd(), 'package.json');
        const currentPackageContent = await fs.readFile(currentPackagePath, 'utf-8');
        const currentPackage = JSON.parse(currentPackageContent);
        currentPackageVersion = currentPackage.version;
    } catch (error) {
        console.error('Failed to read current package.json:', error);
    }

    for (let i = 0; i < projectsToProcess.length; i++) {
        const targetPath = projectsToProcess[i];

        try {
            // npm audit returns exit code 1 if vulnerabilities are found
            let output;
            try {
                const { stdout } = await execPromise(`npm audit --json`, { cwd: targetPath });
                output = stdout;
            } catch (error) {
                if (error.stdout) {
                    output = error.stdout;
                } else {
                    throw error;
                }
            }

            try {

                console.log(`[📜 Audit Output] ${targetPath}: Audit completed.`);

                // Define metadata
                const metadata = {
                    version_used: currentPackageVersion,
                    about: "Metadata used by project-manager.articles.media",
                    last_audit: new Date().toISOString(),
                    audit: JSON.parse(output)
                };

                // Ensure am_project_manager directory exists
                const amDir = path.join(targetPath, 'am_project_manager');
                try {
                    await fs.access(amDir);
                } catch {
                    await fs.mkdir(amDir);
                }

                // Write to project-manager-am.json inside am_project_manager
                const metadataPath = path.join(amDir, 'project-manager-am.json');
                await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

                if (auditHistory) {
                    const auditHistoryPath = path.join(amDir, 'project-manager-am-audit-history.json');
                    let auditHistoryData = [];
                    try {
                        const existingData = await fs.readFile(auditHistoryPath, 'utf-8');
                        auditHistoryData = JSON.parse(existingData);
                    } catch (readError) {
                        // File might not exist, which is fine
                    }
                    auditHistoryData.push({
                        date: new Date().toISOString(),
                        data: metadata,
                    });
                    await fs.writeFile(auditHistoryPath, JSON.stringify(auditHistoryData, null, 2));
                }

            } catch (metadataError) {
                console.error(`Failed to update package metadata for ${targetPath}:`, metadataError);
            }

            results.push({ path: targetPath, status: 'success', audit: JSON.parse(output) });

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
