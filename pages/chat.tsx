import { useState } from 'react';
import axios from 'axios';

export default function ChatPage() {
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are a helpful assistant.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/mixtral', {
        messages: newMessages,
      });

      const reply = response.data.reply || '⚠️ No reply';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Error contacting AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">💬 JDC Mixtral Chat</h1>
      <div className="space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-4 py-2"
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '⏳' : 'Send'}
        </button>
      </div>
    </div>
  );
}
