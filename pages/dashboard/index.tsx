import dynamic from 'next/dynamic';
const MixtralChat = dynamic(() => import('../../components/MixtralChat'), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {/* Your dashboard content */}
      <MixtralChat />
    </div>
  );
}
