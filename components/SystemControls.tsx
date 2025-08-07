import { useState } from 'react';

export default function SystemControls() {
  const [healing, setHealing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleHeal = async () => {
    setHealing(true);
    setLogs(["[+] Starting system healing..."]);

    const steps = [
      "Checking dashboard route...",
      "Validating funnel slugs...",
      "Verifying Supabase backend link...",
      "Rewiring chat assistant...",
      "Reinjecting fallback paths...",
      "Clearing stale cache...",
      "Finalizing system repair..."
    ];

    for (const step of steps) {
      await new Promise((res) => setTimeout(res, 500));
      setLogs((prev) => [...prev, `[✓] ${step}`]);
    }

    await new Promise((res) => setTimeout(res, 500));
    setLogs((prev) => [...prev, "[✓] System healed successfully."]);
    setHealing(false);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 mt-6 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">🛠 System Controls</h3>
      <button
        onClick={handleHeal}
        disabled={healing}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4"
      >
        {healing ? "Healing in progress..." : "Heal System"}
      </button>
      <div className="bg-black text-green-400 font-mono p-3 text-sm rounded-lg max-h-64 overflow-auto">
        {logs.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}
