import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import { PRODUCTS, type ProductRec } from '../../../data/products';

export const config = { runtime: 'edge' };

const font = fetch(new URL('https://fonts.cdnfonts.com/s/17808/Gilroy-ExtraBold.woff', import.meta.url))
  .then(r => r.arrayBuffer())
  .catch(async ()=> (await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2')).arrayBuffer());

export default async function handler(req: NextRequest, { params }: any) {
  const { slug } = params || {};
  const product: ProductRec | undefined = PRODUCTS.find(p => p.slug === slug);

  if (!product) {
    return new Response('Not found', { status: 404 });
  }

  const f = await font;
  const gradA = '#0ea5e9'; // sky-500
  const gradB = '#6d28d9'; // violet-700
  const glass = 'rgba(255,255,255,.10)';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 630, display: 'flex',
          background: `radial-gradient(1200px 630px at 100% 0%, ${gradA}, ${gradB})`,
          color: 'white', fontFamily: 'Gilroy, Inter, ui-sans-serif, system-ui',
          position:'relative'
        }}
      >
        <div style={{
          position:'absolute', inset:40, borderRadius:32,
          background: 'linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02))',
          boxShadow:'0 30px 120px rgba(0,0,0,.35)', border:'1px solid rgba(255,255,255,.08)'
        }} />

        <div style={{ position:'absolute', inset:0, opacity:.18,
          background: 'radial-gradient(800px 400px at 20% 80%, #ffffff, transparent 60%)'
        }} />

        <div style={{ zIndex:2, display:'flex', flexDirection:'column', gap:28, padding:72 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ padding:'6px 12px', borderRadius:999, background:glass, fontSize:24, fontWeight:600 }}>
              {product.tier.toUpperCase()}
            </div>
            <div style={{ opacity:.9, fontSize:24 }}>${(product.price/100).toFixed(2)} {product.currency}</div>
          </div>

          <div style={{ fontSize:64, fontWeight:900, lineHeight:1.05, maxWidth:980 }}>
            {product.name}
          </div>

          <div style={{ fontSize:28, opacity:.9, maxWidth:980 }}>
            {product.funnel.headline}
          </div>

          <div style={{ display:'flex', gap:24, marginTop:10 }}>
            {product.funnel.bullets.slice(0,3).map((b, i) => (
              <div key={i} style={{
                background: glass, padding:'14px 18px', borderRadius:14,
                border:'1px solid rgba(255,255,255,.08)', fontSize:22, maxWidth:320
              }}>
                • {b}
              </div>
            ))}
          </div>

          <div style={{ marginTop:6, fontSize:18, opacity:.8 }}>
            {product.funnel.guarantee}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Gilroy', data: f, weight: 800, style: 'normal' }],
    }
  );
}
