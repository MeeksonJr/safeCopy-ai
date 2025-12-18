"use server"

import { createClient } from "@/lib/supabase/server"
import { ScanStatus } from "@/lib/types/database"
import { createAuditLog } from "@/app/actions/create-audit-log"
import { spawn } from "child_process"

// Import Tesseract.js for OCR - Note: This needs to be client-side compatible or moved to a dedicated server-side function.
// For a Next.js Server Action, a direct import of tesseract.js is problematic as it's typically client-side.
// A server-side solution would involve a Node.js OCR library or an external OCR API.
// For now, we'll use a placeholder and note the need for a proper server-side OCR solution.
// import Tesseract from 'tesseract.js';

interface ProcessFileForOcrParams {
  fileBuffer: string; // Base64 encoded file buffer
  fileName: string;
  fileType: string;
}

export async function processFileForOcr({
  fileBuffer,
  fileName,
  fileType,
}: ProcessFileForOcrParams): Promise<{ extractedText: string | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { extractedText: null, error: "Unauthorized" };
  }

  try {
    let extractedText: string | null = null;

    // Execute Python OCR script
    const pythonProcess = spawn("python", [
      "rag_pipeline/ocr_processor.py",
      fileBuffer,
      fileType,
    ]);

    let pythonOutput = "";
    let pythonError = "";

    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      pythonError += data.toString();
    });

    await new Promise<void>((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Python OCR script exited with code ${code}. Error: ${pythonError}`));
        }
      });
      pythonProcess.on("error", (err) => {
        reject(new Error(`Failed to start Python OCR script: ${err.message}`));
      });
    });

    if (pythonError) {
        console.error("[v0] Python OCR script stderr:", pythonError);
        return { extractedText: null, error: `OCR processing failed: ${pythonError}` };
    }

    extractedText = pythonOutput.trim();

    if (extractedText.startsWith("OCR Error:")) {
        return { extractedText: null, error: extractedText };
    }


    await createAuditLog({
      action: "OCR_FILE_UPLOAD",
      details: { fileName, fileType, extractedText: extractedText.substring(0, 100) + "..." },
      scanId: undefined,
    });

    return { extractedText, error: null };
  } catch (e) {
    console.error("[v0] OCR processing error:", e);
    return { extractedText: null, error: "Failed to process file for OCR." };
  }
}

