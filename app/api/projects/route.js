import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// const additionalFolderLocations = [
//   "F:\\My Documents\\Sites\\games"
// ]

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rootPath = searchParams.get('path');

  let additionalFolderLocationsParam = searchParams.get('additionalFolderLocations');
  additionalFolderLocationsParam = JSON.parse(additionalFolderLocationsParam || '[]')

  if (!rootPath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    // Check if the path exists and is a directory
    const stats = await fs.stat(rootPath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: 'Provided path is not a directory' }, { status: 400 });
    }

    const projects = [];
    const pathsToScan = [rootPath, ...additionalFolderLocationsParam];

    for (const currentPath of pathsToScan) {
      try {
        // Check if path exists and is directory
        const pathStats = await fs.stat(currentPath);
        if (!pathStats.isDirectory()) continue;

        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        const directories = entries.filter(entry => entry.isDirectory());

        for (const dir of directories) {
          const packageJsonPath = path.join(currentPath, dir?.name, 'package.json');
          try {
            // Check if package.json exists
            await fs.access(packageJsonPath);

            const stats = await fs.stat(packageJsonPath);

            // Read and parse package.json
            const fileContent = await fs.readFile(packageJsonPath, 'utf-8');
            const packageJson = JSON.parse(fileContent);

            // Try to read project-manager-am.json
            let metadata = null;
            try {
              // Check new location first
              const metadataPath = path.join(currentPath, dir?.name, 'am_project_manager', 'details.json');
              const metadataContent = await fs.readFile(metadataPath, 'utf-8');
              metadata = JSON.parse(metadataContent);
            } catch (e) {

              // TODO Get rid of old location fallback
              // Fallback to old location
              // try {
              //   const metadataPath = path.join(currentPath, dir?.name, 'details.json');
              //   const metadataContent = await fs.readFile(metadataPath, 'utf-8');
              //   metadata = JSON.parse(metadataContent);
              // } catch (e2) {
              //   // ignore if file doesn't exist in either location
              // }

            }

            // Try to read audit-history.json
            let auditHistory = null;
            try {
              const auditHistoryPath = path.join(currentPath, dir?.name,  'am_project_manager', 'audit-history.json');
              const auditHistoryContent = await fs.readFile(auditHistoryPath, 'utf-8');
              auditHistory = JSON.parse(auditHistoryContent);
            } catch (e) {
              // ignore if file doesn't exist
            }

            // Try to read README.md for preview image
            let thumbnail = null;
            try {
              const readmePath = path.join(currentPath, dir?.name, 'README.md');
              const readmeContent = await fs.readFile(readmePath, 'utf-8');
              const previewMatch = readmeContent.match(/!\[[^\]]*?(?:Game|Site|Preview)[^\]]*?\]\((.*?)\)/i);
              if (previewMatch && previewMatch[1]) {
                let imagePath = previewMatch[1];
                if (imagePath.startsWith('/') || imagePath.startsWith('\\')) {
                  imagePath = imagePath.substring(1);
                }
                const fullPath = path.join(currentPath, dir?.name, imagePath);
                thumbnail = `/api/image?path=${encodeURIComponent(fullPath)}`;
              }
            } catch (e) {
              // ignore
            }

            // Add extra info if needed, like the folder path
            projects.push({
              ...packageJson,
              "project-manager-details": metadata,
              "audit-history": auditHistory?.length,
              _folderPath: path.join(currentPath, dir?.name),
              _folderName: dir?.name,
              _mtime: stats.mtime,
              thumbnail
            });
          } catch (err) {
            // Ignore folders without package.json or with invalid JSON
            // console.error(`Error reading package.json in ${dir.name}:`, err);
          }
        }
      } catch (err) {
        console.error(`Error scanning path ${currentPath}:`, err);
      }
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error scanning directories:', error);
    return NextResponse.json({ error: 'Failed to scan directories: ' + error.message }, { status: 500 });
  }
}
