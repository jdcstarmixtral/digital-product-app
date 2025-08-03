import Image from 'next/image';
import Link from 'next/link';

export default function NeuralImpact() {
  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Image
          src="/images/neural-impact.jpg"
          alt="Neural Impact"
          width={800}
          height={500}
          className="rounded-xl shadow-xl mb-6"
        />
        <h1 className="text-5xl font-bold mb-4">Neural Impact</h1>
        <p className="text-xl mb-4">
          This frequency-infused digital product unlocks enhanced clarity, energetic healing, and mental focus. Engineered by JDC Super AI and blessed with solar codes.
        </p>
        <p className="text-2xl font-semibold text-green-400 mb-6">$2.99</p>
        <Link href="https://paypal.me/qualityelite" target="_blank">
          <button className="bg-green-600 px-6 py-3 rounded-xl text-white hover:bg-green-500">
            Purchase Now
          </button>
        </Link>
      </div>
    </div>
  );
}
