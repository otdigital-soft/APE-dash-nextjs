// eslint-disable-next-line @typescript-eslint/no-var-requires
// const UnoCSS = require('@unocss/webpack').default
// eslint-disable-next-line @typescript-eslint/no-var-requires

const isProd = process.env.NODE_ENV === 'production'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-central-1.wasabisys.com'
      },
      {
        protocol: 'https',
        hostname: 's3.wasabisys.com'
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com'
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com'
      }
    ]
  },
  env: {
    SITE_NAME: 'Dashboard',
    APP_URL: process.env.APP_URL,
    BASE_URL: process.env.BASE_URL,
    API_URL: process.env.API_URL || 'http://localhost:1337',
    CRM_API_URL: process.env.CRM_API_URL || 'http://localhost/crm/api',
    TINYMCE_API_KEY: process.env.TINYMCE_API_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID,
    STRIPE_REDIRECT_URI: process.env.STRIPE_REDIRECT_URI,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    RINGCENTRAL_CLIENT_ID: process.env.RINGCENTRAL_CLIENT_ID
  },
  redirects: async () => {
    return [
      {
        source: '/settings/connections',
        destination: '/settings/connections/stripe',
        permanent: false
      }
    ]
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig
