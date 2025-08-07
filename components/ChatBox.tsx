import React from "react";

interface Message {
  role: string;
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
}

export default function ChatBox({ messages }: ChatBoxProps) {
  return (
    <div className="border rounded p-3 h-96 overflow-y-auto mb-2 bg-white shadow">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={
            msg.role === "user"
              ? "text-right text-blue-600 mb-1"
              : "text-left text-black mb-1"
          }
        >
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
}
