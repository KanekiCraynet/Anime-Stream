const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { getActiveApiEndpoint } = require('../models/database');
const cacheService = require('./cacheService');

class AnimeApiService {
  constructor() {
    this.fallbackEndpointsPath = path.join(__dirname, '..', 'endpoint.json');
    this.apiResponsesPath = path.join(__dirname, '..', 'apiResponse');
    this.cache = new Map();
    this.cacheTimeout = 3 * 60 * 1000; // 3 minutes cache (reduced)
    this.maxCacheSize = 50; // Maximum number of cached items (reduced)
    this.retryAttempts = 1; // Reduced from 2
    this.retryDelay = 300; // 0.3 second (reduced from 0.5 second)
    this.requestTimeout = 5000; // 5 seconds (reduced from 8)
    this.circuitBreakerThreshold = 3; // failures before circuit opens (reduced from 5)
    this.circuitBreakerTimeout = 30000; // 30 seconds (reduced from 1 minute)
    this.circuitBreakerState = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = 0;
    
    // Setup periodic cache cleanup to prevent memory leaks
    this.setupCacheCleanup();
  }

  setupCacheCleanup() {
    // Clean cache every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);
  }

  cleanupCache() {
    const now = Date.now();
    const keysToDelete = [];
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTimeout) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
    
    // If cache is still too large, remove oldest entries
    if (this.cache.size > this.maxCacheSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, this.cache.size - this.maxCacheSize);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
    
