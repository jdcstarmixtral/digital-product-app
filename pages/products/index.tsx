import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: "neural-impact",
    title: "Neural Impact",
    image: "/images/neural-impact.jpg",
    price: ".99",
    tier: "Low"
  },
  {
    id: "soul-mastery",
    title: "Soul Mastery",
    image: "/images/soul-mastery.jpg",
    price: "9",
    tier: "Medium"
  },
  {
    id: "infinite-ascension",
    title: "Infinite Ascension",
    image: "/images/infinite-ascension.jpg",
    price: "33",
    tier: "High"
  }
];

export default function ProductIndex() {
  return (
    <>
      <Head><title>All Products</title></Head>
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">🛒 Elite Digital Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="border rounded-xl p-4 hover:shadow-lg bg-white">
                <Image src={product.image} alt={product.title} width={400} height={300} className="rounded" />
                <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
                <p className="text-sm text-gray-600">{product.tier} Tier • {product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
