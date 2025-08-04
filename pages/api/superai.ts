import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const model = 'mistralai/Mixtral-8x7B-Instruct-v0.1'; // <- Change if using a different one

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.error || 'AI response error' });
    }

    const data = await response.json();
    const result = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;

    return res.status(200).json({ result: result || 'No response generated.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
