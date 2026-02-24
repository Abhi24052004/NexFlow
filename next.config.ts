import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators:false,
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
