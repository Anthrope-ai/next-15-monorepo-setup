/** @type {import('next').NextConfig} */

const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:3001";

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@monorepo/ui"],
  basePath: "/",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/api/:path*`
      }
    ];
  }
};
