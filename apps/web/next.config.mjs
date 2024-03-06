/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["ipfs-utils", "eth-crypto"]
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
  webpack: (config, options) => {
    if (!options.dev) {
      config.devtool = "source-map";
    }
    return config;
  },
};

export default nextConfig;
