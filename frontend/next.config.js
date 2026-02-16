const createNextIntlPlugin = require('next-intl/plugin')

const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@formatjs/intl-messageformat', '@formatjs/icu-messageformat-parser'],
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/media/:path*', destination: `${backendUrl}/media/:path*` },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'http', hostname: '87.229.34.70', pathname: '/**' },
      { protocol: 'https', hostname: 'submit-incredible-shaved-rental.trycloudflare.com', pathname: '/**' },
      { protocol: 'http', hostname: 'submit-incredible-shaved-rental.trycloudflare.com', pathname: '/**' },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
module.exports = withNextIntl(nextConfig)
