/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'standalone',
  images: {
    domains: ['localhost', 'digital-product-app.vercel.app'],
  },
};

module.exports = nextConfig;
