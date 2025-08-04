import { useState } from 'react';

export default function Chat() {
  const [prompt, setPrompt] = useState('');
  const [resp, setResp] = useState('');

  const send = async () => {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const d = await r.json();
    setResp(d.response || d.error || 'No response');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Mixtral Chat</h1>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Type prompt" />
      <button onClick={send}>Send</button>
      <pre>{resp}</pre>
    </div>
  );
}
