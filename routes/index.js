const express = require('express');
const router = express.Router();
const animeApi = require('../services/animeApi');
const cacheService = require('../services/cacheService');
const { getSetting, getAllSettings } = require('../models/database');
// Removed circular dependency - routes no longer needed from app.js
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const request = require('request');

const getSourceVideo = async (url) => {
  try {
    const host = new URL(url).hostname;
    const fetch = await axios.get(url);
    const $ = cheerio.load(fetch.data);
    let data;
    console.log(host)
    $('script').each((i, el) => {
      const content = $(el).html()?.trim();
      if (content && content.includes('VIDEO_CONFIG')) {
        data = content;
      }
    });

    if (!data) return undefined;
    return JSON.parse(data.replace('var VIDEO_CONFIG = ', '')).streams;
  } catch (e) {
    return e;
  }
};

router.get('/', async (req, res) => {
  try {
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=180', // 3 minutes cache
      'ETag': `home-${Date.now()}`
    });

    // Try to get cached data first
    const cacheKey = 'home-data';
    const cachedData = await cacheService.get(cacheKey, 'api');
    
    let homeData;
    if (cachedData) {
      console.log('Cache hit for home data');
      homeData = cachedData;
    } else {
      console.log('Cache miss for home data, fetching from API');
      homeData = await animeApi.getHomeData();
      
      // Cache the result for 5 minutes
      if (homeData) {
        await cacheService.set(cacheKey, homeData, 300, 'api');
      }
    }

    const siteTitle = await getSetting('site_title') || 'KitaNime - Streaming Anime Subtitle Indonesia';
    const siteDescription = await getSetting('site_description') || 'Nonton anime subtitle Indonesia terlengkap dan terbaru';
    
    res.render('index', {
      title: siteTitle,
      description: siteDescription,
      ongoingAnime: homeData?.ongoing_anime || [],
      completeAnime: homeData?.complete_anime || [],
      currentPage: 'home'
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data anime'
      }
    });
  }
});


// Legal and Information Pages
router.get('/privacy-policy', async (req, res) => {
  try {
    const settings = await getAllSettings();
    res.render('legal/privacy-policy', {
      title: 'Kebijakan Privasi - KitaNime',
      description: 'Kebijakan privasi dan perlindungan data pengguna KitaNime',
      content: settings.privacy_policy || 'Kebijakan privasi belum tersedia.',
      currentPage: 'privacy-policy'
    });
  } catch (error) {
    console.error('Privacy policy page error:', error);
    res.render('error', {
      title: 'Error - KitaNime',
      error: { status: 500, message: 'Tidak dapat memuat halaman kebijakan privasi' }
    });
  }
});

router.get('/terms-of-service', async (req, res) => {
  try {
    const settings = await getAllSettings();
    res.render('legal/terms-of-service', {
      title: 'Syarat dan Ketentuan - KitaNime',
      description: 'Syarat dan ketentuan penggunaan layanan KitaNime',
      content: settings.terms_of_service || 'Syarat dan ketentuan belum tersedia.',
      currentPage: 'terms-of-service'
    });
  } catch (error) {
    console.error('Terms of service page error:', error);
    res.render('error', {
      title: 'Error - KitaNime',
      error: { status: 500, message: 'Tidak dapat memuat halaman syarat dan ketentuan' }
    });
  }
});

router.get('/dmca', async (req, res) => {
  try {
    const settings = await getAllSettings();
    res.render('legal/dmca', {
      title: 'Kebijakan DMCA - KitaNime',
      description: 'Kebijakan DMCA dan hak cipta KitaNime',
      content: settings.dmca_policy || 'Kebijakan DMCA belum tersedia.',
      currentPage: 'dmca'
    });
  } catch (error) {
    console.error('DMCA page error:', error);
    res.render('error', {
      title: 'Error - KitaNime',
      error: { status: 500, message: 'Tidak dapat memuat halaman kebijakan DMCA' }
    });
  }
});

router.get('/help', async (req, res) => {
  try {
    const settings = await getAllSettings();
    res.render('legal/help', {
      title: 'Pusat Bantuan - KitaNime',
      description: 'Pusat bantuan dan FAQ KitaNime',
      content: settings.help_center || 'Pusat bantuan belum tersedia.',
      currentPage: 'help'
    });
  } catch (error) {
    console.error('Help page error:', error);
    res.render('error', {
      title: 'Error - KitaNime',
      error: { status: 500, message: 'Tidak dapat memuat halaman pusat bantuan' }
    });
  }
});

