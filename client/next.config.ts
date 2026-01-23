import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix workspace root issue - explicitly set root to client directory
  // This prevents Next.js from detecting the parent directory as workspace root
};

export default nextConfig;
