// executePython.js
const { exec } = require("child_process");
const path = require("path");

const executePython = (filePath, inputPath) => {
  return new Promise((resolve, reject) => {
    const runTimeout = 2000;
    const command = `python "${filePath}" < "${inputPath}"`;

    const child = exec(command, { timeout: runTimeout }, (err, stdout, stderr) => {
      if (err) {
        if (err.killed && err.signal === 'SIGTERM') {
          return reject('TIME_LIMIT_EXCEEDED: Execution timed out (2s limit)');
        }
        return reject(`RUNTIME_ERROR: ${stderr || err.message}`);
      }
      resolve(stdout.trim());
    });
  });
};

module.exports = { executePython };