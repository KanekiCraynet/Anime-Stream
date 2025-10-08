# ⚡ Quick Deploy to Vercel - KitaNime

Panduan cepat untuk deployment KitaNime ke Vercel dalam 5 menit.

## 🚀 One-Click Deployment

### Option 1: Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/Anime-Stream)

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 3: GitHub Integration
1. Fork repository ini
2. Connect ke Vercel Dashboard
3. Import project
4. Deploy!

## ⚙️ Quick Configuration

### 1. Environment Variables
Set di Vercel Dashboard → Settings → Environment Variables:

```env
NODE_ENV=production
VERCEL=1
SESSION_SECRET=your-super-secret-key-32-chars-min
API_BASE_URL=https://your-project.vercel.app/v1
CORS_ORIGIN=https://your-project.vercel.app
```

### 2. Generate Secrets
```bash
# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CSRF secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🎯 5-Minute Setup

### Step 1: Prepare (1 min)
```bash
git clone https://github.com/yourusername/Anime-Stream.git
cd Anime-Stream
```

### Step 2: Deploy (2 min)
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 3: Configure (2 min)
1. Go to Vercel Dashboard
2. Set environment variables
3. Wait for deployment

## ✅ Verification

Check these URLs after deployment:
- `https://your-project.vercel.app` - Main site
- `https://your-project.vercel.app/health` - Health check
- `https://your-project.vercel.app/v1/home` - API test

## 🔧 Troubleshooting

### Common Issues:
- **Build fails**: Check Node.js version (use 18.x)
- **Environment variables**: Make sure all required vars are set
- **API not working**: Check CORS_ORIGIN matches your domain

### Quick Fixes:
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod
```

## 📊 Post-Deployment

1. **Enable Analytics**: Go to Vercel Dashboard → Analytics
2. **Set Custom Domain**: Add your domain in Settings
3. **Monitor Performance**: Check function logs and metrics

## 🎉 Done!

Your KitaNime is now live on Vercel! 🚀

---

**Need help?** Check the full [VERCEL_SETUP.md](VERCEL_SETUP.md) guide.
