import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌟 Welcome to JDC SuperAI Final</h1>
      <p>System is live. Navigate below:</p>
      <ul>
        <li><Link href="/products">🛍️ Browse Products</Link></li>
        <li><Link href="/chat">💬 Super AI Chat</Link></li>
        <li><Link href="/dashboard">📈 Admin Dashboard</Link></li>
      </ul>
    </main>
  );
}
