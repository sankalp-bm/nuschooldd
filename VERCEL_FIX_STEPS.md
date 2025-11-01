# Fix Vercel Deployment - Complete Steps

## Problem Identified:
1. ✅ Your code is correct and pushed to: `sankalp-bm/nuschooldd` (branch: `master`)
2. ❌ Vercel is connected to: `sankalp-bm/nuschooldd1` (different repo!)
3. ❌ Vercel is watching `main` branch, but your repo uses `master`

## Solution: Fix Vercel Project Settings

### Option A: Update Existing Vercel Project (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project: `nuschooldd1`

2. **Open Project Settings**
   - Click on the project `nuschooldd1`
   - Click "Settings" tab (top navigation)
   - Click "Git" in the left sidebar

3. **Change Repository**
   - Click "Disconnect" next to the current repository
   - Click "Connect Git Repository"
   - Select: `sankalp-bm/nuschooldd` (NOT nuschooldd1)
   - Click "Connect"

4. **Fix Branch Settings**
   - Scroll to "Production Branch"
   - Change from `main` to `master`
   - Click "Save"

5. **Configure Build Settings** (if needed)
   - Go to "General" → "Build & Development Settings"
   - Ensure:
     - Framework Preset: `Vite`
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

6. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add these variables for Production, Preview, and Development:
     ```
     VITE_SUPABASE_URL = (your Supabase URL)
     VITE_SUPABASE_ANON_KEY = (your Supabase anon key)
     ```
   - Click "Save" for each

7. **Trigger Manual Deployment**
   - Go to "Deployments" tab
   - Find the latest deployment (or click "Redeploy" on any deployment)
   - Click the three dots (⋯) → "Redeploy"
   - OR better: Push a new commit to trigger auto-deploy

### Option B: Create New Vercel Project (If Option A Doesn't Work)

1. **Create New Project**
   - Click "Add New..." → "Project"
   - Search for: `sankalp-bm/nuschooldd`
   - Click "Import"

2. **Configure Project**
   - Framework: `Vite` (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Production Branch**
   - Production Branch: Select `master` (NOT main)

4. **Add Environment Variables**
   - Before deploying, click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL = (your Supabase URL)
     VITE_SUPABASE_ANON_KEY = (your Supabase anon key)
     ```
   - Select: Production, Preview, Development

5. **Deploy**
   - Click "Deploy"
   - Wait for build (~1-2 minutes)

## Verify Deployment

1. **Check Build Logs**
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Check "Build Logs" to ensure no errors

2. **Test the Live Site**
   - Click "Visit" button or go to the provided URL
   - Verify the updated UI is showing

3. **Force a New Deployment** (if needed)
   ```bash
   # Make a small change to trigger deployment
   echo "# Force deploy" >> README.md
   git add README.md
   git commit -m "chore: trigger Vercel deployment"
   git push origin master
   ```

## Important Notes:

- ✅ Your code is already pushed to GitHub correctly
- ✅ Branch `master` has all latest changes
- ⚠️ Vercel just needs to be connected to the RIGHT repository and branch

## Quick Checklist:

- [ ] Vercel project connected to `sankalp-bm/nuschooldd` (not nuschooldd1)
- [ ] Production branch set to `master` (not main)
- [ ] Environment variables added (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Build settings correct (Vite, dist output)
- [ ] Manual redeploy triggered OR new commit pushed
- [ ] Live site shows updated UI

## Still Not Working?

If after following these steps it still doesn't work:

1. **Check Vercel Project Activity Log**
   - Settings → Activity Log
   - See if deployments are being triggered

2. **Verify GitHub Integration**
   - Settings → Git → Connected Repository
   - Should show: `sankalp-bm/nuschooldd`

3. **Check Deployment History**
   - Deployments tab
   - See when last deployment happened
   - Click on deployment to see build logs

4. **Clear Cache (if needed)**
   - Settings → General → Clear Build Cache
   - Then trigger new deployment

