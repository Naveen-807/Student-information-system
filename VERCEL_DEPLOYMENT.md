# Vercel Deployment Guide

## Prerequisites

1. GitHub account with your repository
2. Vercel account (sign up at https://vercel.com)
3. PostgreSQL database (use a cloud provider like Neon, Supabase, or Railway)

## Step 1: Set Up Cloud Database

### Option A: Neon (Recommended - Free Tier Available)

1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@host/database`)

### Option B: Supabase

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string

### Option C: Railway

1. Go to https://railway.app
2. Create a new project
3. Add PostgreSQL database
4. Copy the connection details

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `https://github.com/Naveen-807/Student-information-system`
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: project root (leave default)
   - Build and output are controlled by `vercel.json`

4. Add Environment Variables:

Click on "Environment Variables" and add:

```
# Database Configuration (recommended)
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d

# API Configuration
NODE_ENV=production

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Optional: keep empty to use same-origin /api from frontend
# VITE_API_URL=/api
```

5. Click "Deploy"

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

## Step 3: Run Database Migrations

After deployment, you need to run migrations on your cloud database:

### Option A: Using Vercel CLI

```bash
# Set environment variables locally
export DB_HOST=your-database-host
export DB_PORT=5432
export DB_NAME=your-database-name
export DB_USER=your-database-user
export DB_PASSWORD=your-database-password

# Run migrations
cd backend
npm run migrate
npm run seed
```

### Option B: Using Database Client

1. Connect to your database using a client (TablePlus, DBeaver, pgAdmin)
2. Run the SQL from `backend/src/config/migrate.js` manually
3. Run the seed script or create users manually

## Step 4: Routing Verification

This project uses:
- `api/[...all].js` for backend serverless routing
- `vercel.json` rewrites to send `/api/*` to backend and all other paths to SPA `index.html`

No additional frontend URL rewrite is needed when using `/api`.

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Try logging in with demo accounts:
   - Admin: admin@university.edu / Admin@123
   - Teacher: teacher@university.edu / Teacher@123
   - Student: student@university.edu / Student@123

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Check that your database allows connections from Vercel IPs
2. Verify your connection string is correct
3. Make sure SSL is enabled if required by your database provider

Add to your database connection in `backend/src/config/database.js`:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### CORS Issues

If you get CORS errors:

1. Make sure `FRONTEND_URL` environment variable is set correctly
2. Check that your backend CORS configuration includes your Vercel domain

### Build Failures

If the build fails:

1. Check the build logs in Vercel dashboard
2. Make sure all dependencies are in `package.json`
3. Verify that your build command is correct

## Alternative: Split Deployment

If you prefer to deploy frontend and backend separately:

### Frontend Only on Vercel

1. Deploy only the `frontend` directory
2. Point `VITE_API_URL` to your separate backend URL (Railway, Render, etc.)

### Backend on Railway/Render

1. Deploy backend to Railway or Render
2. Add PostgreSQL database
3. Set environment variables
4. Update frontend `VITE_API_URL` to backend URL

## Production Checklist

- [ ] Database is set up and accessible
- [ ] All environment variables are configured
- [ ] Migrations have been run
- [ ] Seed data has been added
- [ ] CORS is configured correctly
- [ ] JWT secret is strong and secure
- [ ] SSL/HTTPS is enabled
- [ ] Demo accounts are working
- [ ] All features are tested

## Monitoring

After deployment:

1. Monitor your Vercel dashboard for errors
2. Check database connection limits
3. Monitor API response times
4. Set up error tracking (Sentry, LogRocket)

## Cost Considerations

- Vercel: Free tier includes 100GB bandwidth
- Neon: Free tier includes 3GB storage
- Supabase: Free tier includes 500MB database
- Railway: $5/month for hobby plan

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check database logs
3. Review browser console for frontend errors
4. Check Network tab for API call failures

## Updating Your Deployment

To update your deployed app:

```bash
# Push changes to GitHub
git add .
git commit -m "Update message"
git push origin main

# Vercel will automatically redeploy
```

Or manually trigger a redeploy from Vercel dashboard.
