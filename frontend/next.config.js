const createNextIntlPlugin = require('next-intl/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' несовместим с middleware (редиректы / → /ru и т.д.)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false
    return config
  },
}

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
module.exports = withNextIntl(nextConfig)
