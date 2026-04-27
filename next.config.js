
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we can use images from any source if needed
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
