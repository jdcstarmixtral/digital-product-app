import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

const productData: Record<string, { title: string; description: string; image: string }> = {
  'neural-impact': {
    title: 'Neural Impact',
    description: 'Unlock the full potential of your neural pathways.',
    image: '/images/neural-impact.png',
  },
  'mind-mastery': {
    title: 'Mind Mastery',
    description: 'Gain elite control over thought, emotion, and manifestation.',
    image: '/images/mind-mastery.png',
  },
  'soul-surge': {
    title: 'Soul Surge',
    description: 'Ignite the divine surge within you for clarity and power.',
    image: '/images/soul-surge.png',
  },
};

export default function ProductPage({ title, description, image }: any) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{title}</h1>
      <p>{description}</p>
      <Image src={image} alt={title} width={600} height={400} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(productData).map(slug => ({ params: { slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const data = productData[slug];

  if (!data) {
    return { notFound: true };
  }

  return {
    props: data,
    revalidate: 60,
  };
};
