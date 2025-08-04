import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

export default function ProductPage({ content }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{content?.title || 'No title'}</h1>
      <p>{content?.description || 'No description found'}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // Let pages build dynamically
    fallback: 'blocking', // Build on demand
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const products = {
    'quantum-sigil': {
      title: 'Quantum Sigil',
      description: 'Unlock your energy blueprint with this dynamic sigil.',
    },
    'neural-impact': {
      title: 'Neural Impact',
      description: 'Supercharge your subconscious wiring with frequency-based alignment.',
    },
  };

  const content = products[slug] || null;

  if (!content) {
    return { notFound: true };
  }

  return {
    props: { content },
    revalidate: 60, // Optional: ISR support
  };
};
