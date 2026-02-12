# Deployment Guide

## Frontend Deployment (Vercel)

1. **Connect to Vercel:**
   - Go to https://vercel.com/import
   - Import your GitHub repository: `https://github.com/Yash10yash/Quick-Ai`
   - Select the `client` directory as the root

2. **Environment Variables:**
   - In Vercel Project Settings → Environment Variables, add:
     - `VITE_API_URL`: Your Render backend URL (e.g., `https://quickai-api.onrender.com`)

3. **Deploy:**
   - Vercel will automatically build and deploy on every push to `master`

---

## Backend Deployment (Render)

1. **Create a Render Account:**
   - Go to https://render.com
   - Sign in with GitHub

2. **Deploy with render.yaml:**
   - Go to https://dashboard.render.com/select-repo
   - Select your Quick-Ai repository
   - Render will automatically detect `server/render.yaml`

3. **Set Environment Variables in Render Dashboard:**
   Add these in your Render service settings:
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `CLOUDINARY_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your Neon database connection string

4. **Deploy:**
   - Render will automatically build and deploy on every push

---

## Update Frontend API URL

After your backend is deployed on Render, update your frontend to use the correct API endpoint:

1. Add your Render backend URL to Vercel environment variables
2. Update your React code to use `process.env.VITE_API_URL` for API calls

Example:
```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';
const response = await axios.get(`${API_URL}/api/endpoint`);
```

---

## Monitoring Deployments

- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com

Both services provide logs and deployment history for debugging.
