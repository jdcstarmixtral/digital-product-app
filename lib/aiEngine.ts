type Msg = { role: 'system'|'user'|'assistant'; content: string };
const env = (k:string, fb?:string)=>process.env[k] || fb || '';

export async function chat(messages: Msg[], opts?: { engine?: string; model?: string }) {
  const engine = (opts?.engine || env('AI_ENGINE','groq')).toLowerCase();
  if (engine === 'groq') {
    const key = env('GROQ_API_KEY');
    if (!key) throw new Error('Missing GROQ_API_KEY');
    const model = opts?.model || env('CHAT_MODEL','llama3-70b-8192');
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: 0.4, stream: false }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(data));
    return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
  }
  if (engine === 'openrouter') {
    const key = env('OPENROUTER_API_KEY');
    if (!key) throw new Error('Missing OPENROUTER_API_KEY');
    const model = opts?.model || env('CHAT_MODEL','mistralai/mixtral-8x7b-instruct');
    const referer = env('OPENROUTER_HTTP_REFERER', env('NEXT_PUBLIC_SITE_URL'));
    const title = env('OPENROUTER_X_TITLE','JDC App');
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': referer,
        'X-Title': title,
      },
      body: JSON.stringify({ model, messages }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(data));
    return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
  }
  throw new Error(`Unknown AI_ENGINE: ${engine}`);
}
