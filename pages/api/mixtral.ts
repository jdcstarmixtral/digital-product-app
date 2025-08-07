import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages' });
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'mistralai/mixtral-8x7b',
      messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://yourdomain.com',
        'X-Title': process.env.OPENROUTER_X_TITLE || 'jdc-mixtral'
      }
    });

    res.status(200).json(response.data);
  } catch (err: any) {
    res.status(500).json({ error: 'API call failed', details: err?.response?.data || err.message });
  }
}
