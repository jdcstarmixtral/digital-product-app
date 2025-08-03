import fs from 'fs'
import path from 'path'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'

interface Product {
  slug: string
  title: string
  description: string
  image: string
  price: number
}

export default function ProductPage({ product }: { product: Product }) {
  if (!product) return <div>Product not found.</div>

  return (
    <div>
      <Head>
        <title>{product.title}</title>
      </Head>
      <main className="p-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <img src={`/images/${product.image}`} alt={product.title} className="my-4 w-full max-w-md" />
        <p className="mb-4">{product.description}</p>
        <button className="bg-black text-white px-4 py-2 rounded">Buy for ${product.price}</button>
      </main>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const filePath = path.join(process.cwd(), 'lib', 'products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)

  const paths = products.map(product => ({
    params: { slug: product.slug }
  }))

  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const filePath = path.join(process.cwd(), 'lib', 'products.json')
  const data = fs.readFileSync(filePath, 'utf8')
  const products: Product[] = JSON.parse(data)
  const product = products.find(p => p.slug === slug)

  if (!product) return { notFound: true }

  return { props: { product }, revalidate: 60 }
}
