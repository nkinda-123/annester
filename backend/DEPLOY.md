# Render Deployment Instructions

## Deploying Backend to Render

### Step 1: Prepare Repository
```bash
cd backend
git init
git add .
git commit -m "Initial backend deployment"
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or upload manually)
4. Select the `backend` folder as the root directory

### Step 3: Configure Service
- **Name:** annester-portfolio-backend
- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free (or select paid for always-on)

### Step 4: Deploy
Click "Create Web Service" and Render will deploy your backend.

Your backend URL will be something like:
```
https://annester-portfolio-backend.onrender.com
```

### After Deployment
Update your frontend `app.js` to point to your Render backend:

In `frontend/js/app.js`, change:
```javascript
const apiBase = '';
```
To:
```javascript
const apiBase = 'https://annester-portfolio-backend.onrender.com';
```

Then deploy frontend to Vercel.

## What Gets Deployed
- **Public Folder** → Serves HTML/CSS/JS files
- **API Endpoints** → `/api/profile`, `/api/projects`, `/api/skills`, `/api/qualifications`
- **Admin Panel** → Accessible at root URL `/` or `/index.html`

When you visit your Render URL, the admin panel loads automatically!
