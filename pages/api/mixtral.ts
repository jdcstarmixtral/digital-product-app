export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing or invalid messages" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://jdc-24zqjo6m3-jesscosales-projects.vercel.app",
        "X-Title": "JDC Mixtral"
      },
      body: JSON.stringify({
        model: "mistral/mixtral-8x7b",
        messages,
        temperature: 0.7
      })
    });

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content;
    res.status(200).json({ reply: reply || "No reply from Mixtral." });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from OpenRouter", details: err.message });
  }
}
