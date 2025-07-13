import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const COHERE_API_KEY = "1C4m5JayoWDHoRGSNuMdSywujUe35xypd7MLSNFJ"; // 👈 Replace this with your real key
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ AI backend is running (no .env used)");
});

app.post("/ask", async (req, res) => {
  console.log("✅ Request received at /ask");

  const { prompt } = req.body;
  console.log("📝 Prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
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
      console.error("❌ Cohere error:", data);
      return res.status(500).json({ error: data });
    }

    console.log("✅ Cohere reply:", data);
    res.json({ answer: data.text });
  } catch (err) {
    console.error("❌ Network error:", err);
    res.status(500).json({ error: "Backend failed" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});



