import type { NextApiRequest, NextApiResponse } from 'next';
import { createProductPage } from '../../scripts/lam_product_creator';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { slug, title, description, image, price } = req.body;

    if (!slug || !title || !description || !image || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    createProductPage({ slug, title, description, image, price });
    res.status(200).json({ success: true, message: `Product '${slug}' created.` });
  } catch (err: any) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
