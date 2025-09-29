# 🚀 Deployment Guide - Cricket Insights

This guide will help you deploy your Cricket Insights application to various platforms.

## 📋 Prerequisites

- GitHub account
- Netlify account (for frontend)
- Railway/Render account (for backend) - Optional
- Node.js 18+ installed locally

## 🌐 Deployment Options

### Option 1: Netlify (Frontend Only) - Recommended for Quick Start

#### Step 1: Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/cricket-insights.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/out`
   - **Node version**: 18
5. Click "Deploy site"

#### Step 3: Configure Environment Variables
In Netlify dashboard:
- Go to Site settings > Environment variables
- Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.herokuapp.com`

### Option 2: Full Stack Deployment

#### Frontend: Netlify
Follow Option 1 steps above.

#### Backend: Railway
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the `backend` folder
4. Railway will auto-detect Node.js and deploy
5. Note the deployed URL for frontend configuration

#### Backend: Render
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Deploy and note the URL

## 🔧 Local Development Setup

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/cricket-insights.git
cd cricket-insights

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Run ETL to process data
cd .. && node etl/import_kaggle.js

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Production Build
```bash
# Build frontend for production
cd frontend && npm run build

# The static files will be in frontend/out/
```

## 📁 Project Structure

```
cricket-insights/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── contexts/           # React contexts
│   ├── out/                # Static export (for deployment)
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   └── package.json
├── etl/                    # Data processing scripts
├── data/                   # Processed JSON data
├── cricket data/           # Raw CSV data
├── netlify.toml           # Netlify configuration
└── README.md
```

## 🌍 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
```

## 🔄 Continuous Deployment

### Netlify
- Automatic deployment on every push to main branch
- Preview deployments for pull requests
- Custom domain support

### Railway/Render
- Automatic deployment on push to main branch
- Environment variable management
- Log monitoring

## 🐛 Troubleshooting

### Build Issues
1. **Node version mismatch**: Ensure Node.js 18+ is used
2. **Memory issues**: Increase build timeout in Netlify
3. **Dependency issues**: Clear cache and reinstall

### Runtime Issues
1. **API not found**: Check environment variables
2. **CORS errors**: Configure backend CORS settings
3. **Data not loading**: Verify ETL script ran successfully

## 📊 Performance Optimization

### Frontend
- Static export for fast loading
- Image optimization disabled for static export
- Code splitting enabled
- Tree shaking for smaller bundles

### Backend
- In-memory data caching
- Efficient CSV parsing
- RESTful API design

## 🔒 Security Considerations

- Environment variables for sensitive data
- CORS configuration for API access
- Input validation on backend
- HTTPS enforcement in production

## 📈 Monitoring

### Netlify
- Build logs and deployment status
- Performance metrics
- Error tracking

### Backend Services
- Application logs
- Performance monitoring
- Uptime monitoring

## 🚀 Going Live Checklist

- [ ] Code pushed to GitHub
- [ ] Frontend deployed to Netlify
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active
- [ ] Performance testing completed
- [ ] Error monitoring set up

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review build logs
3. Verify environment variables
4. Test locally first
5. Check GitHub issues

---

**Happy Deploying! 🎉**
