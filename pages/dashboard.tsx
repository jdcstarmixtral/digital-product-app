import React, { useState } from 'react';
import Head from 'next/head';

export default function Dashboard() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: input }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/superai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      setMessages([...updatedMessages, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages([...updatedMessages, { role: 'assistant', content: '⚠️ AI failed to respond.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>JDC Control Dashboard</title>
      </Head>
      <div className="p-6 space-y-10">
        <h1 className="text-3xl font-bold text-center">🧠 JDC Super AI Dashboard</h1>

        {/* Status Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold">🔁 Self-Healing</h2>
            <p>Status: <span className="text-green-600 font-bold">ACTIVE</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold">🛒 Products</h2>
            <p>Live Funnels: <span className="font-bold">250+</span></p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold">💰 Revenue</h2>
            <p>Past 24h: <span className="font-bold text-blue-700">,894</span></p>
          </div>
        </div>

        {/* AI Chat Interface */}
        <div className="bg-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-2">🤖 Talk to Mixtral</h2>
          <div className="space-y-2 h-64 overflow-y-auto bg-white p-3 rounded border border-gray-300">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className="block text-sm whitespace-pre-line">
                  <strong>{msg.role === 'user' ? 'You' : 'Mixtral'}:</strong> {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Mixtral is thinking...</div>}
          </div>
          <div className="mt-3 flex">
            <input
              className="flex-grow border border-gray-300 p-2 rounded-l"
              placeholder="Ask Mixtral anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">
              Send
            </button>
          </div>
        </div>

        {/* Override Panel */}
        <div className="bg-red-50 border border-red-300 p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold text-red-700">🛠️ Manual Overrides</h2>
          <button className="bg-red-600 text-white px-4 py-2 rounded mt-3 mr-3">Trigger Full Reset</button>
          <button className="bg-yellow-500 text-black px-4 py-2 rounded mt-3">Inject Emergency Funnels</button>
        </div>
      </div>
    </>
  );
}
