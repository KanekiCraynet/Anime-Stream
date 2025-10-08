require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  trustProxy: process.env.TRUST_PROXY === '1' || process.env.VERCEL === '1',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiBaseUrl: process.env.API_BASE_URL || null,
  sessionSecret: process.env.SESSION_SECRET || 'kitanime-secret-key-change-in-production'
};

module.exports = env;