    if (keysToDelete.length > 0) {
      console.log(`Cleaned up ${keysToDelete.length} expired cache entries`);
    }
  }
  async getApiBaseUrl() {
    try {
      // Priority: ENV -> DB -> endpoint.json -> sane default
      const envUrl = process.env.API_BASE_URL;
      if (envUrl && typeof envUrl === 'string' && envUrl.startsWith('http')) {
        return envUrl.replace(/\/$/, '');
      }

      const dbUrl = await getActiveApiEndpoint();
      if (dbUrl && typeof dbUrl === 'string') {
        return dbUrl.replace(/\/$/, '');
      }
      try {
        const endpointData = await fs.readFile(this.fallbackEndpointsPath, 'utf8');
        const endpoints = JSON.parse(endpointData);
        const fileUrl = endpoints.base_url;
        if (fileUrl && typeof fileUrl === 'string' && fileUrl.startsWith('http')) {
          return fileUrl.replace(/\/$/, '');
        }
        return 'http://localhost:3000/v1';
      } catch (error) {
        console.warn('Could not read endpoint.json, using default URL');
        return 'http://localhost:3000/v1';
      }
    } catch (error) {
      console.error('Error getting API base URL:', error);
      return 'http://localhost:3000/v1';
    }
  }

  // Cache management methods
  getCacheKey(endpoint, params = {}) {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  setCache(key, data) {
    // Implement LRU cache eviction
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Circuit Breaker Pattern
  isCircuitOpen() {
    if (this.circuitBreakerState === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.circuitBreakerTimeout) {
        this.circuitBreakerState = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  recordSuccess() {
    this.failureCount = 0;
    this.circuitBreakerState = 'CLOSED';
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.circuitBreakerThreshold) {
      this.circuitBreakerState = 'OPEN';
    }
  }

  // Retry mechanism with exponential backoff
  async retryRequest(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying request in ${delay}ms (attempt ${attempt + 1}/${this.retryAttempts})`);
        await this.sleep(delay);
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  shouldRetry(error) {
    // Retry on network errors, timeouts, and 5xx status codes
    return (
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      (error.response && error.response.status >= 500) ||
      error.message.includes('timeout')
    );
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeRequest(endpoint, params = {}) {
    try {
      // Check cache first using cache service
      const cacheKey = cacheService.generateApiKey(endpoint, params);
      const cachedData = await cacheService.get(cacheKey, 'api');
      if (cachedData) {
        console.log(`Cache hit for: ${endpoint}`);
        return cachedData;
      }

      // Check circuit breaker
      if (this.isCircuitOpen()) {
        console.log(`Circuit breaker is OPEN for ${endpoint}, using fallback data`);
        return await this.loadMockData(endpoint, params);
      }

      // For ongoing anime, try mock data first if API is slow
      if (endpoint.includes('ongoing') && this.failureCount > 0) {
        console.log(`Using mock data for ${endpoint} due to previous failures`);
        return await this.loadMockData(endpoint, params);
      }

      const baseUrl = await this.getApiBaseUrl();
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      let url = `${baseUrl}${normalizedEndpoint}`;
      if(endpoint == '/ongoing-anime'){
        url = `${baseUrl}/ongoing-anime/${params.page}`;
      }
      
      console.log(`Making API request to: ${url}`);
      
      // Use retry mechanism with circuit breaker
      const result = await this.retryRequest(async () => {
        const response = await axios.get(url, {
          params,
          timeout: this.requestTimeout,
          headers: {
            'User-Agent': 'KitaNime/1.0',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive'
          },
          validateStatus: (status) => status < 500, // Don't throw on 4xx errors
          maxRedirects: 3, // Limit redirects
          maxContentLength: 10 * 1024 * 1024 // 10MB max response size
        });

        if (response.status >= 400) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let data;
        if (response.data && response.data.status === 'Ok') {
          if(endpoint === '/ongoing-anime' || endpoint.includes('/complete-anime') || endpoint.includes('/search') || endpoint.includes('/movies') || response.data.anime && response.data.pagination) {
            data = response.data;
          } else {
            data = response.data.data;
          }
        } else {
          throw new Error('Invalid API response format');
        }

        return data;
      });

      // Record success and cache result
      this.recordSuccess();
      // Cache for shorter time for ongoing anime (5 minutes)
      const cacheTTL = endpoint.includes('ongoing') ? 300 : 600;
      await cacheService.set(cacheKey, result, cacheTTL, 'api');
      return result;

    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error.message);
      this.recordFailure();
      
      // Always fallback to mock data on failure
      return await this.loadMockData(endpoint, params);
    }
  }

  async loadMockData(endpoint, params = {}) {
    try {
      let filename;
      
      switch (endpoint) {
        case '/home':
          filename = 'v1_home.json';
          break;
        case '/ongoing-anime':
          filename = `v1_ongoing-anime_page.json`;
          break;
        case '/complete-anime':
          filename = `v1_complete-anime_page.json`;
          break;
        case '/genres':
          filename = 'v1_genres.json';
          break;
        case '/search':
          filename = 'v1_search_keyword.json';
          break;
        default:
          if (endpoint.includes('/anime/') && endpoint.includes('/episodes')) {
            filename = 'v1_anime_slug_episodes.json';
          } else if (endpoint.includes('/anime/')) {
            filename = 'v1_anime_slug.json';
          } else if (endpoint.includes('/episode/')) {
            filename = 'v1_episode_slug.json';
          } else {
            throw new Error(`No mock data available for endpoint: ${endpoint}`);
          }
      }

      const mockDataPath = path.join(this.apiResponsesPath, filename);
      const mockData = await fs.readFile(mockDataPath, 'utf8');
      const parsedData = JSON.parse(mockData);
      
      console.log(`Using mock data from: ${filename}`);
      return parsedData.data || parsedData;
    } catch (error) {
      console.error(`Failed to load mock data for ${endpoint}:`, error.message);
      return null;
    }
  }

  async getHomeData() {
    return await this.makeRequest('/home');
  }

  async getOngoingAnime(page = 1) {
    try {
      // Try to get from cache first
      const cacheKey = cacheService.generateApiKey('/ongoing-anime', { page });
      const cachedData = await cacheService.get(cacheKey, 'api');
      if (cachedData) {
        console.log(`Cache hit for ongoing anime page ${page}`);
        return cachedData;
      }

      // If no cache, try API with shorter timeout for ongoing anime
      const originalTimeout = this.requestTimeout;
      this.requestTimeout = 5000; // 5 seconds for ongoing anime
      
      const result = await this.makeRequest('/ongoing-anime', { page });
      
      // Restore original timeout
      this.requestTimeout = originalTimeout;
      
      return result;
    } catch (error) {
      console.log(`API failed for ongoing anime, using mock data: ${error.message}`);
      return await this.loadMockData('/ongoing-anime', { page });
    }
  }

  async getCompleteAnime(page = 1) {
    return await this.makeRequest(`/complete-anime/${page}`);
  }

  async getMovies(page = 1) {
    return await this.makeRequest(`/movies/${page}`);
  }

  async getMovieDetails(year, month, slug) {
    return await this.makeRequest(`/movies/${year}/${month}/${slug}`);
  }

  async getAnimeDetails(slug) {
    return await this.makeRequest(`/anime/${slug}`);
  }

  async getAnimeEpisodes(slug) {
    return await this.makeRequest(`/anime/${slug}/episodes`);
  }

  async getEpisodeDetails(slug, episode) {
    return await this.makeRequest(`/anime/${slug}/episodes/${episode}`);
  }

  async searchAnime(keyword, page = 1) {
    return await this.makeRequest(`/search/${keyword}`, { keyword, page });
  }

  async getGenres() {
    return await this.makeRequest('/genres');
  }

  async getAnimeByGenre(genreSlug, page = 1) {
    return await this.makeRequest(`/genres/${genreSlug}/${page}`, { page });
  }

  validateAnimeData(data, slug = null) {
    if (!data) return null;
    const sanitized = {
      title: this.sanitizeString(data.title),
      slug: slug !== null ? slug : this.sanitizeSlug(data.slug),
      poster: this.sanitizeUrl(data.poster),
      synopsis: this.sanitizeString(data.synopsis),
      genres: Array.isArray(data.genres) ? data.genres : [],
      status: this.sanitizeString(data.status),
      rating: data.rating ? parseFloat(data.rating) : null,
      release_year: data.release_year ? parseInt(data.release_year) : null,
      episodes: Array.isArray(data.episode_lists) ? data.episode_lists : []
    };

    return sanitized;
  }

  sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    try {
      new URL(url);
      return url;
    } catch {
      return '';
    }
  }

  sanitizeSlug(slug) {
    if (typeof slug !== 'string') return '';
    return slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-');
  }

  generateAnimeUrl(slug, episode = null) {
    const baseUrl = '/anime/' + this.sanitizeSlug(slug);
    return episode ? `${baseUrl}/episode/${episode}` : baseUrl;
  }

  async checkConnectivity() {
    try {
      const base = await this.getApiBaseUrl();
      // Try conventional /health first
      try {
        const res = await axios.get(`${base}/health`, { timeout: 5000 });
        return {
          ok: res.status >= 200 && res.status < 300,
          status: res.status,
          baseUrl: base,
          testedEndpoint: '/health'
        };
      } catch (firstErr) {
        // Fallback: use a lightweight, known read endpoint like /home
        try {
          const res2 = await axios.get(`${base}/home`, { timeout: 7000, headers: { 'Accept': 'application/json' } });
          const ok = res2.status >= 200 && res2.status < 300;
          // Some APIs wrap with { status: 'Ok' } or provide arrays; accept both
          const body = res2.data;
          const schemaOk = !!body && (body.status === 'Ok' || body.data || body.home || Array.isArray(body) || typeof body === 'object');
          return {
            ok: ok && schemaOk,
            status: res2.status,
            baseUrl: base,
            testedEndpoint: '/home'
          };
        } catch (secondErr) {
          return {
            ok: false,
            error: secondErr.message,
            baseUrl: base,
            testedEndpoint: '/health then /home'
          };
        }
      }
    } catch (e) {
      return {
        ok: false,
        error: e.message,
        baseUrl: await this.getApiBaseUrl(),
        testedEndpoint: 'unresolved'
      };
    }
  }
}

module.exports = new AnimeApiService();
