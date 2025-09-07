# 🚀 Vercel Deployment Guide

## Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings > Database
4. Copy the Connection String (URI) - this is your `DATABASE_URL`
5. Go to Settings > API
6. Copy Project URL - this is your `NEXT_PUBLIC_SUPABASE_URL`
7. Copy anon/public key - this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Update .env.local

Replace these values in your `.env.local` file:

```env
# Replace with your actual Supabase database URL
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# This JWT secret is already generated and secure
JWT_SECRET="e67ba56eecfff9f15c48a81a42d55f224a4570282e1e282d9ffae933eb6cb4dd"

# Replace with your actual Supabase project values
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
```

## Step 3: Deploy to Vercel

### Option A: Deploy with Vercel CLI

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. Add environment variables when prompted or in Vercel dashboard

### Option B: Deploy with GitHub (Recommended)

1. **Push to GitHub:**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**

   - In Vercel dashboard, go to Settings > Environment Variables
   - Add each variable from your `.env.local`:
     - `DATABASE_URL`
     - `DIRECT_URL`
     - `JWT_SECRET`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically

## Step 4: Run Database Migrations

After deployment, run Prisma migrations:

```bash
# On your local machine
npx prisma db push
npx prisma db seed
```

## Step 5: Test Your Deployment

Your app will be available at: `https://your-project-name.vercel.app`

## 🔧 Troubleshooting

- **Build fails:** Check environment variables are set correctly
- **Database connection fails:** Verify DATABASE_URL format
- **API routes don't work:** Ensure all environment variables are added in Vercel
- **Images don't load:** Check image paths and Vercel configuration

## 📱 Features That Will Work on Vercel

✅ All API routes (auth, cart, products)
✅ Database operations (Prisma + Supabase)
✅ Authentication (JWT)
✅ Dynamic pages
✅ Static pages
✅ Image optimization
✅ Automatic deployments on git push

## 🎯 Your App URL

Once deployed, your e-commerce app will be live and fully functional!
