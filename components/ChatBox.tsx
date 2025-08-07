import React from "react";

type Message = {
  role: string;
  content: string;
};

type Props = {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSend: (input: string) => void;
};

const ChatBox: React.FC<Props> = ({ messages, loading, error, onSend }) => {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== "") {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-3">🔧 JDC Control Center</h2>

      <div className="border rounded p-3 h-96 overflow-y-auto mb-2 bg-white shadow">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-blue-500">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
