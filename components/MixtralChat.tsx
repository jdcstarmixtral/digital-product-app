import { useState } from 'react';

export default function MixtralChat() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are JDC Super AI powered by Mixtral. Respond intelligently.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/mixtral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, data.reply]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: '⚠️ No reply received.' }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([...newMessages, { role: 'assistant', content: '❌ Error contacting Mixtral API.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '6px 0' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message..."
        style={{ padding: 8, width: '70%' }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ padding: 8, marginLeft: 10 }}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </div>
  );
}
