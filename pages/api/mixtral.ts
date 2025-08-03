import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        "Content-Type": "application/json",
        "Authorization": "Token r8_NHHY0KcQcP3w6A2VK4UgnLI0crvZ2hFgBPxHBgJ"
      },
      body: JSON.stringify({
        model: "openrouter/mixtral-8x7b",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    const data = await response.json();
    if (data?.choices?.[0]?.message?.content) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      console.error("Invalid response from Mixtral:", data);
      res.status(500).json({ error: "No valid reply from Mixtral" });
    }
  } catch (error) {
    console.error("Mixtral API error:", error);
    res.status(500).json({ error: "Error reaching Mixtral" });
  }
}
