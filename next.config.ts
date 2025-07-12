import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'recharts': require.resolve('recharts'),
    };
    return config;
  },
};

export default nextConfig;
