import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Workers向けにOpenNextがPrisma Clientを差し替えられるよう、バンドルしない
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
