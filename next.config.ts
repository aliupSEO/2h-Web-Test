import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow remote images from any WordPress host */
  images: {
    qualities: [25, 50, 75, 95, 100],
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
  async rewrites() {
    return [
      {
        source: "/service/google-ads-agentur-wien",
        destination: "/google-ads",
      },
      {
        source: "/service/google-ads-agentur-wien/",
        destination: "/google-ads",
      },
    ];
  },
};

export default nextConfig;
