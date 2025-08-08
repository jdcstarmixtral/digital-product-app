import React, { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are Mixtral, a helpful assistant.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/mixtral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      if (!res.ok || !data.reply) {
        setError('❌ Mixtral returned no reply.');
        setLoading(false);
        return;
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('❌ Failed to reach Mixtral.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>🧠 Mixtral Chat</h1>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '0.5rem 0' }}>
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}
        {loading && <p>⏳ Thinking...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <input
        style={{ width: '80%', padding: '0.5rem' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something to Mixtral..."
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
        Send
      </button>
    </div>
  );
}
