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
