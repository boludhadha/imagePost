# Vercel Deployment Guide

## Steps to Deploy Frontend on Vercel:

1. **Create a Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Update Backend URL**
   - First, get your Railway backend URL (from Railway deployment)
   - Open `frontend/script.js`
   - Replace `const API_URL = 'https://your-backend-url.railway.app';` with your actual Railway URL

3. **Deploy to Vercel**

   **Option A: Using Vercel Dashboard (Recommended)**
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Root Directory**: Set to `frontend`
     - **Framework Preset**: Other
     - **Build Command**: Leave empty (it's static HTML)
     - **Output Directory**: Leave as `.` (current directory)
   - Click "Deploy"

   **Option B: Using Vercel CLI**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```

4. **Access Your Site**
   - After deployment, Vercel will provide a URL (e.g., `https://your-app.vercel.app`)
   - Your image hosting service is now live!

## Testing:
1. Visit your Vercel URL
2. Upload an image
3. Copy the returned URL
4. Share it anywhere - the image will be publicly accessible

## Important Notes:
- Make sure the backend URL in `script.js` is updated before deploying
- Vercel automatically redeploys when you push to GitHub
- Free tier includes generous bandwidth and hosting