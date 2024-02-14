/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["ipfs-utils", "eth-crypto"]
  },
  images: {
    remotePatterns: [{ hostname: "nicepfp.infura-ipfs.io" }, { hostname: "cloudflare-ipfs.com" }],
  },
};

export default nextConfig;
