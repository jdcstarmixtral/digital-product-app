import type { NextApiRequest, NextApiResponse } from 'next';

export const dynamic = 'force-dynamic';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const engine = process.env.AI_ENGINE || 'unknown';
  const model  = process.env.CHAT_MODEL || 'unknown';

  const report: any = { engine, model, chat: false };
  try {
    const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/mixtral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // simple ping prompt
      body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] }),
    });
    report.chat = r.ok;
    if (!r.ok) {
      try { report.chat_error = await r.json(); } catch { report.chat_error = await r.text(); }
    }
  } catch (e: any) {
    report.chat_error = String(e?.message || e);
  }

  const status = report.chat ? 'OK' : 'ISSUES_DETECTED';
  return res.status(200).json({ status, report });
}
