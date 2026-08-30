import type { NextConfig } from "next";

const devBuildDirectory = process.env.NEXT_DEV_DIR || ".next";

const nextConfig: NextConfig = {
  distDir: devBuildDirectory,
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
