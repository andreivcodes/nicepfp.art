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
    // Only the IPFS gateway used by the showcase (token images). Anything
    // broader turns /_next/image into an open image proxy.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
