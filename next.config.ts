import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "images.admakeai.com" },
    ],
  },
};

export default nextConfig;