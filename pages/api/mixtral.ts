import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSlug } from '@/utils/slugger';
import { writeMixtralProduct } from '@/utils/mixtralProductWriter';
import { MixtralProduct } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const product: MixtralProduct = {
      title: body.title,
      description: body.description,
      price: body.price,
      image: body.image,
      category: body.category,
      tier: body.tier,
      timestamp: new Date().toISOString()
    };

    const slug = generateSlug(product.title);

    // ✅ FINAL FIX: use both slug and product
    await writeMixtralProduct(slug, product);

    return res.status(200).json({ success: true, slug, product });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
// Force touch to trigger rebuild
