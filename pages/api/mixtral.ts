import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const MIXTRAL_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await axios.post(
      MIXTRAL_API_URL,
      {
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: messages,
      },
      {
        headers: {
          'Authorization': \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://digital-product.vercel.app',
          'X-Title': process.env.OPENROUTER_X_TITLE || 'JDC LAM',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || '⚠️ No response';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('Mixtral API error:', error);
    res.status(500).json({ error: 'Error contacting Mixtral server' });
  }
}
