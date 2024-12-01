import { exec, spawn } from "child_process";
import util from "util";
import { CODES_DIR, Language, languages, OUTPUTS_DIR } from "../config/consts";
import fileSystem from "./fileSystemService";

interface LanguageCommandInfo {
  executeCommand: string;
  executionArgs?: string[];
  compilerInfoCommand: string;
  compileCommand?: string;
  compilationArgs?: string[];
  outputExt?: string;
}

interface RunCodeParams {
  language: Language;
  code: string;
  input: string;
}

class LanguageService {
  private readonly timeoutInSeconds = 30;
  private readonly execPromise = util.promisify(exec);

  private languageCommands: { [key in Language]: LanguageCommandInfo } = {
    java: {
      executeCommand: "java",
      executionArgs: [],
      compilerInfoCommand: "java --version",
    },
    cpp: {
      compileCommand: "g++",
      compilationArgs: [],
      executeCommand: "",
      executionArgs: [],
      outputExt: "out",
      compilerInfoCommand: "g++ --version",
    },
    py: {
      executeCommand: "python3",
      executionArgs: [],
      compilerInfoCommand: "python3 --version",
    },
    c: {
      compileCommand: "gcc",
      compilationArgs: [],
      executeCommand: "",
      executionArgs: [],
      outputExt: "out",
      compilerInfoCommand: "gcc --version",
    },
    js: {
      executeCommand: "node",
      executionArgs: [],
      compilerInfoCommand: "node --version",
    },
    go: {
      executeCommand: "go",
      executionArgs: ["run"],
      compilerInfoCommand: "go version",
    },
    cs: {
      compileCommand: "mcs",
      compilationArgs: [],
      executeCommand: "mono",
      executionArgs: [],
      outputExt: "exe",
      compilerInfoCommand: "mcs --version",
    },
  };

  public async runCode({ language, code, input }: RunCodeParams) {
    if (!code) {
      throw {
        status: 400,
        error: "No code found to execute.",
      };
    }

    if (!languages.includes(language)) {
      throw {
        status: 400,
        error: `Invalid language. Supported languages are: ${languages.join(", ")}.`,
      };
    }

    const { jobID } = await fileSystem.createCodeFile(language, code);
    const commandInfo = this.getCommandInfo(jobID, language);

    try {
      if (commandInfo.compileCommand) {
        await this.compileCode(commandInfo);
      }

      const result = await this.executeCode(commandInfo, input);

      await fileSystem.removeCodeFile(jobID, language, commandInfo.outputExt);

      return {
        ...result,
        language,
        info: await this.getInfo(language),
      };
    } catch (error) {
      await fileSystem.removeCodeFile(jobID, language, commandInfo.outputExt);
      throw error;
    }
  }

  public async getInfo(language: Language) {
    const { compilerInfoCommand } = this.getCommandInfo("", language);
    const { stdout } = await this.execPromise(compilerInfoCommand);
    return stdout;
  }

  private getCommandInfo(jobID: string, language: Language): LanguageCommandInfo {
    const commandInfo = { ...this.languageCommands[language] };

    switch (language) {
      case "java":
        commandInfo.executionArgs = [`${CODES_DIR}/${jobID}.java`];
        break;
      case "cpp":
      case "c":
        commandInfo.compilationArgs = [
          `${CODES_DIR}/${jobID}.${language}`,
          "-o",
          `${OUTPUTS_DIR}/${jobID}.${commandInfo.outputExt}`,
        ];
        commandInfo.executeCommand = `${OUTPUTS_DIR}/${jobID}.${commandInfo.outputExt}`;
        break;
      case "py":
        commandInfo.executionArgs = [`${CODES_DIR}/${jobID}.py`];
        break;
      case "js":
        commandInfo.executionArgs = [`${CODES_DIR}/${jobID}.js`];
        break;
      case "go":
        commandInfo.executionArgs = ["run", `${CODES_DIR}/${jobID}.go`];
        break;
      case "cs":
        commandInfo.compilationArgs = [
          `-out:${OUTPUTS_DIR}/${jobID}.${commandInfo.outputExt}`,
          `${CODES_DIR}/${jobID}.cs`,
        ];
        commandInfo.executionArgs = [`${OUTPUTS_DIR}/${jobID}.${commandInfo.outputExt}`];
        break;
    }

    return commandInfo;
  }

  private compileCode(commandInfo: LanguageCommandInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      const compiler = spawn(commandInfo.compileCommand!, commandInfo.compilationArgs || []);

      let compileError = "";

      compiler.stderr.on("data", (data) => {
        compileError += data.toString();
      });

      compiler.on("close", (code) => {
        if (code !== 0) {
          reject({
            status: 400,
            output: "",
            error: compileError || "Compilation failed.",
          });
        } else {
          resolve();
        }
      });
    });
  }

  private executeCode(
    commandInfo: LanguageCommandInfo,
    input: string
  ): Promise<{ output: string; error: string }> {
    return new Promise((resolve, reject) => {
      const executeProcess = spawn(commandInfo.executeCommand, commandInfo.executionArgs || [], {
        shell: true,
      });

      let output = "";
      let error = "";

      const timer = setTimeout(() => {
        executeProcess.kill("SIGKILL");
        reject({
          status: 408,
          output: "",
          error: `Execution timed out after ${this.timeoutInSeconds} seconds.`,
        });
      }, this.timeoutInSeconds * 1000);

      if (input) {
        executeProcess.stdin.write(input);
        executeProcess.stdin.end();
      }

      executeProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      executeProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      executeProcess.on("close", () => {
        clearTimeout(timer);
        resolve({ output, error });
      });

      executeProcess.on("error", (err) => {
        clearTimeout(timer);
        reject({
          status: 500,
          output: "",
          error: `Execution failed: ${err.message}`,
        });
      });
    });
  }
}

export default new LanguageService();
