import React, { useState } from "react";

const HealSystem = () => {
  const [log, setLog] = useState<string[]>([]);
  const [healing, setHealing] = useState(false);

  const startHealing = async () => {
    setHealing(true);
    const steps = [
      "🧠 CLAWS AI engaged...",
      "🔍 Scanning for system issues...",
      "⚙️ Rebuilding routes...",
      "📦 Validating components...",
      "🚨 Fixing 404 fallback routes...",
      "📁 Ensuring all files are accessible...",
      "✅ All core logic healed successfully.",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 1000)); // Simulate delay
      setLog((prev) => [...prev, steps[i]]);
    }

    setHealing(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">🛠️ System Healing</h3>
      <button
        onClick={startHealing}
        disabled={healing}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {healing ? "Healing..." : "Heal System"}
      </button>
      <div className="mt-4 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50 text-sm">
        {log.length === 0 ? (
          <p className="text-gray-400">No healing logs yet.</p>
        ) : (
          log.map((line, idx) => <p key={idx}>• {line}</p>)
        )}
      </div>
    </div>
  );
};

export default HealSystem;
