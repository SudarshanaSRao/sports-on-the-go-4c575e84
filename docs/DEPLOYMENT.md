# Deployment Guide

This guide covers different ways to deploy SquadUp to production.

## Table of Contents
- [Lovable Deployment (Recommended)](#lovable-deployment)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [Self-Hosting](#self-hosting)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)

## Lovable Deployment

The easiest way to deploy SquadUp is through Lovable.

1. **Open Your Project**
   - Navigate to your Lovable project
   
2. **Publish**
   - Click the "Publish" button in the top right
   - Your app will be deployed automatically
   
3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Click "Connect Domain"
   - Follow the instructions to connect your custom domain

**Advantages:**
- One-click deployment
- Automatic backend setup
- Built-in SSL certificates
- Auto-scaling infrastructure
- Integrated with Lovable Cloud

## Vercel

Deploy SquadUp on Vercel for excellent performance and DX.

### Prerequisites
- Vercel account
- GitHub repository connected
- Supabase project (for backend)

### Steps

1. **Import Repository**
   ```bash
   # Via Vercel CLI
   npm i -g vercel
   vercel
   ```
   
   Or use the Vercel dashboard to import from GitHub.

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard (Settings → Environment Variables):
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - Automatic deployments on git push

### Custom Domain on Vercel
- Settings → Domains
- Add your domain
- Configure DNS as instructed

## Netlify

Deploy on Netlify for simple static hosting with edge functions.

### Steps

1. **Connect Repository**
   - Log in to Netlify
   - Click "New site from Git"
   - Choose your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18 or higher

3. **Environment Variables**
   Go to Site settings → Build & deploy → Environment:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy

### Redirects Configuration
Create `public/_redirects` file:
```
/*    /index.html   200
```

## Self-Hosting

Host SquadUp on your own infrastructure.

### Requirements
- Node.js 18+ server
- Nginx or similar web server
- SSL certificate
- Supabase project

### Build the Application
```bash
# Clone the repository
git clone <your-repo-url>
cd squadup

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Build for production
npm run build
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/squadup/dist;
    index index.html;

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### PM2 (Process Manager)
If serving with Node.js:
```bash
npm install -g pm2

# Create ecosystem file
pm2 ecosystem

# Edit ecosystem.config.js
module.exports = {
  apps: [{
    name: 'squadup',
    script: 'npx',
    args: 'serve dist -p 3000',
    env: {
      NODE_ENV: 'production'
    }
  }]
}

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  squadup:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}
      - VITE_SUPABASE_PROJECT_ID=${VITE_SUPABASE_PROJECT_ID}
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Environment Variables

Required environment variables for all deployments:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**Security Notes:**
- Never commit `.env` files to version control
- Use environment-specific configurations
- Rotate keys regularly
- Use proper CORS settings

## Database Setup

### Using Lovable Cloud
- Database is automatically configured
- No additional setup needed
- RLS policies pre-configured

### Using Your Own Supabase
1. Create a Supabase project
2. Run migrations from `supabase/migrations/`
3. Deploy edge functions:
   ```bash
   supabase functions deploy geocode
   supabase functions deploy moderate-content
   ```
4. Configure authentication providers
5. Set up storage buckets

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test authentication flow
- [ ] Check map functionality
- [ ] Verify game creation works
- [ ] Test image uploads
- [ ] Check responsive design
- [ ] Test in multiple browsers
- [ ] Verify SSL certificate
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test error pages
- [ ] Verify API rate limits

## Monitoring & Maintenance

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Performance**: Lighthouse CI

### Regular Maintenance
- Update dependencies monthly
- Monitor database performance
- Check error logs weekly
- Review security policies
- Backup database regularly

## Troubleshooting

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check variable names match exactly

### Deployment Fails
- Check Node.js version (18+)
- Verify all dependencies are in package.json
- Check build logs for errors
- Ensure environment variables are set

## Support

Need help with deployment?
- Check [GitHub Issues](https://github.com/yourusername/squadup/issues)
- Read [Lovable Docs](https://docs.lovable.dev)
- Join community discussions

---

Happy deploying! 🚀
