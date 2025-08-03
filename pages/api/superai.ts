import type { NextApiRequest, NextApiResponse } from 'next';

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
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jdcai.vercel.app',
        'X-Title': 'JDC Super AI'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b',
        messages,
        temperature: 0.8
      }),
    });

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || '⚠️ No response from Mixtral.';
    res.status(200).json({ message });
  } catch (error) {
    console.error('[Mixtral Error]', error);
    res.status(500).json({ error: 'Failed to reach Mixtral API' });
  }
}
