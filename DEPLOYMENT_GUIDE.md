# Deployment Guide - Riverwood AI Voice Agent

## 🚀 Production Deployment Options

### Option 1: Cloud Platform (Recommended)
- **Backend**: Railway, Render, or Heroku
- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Database**: PostgreSQL on Railway/Render (future upgrade)

### Option 2: VPS Hosting
- **Provider**: DigitalOcean, Linode, or AWS EC2
- **Setup**: Ubuntu 22.04 LTS with PM2
- **Reverse Proxy**: Nginx

### Option 3: Containerized
- **Platform**: Docker + Kubernetes
- **Registry**: Docker Hub or AWS ECR
- **Orchestration**: Kubernetes or Docker Swarm

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] API keys secured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] CORS configured for production domain
- [ ] Rate limiting added (recommended)
- [ ] Input validation complete

### Infrastructure
- [ ] Domain name purchased
- [ ] SSL certificate obtained
- [ ] Database setup (if upgrading from JSON)
- [ ] CDN configured (optional)
- [ ] Monitoring tools setup
- [ ] Backup strategy defined

### Security
- [ ] API keys in environment variables
- [ ] HTTPS enabled
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] Input sanitization
- [ ] Security headers configured

## 🌐 Option 1: Deploy to Cloud Platforms

### Backend Deployment (Railway)

#### Step 1: Prepare Backend
```powershell
# Add start script to backend/package.json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

#### Step 2: Create Railway Project
1. Go to https://railway.app
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your repository
6. Choose `backend` folder as root

#### Step 3: Configure Environment Variables
```
OPENAI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Step 4: Deploy
- Railway auto-deploys on git push
- Get your backend URL: `https://your-app.railway.app`

### Frontend Deployment (Vercel)

#### Step 1: Prepare Frontend
```powershell
# Update frontend/.env
VITE_API_URL=https://your-backend.railway.app
```

#### Step 2: Deploy to Vercel
```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
# Set root directory to: frontend
# Build command: npm run build
# Output directory: dist
```

#### Step 3: Configure Environment Variables
In Vercel Dashboard:
```
VITE_API_URL=https://your-backend.railway.app
```

#### Step 4: Deploy Production
```powershell
vercel --prod
```

## 🖥️ Option 2: Deploy to VPS (DigitalOcean)

### Step 1: Create Droplet
```
1. Create Ubuntu 22.04 LTS droplet
2. Choose plan (minimum 2GB RAM)
3. Add SSH key
4. Create droplet
```

### Step 2: Initial Server Setup
```bash
# SSH into server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### Step 3: Deploy Backend
```bash
# Create app directory
mkdir -p /var/www/riverwood
cd /var/www/riverwood

# Clone repository
git clone your_repo_url .

# Install backend dependencies
cd backend
npm install --production

# Create .env file
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name riverwood-backend
pm2 save
pm2 startup
```

### Step 4: Configure Nginx
```bash
# Create Nginx config
nano /etc/nginx/sites-available/riverwood

# Add configuration:
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/riverwood/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/riverwood /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 5: Deploy Frontend
```bash
# Build frontend
cd /var/www/riverwood/frontend
npm install
npm run build

# Frontend is now in dist/ folder
```

### Step 6: Setup SSL
```bash
# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
```

## 🐳 Option 3: Docker Deployment

### Step 1: Create Dockerfiles

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Frontend Nginx Config
```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Step 2: Create Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
      - ELEVENLABS_VOICE_ID=${ELEVENLABS_VOICE_ID}
      - PORT=3001
      - NODE_ENV=production
      - FRONTEND_URL=http://localhost
    volumes:
      - ./backend/data:/app/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Step 3: Deploy with Docker
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔒 Security Hardening

### 1. Environment Variables
```bash
# Never commit .env files
# Use platform-specific secret management
# Rotate API keys regularly
```

### 2. Rate Limiting (Add to backend)
```javascript
// backend/server.js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Helmet for Security Headers
```javascript
// backend/server.js
import helmet from 'helmet';

app.use(helmet());
```

### 4. Input Validation
```javascript
// backend/routes/chat.routes.js
import { body, validationResult } from 'express-validator';

router.post('/',
  body('customerId').isString().notEmpty(),
  body('message').isString().notEmpty().isLength({ max: 1000 }),
  body('projectId').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest of handler
  }
);
```

## 📊 Monitoring & Logging

### 1. Setup Logging (Winston)
```javascript
// backend/utils/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### 2. Error Tracking (Sentry)
```javascript
// backend/server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### 3. Uptime Monitoring
- Use UptimeRobot or Pingdom
- Monitor: `/health` endpoint
- Alert on downtime

## 💾 Database Migration (Optional)

### Upgrade from JSON to PostgreSQL

#### 1. Install Dependencies
```bash
npm install pg sequelize
```

#### 2. Create Database Schema
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_customer_id ON conversations(customer_id);
CREATE INDEX idx_timestamp ON conversations(timestamp);
```

#### 3. Update Memory Service
```javascript
// backend/services/memory.service.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL);

// Define model
const Conversation = sequelize.define('Conversation', {
  customerId: DataTypes.STRING,
  role: DataTypes.STRING,
  content: DataTypes.TEXT,
  timestamp: DataTypes.DATE
});

// Update methods to use Sequelize
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd backend && npm install
        cd ../frontend && npm install
    
    - name: Run tests
      run: |
        cd backend && npm test
        cd ../frontend && npm test
    
    - name: Deploy to Railway
      run: |
        # Add Railway deployment commands
```

## 📈 Performance Optimization

### 1. Enable Caching
```javascript
// backend/server.js
import redis from 'redis';
const client = redis.createClient();

// Cache OpenAI responses
async function getCachedResponse(key) {
  return await client.get(key);
}
```

### 2. Compress Responses
```javascript
// backend/server.js
import compression from 'compression';
app.use(compression());
```

### 3. CDN for Frontend
- Use Cloudflare CDN
- Cache static assets
- Enable Brotli compression

## 🔍 Post-Deployment Checklist

- [ ] All services running
- [ ] SSL certificate valid
- [ ] Domain resolves correctly
- [ ] API endpoints accessible
- [ ] Frontend loads properly
- [ ] Voice input works
- [ ] Audio playback works
- [ ] Conversation history persists
- [ ] Error logging working
- [ ] Monitoring alerts configured
- [ ] Backup system running
- [ ] Documentation updated

## 🆘 Troubleshooting Production Issues

### Issue: High API Costs
**Solution**: Implement caching, rate limiting, shorter responses

### Issue: Slow Response Times
**Solution**: Use Redis caching, optimize OpenAI prompts, enable CDN

### Issue: Memory Leaks
**Solution**: Monitor with PM2, restart services periodically, fix memory leaks

### Issue: SSL Certificate Expired
**Solution**: Certbot auto-renewal should handle this, check cron jobs

### Issue: Database Connection Errors
**Solution**: Check connection string, increase connection pool, restart database

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- [ ] Weekly: Check error logs
- [ ] Weekly: Monitor API usage
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review security patches
- [ ] Quarterly: Performance audit
- [ ] Quarterly: Cost optimization

### Backup Strategy
```bash
# Daily backup of conversations
0 2 * * * /usr/local/bin/backup-conversations.sh

# Weekly full backup
0 3 * * 0 /usr/local/bin/full-backup.sh
```

---

## 🎉 Deployment Complete!

Your Riverwood AI Voice Agent is now live and ready to serve customers!

**Next Steps:**
1. Monitor logs for first 24 hours
2. Test all features in production
3. Set up alerts for errors
4. Document any issues
5. Plan for scaling

Good luck! 🚀
