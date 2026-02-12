# Vercel Deployment Guide

This guide details how to deploy your Next.js application to Vercel using Git.

## Prerequisites

1.  **Git Repository**: Your code must be pushed to a Git provider (GitHub, GitLab, or Bitbucket).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
3.  **MongoDB Atlas**: You need a cloud-hosted MongoDB database (e.g., MongoDB Atlas).

## Step 1: Push to Git

Ensure your latest code is committed and pushed to your repository.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Import Project in Vercel

1.  Log in to your Vercel Dashboard.
2.  Click **Add New...** -> **Project**.
3.  Connect your Git provider account if you haven't already.
4.  Find your `namma-elampillai` repository and click **Import**.

## Step 3: Configure Project

1.  **Framework Preset**: Next.js (should be auto-detected).
2.  **Root Directory**: `./` (default).
3.  **Build and Output Settings**: Default (Build Command: `next build`).
4.  **Environment Variables**:
    *   Expand the **Environment Variables** section.
    *   Add the following variables (copy values from your `.env.local` or your production secrets):
        *   `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`).
        *   `NEXTAUTH_SECRET`: A long random string for authentication security.
        *   `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://namma-elampillai.vercel.app`) - *Note: Vercel automatically sets `VERCEL_URL`, but setting this explicitly ensures consistency.*
        *   `GMAIL_USER`: Your email for notifications.
        *   `GMAIL_APP_PASSWORD`: Your app password.

## Step 4: Deploy

1.  Click **Deploy**.
2.  Vercel will build your application and assign a domain.
3.  Once complete, you will see a "Congratulations!" screen with your live dashboard.

## Step 5: Post-Deployment

1.  **Verify Database**: Ensure the application can connect to MongoDB Atlas.
2.  **Test Auth**: Try logging in/out to verify `NEXTAUTH_SECRET` and cookie settings.
3.  **Custom Domain** (Optional): Go to **Settings** -> **Domains** in Vercel to add your own domain (e.g., `nammaelampillai.com`).

## Troubleshooting

-   **Build Failures**: Check the "Build Logs" in Vercel deployment details.
-   **Runtime Errors**: Check the "Runtime Logs" (Functions tab) in Vercel.
