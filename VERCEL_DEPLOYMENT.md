# Vercel Deployment Guide for NU School

## ✅ Pre-Deployment Checklist

All code changes have been committed and pushed to GitHub:
- Repository: `https://github.com/sankalp-bm/nuschooldd.git`
- Branch: `master`

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your repository: `sankalp-bm/nuschooldd`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
   ⚠️ **Important**: Replace with your actual Supabase credentials

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~1-2 minutes)

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow prompts to link project
   - Add environment variables when prompted:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Production Deploy**:
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Configuration

### 1. Verify Environment Variables
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Ensure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set for:
  - Production
  - Preview
  - Development

### 2. Check Deployment URL
- After deployment, Vercel provides a URL like: `https://nuschooldd-xxx.vercel.app`
- Test the application to ensure it loads correctly

### 3. Automatic Deployments
- **Push to `master` branch** → Auto-deploys to production
- **Pull requests** → Auto-creates preview deployments
- No action needed - this is automatic!

## 🌐 Adding Custom Domain (Next Step)

After deployment is successful:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS configuration instructions that Vercel provides
5. Update DNS records at your domain registrar

## ⚠️ Common Issues & Solutions

### Build Fails
- **Check**: Environment variables are set correctly
- **Check**: Build logs in Vercel dashboard for specific errors
- **Solution**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

### App Works Locally but Not on Vercel
- **Check**: Environment variables are added in Vercel dashboard
- **Check**: Supabase RLS policies allow public read access
- **Solution**: Redeploy after fixing environment variables

### Iframe Content Not Loading
- **Check**: CORS settings on your Lovable pages
- **Check**: iframe `src` URLs are correct and publicly accessible
- **Solution**: Ensure external links are HTTPS and allow embedding

## 📝 Notes

- Vercel automatically detects Vite and configures build settings
- Builds are cached for faster subsequent deployments
- Preview deployments are created for every pull request
- Production deployments are created on push to `master` branch

## 🎉 You're All Set!

Once deployed, your app will be live at the Vercel-provided URL. Share it and test all features!

