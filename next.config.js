/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ["scontent.fbom12-1.fna.fbcdn.net", "lh3.googleusercontent.com"],
  },
};

module.exports = nextConfig;
