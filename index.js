import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Gemini uses raw HTTP

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Replace with your actual Gemini API key or use environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";

app.get("/", (req, res) => {
  res.send("Hello! Gemini AI backend is running.");
});

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();

    if (data && data.candidates && data.candidates.length > 0) {
      const aiReply = data.candidates[0].content.parts[0].text;
      res.json({ answer: aiReply });
    } else {
      console.error("Unexpected Gemini response:", data);
      res.status(500).json({ error: "Invalid Gemini response" });
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