router.get('/about', async (req, res) => {
  try {
    const settings = await getAllSettings();
    res.render('legal/about', {
      title: 'Tentang Kami - KitaNime',
      description: 'Tentang KitaNime dan tim pengembang',
      content: settings.about_us || 'Informasi tentang kami belum tersedia.',
      currentPage: 'about'
    });
  } catch (error) {
    console.error('About page error:', error);
    res.render('error', {
      title: 'Error - KitaNime',
      error: { status: 500, message: 'Tidak dapat memuat halaman tentang kami' }
    });
  }
});

router.get('/contact', async (req, res) => {
  try {
    const settings = await getAllSettings();
    res.render('legal/contact', {
      title: 'Kontak - KitaNime',
      description: 'Hubungi tim KitaNime untuk bantuan dan pertanyaan',
      contact_email: settings.contact_email || '',
      contact_phone: settings.contact_phone || '',
      contact_address: settings.contact_address || '',
      social_media: JSON.parse(settings.social_media || '{}'),
      currentPage: 'contact'
    });
  } catch (error) {
    console.error('Contact page error:', error);
    res.render('error', {
      title: 'Error - KitaNime',
      error: { status: 500, message: 'Tidak dapat memuat halaman kontak' }
    });
  }
});

router.get('/stream', async (req, res) => {
  const startTime = Date.now();
  console.log('Streaming request:', req.query.url);
  
  try {
    const googleVideoUrl = req.query.url;
    const range = req.headers.range;
    const token = req.query.token;
    const quality = req.query.quality || 'auto';
    
    if (!googleVideoUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Validate URL format
    try {
      new URL(googleVideoUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
    
    if (!token) {
      const match = await getSourceVideo(googleVideoUrl);
      if (!match || !match[0] || !match[0].play_url) {
        return res.status(404).json({ error: 'Video source not found' });
      }
      
      const referer = new URL(googleVideoUrl).host;
      const videoUrl = match[0].play_url;
      const host = new URL(videoUrl).hostname;
      
      console.log(`Streaming from: ${host}`);
      
      // Enhanced headers for better compatibility
      const headers = {
        'Range': range || '',
        'Accept': 'video/mp4,video/*,*/*;q=0.9',
        'Accept-Encoding': 'identity', // Disable compression for video
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Referer': `https://${referer}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      };

      // Remove empty range header
      if (!range) {
        delete headers.Range;
      }
      
      const response = await axios.get(videoUrl, {
        responseType: 'stream',
        timeout: 45000, // 45 second timeout
        maxRedirects: 5,
        headers,
        validateStatus: (status) => status < 400
      });
    
      // Set response headers
      res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
      res.setHeader('ETag', response.headers['etag'] || `"${Date.now()}"`);
      
      if (range && response.headers['content-range']) {
        res.setHeader('Content-Range', response.headers['content-range']);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', response.headers['content-length']);
        res.status(206);
      } else if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
        res.setHeader('Accept-Ranges', 'bytes');
      }
    
      // Handle stream errors with better error handling
      response.data.on('error', (err) => {
        console.error('Stream error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream error occurred' });
        }
      });

      // Handle client disconnect
      req.on('close', () => {
        console.log('Client disconnected from stream');
        response.data.destroy();
      });

      // Add performance monitoring
      response.data.on('end', () => {
        const duration = Date.now() - startTime;
        console.log(`Stream completed in ${duration}ms`);
      });
      
      // Pipe the stream with error handling
      response.data.pipe(res, { end: true });
      
    } else {
      // Handle token-based streaming (existing logic)
      const match = await getSourceVideo(`https://www.blogger.com/video.g?token=${token}`);
      if (!match || !match[0] || !match[0].play_url) {
        return res.status(404).json({ error: 'Video source not found' });
      }
      
      const referer = 'www.blogger.com';
      const videoUrl = match[0].play_url;
      
      const response = await axios.get(videoUrl, {
        responseType: 'stream',
        timeout: 45000,
        headers: {
          'Range': range || '',
          'Accept': 'video/mp4,video/*,*/*;q=0.9',
          'Accept-Encoding': 'identity',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Pragma': 'no-cache',
          'Referer': `https://${referer}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    
      res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');
      if (range && response.headers['content-range']) {
        res.setHeader('Content-Range', response.headers['content-range']);
        res.setHeader('Accept-Ranges', 'bytes');
        res.status(206);
      }
    
      response.data.pipe(res);
    }
  } catch (error) {
    console.error('Stream error:', error.message);
    if (!res.headersSent) {
      const statusCode = error.response?.status || 500;
      res.status(statusCode).json({
        error: 'Failed to stream video',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
        status: statusCode
      });
    }
  }
});

router.get('/blog/:token', async (req, res) => {
  console.log('streaming..')
  try {
    const {token} = req.params;
    const googleVideoUrl = `https://www.blogger.com/video.g?token=${token}`;
    const range = req.headers.range;
    
    if (!googleVideoUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    
    if(token){
      const match = await getSourceVideo(googleVideoUrl);
      const Referer = new URL(googleVideoUrl).host;
      console.log(Referer)
      const host = new URL(match[0].play_url).hostname;
      const response = await axios.get(match[0].play_url, {
        responseType: 'stream',
        headers: {
          'Range': range,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Pragma': 'no-cache',
          'Referer': `https://${Referer}`
        }
      });
    
      res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');
      if (range) {
        res.setHeader('Content-Range', response.headers['content-range']);
        res.setHeader('Accept-Ranges', 'bytes');
        res.status(206);
      }
    
      response.data.pipe(res);
    }
  } catch (error) {
    console.error('Stream error:', error.message);
    res.status(500).json({
      error: 'Failed to stream video',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

router.get("/gdrive/:vid", async (req, res) => {
  const {vid} = req.params;
  const range = req.headers.range;
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
    const gdriveUrl = `https://docs.google.com/uc?export=download&id=${vid}`;
    const Referer = new URL(gdriveUrl).host;
    const response = await axios.get(gdriveUrl, {
        responseType: 'stream',
        headers: {
          'Range': range,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Pragma': 'no-cache',
          'Referer': `https://${Referer}`
        }
      });

    res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');
    if (range) {
      res.setHeader('Content-Range', response.headers['content-range']);
      res.setHeader('Accept-Ranges', 'bytes');
      res.status(206);
    }

    response.data.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error streaming");
  }
});

router.get('/ongoing', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    
    // Set cache headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes cache
      'ETag': `ongoing-${page}-${Date.now()}`
    });

    // Try to get cached data first
    const cacheKey = `ongoing-page-${page}`;
    const cachedData = await cacheService.get(cacheKey, 'api');
    
    let ongoingData;
    if (cachedData) {
      console.log(`Cache hit for ongoing page ${page}`);
      ongoingData = cachedData;
    } else {
      console.log(`Cache miss for ongoing page ${page}, fetching from API`);
      ongoingData = await animeApi.getOngoingAnime(page);
      
      // Cache the result for 10 minutes
      if (ongoingData) {
        await cacheService.set(cacheKey, ongoingData, 600, 'api');
      }
    }

    res.render('ongoing', {
      title: `Anime Ongoing - Halaman ${page} - KitaNime`,
      description: 'Daftar anime ongoing terbaru dengan subtitle Indonesia',
      animeList: ongoingData?.data || [],
      pagination: ongoingData?.pagination || { current_page: page, last_visible_page: 1 },
      currentPage: 'ongoing'
    });
  } catch (error) {
    console.error('Ongoing page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data anime ongoing'
      }
    });
  }
});

router.get('/complete', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const completeData = await animeApi.getCompleteAnime(page);
    res.render('complete', {
      title: `Anime Complete - Halaman ${page} - KitaNime`,
      description: 'Daftar anime complete dengan subtitle Indonesia',
      animeList: completeData?.data || [],
      pagination: completeData?.pagination || { current_page: page, total_pages: 1 },
      currentPage: 'complete'
    });
  } catch (error) {
    console.error('Complete page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data anime complete'
      }
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const keyword = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    
    let searchResults = null;
    if (keyword.trim()) {
      searchResults = await animeApi.searchAnime(keyword, page);
    }
    const genres = await animeApi.getGenres();
    res.render('search', {
      title: keyword ? `Pencarian: ${keyword} - KitaNime` : 'Pencarian Anime - KitaNime',
      description: keyword ? `Hasil pencarian untuk "${keyword}"` : 'Cari anime favorit Anda',
      keyword,
      searchResults: searchResults?.data || [],
      pagination: searchResults?.pagination || { current_page: page, total_pages: 1 },
      currentPage: 'search',
      genres
    });
  } catch (error) {
    console.error('Search page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat melakukan pencarian'
      }
    });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const genresData = await animeApi.getGenres();
    res.render('genres', {
      title: 'Genre Anime - KitaNime',
      description: 'Jelajahi anime berdasarkan genre favorit Anda',
      genres: genresData || [],
      currentPage: 'genres'
    });
  } catch (error) {
    console.error('Genres page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data genre'
      }
    });
  }
});

