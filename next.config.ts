import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Databricks-Training-Manuel",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
