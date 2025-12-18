// app/api/rag/retrieve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
    try {
        const { query } = await req.json();

        if (!query) {
            return new NextResponse("Query parameter is required", { status: 400 });
        }

        const retrieverPath = path.join(process.cwd(), 'rag_pipeline', 'retriever.py');

        // Execute the Python retriever script
        // Ensure python is in your PATH or provide the full path to the python executable
        const { stdout, stderr } = await execPromise(`python ${retrieverPath} "${query}"`);

        if (stderr) {
            console.error("Python script stderr:", stderr);
            return new NextResponse(`Python script error: ${stderr}`, { status: 500 });
        }

        const retrievedDocs = JSON.parse(stdout);
        return NextResponse.json({ documents: retrievedDocs });

    } catch (error) {
        console.error("Error in RAG retrieval API:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

