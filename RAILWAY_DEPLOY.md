# Railway Deployment Guide

## Steps to Deploy Backend on Railway:

1. **Create a Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account and select your repository

3. **Add Volume Storage**
   - In your Railway project dashboard, go to your service
   - Click on "Variables" tab
   - Add this variable:
     - `UPLOAD_FOLDER=/app/uploads`
   - Go to "Settings" tab
   - Scroll to "Volumes"
   - Click "Add Volume"
   - Mount path: `/app/uploads`

4. **Environment Variables**
   Railway will automatically set the `PORT` variable. Your app is configured to use it.

5. **Deploy**
   - Railway will automatically deploy your app
   - Wait for the build to complete
   - Once deployed, you'll get a public URL (e.g., `https://your-app.railway.app`)

6. **Get Your Backend URL**
   - Copy the public URL from Railway dashboard
   - Update `frontend/script.js` with this URL (replace `https://your-backend-url.railway.app`)

## Important Notes:
- Railway volumes persist data across deployments
- Free tier has limited resources and volume storage
- Monitor your usage in the Railway dashboard