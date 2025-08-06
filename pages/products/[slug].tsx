import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';

export default function ProductPage({ product }: { product: any }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <>
      <Head>
        <title>{product.title} | JDC Products</title>
      </Head>
      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 space-y-6">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <p className="text-gray-700">{product.description}</p>
            {product.image && (
              <img
                src={`/images/${product.image}`}
                alt={product.title}
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}
            <button className="bg-purple-700 text-white px-6 py-3 rounded-xl w-full transition hover:bg-purple-800">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const productsDir = path.join(process.cwd(), 'data/products');
  const filenames = fs.existsSync(productsDir) ? fs.readdirSync(productsDir) : [];

  const paths = filenames.map((name) => ({
    params: { slug: name.replace(/\.json$/, '') },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: any }) {
  const filePath = path.join(process.cwd(), 'data/products', `${params.slug}.json`);

  if (!fs.existsSync(filePath)) {
    return {
      notFound: true,
    };
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const product = JSON.parse(fileContent);

  return {
    props: {
      product,
    },
  };
}
