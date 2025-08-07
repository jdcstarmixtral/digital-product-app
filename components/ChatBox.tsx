import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/superai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Unknown error');

      setMessages([...newMessages, data.message]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="border rounded p-3 h-96 overflow-y-auto mb-2 bg-white shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className={}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-green-600">Thinking...</div>}
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
