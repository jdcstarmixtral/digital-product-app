import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jdcstar.com',
        'X-Title': 'JDC Mixtral AI Chat',
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages,
      }),
    });

    const data = await response.json();
    return res.status(200).json({ message: data?.choices?.[0]?.message?.content || "No response" });
  } catch (err) {
    console.error("AI chat error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}
