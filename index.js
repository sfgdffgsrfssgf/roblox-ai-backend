import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // If you're using an older Node.js version, keep this
import dotenv from "dotenv";

dotenv.config();

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ AI backend is running!");
});

app.post("/ask", async (req, res) => {
  console.log("✅ Request received at /ask");

  const { prompt } = req.body;

  console.log("📝 Prompt:", prompt);

  if (!prompt) {
    console.warn("⚠️ No prompt provided");
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
        "Cohere-Version": "2022-12-06"
      },
      body: JSON.stringify({
        message: prompt,
        model: "command-r",
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Cohere returned an error:", data);
      return res.status(500).json({ error: data });
    }

    console.log("✅ Cohere response:", data);
    res.json({ answer: data.text });
  } catch (error) {
    console.error("❌ Network error to Cohere:", error);
    res.status(500).json({ error: "Cohere API failed." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});


