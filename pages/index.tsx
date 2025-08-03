import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🚀 Welcome to the JDC Super AI System</h1>
      <p>System is live and active.</p>
      <ul>
        <li><Link href="/chat">Launch Super AI Chat</Link></li>
        <li><Link href="/products">View Products</Link></li>
        <li><Link href="/funnels">Funnels Overview</Link></li>
      </ul>
    </div>
  );
}
