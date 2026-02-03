import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Exclude graphql-schema directory from compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/graphql-schema/**", "**/node_modules/**"],
    };
    return config;
  },
  // Exclude graphql-schema from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude from pages
  pageExtensions: ["tsx", "ts", "jsx", "js"]
    .map((ext) => `page.${ext}`)
    .concat(["tsx", "ts", "jsx", "js"]),
};

export default nextConfig;
