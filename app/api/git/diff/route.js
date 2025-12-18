import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(req) {
    try {

        // const { folderPath } = await req.json();
        const { searchParams } = new URL(req.url);
        const folderPath = searchParams.get('path');

        console.log("test")

        if (!folderPath) {
            return NextResponse.json(
                { error: 'Missing folderPath or message' },
                { status: 400 }
            );
        }

        console.log("folderPath", folderPath)

        // Chain commands: add all changes, commit with message, and push
        const command = `git diff`;
        const { stdout, stderr } = await execAsync(command, { cwd: folderPath });

        const command_two = `git diff --name-only`;
        const { stdout: stdout_two, stderr: stderr_two } = await execAsync(command_two, { cwd: folderPath });

        return NextResponse.json({
            success: true,
            output: stdout,
            output_names: stdout_two,
            errorOutput: stderr
        });

    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
