import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import fetch from 'cross-fetch';
import { PRODUCTS } from '../../data/products';

export const dynamic = 'force-dynamic';

async function getLocationId(accessToken: string): Promise<string> {
  if (process.env.SQUARE_LOCATION_ID) return process.env.SQUARE_LOCATION_ID as string;
  const resp = await fetch('https://connect.squareup.com/v2/locations', {
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'Square-Version': '2023-10-18' }
  });
  if (!resp.ok) throw new Error(`Square locations error: ${resp.status} ${await resp.text()}`);
  const json:any = await resp.json();
  const active = (json?.locations || []).find((l: any) => l.status === 'ACTIVE');
  if (!active?.id) throw new Error('No ACTIVE Square locations found. Set SQUARE_LOCATION_ID.');
  return active.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try{
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    if (!accessToken) return res.status(500).json({ error: 'Missing SQUARE_ACCESS_TOKEN' });

    const slug = String(req.query.slug || '');
    if (!slug) return res.status(400).json({ error: 'Missing slug' });

    const product = PRODUCTS.find(p => p.slug === slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const locationId = await getLocationId(accessToken);
    const amount = Math.round(product.price);

    const body = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: product.name,
        price_money: { amount, currency: product.currency || 'USD' },
        location_id: locationId
      },
      checkout_options: {
        redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/products/${product.slug}?status=paid`
      }
    };

    const resp = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', 'Square-Version': '2023-10-18' },
      body: JSON.stringify(body)
    });
    const data:any = await resp.json();
    if (!resp.ok || !data?.payment_link?.url) return res.status(500).json({ error: 'Square link error', details: data });
    return res.status(200).json({ url: data.payment_link.url });
  }catch(e:any){
    return res.status(500).json({ error: e?.message || 'Checkout failure' });
  }
}
