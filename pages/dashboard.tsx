import React from 'react';

type CoreLaw = {
  title: string;
  description: string;
};

const coreLaws: CoreLaw[] = [
  { title: "Elite Quality Law", description: "Nothing goes out unless it's elite" },
  { title: "Zero Placeholder Law", description: "No fake data allowed, ever" },
  { title: "Self-Healing AI Law", description: "System must auto-repair all issues" },
  { title: "Live Data Law", description: "Only real-time production data allowed" },
];

export default function Dashboard() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">JDC Core Laws</h1>
      <ul className="space-y-4">
        {coreLaws.map((law, i) => (
          <li key={i} className="bg-gray-800 p-3 rounded border border-gray-600">
            <strong>{law.title}:</strong> {law.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
