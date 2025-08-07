import { useState } from 'react';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages: ChatMessage[] = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/mixtral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();
      const replyContent = data.choices?.[0]?.message?.content || 'No reply received.';

      const assistantReply: ChatMessage = {
        role: 'assistant',
        content: replyContent,
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: ' + error.message },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="border rounded p-3 h-96 overflow-y-auto mb-2 bg-white shadow">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded shadow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