router.get('/genres/:slug', async (req, res) => {
  try {
    const genreSlug = req.params.slug;
    const page = parseInt(req.query.page) || 1;
    const genreData = await animeApi.getAnimeByGenre(genreSlug, page);
    res.render('genre-detail', {
      title: `Genre ${genreData?.genre_name || genreSlug} - KitaNime`,
      description: `Anime dengan genre ${genreData?.genre_name || genreSlug}`,
      genreName: genreData?.genre_name || genreSlug,
      genreSlug,
      animeList: genreData?.anime || [],
      pagination: genreData?.pagination || { current_page: page, total_pages: 1 },
      currentPage: 'genres'
    });
  } catch (error) {
    console.error('Genre detail page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data genre'
      }
    });
  }
});

router.get('/movies/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    var movieData = await animeApi.getMovies(page);
    if(!movieData) {
      return res.status(404).render('error', {
        title: 'Tidak ada film anime - KitaNime',
        error: {
          status: 404,
          message: 'Tidak ada film anime\nCoba Kembali!'
        }
      });
    }
    res.render('movie-list', {
      title: `Daftar Film Anime - KitaNime`,
      description: `Daftar film anime terbaru`,
      animeList: movieData?.data?.movies || [],
      pagination : movieData?.data?.pagination || { current_page: 1, total_pages: 2 },
      currentPage: 'movies'
    });
  } catch (error) {
    console.error('Movies page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data film anime'
      }
    });
  }
});

