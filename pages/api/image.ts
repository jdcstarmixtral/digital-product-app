import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/image', // Replace with your Mixtral-compatible image endpoint if different
      { prompt },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://digital-product.vercel.app',
          'X-Title': process.env.OPENROUTER_X_TITLE || 'JDC LAM',
        },
      }
    );

    res.status(200).json({ image: response.data.image_url || null });
  } catch (error: any) {
    console.error('Image API error:', error?.message || error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
