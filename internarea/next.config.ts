import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */

  reactCompiler: true,

  reactStrictMode: true,

  turbopack: {
    root: path.resolve(__dirname),
  },

  async rewrites() {
    return [
      {
        source: "/detailJob/:id*",
        destination: "/detailjob/:id*",
      },
    ];
  },
};

export default nextConfig;