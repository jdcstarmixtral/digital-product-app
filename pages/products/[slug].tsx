import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';

type Product = {
  title: string;
  description: string;
  image: string;
};

export async function getStaticPaths() {
  const productsDir = path.join(process.cwd(), 'data', 'products');
  const files = fs.readdirSync(productsDir);

  const paths = files.map(file => ({
    params: { slug: file.replace('.json', '') }
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { slug } = context.params!;
  const filePath = path.join(process.cwd(), 'data', 'products', `${slug}.json`);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const product: Product = JSON.parse(fileContents);

    return { props: { product } };
  } catch (err) {
    return { notFound: true };
  }
}

export default function ProductPage({ product }: { product: Product }) {
  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-700">
          <div className="relative w-full h-64">
            <Image
              src={`/images/${product.image}`}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-2xl"
            />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-lg mb-6">{product.description}</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl w-full transition">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
