# EcoViz Deployment Guide

## Quick Start: Deploy to Vercel in 5 Minutes

### Prerequisites
- GitHub account with your repository
- Vercel account (free tier available)
- Node.js v14+ installed locally

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Login with GitHub
3. Click "New Project"
4. Select your repository
5. Click "Import"

### Step 3: Configure Environment Variables
1. Go to Project Settings → Environment Variables
2. Add the following:
   ```
   NODE_ENV=production
   PORT=5000
   REACT_APP_API_URL=https://[YOUR_PROJECT_NAME].vercel.app/api
   ```
3. Optional (for real data):
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/climate-dashboard
   NASA_API_KEY=your_api_key
   ```

### Step 4: Deploy
Click "Deploy" and wait for the build to complete!

Your app will be live at: `https://[YOUR_PROJECT_NAME].vercel.app`

---

## Detailed Deployment Instructions

### Vercel Deployment (Recommended)

#### Why Vercel?
- ✅ Free tier (up to 12 serverless functions)
- ✅ Automatic deployments on git push
- ✅ Built-in SSL certificates
- ✅ Global CDN
- ✅ One-click rollbacks
- ✅ Analytics and monitoring

#### Full Setup Guide

1. **Create Vercel Account**
   - Go to https://vercel.com/signup
   - Choose "Continue with GitHub"
   - Authorize Vercel access

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Choose framework: "Other" (since it's a custom Node+React setup)

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`

4. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   REACT_APP_API_URL=https://[PROJECT_NAME].vercel.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build (2-5 minutes)
   - Get your live URL

#### Setting Custom Domain

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your custom domain (e.g., `ecoviz.com`)
4. Update DNS records at your domain provider:
   - Add CNAME record pointing to `cname.vercel.app`
   - Add A record: `76.76.19.0` (optional backup)

#### Monitoring Deployments

1. **View Logs**
   - Vercel Dashboard → Deployments
   - Click on a deployment
   - View Build Logs and Deployment Status

2. **Performance Analytics**
   - Analytics tab shows real-time metrics
   - Response times, requests, errors

3. **Rollback to Previous**
   - Deployments → Select previous build
   - Click "Rollback to this Deployment"

---

### Alternative: Deploy to Heroku

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- GitHub repository

#### Steps

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create ecoviz
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   heroku config:set REACT_APP_API_URL=https://ecoviz.herokuapp.com/api
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

**Note:** Heroku free tier may be slow. Consider upgrading for production.

---

### Alternative: Deploy to Railway

#### Steps

1. **Create Account**
   - Go to https://railway.app
   - Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment**
   - Variables tab
   - Add: `NODE_ENV=production`
   - Add: `REACT_APP_API_URL=https://[YOUR_PROJECT].up.railway.app/api`

4. **Deploy**
   - Auto-deploys on git push
   - View at your Railway URL

**Railway Benefits:** Better free tier, auto-deploys, easy scaling

---

### Alternative: Deploy to Render

#### Steps

1. **Sign Up**
   - https://render.com
   - Connect GitHub

2. **Create New Service**
   - "New +" → "Web Service"
   - Select your repository
   - Choose "Node"

3. **Configure**
   - Build Command: `npm install --legacy-peer-deps && npm run build`
   - Start Command: `node server/index.js`
   - Environment: Add variables as needed

4. **Deploy**
   - Click "Create Web Service"
   - Auto-deploys on git push

---

### Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["node", "server/index.js"]
```

#### Build and Run Locally

```bash
docker build -t ecoviz .
docker run -p 5000:5000 ecoviz
```

#### Deploy to Docker Hub

```bash
docker login
docker tag ecoviz username/ecoviz:latest
docker push username/ecoviz:latest
```

---

### Database Setup for Production

#### MongoDB Atlas (Recommended)

1. **Create Free Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create account
   - Create free tier cluster

2. **Get Connection String**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string

3. **Set on Hosting Platform**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/climate-dashboard?retryWrites=true&w=majority
   ```

#### Backup Strategy

```bash
# Backup MongoDB data
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/climate-dashboard"

# Restore from backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/climate-dashboard" dump/
```

---

## Post-Deployment Checklist

- [ ] Test API endpoints are working
- [ ] Data is loading correctly
- [ ] Visualizations render properly
- [ ] File upload functionality works
- [ ] Export features function correctly
- [ ] No console errors in browser
- [ ] Performance is acceptable
- [ ] Mobile responsiveness works
- [ ] SSL certificate is valid
- [ ] Analytics are enabled

## Monitoring & Maintenance

### Log Monitoring
```bash
# View live logs
vercel logs [PROJECT_NAME]

# Filter by service
vercel logs [PROJECT_NAME] --follow
```

### Performance Monitoring
- Set up Sentry for error tracking
- Use Datadog for performance metrics
- Monitor with New Relic APM

### Regular Backups
- Weekly backup of MongoDB data
- Keep deployment history (Vercel keeps 100 recent)
- Test restore procedures monthly

### Updates
- Keep Node.js updated (minor versions)
- Update npm packages: `npm update`
- Monitor security advisories: `npm audit`

---

## Troubleshooting Deployment

### Build Fails on "npm run build"
```bash
# Local solution
npm ci  # Clear install
npm run build

# Remote: Check Node version matches locally
# May need: npm install --legacy-peer-deps
```

### API Connection Fails
- Verify `REACT_APP_API_URL` matches deployment URL
- Check CORS configuration in server/index.js
- Verify backend is running on port 5000

### Static Assets Missing
- Ensure `dist/` folder is deployed
- Check build output directory in `vercel.json`
- Verify `.gitignore` isn't excluding necessary files

### Database Connection Issues
- Test MONGO_URI locally first
- Check MongoDB Atlas network whitelist
- Verify credentials are correct
- Use MongoDB connection checker tool

### High Memory Usage
- Check for memory leaks in logs
- Consider splitting backend to separate dyno
- Monitor API response times

---

## Cost Estimation

### Vercel
- Free: ≤100 serverless function invocations/day
- Pro: $20/month (unlimited)
- Enterprise: Custom pricing

### MongoDB Atlas
- Free: 512 MB storage
- Paid: $57-$405/month

### Total Estimated Cost
- Free tier: $0/month
- Small production: ~$20/month (Vercel Pro + MongoDB)
- Large production: $100-500/month

---

## CI/CD Pipeline

### Auto-Deploy on Push

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

Get tokens from Vercel dashboard and add to GitHub Secrets.

---

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- React Deployment: https://create-react-app.dev/deployment
- Express.js Deployment: https://expressjs.com/en/advanced/best-practice-performance.html
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Need help?** Check the main README.md or open an issue on GitHub.
