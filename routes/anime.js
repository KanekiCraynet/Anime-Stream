const express = require('express');
const router = express.Router();
const axios = require('axios');
const {load} = require('cheerio');
const animeApi = require('../services/animeApi');
const { getAnimeAverageRating, getAnimeRating, getComments, getWatchProgress, updateWatchHistory } = require('../models/database');

router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const animeData = await animeApi.getAnimeDetails(slug);

    if (!animeData) {
      return res.status(404).render('error', {
        title: 'Anime Tidak Ditemukan - KitaNime',
        error: {
          status: 404,
          message: 'Anime yang Anda cari tidak ditemukan'
        }
      });
    }

    const sanitizedAnime = animeApi.validateAnimeData(animeData, slug);
    const clean = sanitizedAnime.episodes.map(ep => {
      const match = ep.episode.match(/Episode\s+(\d+)/i);
      const num = match ? match[1] : null;

      return {
        ...ep,
        episode: num
      };
    });
    sanitizedAnime.episodes = clean;

    // Get additional data for enhanced features
    const [averageRating, userRating, comments, watchProgress] = await Promise.all([
      getAnimeAverageRating(slug),
      req.session.userId ? getAnimeRating(req.session.userId, slug) : null,
      getComments(slug, null, 10, 0), // Get first 10 comments
      req.session.userId ? getWatchProgress(req.session.userId, slug) : null
    ]);

    res.render('anime-detail', {
      title: `${sanitizedAnime.title} - KitaNime`,
      description: sanitizedAnime.synopsis ?
        sanitizedAnime.synopsis.substring(0, 160) + '...' :
        `Nonton ${sanitizedAnime.title} subtitle Indonesia`,
      anime: sanitizedAnime,
      averageRating,
      userRating,
      comments,
      watchProgress,
      currentPage: 'anime'
    });
  } catch (error) {
    console.error('Anime detail page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat detail anime'
      }
    });
  }
});

router.get('/:slug/episodes', async (req, res) => {
  try {
    const slug = req.params.slug;
    // Only get anime details since episodes are already included
    const animeData = await animeApi.getAnimeDetails(slug);

    if (!animeData) {
      return res.status(404).render('error', {
        title: 'Anime Tidak Ditemukan - KitaNime',
        error: {
          status: 404,
          message: 'Anime yang Anda cari tidak ditemukan'
        }
      });
    }

    const sanitizedAnime = animeApi.validateAnimeData(animeData, slug);
    const clean = sanitizedAnime.episodes.map(ep => {
      const match = ep.episode.match(/Episode\s+(\d+)/i);
      const num = match ? match[1] : null;

      return {
        ...ep,
        episode: num
      };
    });
    res.render('anime-episodes', {
      title: `Episode ${sanitizedAnime.title} - KitaNime`,
      description: `Daftar episode ${sanitizedAnime.title} subtitle Indonesia`,
      anime: sanitizedAnime,
      episodes: clean || [],
      currentPage: 'anime'
    });
  } catch (error) {
    console.error('Anime episodes page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat daftar episode'
      }
    });
  }
});

router.get('/:slug/episode/:episode', async (req, res) => {
  try {
    const slug = req.params.slug;
    const episodeNumber = req.params.episode;

    const [animeData, episodeData] = await Promise.all([
      animeApi.getAnimeDetails(slug),
      animeApi.getEpisodeDetails(slug, episodeNumber)
    ]);

    if (!animeData || !episodeData) {
      return res.status(404).render('error', {
        title: 'Episode Tidak Ditemukan - KitaNime',
        error: {
          status: 404,
          message: 'Episode yang Anda cari tidak ditemukan'
        }
      });
    }

    const sanitizedAnime = animeApi.validateAnimeData(animeData, slug);

    const allEpisodes = episodeData.all_episodes || [];
    const currentEpisodeIndex = allEpisodes.findIndex(ep =>
      ep.episode_number == episodeNumber
    );
    
    // Use episodeData directly instead of making another API call
    console.log(episodeData.next_episode);
    const modifiedStreamList = {};
    var qlist = [];
    for (const quality in episodeData.steramList) {
      qlist.push(parseInt(quality.replace('p', '')));
      modifiedStreamList[parseInt(quality.replace('p', ''))] = `${episodeData.steramList[quality]}`;
    }
    if(Object.keys(episodeData.steramList).length == 0 || episodeData.steramList['720'] == null){
      qlist.push('480');
      modifiedStreamList['480'] = episodeData.stream_url;
    }
    if(!modifiedStreamList['480']){
      modifiedStreamList['480'] = episodeData.stream_url;
    }
    console.log(modifiedStreamList)

    // Get episode-specific comments and watch progress
    const [episodeComments, watchProgress] = await Promise.all([
      getComments(slug, parseInt(episodeNumber), 10, 0),
      req.session.userId ? getWatchProgress(req.session.userId, slug) : null
    ]);
    
    var episodeDatas = {
        title: `${sanitizedAnime.title} Episode ${episodeNumber} - KitaNime`,
        description: `Nonton ${sanitizedAnime.title} Episode ${episodeNumber} subtitle Indonesia`,
        anime: sanitizedAnime,
        episode: {
          number: episodeNumber,
          title: episodeData.episode_title || `Episode ${episodeNumber}`,
          video_sources: episodeData.stream_url || [],
          qlist,
          quality: modifiedStreamList || [],
          subtitles: episodeData.stream_url || [],
          download_links: episodeData.download_urls || []
        },
        navigation: {
          isNext: episodeData.has_next_episode,
          isPrev: episodeData.has_previous_episode,
          prev: episodeData.previous_episode,
          next: episodeData.next_episode,
          all_episodes: sanitizedAnime.episodes
        },
        comments: episodeComments,
        watchProgress,
        currentPage: 'anime'
    }
    res.render('episode-player', episodeDatas);
  } catch (error) {
    console.error('Episode player page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat episode'
      }
    });
  }
});

router.get('/:slug/batch', async (req, res) => {
  try {
    const slug = req.params.slug;
    const animeData = await animeApi.getAnimeDetails(slug);

    if (!animeData) {
      return res.status(404).render('error', {
        title: 'Anime Tidak Ditemukan - KitaNime',
        error: {
          status: 404,
          message: 'Anime yang Anda cari tidak ditemukan'
        }
      });
    }

    const sanitizedAnime = animeApi.validateAnimeData(animeData, slug);

    res.render('anime-batch', {
      title: `Download Batch ${sanitizedAnime.title} - KitaNime`,
      description: `Download batch ${sanitizedAnime.title} subtitle Indonesia`,
      anime: sanitizedAnime,
      batchLinks: animeData.batch_links || [],
      currentPage: 'anime'
    });
  } catch (error) {
    console.error('Batch download page error:', error);
    res.status(500).render('error', {
      title: 'Terjadi Kesalahan - KitaNime',
      error: {
        status: 500,
        message: 'Tidak dapat memuat halaman batch download'
      }
    });
  }
});

// Track watch progress
router.post('/:slug/episode/:episode/progress', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Login required' });
    }

    const { slug, episode } = req.params;
    const { watchTime, totalDuration, completed } = req.body;

    if (!watchTime || !totalDuration) {
      return res.status(400).json({ error: 'Watch time and total duration are required' });
    }

    await updateWatchHistory(
      req.session.userId,
      slug,
      parseInt(episode),
      parseFloat(watchTime),
      parseFloat(totalDuration),
      completed ? 1 : 0
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update watch progress error:', error);
    res.status(500).json({ error: 'Failed to update watch progress' });
  }
});

module.exports = router;
