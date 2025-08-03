import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🚀 JDC Super AI: Mixtral Mode Live</h1>
      <p>Welcome to the active system interface.</p>
      <ul style={{ lineHeight: '2' }}>
        <li><Link href="/products">🛒 View All Products</Link></li>
        <li><Link href="/chat">🤖 Open Super AI Chat</Link></li>
        <li><Link href="/dashboard">📊 Admin Dashboard</Link></li>
      </ul>
    </main>
  );
}
