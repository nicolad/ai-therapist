import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Exclude generated schema files from hot reloading
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/schema/**/*.generated.*", "**/node_modules/**"],
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude from pages
  pageExtensions: ["tsx", "ts", "jsx", "js"]
    .map((ext) => `page.${ext}`)
    .concat(["tsx", "ts", "jsx", "js"]),
};

export default nextConfig;
