# 📊 Vercel Analytics Setup - KitaNime

Dokumentasi lengkap untuk setup dan penggunaan Vercel Analytics di KitaNime Anime Streaming Platform.

## 🚀 Quick Setup

### 1. Environment Variables

Tambahkan ke file `.env`:

```env
# Vercel Analytics
VERCEL=1
VERCEL_ANALYTICS_ID=your-analytics-id
```

### 2. Production Deployment

Analytics akan otomatis aktif saat:
- `NODE_ENV=production`
- `VERCEL=1` (saat deploy di Vercel)

## 📈 Features

### Automatic Tracking
- ✅ Page views
- ✅ User interactions
- ✅ Anime clicks
- ✅ Search queries
- ✅ Video interactions (play, pause, complete)
- ✅ Bookmark actions

### Custom Events
- ✅ Anime view tracking
- ✅ Search tracking
- ✅ Streaming events
- ✅ User actions

## 🔧 Implementation

### Server-Side Middleware

```javascript
const { analyticsMiddleware } = require('./middleware/analytics');

// Add to app.js
app.use(analyticsMiddleware);
```

### Client-Side Tracking

Analytics script otomatis di-inject ke layout.pug:

```pug
// Vercel Analytics
if analytics && analytics.enabled
  != analytics.script
```

### Custom Event Tracking

```javascript
// Track anime view
fetch('/analytics/track/anime-view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    animeTitle: 'One Piece',
    animeSlug: 'one-piece',
    episode: 'Episode 1000'
  })
});

// Track search
fetch('/analytics/track/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'naruto',
    resultsCount: 25
  })
});
```

## 📊 Available Endpoints

### GET /analytics/status
Check analytics status

**Response:**
```json
{
  "status": "success",
  "analytics": {
    "enabled": true,
    "environment": "production",
    "vercel": true
  }
}
```

### POST /analytics/track/anime-view
Track anime view

**Body:**
```json
{
  "animeTitle": "One Piece",
  "animeSlug": "one-piece",
  "episode": "Episode 1000"
}
```

### POST /analytics/track/search
Track search query

**Body:**
```json
{
  "query": "naruto",
  "resultsCount": 25
}
```

### POST /analytics/track/streaming
Track streaming events

**Body:**
```json
{
  "action": "play",
  "videoTitle": "One Piece Episode 1000",
  "videoDuration": "24:30"
}
```

### POST /analytics/track/user-action
Track custom user actions

**Body:**
```json
{
  "action": "bookmark_add",
  "properties": {
    "animeId": "123",
    "animeTitle": "One Piece"
  }
}
```

## 🎯 Event Types

### Automatic Events

| Event | Description | Data |
|-------|-------------|------|
| `page_view` | Page navigation | url, title, timestamp |
| `anime_click` | Anime link clicks | anime_url, anime_title, timestamp |
| `search` | Search queries | query, timestamp |
| `video_play` | Video playback start | video_title, timestamp |
| `video_pause` | Video playback pause | video_title, timestamp |
| `video_complete` | Video playback complete | video_title, timestamp |
| `bookmark_action` | Bookmark add/remove | action, anime_id, timestamp |

### Custom Events

| Event | Description | Data |
|-------|-------------|------|
| `anime_view` | Anime page view | anime_title, anime_slug, episode |
| `search` | Search with results | query, results_count |
| `streaming` | Streaming actions | action, video_title, video_duration |
| `user_action` | Custom user actions | action, properties |

## 🔍 Analytics Dashboard

### Vercel Dashboard
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project KitaNime
3. Go to Analytics tab
4. View real-time data

### Metrics Available
- Page views
- Unique visitors
- Top pages
- Referrers
- User interactions
- Custom events

## 🛠️ Development

### Local Testing

```bash
# Set environment for testing
NODE_ENV=development VERCEL=1 npm run dev

# Check analytics status
curl http://localhost:3001/analytics/status
```

### Debug Mode

Analytics script menggunakan debug mode di development:

