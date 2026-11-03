import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A clean résumé URL; the PDF itself lives once, in public/.
  async redirects() {
    return [{ source: "/resume", destination: "/resume.pdf", permanent: true }];
  },
};

export default nextConfig;
