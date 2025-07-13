import express from "express";
import cors from "cors";
import fetch from "node-fetch";  // If using Node <18; Node 18+ has fetch built-in

const app = express();
app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.get("/", (req, res) => {
  res.send("Cohere AI backend is running.");
});

app.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const response = await fetch("https://api.cohere.ai/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-xlarge-nightly",
        prompt,
        max_tokens: 100,
        temperature: 0.7,
        k: 0,
        p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: ["--"],
      }),
    });

    const data = await response.json();

    if (data.generations && data.generations.length > 0) {
      res.json({ answer: data.generations[0].text.trim() });
    } else {
      res.status(500).json({ error: "No response from Cohere" });
    }
  } catch (err) {
    console.error("Error calling Cohere:", err);
    res.status(500).json({ error: "Failed to call Cohere" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

