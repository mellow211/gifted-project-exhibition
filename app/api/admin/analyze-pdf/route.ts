import { NextResponse } from "next/server";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execFileAsync = util.promisify(execFile);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const reportFile = formData.get("report") as File | null;
    const manualFile = formData.get("manual") as File | null;
    const category = formData.get("category") as string | null;
    const saveToDb = formData.get("saveToDb") === "true";

    if (!reportFile || !manualFile) {
      return NextResponse.json(
        { error: "탐구 보고서 PDF와 작품 설명서 PDF 파일 2개가 모두 필요합니다." },
        { status: 400 }
      );
    }

    const tempDir = path.join(process.cwd(), "temp_uploads", `upload-${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });

    const reportPath = path.join(tempDir, "report.pdf");
    const manualPath = path.join(tempDir, "manual.pdf");

    // Write uploaded files to temp folder
    const reportBuffer = Buffer.from(await reportFile.arrayBuffer());
    const manualBuffer = Buffer.from(await manualFile.arrayBuffer());
    await fs.promises.writeFile(reportPath, reportBuffer);
    await fs.promises.writeFile(manualPath, manualBuffer);

    // Run python script
    const scriptPath = path.join(process.cwd(), "scripts", "extract_pdf_project.py");
    const args = ["scripts/extract_pdf_project.py", "--report", reportPath, "--manual", manualPath];
    if (category && category !== "AUTO") {
      args.push("--category", category);
    }
    if (saveToDb) {
      args.push("--save");
    }

    const { stdout, stderr } = await execFileAsync("python", args, {
      cwd: process.cwd(),
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    // Cleanup temp folder
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch {}

    // Find JSON in stdout
    const jsonStart = stdout.indexOf("{");
    const jsonEnd = stdout.lastIndexOf("}");
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = stdout.slice(jsonStart, jsonEnd + 1);
      const project = JSON.parse(jsonStr);
      return NextResponse.json({ success: true, project });
    }

    return NextResponse.json(
      { error: "PDF 분석 결과를 파싱하지 못했습니다.", raw: stdout, stderr },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("PDF analysis API error:", error);
    return NextResponse.json(
      { error: error?.message || "PDF 분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
