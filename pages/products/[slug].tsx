import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';
import { useRouter } from 'next/router';

interface ProductProps {
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function ProductPage({ title, description, price, image }: ProductProps) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <Image src={`/images/${image}`} alt={title} width={600} height={400} className="mx-auto mb-4" />
      <p className="mb-2">{description}</p>
      <p className="text-xl font-semibold mb-4">{price}</p>
      <button className="bg-black text-white px-6 py-2 rounded-lg">Buy Now</button>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = [
    'neural-impact',
    'mind-mastery',
    'soul-surge',
    'neural-impact' // This duplicate line is the problem
  ];

  const uniqueSlugs = Array.from(new Set(slugs));

  const paths = uniqueSlugs.map(slug => ({
    params: { slug }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  const productMap: Record<string, ProductProps> = {
    'neural-impact': {
      title: 'Neural Impact',
      description: 'Unlock your mind\'s full potential.',
      price: '$4.99',
      image: 'neural-impact.jpg'
    },
    'mind-mastery': {
      title: 'Mind Mastery',
      description: 'Take control of your inner world.',
      price: '$7.99',
      image: 'mind-mastery.jpg'
    },
    'soul-surge': {
      title: 'Soul Surge',
      description: 'Amplify your energy and purpose.',
      price: '$9.99',
      image: 'soul-surge.jpg'
    }
  };

  const product = productMap[slug];

  if (!product) {
    return { notFound: true };
  }

  return {
    props: product,
    revalidate: 60
  };
};
