import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || '',
        'X-Title': process.env.OPENROUTER_X_TITLE || ''
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'OpenRouter error' });
    }

    res.status(200).json({ result: data.choices?.[0]?.message?.content || 'No response.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to contact Mixtral.' });
  }
}
