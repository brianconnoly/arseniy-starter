/**
 * Next.js клиент — specs/workspace.c4 (webApp.nextWebClient).
 * API-контракт: specs/backend/api.tsp. Прокси /api/v1 → BACKEND_URL (см. docker-compose build-args).
 * @type {import('next').NextConfig}
 */
const backendUrl =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:4001";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
