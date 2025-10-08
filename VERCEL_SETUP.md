# 🚀 Vercel Deployment Guide - KitaNime

Panduan lengkap untuk deployment KitaNime Anime Streaming Platform ke Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account
- Repository sudah di-push ke GitHub
- Node.js 16+ (untuk local testing)

## 🎯 Step-by-Step Deployment

### 1. Prepare Repository

Pastikan repository sudah siap:

```bash
# Commit semua perubahan
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

#### Option A: Via Vercel Dashboard
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import dari GitHub repository
4. Select repository "Anime-Stream"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? kitanime-streaming
# - Directory? ./
```

### 3. Configure Environment Variables

Di Vercel Dashboard → Project Settings → Environment Variables:

```env
# Application
NODE_ENV=production
PORT=3001
TRUST_PROXY=1

# Security (GENERATE STRONG SECRETS!)
SESSION_SECRET=your-super-secret-key-min-32-characters-long
CSRF_SECRET=your-csrf-secret-key

# API Configuration
API_BASE_URL=https://your-project-name.vercel.app/v1
CORS_ORIGIN=https://your-project-name.vercel.app

# Vercel Configuration
VERCEL=1
VERCEL_ANALYTICS_ID=your-analytics-id
```

### 4. Configure Build Settings

Di Vercel Dashboard → Project Settings → General:

- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: `npm install`
- **Output Directory**: `./`
- **Install Command**: `npm install`

### 5. Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch (auto-deploy)
git push origin main
```

## 🔧 Configuration Files

### vercel.json
File konfigurasi sudah disiapkan dengan:
- Serverless functions
- Static file serving
- CORS headers
- Cache optimization
- Analytics integration

### package.json
Scripts yang tersedia:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "build": "echo 'No build step required'",
    "vercel-build": "echo 'Vercel build completed'"
  }
}
```

## 🌐 Custom Domain Setup

### 1. Add Custom Domain
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 2. Update Environment Variables
```env
CORS_ORIGIN=https://your-custom-domain.com
API_BASE_URL=https://your-custom-domain.com/v1
```

### 3. Update DNS Records
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Otomatis aktif di production
- View di Vercel Dashboard → Analytics
- Real-time metrics dan insights

### Performance Monitoring
- Function logs di Vercel Dashboard
- Real-time performance metrics
- Error tracking

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs

# Common solutions:
# - Update Node.js version in package.json
# - Check dependencies compatibility
# - Verify file paths in vercel.json
```

#### 2. Environment Variables Not Working
```bash
# Check environment variables
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

#### 3. API Routes Not Working
- Check vercel.json rewrites
- Verify API endpoint paths
- Check CORS configuration

#### 4. Static Files Not Loading
- Check public folder structure
- Verify static file headers
- Check file permissions

### Debug Commands

```bash
# Check deployment status
vercel ls

# View function logs
vercel logs

# Check environment variables
vercel env ls

# Inspect deployment
vercel inspect [deployment-url]
```

## 🚀 Production Optimization

### 1. Performance Optimization
- Enable Vercel Analytics
- Configure proper caching headers
- Optimize images and assets
- Use CDN for static files

### 2. Security
- Set strong session secrets
- Enable HTTPS
- Configure CORS properly
- Use environment variables for secrets

### 3. Monitoring
- Set up error tracking
- Monitor function performance
- Track user analytics
- Set up alerts

## 📱 API Deployment

### Separate API Deployment
Jika ingin deploy API terpisah:

```bash
# Deploy API service
cd api
vercel

# Update main app environment
API_BASE_URL=https://your-api-project.vercel.app/v1
```

### Combined Deployment
API sudah dikonfigurasi untuk deploy bersama main app melalui vercel.json.

## 🔄 CI/CD Setup

### Automatic Deployments
- Push ke `main` branch → Production deployment
- Push ke `develop` branch → Preview deployment
- Pull requests → Preview deployments

### Manual Deployments
```bash
# Deploy specific branch
vercel --prod --target production

# Deploy with specific environment
vercel --env production
```

## 📊 Post-Deployment Checklist

- [ ] ✅ Application loads correctly
- [ ] ✅ API endpoints working
- [ ] ✅ Database connections working
- [ ] ✅ Analytics tracking active
- [ ] ✅ Static files loading
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ SSL certificate active
- [ ] ✅ Performance monitoring setup
- [ ] ✅ Error tracking configured
- [ ] ✅ Environment variables set
- [ ] ✅ CORS configured properly
- [ ] ✅ Cache headers working
- [ ] ✅ SEO meta tags working
- [ ] ✅ Social media previews working

## 🎯 Performance Tips

### 1. Optimize Bundle Size
- Remove unused dependencies
- Use dynamic imports
- Optimize images
- Enable compression

### 2. Database Optimization
- Use connection pooling
- Implement caching
- Optimize queries
- Use indexes

### 3. Caching Strategy
- Static assets: 1 year
- API responses: 1 hour
- HTML pages: 1 day
- User data: No cache

## 📞 Support

Jika mengalami masalah deployment:

- 📧 Email: support@kitanime.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/Anime-Stream/issues)
- 📚 Docs: [Vercel Documentation](https://vercel.com/docs)
- 💬 Discord: [Vercel Community](https://vercel.com/discord)

## 🎉 Success!

Setelah deployment berhasil, Anda akan mendapatkan:

- ✅ Production URL: `https://your-project.vercel.app`
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Real-time analytics
- ✅ Automatic scaling
- ✅ Zero-downtime deployments

---

<div align="center">
  <p>🚀 KitaNime di Vercel</p>
  <p>Deploy dengan mudah, scale dengan otomatis</p>
</div>
