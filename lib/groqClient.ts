export async function groqChat(messages: any[], model = process.env.CHAT_MODEL || 'llama3-70b-8192') {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY');

  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
      stream: false
    }),
  });

  const data = await r.json();
  if (!r.ok) {
    throw new Error(`Groq upstream error ${r.status}: ${JSON.stringify(data).slice(0,1200)}`);
  }
  return (data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? '').toString();
}
