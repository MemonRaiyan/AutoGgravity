import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@autogravity/ui", "@autogravity/config", "@autogravity/shared"],
};

export default nextConfig;
