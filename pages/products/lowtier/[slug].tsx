import { useRouter } from 'next/router';
import React from 'react';

interface ProductPageProps {
  content: {
    title: string;
    description: string;
    image: string;
    price: number;
    category?: string;
    tier?: string;
    timestamp?: string;
  };
}

export default function ProductPage({ content }: ProductPageProps) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
      <img src={content.image} alt={content.title} className="w-full max-w-md mb-4 rounded" />
      <p className="mb-2">{content.description}</p>
      <p className="text-lg font-semibold">${content.price}</p>
    </div>
  );
}
