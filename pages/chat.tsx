import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are now speaking to JDC Mixtral AI.' }]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const updated = [...messages, { role: 'user', content: input }];
    setMessages(updated);
    setInput('');

    const res = await fetch('/api/superai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: updated }),
    });

    const data = await res.json();
    if (data?.message) {
      setMessages([...updated, { role: 'assistant', content: data.message }]);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">JDC Mixtral Chat</h1>
      <div className="bg-gray-800 p-4 rounded-xl h-96 overflow-y-scroll mb-4">
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.role}:</strong> {msg.content}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
        />
        <button className="bg-green-500 px-4 py-2 rounded-xl">Send</button>
      </form>
    </div>
  );
}
