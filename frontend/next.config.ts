import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove Python backend rewrite — we use native Next.js API routes for Vercel
  // Self-hosted mode can re-enable this to proxy to FastAPI
  // async rewrites() {
  //   const backendUrl = process.env.NIBAME_API_URL ?? "http://127.0.0.1:8000";
  //   return [{ source: "/api/backend/:path*", destination: `${backendUrl}/api/:path*` }];
  // },
};

export default nextConfig;
