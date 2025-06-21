const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI, GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const verifyToken = require("../middlewares/authMiddleware");

router.post("/", verifyToken, async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({ message: "Code is empty" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyse the code and provide a short and concise review Code:${code}`,
    });
    console.log(response.text);
    res.status(200).json({ "review": response.text });

  } catch (err) {
    console.error("AI Review Error:", err);
    res.status(500).json({ 
      message: "Failed to get AI review",
      error: err.message,
      details: err.response?.data || null
    });
  }
});

module.exports = router;