# 🚀 Deployment Guide - KitaNime

Panduan lengkap untuk deployment KitaNime Anime Streaming Platform ke berbagai platform hosting.

## 📋 Daftar Isi

- [Vercel Deployment](#vercel-deployment)
- [Railway Deployment](#railway-deployment)
- [Heroku Deployment](#heroku-deployment)
- [VPS/Server Deployment](#vpsserver-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [Monitoring & Maintenance](#monitoring--maintenance)

## 🌐 Vercel Deployment

Vercel adalah platform yang direkomendasikan untuk deployment KitaNime karena optimasi untuk Node.js dan serverless functions.

### Prerequisites
- GitHub account
- Vercel account
- Repository sudah di-push ke GitHub

### Step-by-Step Deployment

1. **Connect Repository**
   ```bash
   # Login ke Vercel
   npm i -g vercel
   vercel login
   
   # Deploy dari local
   vercel
   ```

2. **Environment Variables**
   Set di Vercel Dashboard → Project Settings → Environment Variables:
   ```
   NODE_ENV=production
   SESSION_SECRET=your-super-secret-key-here
   API_BASE_URL=https://your-api-domain.vercel.app/v1
   CORS_ORIGIN=https://your-domain.vercel.app
   VERCEL=1
   ```

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records

4. **Automatic Deployment**
   - Setiap push ke main branch akan otomatis deploy
   - Preview deployments untuk pull requests

### Vercel Configuration

File `vercel.json` sudah dikonfigurasi dengan:
- Serverless functions
- Static file serving
- CORS headers
- Cache optimization

## 🚂 Railway Deployment

Railway menyediakan platform deployment yang mudah dengan database terintegrasi.

### Step-by-Step Deployment

1. **Connect GitHub**
   - Login ke [Railway](https://railway.app)
   - Connect GitHub repository
   - Select project

2. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   SESSION_SECRET=your-secret-key
   API_BASE_URL=https://your-app.railway.app/v1
   CORS_ORIGIN=https://your-app.railway.app
   ```

3. **Database Setup**
   - Add PostgreSQL service
   - Update database connection string
   - Run migrations

4. **Deploy**
   - Railway akan otomatis build dan deploy
   - Monitor logs di dashboard

## 🟣 Heroku Deployment

Heroku adalah platform cloud yang populer untuk deployment aplikasi Node.js.

### Prerequisites
- Heroku CLI installed
- Heroku account

### Step-by-Step Deployment

1. **Create Heroku App**
   ```bash
   # Login ke Heroku
   heroku login
   
   # Create app
   heroku create kitanime-app
   
   # Add buildpack
   heroku buildpacks:set heroku/nodejs
   ```

2. **Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your-secret-key
   heroku config:set API_BASE_URL=https://your-app.herokuapp.com/v1
   heroku config:set CORS_ORIGIN=https://your-app.herokuapp.com
   ```

3. **Database Setup**
   ```bash
   # Add PostgreSQL addon
   heroku addons:create heroku-postgresql:hobby-dev
   
   # Run migrations
   heroku run npm run migrate
   ```

4. **Deploy**
   ```bash
   # Deploy to Heroku
   git push heroku main
   
   # Open app
   heroku open
   ```

### Heroku Configuration

Create `Procfile`:
```
web: node app.js
```

## 🖥️ VPS/Server Deployment

Deployment ke VPS atau dedicated server memberikan kontrol penuh atas environment.

### Prerequisites
- Ubuntu 20.04+ atau CentOS 8+
- Node.js 16+
- Nginx
- PM2
- SSL certificate

### Step-by-Step Deployment

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Application Setup**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/Anime-Stream.git
   cd Anime-Stream
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   ```

3. **Environment Configuration**
   ```bash
   # Create .env file
   cp ENV_SAMPLE.txt .env
   nano .env
   ```
   
   ```env
   NODE_ENV=production
   PORT=3001
   SESSION_SECRET=your-super-secret-key
   API_BASE_URL=https://your-domain.com/v1
   CORS_ORIGIN=https://your-domain.com
   ```

4. **PM2 Configuration**
   ```bash
   # Start with PM2
   pm2 start app.js --name "kitanime"
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

5. **Nginx Configuration**
   Create `/etc/nginx/sites-available/kitanime`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /static {
           alias /path/to/Anime-Stream/public;
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

6. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/kitanime /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## 🐳 Docker Deployment

Docker memungkinkan deployment yang konsisten di berbagai environment.

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY api/package*.json ./api/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=your-secret-key
      - API_BASE_URL=http://localhost:3000/v1
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Deployment Commands
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ⚙️ Environment Configuration

### Production Environment Variables

```env
# Application
NODE_ENV=production
PORT=3001
TRUST_PROXY=1

# Security
SESSION_SECRET=your-super-secret-key-min-32-chars
CSRF_SECRET=your-csrf-secret-key

# API Configuration
API_BASE_URL=https://your-api-domain.com/v1
CORS_ORIGIN=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Cache
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Development Environment Variables

```env
NODE_ENV=development
PORT=3001
TRUST_PROXY=0
SESSION_SECRET=dev-secret-key
API_BASE_URL=http://localhost:3000/v1
CORS_ORIGIN=*
```

## 🗄️ Database Setup

### SQLite (Default)
```bash
# Database akan dibuat otomatis
# File: data/kitanime.db
```

### PostgreSQL (Production)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb kitanime

# Create user
sudo -u postgres createuser kitanime_user

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kitanime TO kitanime_user;"
```

### Database Migration
```bash
# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3001;
        # ... proxy configuration
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 Monitoring & Maintenance

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs kitanime

# Restart application
pm2 restart kitanime

# Update application
git pull origin main
npm install
pm2 restart kitanime
```

### Log Management
```bash
# Install logrotate
sudo apt install logrotate

# Configure log rotation
sudo nano /etc/logrotate.d/kitanime
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/kitanime"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
cp data/kitanime.db $BACKUP_DIR/kitanime_$DATE.db

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz public/uploads/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Health Checks
```bash
# Create health check script
#!/bin/bash
# health-check.sh

URL="https://your-domain.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ $RESPONSE -ne 200 ]; then
    echo "Health check failed: $RESPONSE"
    # Send notification or restart service
    pm2 restart kitanime
fi
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   sudo lsof -i :3001
   
   # Kill process
   sudo kill -9 PID
   ```

2. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER /path/to/app
   chmod -R 755 /path/to/app
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Restart database
   sudo systemctl restart postgresql
   ```

4. **Nginx Configuration Issues**
   ```bash
   # Test configuration
   sudo nginx -t
   
   # Reload configuration
   sudo systemctl reload nginx
   ```

### Performance Optimization

1. **Enable Gzip Compression**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   ```

2. **Cache Static Files**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Database Optimization**
   ```sql
   -- Create indexes
   CREATE INDEX idx_anime_slug ON anime(slug);
   CREATE INDEX idx_user_email ON users(email);
   ```

## 📞 Support

Jika mengalami masalah deployment:

- 📧 Email: support@kitanime.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/Anime-Stream/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/Anime-Stream/discussions)

---

<div align="center">
  <p>🚀 Deployment Guide untuk KitaNime</p>
  <p>Pilih platform yang sesuai dengan kebutuhan Anda</p>
</div>
