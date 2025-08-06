import { useEffect, useState } from 'react';

export default function MixtralChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const res = await fetch('/api/superai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.result }]);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%' }}
      />
      <button onClick={handleSend} disabled={isLoading}>
        {isLoading ? 'Thinking...' : 'Send'}
      </button>
    </div>
  );
}
