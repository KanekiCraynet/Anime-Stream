# 📡 KitaNime API Documentation

API documentation untuk KitaNime Anime Streaming Platform. API ini menyediakan akses ke data anime dari berbagai sumber dengan format JSON yang konsisten.

## 🌐 Base URL

- **Development**: `http://localhost:3000/v1`
- **Production**: `https://yourdomain.com/v1`

## 🔑 Authentication

API ini tidak memerlukan authentication untuk endpoint public. Namun, beberapa endpoint memerlukan rate limiting untuk mencegah abuse.

## 📋 Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Search**: 50 requests per 15 minutes per IP
- **Stream**: 30 requests per 15 minutes per IP

## 📊 Response Format

Semua response mengikuti format JSON standar:

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 🏠 Home & Discovery

### Get Home Data
Mengambil data anime terbaru, trending, dan rekomendasi.

```http
GET /v1/home
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "ongoing": [
      {
        "title": "One Piece",
        "slug": "one-piece",
        "poster": "https://example.com/poster.jpg",
        "episode": "Episode 1000",
        "status": "Ongoing",
        "rating": 9.5,
        "genres": ["Action", "Adventure"]
      }
    ],
    "complete": [
      {
        "title": "Attack on Titan",
        "slug": "attack-on-titan",
        "poster": "https://example.com/poster.jpg",
        "episode": "25 Episodes",
        "status": "Complete",
        "rating": 9.8,
        "genres": ["Action", "Drama"]
      }
    ],
    "movies": [
      {
        "title": "Your Name",
        "slug": "your-name",
        "poster": "https://example.com/poster.jpg",
        "duration": "106 minutes",
        "rating": 9.2,
        "genres": ["Romance", "Drama"]
      }
    ]
  }
}
```

## 🔍 Search

### Search Anime
Pencarian anime berdasarkan keyword.

```http
GET /v1/search?keyword={keyword}&page={page}
```

**Parameters:**
- `keyword` (required): Kata kunci pencarian
- `page` (optional): Nomor halaman (default: 1)

