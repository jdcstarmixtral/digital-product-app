import type { NextApiRequest, NextApiResponse } from 'next';

const MIXTRAL_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MIXTRAL_API_KEY = process.env.MIXTRAL_API_KEY || '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';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages' });
    }

    const response = await fetch(MIXTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MIXTRAL_API_KEY}`,
        'HTTP-Referer': 'https://jdcai.vercel.app',
        'X-Title': 'JDC Super AI',
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b',
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: 'Mixtral API failed', details: error });
    }

    const data = await response.json();
    return res.status(200).json({ response: data.choices?.[0]?.message?.content || '' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
