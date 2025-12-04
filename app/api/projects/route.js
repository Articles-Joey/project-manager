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
              const metadataPath = path.join(currentPath, dir?.name, 'project-manager-am.json');
              const metadataContent = await fs.readFile(metadataPath, 'utf-8');
              metadata = JSON.parse(metadataContent);
            } catch (e) {
              // ignore if file doesn't exist
            }

            // Add extra info if needed, like the folder path
            projects.push({
              ...packageJson,
              "project-manager-am-metadata": metadata,
              _folderPath: path.join(currentPath, dir?.name),
              _folderName: dir?.name,
              _mtime: stats.mtime
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
