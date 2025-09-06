/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      'via.placeholder.com'
    ],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'authenticated',
            value: 'false',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;