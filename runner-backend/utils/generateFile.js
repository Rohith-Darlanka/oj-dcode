const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const CODES_DIR = path.join(__dirname, "../codes");
const OUTPUTS_DIR = path.join(__dirname, "../outputs");


[CODES_DIR, OUTPUTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const generateFile = async (language, code) => {
  let filename, filePath;

  if (language === "java") {
 
    filename = "Main.java";
    filePath = path.join(CODES_DIR, filename);
    const updatedCode = code.replace(/public\s+class\s+\w+/, "public class Main");
    await fs.promises.writeFile(filePath, updatedCode);
  } else {
    const jobId = uuid();
    const extensions = {
      cpp: "cpp",
      python: "py"
    };

    if (!extensions[language]) {
      throw new Error(`Unsupported language: ${language}`);
    }

    filename = `${jobId}.${extensions[language]}`;
    filePath = path.join(CODES_DIR, filename);
    await fs.promises.writeFile(filePath, code);
  }

  return filePath;
};



module.exports = { 
  generateFile,
  CODES_DIR,
  OUTPUTS_DIR
};