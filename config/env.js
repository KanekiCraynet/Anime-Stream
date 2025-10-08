require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  trustProxy: process.env.TRUST_PROXY === '1' || process.env.VERCEL === '1',
  corsOrigin: process.env.CORS_ORIGIN || 'https://anime-stream-delta.vercel.app',
  apiBaseUrl: process.env.API_BASE_URL || 'https://anime-stream-delta.vercel.app/v1',
  sessionSecret: process.env.SESSION_SECRET || 'kitanime-super-secret-key-2025-production-32-chars',
  siteUrl: process.env.SITE_URL || 'https://anime-stream-delta.vercel.app',
  upstreamApiUrl: process.env.UPSTREAM_API_BASE_URL || 'https://anime-stream-delta.vercel.app/v1',
  assetsUrl: process.env.ASSETS_URL || 'https://anime-stream-delta.vercel.app',
  cdnUrl: process.env.CDN_URL || 'https://anime-stream-delta.vercel.app',
  staticUrl: process.env.STATIC_URL || 'https://anime-stream-delta.vercel.app/public',
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  enableAdsense: process.env.ENABLE_ADSENSE === 'true',
  enableCaching: process.env.ENABLE_CACHING === 'true',
  enableCompression: process.env.ENABLE_COMPRESSION === 'true',
  vercelAnalyticsId: process.env.VERCEL_ANALYTICS_ID || 'prj_anime-stream-delta'
};

module.exports = env;


