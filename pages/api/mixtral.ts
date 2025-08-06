import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { writeMixtralProduct } from '../../utils/mixtralProductWriter';

const MIXTRAL_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const userPrompt = req.body?.prompt;
  if (!userPrompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are Mixtral, an elite product generator AI. Your job is to create viral digital product ideas with a title, description, and image suggestion.',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    const response = await fetch(MIXTRAL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || 'https://digital-product.vercel.app',
        'X-Title': process.env.OPENROUTER_X_TITLE || 'JDC LAM',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral/mixtral-8x7b',
        messages,
      }),
    });

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error('No content from Mixtral');
    }

    // Basic parsing logic from AI response
    const match = aiText.match(/Title:\s*(.+)\n+Description:\s*(.+)\n+Image:\s*(.+)/i);
    if (!match) {
      return res.status(500).json({ error: 'Failed to parse Mixtral response', raw: aiText });
    }

    const [_, title, description, image] = match;

    // Write product file
    const product = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
    };

    const slug = await writeMixtralProduct(product);

    return res.status(200).json({ success: true, slug, product });

  } catch (error: any) {
    console.error('[MIXTRAL API ERROR]', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
