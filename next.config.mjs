/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // KV-Radar serves a small static catalogue; trailing slashes off for clean canonical URLs.
  trailingSlash: false,
  experimental: {
    // Keep client JS lean for the performance budget (LCP < 2.0s).
    optimizePackageImports: ["fuse.js"],
  },
};

export default nextConfig;
