import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import fs from 'fs';
import path from 'path';

interface Product {
  title: string;
  description: string;
  image: string;
  price: number;
}

interface ProductPageProps {
  content: Product;
}

export default function ProductPage({ content }: ProductPageProps) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
      <img src={content.image} alt={content.title} className="mb-4 w-full max-w-md rounded" />
      <p className="mb-2">{content.description}</p>
      <p className="text-lg font-semibold">${content.price.toFixed(2)}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dir = path.join(process.cwd(), 'data', 'mixtral');
  let paths: { params: { slug: string } }[] = [];

  try {
    const files = await fs.promises.readdir(dir);
    paths = files
      .filter((file) => file.endsWith('.json'))
      .map((file) => ({
        params: { slug: file.replace('.json', '') }
      }));
  } catch (error) {
    console.warn('⚠️ No product JSONs found at build time');
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), 'data', 'mixtral', `${slug}.json`);

  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const content = JSON.parse(data);

    return {
      props: { content },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`❌ Failed to load product data for slug: ${slug}`, error);
    return {
      notFound: true,
    };
  }
};
