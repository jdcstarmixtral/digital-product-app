import type { NextApiRequest, NextApiResponse } from 'next';
export const dynamic = 'force-dynamic';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const engine = process.env.AI_ENGINE || 'unknown';
  const model  = process.env.CHAT_MODEL || 'unknown';

  const report: any = { engine, model, probes: {} };

  async function probe(name: string, url: string, body?: any) {
    try {
      const r = await fetch(url, {
        method: body ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });
      report.probes[name] = { ok: r.ok, status: r.status };
      if (!r.ok) {
        try { report.probes[name].error = await r.json(); }
        catch { report.probes[name].error = await r.text(); }
      }
    } catch (e: any) {
      report.probes[name] = { ok: false, error: e?.message || String(e) };
    }
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || '';
  await probe('chat',    `${base}/api/mixtral`, { messages:[{ role:'user', content:'ping' }]} );
  await probe('ai',      `${base}/api/ai`,      { messages:[{ role:'user', content:'ping' }]} );
  await probe('system',  `${base}/api/system`,  { messages:[{ role:'user', content:'ping' }]} );
  await probe('superai', `${base}/api/superai`, { messages:[{ role:'user', content:'ping' }]} );

  const ok = Object.values(report.probes).every((p:any) => p.ok);
  res.status(200).json({ status: ok ? 'OK' : 'ISSUES_DETECTED', report });
}
