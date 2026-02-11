const createNextIntlPlugin = require('next-intl/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@formatjs/intl-messageformat', '@formatjs/icu-messageformat-parser'],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      { protocol: 'http', hostname: '87.229.34.70', pathname: '/**' },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
module.exports = withNextIntl(nextConfig)
