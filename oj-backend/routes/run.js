const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { code, language, input } = req.body;

  try {
    // Forward the request to the runner service
    const response = await axios.post(`${process.env.RUNNER_URL}`, {
      code,
      language,
      input,
    });


    res.status(200).json(response.data); // Forward output to frontend
  } catch (err) {
    console.error("Error calling runner service:", err.message);
    res.status(500).json({ error: "Failed to execute code." });
  }
});


module.exports = router;
