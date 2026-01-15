# Vercel Deployment Instructions for TELsTP Radio Documentary

Follow these steps to deploy the application to Vercel and connect it to your Supabase database.

## 1. Prerequisites
- A GitHub account with the project repository pushed.
- A Vercel account linked to your GitHub.
- A Supabase project with a PostgreSQL database.

## 2. Environment Variables
In your Vercel Project Settings (Environment Variables), add the following:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase connection string |
| `SESSION_SECRET` | A long, random string for secure sessions |
| `MISTRAL_API_KEY` | Your Mistral AI API key |
| `DEEPGRAM_API_KEY` | Your Deepgram API key |
| `NODE_ENV` | `production` |

## 3. Database Migration
Before the app can run on Vercel, the database schema must be pushed to Supabase.
In your Replit shell, run:
```bash
SUPABASE_DATABASE_URL="your_supabase_connection_string" npm run db:push
```

## 4. Vercel Configuration
The project already includes a `vercel.json` file which handles:
- Routing `/api` requests to the Express backend.
- Serving the frontend from the `dist/public` directory.
- Building the frontend during deployment.

## 5. Deployment Steps
1. Push your code to a new GitHub repository.
2. In Vercel, click "Add New" -> "Project".
3. Import your GitHub repository.
4. Add the environment variables listed in Step 2.
5. Click "Deploy".

## 7. Supabase Database Schema
The file `SUPABASE_SCHEMA.sql` has been generated for you. 
1. Go to your Supabase Dashboard.
2. Open the **SQL Editor**.
3. Create a **New Query**.
4. Paste the contents of `SUPABASE_SCHEMA.sql` and run it to set up your tables.

## 8. GitHub Push Instructions
Detailed instructions can be found in `GITHUB_SETUP.md`. In summary:
1. `git init` (if not already done)
2. `git add .`
3. `git commit -m "Initial commit"`
4. `git remote add origin YOUR_REPO_URL`
5. `git push -u origin main`
