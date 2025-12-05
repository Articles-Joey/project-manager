import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = util.promisify(exec);

export async function getCurrentPackageVersion() {
    try {
        const currentPackagePath = path.join(process.cwd(), 'package.json');
        const currentPackageContent = await fs.readFile(currentPackagePath, 'utf-8');
        const currentPackage = JSON.parse(currentPackageContent);
        return currentPackage.version;
    } catch (error) {
        console.error('Failed to read current package.json:', error);
        return 'unknown';
    }
}

export async function performAudit(targetPath, auditHistory, currentPackageVersion) {
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
            const auditHistoryPath = path.join(amDir, 'audit-history.json');
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
        // Continue to return audit results even if metadata update fails
    }

    return JSON.parse(output);
}
