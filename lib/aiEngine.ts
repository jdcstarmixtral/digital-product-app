type Msg = { role: 'system'|'user'|'assistant'; content: string };

const pick = (k: string, fb?: string) => process.env[k] || fb || '';

export async function chat(messages: Msg[], opts?: { engine?: string; model?: string }) {
  const engine = (opts?.engine || pick('AI_ENGINE','groq')).toLowerCase();
  if (engine === 'groq') {
    const apiKey = pick('GROQ_API_KEY');
    const model = opts?.model || pick('CHAT_MODEL','llama3-70b-8192');
    if (!apiKey) throw new Error('Missing GROQ_API_KEY');
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: 0.4, stream: false }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(data));
    return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
  }

  if (engine === 'openrouter') {
    const apiKey = pick('OPENROUTER_API_KEY');
    const model = opts?.model || pick('CHAT_MODEL','mistralai/mixtral-8x7b-instruct');
    if (!apiKey) throw new Error('Missing OPENROUTER_API_KEY');
    const referer = pick('OPENROUTER_HTTP_REFERER', pick('NEXT_PUBLIC_SITE_URL'));
    const title = pick('OPENROUTER_X_TITLE','JDC App');
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
