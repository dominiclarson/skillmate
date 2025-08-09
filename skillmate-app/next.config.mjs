/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
