import mammoth from "mammoth";

const MAX_CHARS = 28_000;

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (mimeType === "application/pdf" || ext === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return normalizeText(data.text);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return normalizeText(result.value);
  }

  if (mimeType === "text/plain" || ext === "txt") {
    return normalizeText(buffer.toString("utf-8"));
  }

  throw new Error(
    "Unsupported file type. Upload PDF, DOCX, or TXT."
  );
}

function normalizeText(raw: string): string {
  const cleaned = raw
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (cleaned.length < 80) {
    throw new Error(
      "Could not extract enough text. Try a text-based PDF or paste your resume."
    );
  }

  if (cleaned.length > MAX_CHARS) {
    return cleaned.slice(0, MAX_CHARS) + "\n\n[Truncated for analysis]";
  }

  return cleaned;
}