router.get('/movies/:year/:month/:slug', async (req, res) => {
  try {
    const { year, month, slug } = req.params;

    const movieData = await animeApi.getMovieDetails(year, month, slug);
    var movie = movieData?.data?.stream_url;
    movie = movie.split('/')[3];
    //https://www.mp4upload.com/embed-iwzh09efokfj.html
    movie = `https://www.mp4upload.com/embed-${movie}.html`;
    
    if (movieData?.data) {
      movieData.data.stream_url = movie;
    }
    res.render('movie-player', {
      title: `${movieData?.data.title || slug} - KitaNime`,
      description: `Film anime ${movieData?.data.title || slug}`,
      anime: movieData?.data || {},
      stream: movieData?.data?.stream_url || '',
      currentPage: 'movies'
    });
  } catch (error) {
    console.error('Movie detail page error:', error);
    res.render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat data film anime'
      }
    });
  }
});

// Robots.txt route
router.get('/robots.txt', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  const robotsTxt = `# Robots.txt for KitaNime - Streaming Anime Subtitle Indonesia
# Website: ${baseUrl}
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

# Allow all major search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /temp/
Disallow: /cache/
Disallow: /*.json$
Disallow: /*.log$

# Allow important directories
Allow: /images/
Allow: /css/
Allow: /js/
Allow: /fonts/

# Crawl delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Additional sitemaps (if needed in the future)
# Sitemap: ${baseUrl}/sitemap-anime.xml
# Sitemap: ${baseUrl}/sitemap-episodes.xml
# Sitemap: ${baseUrl}/sitemap-movies.xml`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Enhanced Sitemap.xml route
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Get data for sitemap
    const homeData = await animeApi.getHomeData();
    const ongoingAnime = homeData?.ongoing_anime || [];
    const completeAnime = homeData?.complete_anime || [];
    const genres = await animeApi.getGenres() || [];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/ongoing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/complete</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/movies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/genres</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

    // Add genre pages
    if (genres && genres.length > 0) {
      genres.forEach(genre => {
        if (genre.slug) {
          sitemap += `
  <url>
    <loc>${baseUrl}/genres/${genre.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      });
    }

    // Add anime URLs with enhanced metadata
    [...ongoingAnime, ...completeAnime].forEach(anime => {
      if (anime.slug) {
        sitemap += `
  <url>
    <loc>${baseUrl}/anime/${anime.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;
        
        // Add image information if available
        if (anime.poster) {
          sitemap += `
    <image:image>
      <image:loc>${anime.poster}</image:loc>
      <image:title>${anime.title || anime.slug}</image:title>
      <image:caption>Poster anime ${anime.title || anime.slug}</image:caption>
    </image:image>`;
        }
        
        sitemap += `
  </url>`;
      }
    });

    // Add pagination URLs for ongoing anime
    for (let page = 1; page <= 10; page++) {
      sitemap += `
  <url>
    <loc>${baseUrl}/ongoing?page=${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Add pagination URLs for complete anime
    for (let page = 1; page <= 10; page++) {
      sitemap += `
  <url>
    <loc>${baseUrl}/complete?page=${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }

    // Add pagination URLs for movies
    for (let page = 1; page <= 5; page++) {
      sitemap += `
  <url>
    <loc>${baseUrl}/movies?page=${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    sitemap += `
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

router.post('/cookie-consent', (req, res) => {
  res.cookie('cookie_consent', 'accepted', {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });
  res.json({ success: true });
});

module.exports = router;
