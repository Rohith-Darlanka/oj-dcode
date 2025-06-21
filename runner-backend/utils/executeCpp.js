// executeCpp.js
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const outputDir = path.join(__dirname, "../outputs");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const executeCpp = (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputDir, `${jobId}.exe`);
  const compileTimeout = 8000;
  const runTimeout = 2000;

  return new Promise((resolve, reject) => {
    exec(`g++ "${filePath}" -o "${outPath}"`, { timeout: compileTimeout }, (compileErr, _, compileStderr) => {
      if (compileErr || compileStderr) {
        if (compileErr?.killed && compileErr.signal === 'SIGTERM') {
          return reject('TIME_LIMIT_EXCEEDED: Compilation timed out (5s limit)');
        }
        return reject(`COMPILATION_ERROR: ${compileStderr || compileErr.message}`);
      }

      const child = exec(`"${outPath}" < "${inputPath}"`, { timeout: runTimeout }, (runErr, stdout, runStderr) => {
        try { fs.unlinkSync(outPath); } catch {}
        
        if (runErr) {
          if (runErr.killed && runErr.signal === 'SIGTERM') {
            return reject('TIME_LIMIT_EXCEEDED: Execution timed out (2s limit)');
          }
          return reject(`RUNTIME_ERROR: ${runStderr || runErr.message}`);
        }
        resolve(stdout.trim());
      });
    });
  });
};

module.exports = { executeCpp };