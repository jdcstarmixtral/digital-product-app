import fs from 'fs';
import path from 'path';
import { writeMixtralProduct } from '@/utils/mixtralProductWriter';
import type { NextApiRequest, NextApiResponse } from 'next';

const MIXTRAL_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const prompt = req.body.prompt;

  try {
    const response = await fetch(MIXTRAL_URL, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.OPENROUTER_API_KEY}\`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_HTTP_REFERER || '',
        'X-Title': process.env.OPENROUTER_X_TITLE || 'JDC-AI'
      },
      body: JSON.stringify({
        model: "mistral/mixtral-8x7b",
        messages: [
          {
            role: "system",
            content: "You are a product generator. Based on a user's request, generate a small digital product idea including slug, title, description, price, and image."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    const product = JSON.parse(content);
    const slug = product.slug || product.title.toLowerCase().replace(/\s+/g, '-');

    writeMixtralProduct(slug, product);

    return res.status(200).json({ success: true, slug, product });

  } catch (error: any) {
    console.error('Error contacting Mixtral server:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
