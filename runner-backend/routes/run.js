const express = require("express");
const router = express.Router();
const { generateFile } = require("../utils/generateFile");
const { executeCpp } = require("../utils/executeCpp");
const { executeJava } = require("../utils/executeJava");
const { executePython } = require("../utils/executePython");
const fs = require("fs");
const path = require("path");

router.post("/", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({ 
      status: "ERROR",
      error: "Code is required",
      output: null 
    });
  }

  try {
    const filePath = await generateFile(language, code);
    const jobId = path.basename(filePath).split(".")[0];
    const inputPath = path.join(__dirname, `../codes/${jobId}_input.txt`);
    fs.writeFileSync(inputPath, input);

    try {
      let output;
      switch (language) {
        case "cpp":
          output = await executeCpp(filePath, inputPath);
          break;
        case "python":
          output = await executePython(filePath, inputPath);
          break;
        case "java":
          output = await executeJava(filePath, inputPath);
          break;
        default:
          return res.status(400).json({ 
            status: "ERROR",
            error: "Unsupported language",
            output: null 
          });
      }

      return res.json({ 
        status: "SUCCESS",
        output,
        error: null 
      });

    } catch (executionError) {
      console.error("Execution Error:", executionError);
      
      const errorMessage = executionError.toString();
      let status, userError;

      // Parse the error type from the message
      if (errorMessage.startsWith('TIME_LIMIT_EXCEEDED:')) {
        status = "TIME_LIMIT_EXCEEDED";
        userError = "Time limit exceeded";
      } 
      else if (errorMessage.startsWith('COMPILATION_ERROR:')) {
        status = "COMPILATION_ERROR";
        // Remove file paths from compilation error
        userError = errorMessage
          .replace('COMPILATION_ERROR:', '')
          .replace(new RegExp(filePath, 'g'), '')
          .replace(/\/.+\//g, '')  
          .trim();
      }
      else if (errorMessage.startsWith('RUNTIME_ERROR:')) {
        status = "RUNTIME_ERROR";
        userError = errorMessage
          .replace('RUNTIME_ERROR:', '')
          .replace(new RegExp(filePath, 'g'), '')
          .trim();
      }
      else if (errorMessage.startsWith('DIVISION_BY_ZERO:')) {
        status = "RUNTIME_ERROR";
        userError = "Division by zero error";
      }
      else if (errorMessage.startsWith('SEGMENTATION_FAULT:')) {
        status = "RUNTIME_ERROR";
        userError = "Segmentation fault";
      }
      else {
        status = "ERROR";
        userError = "An error occurred during execution";
      }

      return res.json({ 
        status,
        error: userError,
        output: null 
      });
    }

  } catch (serverError) {
    console.error("Server Error:", serverError);
    return res.status(500).json({ 
      status: "SERVER_ERROR",
      error: "Internal server error",
      output: null 
    });
  }
});

module.exports = router;