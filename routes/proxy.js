const express = require('express');
const axios = require('axios');
const { getActiveApiEndpoint } = require('../models/database');

const router = express.Router();

async function resolveUpstreamBaseUrl() {
  // Prefer explicit upstream to avoid recursion if API_BASE_URL points to /v1
  const explicit = process.env.UPSTREAM_API_BASE_URL;
  if (explicit && explicit.startsWith('http')) return explicit.replace(/\/$/, '');
  const dbUrl = await getActiveApiEndpoint();
  if (dbUrl && dbUrl.startsWith('http')) return dbUrl.replace(/\/$/, '');
  return 'https://anime-stream-delta.vercel.app/v1';
}

// Handle root /v1 endpoint
router.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'KitaNime API v1',
    version: '1.0.0',
    endpoints: {
      home: '/v1/home',
      search: '/v1/search',
      anime: '/v1/anime/{slug}',
      ongoing: '/v1/ongoing-anime',
      complete: '/v1/complete-anime',
      genres: '/v1/genres',
      movies: '/v1/movies'
    },
    documentation: 'https://anime-stream-delta.vercel.app/api-docs'
  });
});

// Proxy GET requests under /v1/* to the upstream API
router.get(/.* /, async (req, res) => {
  try {
    const upstreamBase = await resolveUpstreamBaseUrl();
    const targetUrl = `${upstreamBase}${req.url}`; // req.url already starts with /...

    const response = await axios.get(targetUrl, {
      params: req.query,
      timeout: 10000,
      headers: {
        'User-Agent': 'KitaNime/1.0',
        'Accept': req.get('Accept') || 'application/json'
      }
    });

    const contentType = response.headers['content-type'] || 'application/json';
    res.status(response.status).set('content-type', contentType).send(response.data);
  } catch (error) {
    const status = error.response?.status || 502;
    const message = error.response?.data || { error: 'Upstream request failed' };
    res.status(status).json({ ok: false, upstream: true, status, message });
  }
});

module.exports = router;