```javascript
// Debug script URL
https://cdn.vercel-insights.com/v1/script.debug.js
```

## 📱 Client-Side Usage

### Manual Event Tracking

```javascript
// Track custom events
if (typeof va !== 'undefined') {
  va('track', 'custom_event', {
    event_type: 'button_click',
    button_id: 'subscribe-btn',
    timestamp: new Date().toISOString()
  });
}
```

### React Integration (if using React components)

```jsx
import { useEffect } from 'react';

function AnimeCard({ anime }) {
  useEffect(() => {
    // Track anime card view
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', 'anime_card_view', {
        anime_title: anime.title,
        anime_slug: anime.slug
      });
    }
  }, [anime]);

  return (
    <div className="anime-card">
      {/* Card content */}
    </div>
  );
}
```

## 🔒 Privacy & GDPR

### Data Collection
- Page views (anonymized)
- User interactions (anonymized)
- No personal data collected
- No cookies for tracking

### GDPR Compliance
- Analytics data is anonymized
- No personal identifiers stored
- Users can opt-out via browser settings

## 🚀 Performance

### Optimization
- Analytics script loaded asynchronously
- Minimal impact on page load time
- Only active in production
- Debug mode available for development

### Bundle Size
- Analytics script: ~2KB
- No impact on main bundle
- Loaded from Vercel CDN

## 🔧 Troubleshooting

### Analytics Not Working

1. **Check Environment Variables**
   ```bash
   echo $NODE_ENV
   echo $VERCEL
   ```

2. **Check Analytics Status**
   ```bash
   curl https://your-domain.com/analytics/status
   ```

3. **Check Browser Console**
   ```javascript
   // Check if va function exists
   console.log(typeof window.va);
   ```

4. **Check Network Tab**
   - Look for requests to `cdn.vercel-insights.com`
   - Check for any blocked requests

### Common Issues

| Issue | Solution |
|-------|----------|
| Analytics not loading | Check VERCEL=1 environment variable |
| Events not tracking | Verify analytics.enabled in response |
| Script blocked | Check CSP headers |
| Debug mode not working | Use script.debug.js URL |

## 📚 Examples

### Complete Integration Example

```javascript
// routes/anime.js
const { trackAnimeEvent } = require('../middleware/analytics');

router.get('/anime/:slug', async (req, res) => {
  try {
    const anime = await getAnimeBySlug(req.params.slug);
    
    // Track anime view
    trackAnimeEvent('view', {
      title: anime.title,
      slug: anime.slug,
      episode: anime.episode
    });
    
    res.render('anime-detail', { anime });
  } catch (error) {
    res.status(404).render('error', { error });
  }
});
```

### Frontend Integration Example

```javascript
// public/js/analytics.js
class AnalyticsTracker {
  static trackAnimeView(anime) {
    if (typeof va !== 'undefined') {
      va('track', 'anime_view', {
        anime_title: anime.title,
        anime_slug: anime.slug,
        episode: anime.episode
      });
    }
  }

  static trackSearch(query, resultsCount) {
    if (typeof va !== 'undefined') {
      va('track', 'search', {
        query: query,
        results_count: resultsCount
      });
    }
  }

  static trackVideoEvent(action, videoData) {
    if (typeof va !== 'undefined') {
      va('track', 'video_event', {
        action: action,
        video_title: videoData.title,
        video_duration: videoData.duration
      });
    }
  }
}

// Usage
AnalyticsTracker.trackAnimeView({
  title: 'One Piece',
  slug: 'one-piece',
  episode: 'Episode 1000'
});
```

## 📞 Support

Jika mengalami masalah dengan analytics:

- 📧 Email: support@kitanime.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/Anime-Stream/issues)
- 📚 Docs: [Vercel Analytics Docs](https://vercel.com/docs/analytics)

---

<div align="center">
  <p>📊 Vercel Analytics untuk KitaNime</p>
  <p>Track user behavior dan optimize user experience</p>
</div>
