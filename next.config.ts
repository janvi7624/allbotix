/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // Required for Node deployment
  reactStrictMode: true,

  // Optional but recommended
  images: {
    unoptimized: true,   // Avoid image optimization issues on Hostinger
  },
};

module.exports = nextConfig;