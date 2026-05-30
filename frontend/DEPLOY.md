# Vercel Deployment Instructions

## Deploying Frontend to Vercel

### Step 1: Prepare Repository
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend deployment"
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (or upload the `frontend` folder)
4. Set root directory to `frontend`

### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:
- No special variables needed - the backend URL is hardcoded in `app.js`

### Step 4: Deploy
Click "Deploy" and Vercel will build and host your frontend.

Your frontend URL will be something like:
```
https://annester-portfolio.vercel.app
```

## Configuration

### Backend URL
The frontend is configured to use:
```javascript
const apiBase = 'https://annester.onrender.com';
```

If you change your backend URL on Render, update `frontend/js/app.js` with the new URL.

## Deployment Complete
- **Frontend:** https://annester-portfolio.vercel.app
- **Backend/Admin:** https://annester.onrender.com
- **API Base:** https://annester.onrender.com/api/*

The portfolio will automatically fetch data from your deployed backend!
