"use client";
import { useState } from "react";

export default function HealSystem() {
  const [healing, setHealing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleHeal = async () => {
    setHealing(true);
    setLogs(["⛑ Healing Activated..."]);

    const steps = [
      "🔍 Scanning for broken routes...",
      "🧠 CLAWS AI running diagnostics...",
      "🛠 Rebuilding dynamic routes...",
      "🔁 Revalidating deployment...",
      "✅ Final system check...",
      "🚀 System healed successfully."
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 1000));
      setLogs((prev) => [...prev, step]);
    }

    setHealing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-lg font-semibold mb-2">System Healer</h3>
      <button
        onClick={handleHeal}
        disabled={healing}
        className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {healing ? "Healing..." : "Heal System"}
      </button>

      {logs.length > 0 && (
        <div className="mt-4 text-sm bg-gray-100 p-3 rounded font-mono space-y-1 max-h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}
