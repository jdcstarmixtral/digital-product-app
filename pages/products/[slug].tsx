import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface ProductProps {
  title: string;
  description: string;
  price: string;
  image: string;
}

const products: Record<string, ProductProps> = {
  'neural-impact': {
    title: 'Neural Impact',
    description: 'Activate deep subconscious breakthroughs.',
    price: '$2.99',
    image: 'neural-impact.jpg'
  },
  'mind-mastery': {
    title: 'Mind Mastery',
    description: 'Overclock your focus and flow.',
    price: '$5.99',
    image: 'mind-mastery.jpg'
  },
  'soul-surge': {
    title: 'Soul Surge',
    description: 'Channel divine energy and spiritual clarity.',
    price: '$7.99',
    image: 'soul-surge.jpg'
  }
};

export default function ProductPage({ title, description, price, image }: ProductProps) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <Image src={`/images/${image}`} alt={title} width={600} height={400} className="mx-auto mb-4" />
      <p className="mb-2">{description}</p>
      <p className="text-xl font-semibold mb-4">{price}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(products).map(slug => ({
    params: { slug }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const product = products[slug];

  if (!product) return { notFound: true };

  return {
    props: product,
    revalidate: 60
  };
};