**Example:**
```http
GET /v1/search?keyword=naruto&page=1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "title": "Naruto",
      "slug": "naruto",
      "poster": "https://example.com/poster.jpg",
      "episode": "220 Episodes",
      "status": "Complete",
      "rating": 9.1,
      "genres": ["Action", "Adventure"],
      "synopsis": "Naruto Uzumaki adalah seorang ninja muda..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📺 Anime Details

### Get Anime Detail
Mengambil detail lengkap anime.

```http
GET /v1/anime/{slug}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "One Piece",
    "slug": "one-piece",
    "poster": "https://example.com/poster.jpg",
    "banner": "https://example.com/banner.jpg",
    "status": "Ongoing",
    "episode": "Episode 1000",
    "rating": 9.5,
    "genres": ["Action", "Adventure", "Comedy"],
    "synopsis": "Monkey D. Luffy adalah seorang pemuda yang bercita-cita menjadi Raja Bajak Laut...",
    "details": {
      "studio": "Toei Animation",
      "season": "Fall 1999",
      "type": "TV",
      "duration": "24 min per ep"
    }
  }
}
```

### Get Anime Episodes
Mengambil daftar episode anime.

```http
GET /v1/anime/{slug}/episodes
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "episode": "Episode 1000",
      "slug": "one-piece-episode-1000",
      "date": "2021-11-21",
      "title": "Luffy's New Power"
    },
    {
      "episode": "Episode 999",
      "slug": "one-piece-episode-999",
      "date": "2021-11-14",
      "title": "The Final Battle Begins"
    }
  ]
}
```

### Get Specific Episode
Mengambil detail episode tertentu.

```http
GET /v1/anime/{slug}/episodes/{episode}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "episode": "Episode 1000",
    "title": "Luffy's New Power",
    "slug": "one-piece-episode-1000",
    "date": "2021-11-21",
    "video": {
      "url": "https://example.com/video.mp4",
      "quality": "1080p",
      "size": "1.2GB"
    },
    "download": [
      {
        "quality": "1080p",
        "size": "1.2GB",
        "url": "https://example.com/download/1080p"
      },
      {
        "quality": "720p",
        "size": "800MB",
        "url": "https://example.com/download/720p"
      }
    ]
  }
}
```

## 🎭 Genres

### Get All Genres
Mengambil daftar semua genre anime.

```http
GET /v1/genres
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "name": "Action",
      "slug": "action",
      "count": 1250
    },
    {
      "name": "Adventure",
      "slug": "adventure",
      "count": 980
    },
    {
      "name": "Comedy",
      "slug": "comedy",
      "count": 1100
    }
  ]
}
```

### Get Anime by Genre
Mengambil anime berdasarkan genre.

```http
GET /v1/genres/{slug}?page={page}
```

**Parameters:**
- `slug` (required): Slug genre
- `page` (optional): Nomor halaman (default: 1)

**Example:**
```http
GET /v1/genres/action?page=1
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "title": "One Piece",
      "slug": "one-piece",
      "poster": "https://example.com/poster.jpg",
      "episode": "Episode 1000",
      "status": "Ongoing",
      "rating": 9.5,
      "genres": ["Action", "Adventure"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📋 Complete & Ongoing Anime

### Get Complete Anime
Mengambil daftar anime yang sudah selesai.

```http
GET /v1/complete-anime?page={page}
```

**Parameters:**
- `page` (optional): Nomor halaman (default: 1)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "title": "Attack on Titan",
      "slug": "attack-on-titan",
      "poster": "https://example.com/poster.jpg",
      "episode": "25 Episodes",
      "status": "Complete",
      "rating": 9.8,
      "genres": ["Action", "Drama"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Ongoing Anime
Mengambil daftar anime yang sedang berlangsung.

```http
GET /v1/ongoing-anime?page={page}
```

**Parameters:**
- `page` (optional): Nomor halaman (default: 1)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "title": "One Piece",
      "slug": "one-piece",
      "poster": "https://example.com/poster.jpg",
      "episode": "Episode 1000",
      "status": "Ongoing",
      "rating": 9.5,
      "genres": ["Action", "Adventure"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🎬 Episode Details

### Get Episode Detail
Mengambil detail episode berdasarkan slug.

```http
GET /v1/episode/{slug}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "episode": "Episode 1000",
    "title": "Luffy's New Power",
    "slug": "one-piece-episode-1000",
    "anime": {
      "title": "One Piece",
      "slug": "one-piece",
      "poster": "https://example.com/poster.jpg"
    },
    "date": "2021-11-21",
    "video": {
      "url": "https://example.com/video.mp4",
      "quality": "1080p",
      "size": "1.2GB"
    },
    "download": [
      {
        "quality": "1080p",
        "size": "1.2GB",
        "url": "https://example.com/download/1080p"
      }
    ]
  }
}
```

## 🎥 Movies

### Get Movies List
Mengambil daftar anime movie.

```http
GET /v1/movies?page={page}
```

**Parameters:**
- `page` (optional): Nomor halaman (default: 1)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "title": "Your Name",
      "slug": "your-name",
      "poster": "https://example.com/poster.jpg",
      "duration": "106 minutes",
      "rating": 9.2,
      "genres": ["Romance", "Drama"],
      "year": 2016
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📊 Batch Download

### Get Batch Download
Mengambil link download batch untuk anime.

```http
GET /v1/batch/{slug}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "One Piece",
    "slug": "one-piece",
    "batches": [
      {
        "title": "One Piece Batch 1-50",
        "episodes": "Episode 1-50",
        "size": "15GB",
        "quality": "1080p",
        "download": [
          {
            "provider": "Google Drive",
            "url": "https://drive.google.com/..."
          },
          {
            "provider": "Mega",
            "url": "https://mega.nz/..."
          }
        ]
      }
    ]
  }
}
```

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| `INVALID_SLUG` | Anime slug tidak valid |
| `EPISODE_NOT_FOUND` | Episode tidak ditemukan |
| `GENRE_NOT_FOUND` | Genre tidak ditemukan |
| `RATE_LIMIT_EXCEEDED` | Rate limit terlampaui |
| `SERVER_ERROR` | Error internal server |
| `INVALID_PAGE` | Nomor halaman tidak valid |

## 🔧 Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/v1'
});

// Get home data
const homeData = await api.get('/home');

// Search anime
const searchResults = await api.get('/search', {
  params: { keyword: 'naruto', page: 1 }
});

// Get anime detail
const animeDetail = await api.get('/anime/one-piece');
```

### Python
```python
import requests

base_url = 'http://localhost:3000/v1'

# Get home data
response = requests.get(f'{base_url}/home')
home_data = response.json()

# Search anime
response = requests.get(f'{base_url}/search', params={
    'keyword': 'naruto',
    'page': 1
})
search_results = response.json()
```

### cURL
```bash
# Get home data
curl -X GET "http://localhost:3000/v1/home"

# Search anime
curl -X GET "http://localhost:3000/v1/search?keyword=naruto&page=1"

# Get anime detail
curl -X GET "http://localhost:3000/v1/anime/one-piece"
```

## 📝 Notes

- Semua endpoint mengembalikan response dalam format JSON
- Pagination tersedia untuk endpoint yang mengembalikan list data
- Rate limiting diterapkan untuk mencegah abuse
- API menggunakan caching untuk meningkatkan performa
- Semua URL video dan download bersifat temporary dan dapat berubah

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic anime data endpoints
- Search functionality
- Genre filtering
- Episode streaming

---

<div align="center">
  <p>📡 API Documentation untuk KitaNime</p>
  <p>Terakhir diperbarui: {current_date}</p>
</div>
