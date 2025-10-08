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
  return 'http://localhost:3000/v1';
}

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


