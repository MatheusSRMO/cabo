import { v4 as getUUID } from "uuid";
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { Language } from "../config/consts";

const CODES_DIR = process.env.CODES_DIR || "/tmp/codes";
const OUTPUTS_DIR = process.env.OUTPUTS_DIR || "/tmp/outputs";

// Ensure directories exist
if (!existsSync(CODES_DIR)) mkdirSync(CODES_DIR, { recursive: true });
if (!existsSync(OUTPUTS_DIR)) mkdirSync(OUTPUTS_DIR, { recursive: true });

interface CodeFile {
  fileName: string;
  filePath: string;
  jobID: string;
}

class FileSystem {
  public async createCodeFile(language: Language, code: string): Promise<CodeFile> {
    const jobID = getUUID();
    const fileName = `${jobID}.${language}`;
    const filePath = join(CODES_DIR, fileName);

    writeFileSync(filePath, code?.toString());

    return {
      fileName,
      filePath,
      jobID,
    };
  }

  public async removeCodeFile(uuid: string, lang: Language, outputExt?: string): Promise<void> {
    const codeFile = join(CODES_DIR, `${uuid}.${lang}`);
    const outputFile = outputExt ? join(OUTPUTS_DIR, `${uuid}.${outputExt}`) : null;

    try {
      unlinkSync(codeFile);
    } catch (err) {
      console.error(`Failed to delete code file: ${codeFile}`, err);
    }

    if (outputFile) {
      try {
        unlinkSync(outputFile);
      } catch (err) {
        console.error(`Failed to delete output file: ${outputFile}`, err);
      }
    }
  }
}

export default new FileSystem();
