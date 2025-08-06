import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const MIXTRAL_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MIXTRAL_API_KEY = process.env.OPENROUTER_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing or invalid messages array' });
  }

  try {
    const response = await axios.post(
      MIXTRAL_API_URL,
      {
        model: 'mistralai/mixtral-8x7b-instruct',
        messages,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${MIXTRAL_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://digital-product.vercel.app',
          'X-Title': 'JDC Mixtral Chat',
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message;
    if (!reply) throw new Error('No reply returned from Mixtral');

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('Mixtral error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Mixtral request failed', detail: error.message });
  }
}
