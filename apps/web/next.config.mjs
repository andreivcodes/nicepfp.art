/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["ipfs-utils", "eth-crypto", "pg", "electron-fetch", "ipfs-http-client", "ipfs-core-utils", "electron"],
  transpilePackages: ["cheerio", "undici"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        electron: false,
      };
    }
    // Ignore electron module to avoid build errors
    config.externals = [...(config.externals || []), "electron"];
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "*",
        protocol: "http",
      },
      {
        hostname: "*",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
