import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = util.promisify(exec);

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const targetPath = searchParams.get('path');

    if (!targetPath) {
        return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
    }

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
            // Fetch current project's package.json to get the version
            const currentPackagePath = path.join(process.cwd(), 'package.json');
            const currentPackageContent = await fs.readFile(currentPackagePath, 'utf-8');
            const currentPackage = JSON.parse(currentPackageContent);

            // Define metadata
            const metadata = {
                version_used: currentPackage.version,
                last_audit: new Date().toISOString(),
                about: "Metadata used by project-manager.articles.media"
            };

            // Write to project-manager-am.json
            const metadataPath = path.join(targetPath, 'project-manager-am.json');
            await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        } catch (metadataError) {
            console.error('Failed to update package metadata:', metadataError);
            // Continue to return audit results even if metadata update fails
        }

        return NextResponse.json(JSON.parse(output));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to run npm audit: ' + error.message }, { status: 500 });
    }
}
