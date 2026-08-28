import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Databricks-Training-Manual",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
