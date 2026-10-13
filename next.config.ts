import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
  },
  experimental: {
    globalNotFound: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
