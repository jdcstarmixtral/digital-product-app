import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array.' });
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
        model: 'mistralai/mixtral-8x7b-instruct',
        messages,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message) {
      return res.status(500).json({ error: 'Invalid AI response' });
    }

    return res.status(200).json({ message: data.choices[0].message });
  } catch (err) {
    console.error('[SuperAI Error]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
