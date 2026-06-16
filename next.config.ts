import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow remote images from any WordPress host */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
