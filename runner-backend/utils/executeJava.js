// executeJava.js
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeJava = (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const className = path.basename(filePath, '.java');
    const compileTimeout = 5000;
    const runTimeout = 2000;

    const compileCmd = `javac "${filePath}"`;
    const runCmd = `java -cp "${dir}" ${className} < "${inputPath}"`;

    exec(compileCmd, { timeout: compileTimeout }, (compileErr, _, compileStderr) => {
      if (compileErr) {
        if (compileErr.killed && compileErr.signal === 'SIGTERM') {
          return reject('TIME_LIMIT_EXCEEDED: Compilation timed out (5s limit)');
        }
        return reject(`COMPILATION_ERROR: ${compileStderr || compileErr.message}`);
      }

      const child = exec(runCmd, { timeout: runTimeout }, (runErr, stdout, runStderr) => {
        try { fs.unlinkSync(path.join(dir, `${className}.class`)); } catch {}
        
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

module.exports = { executeJava };