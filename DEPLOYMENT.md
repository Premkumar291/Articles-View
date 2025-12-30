# Deployment Guide for Render

This project is configured to be easily deployed on [Render](https://render.com/) using the `render.yaml` Blueprint.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
2.  **MongoDB Atlas**: You need a cloud-hosted MongoDB database.
    *   Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas).
    *   Create a Cluster (Shared Tier M0 is free).
    *   Get the Connection String (URI). It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/beyondchats_articles?retryWrites=true&w=majority`
3.  **Groq API Key**: You need your API key from [Groq Console](https://console.groq.com/).

## Steps to Deploy

### 1. Simple Blueprint Deployment

1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will detect the `render.yaml` file and show you the resources it will create:
    *   `articles-viewer-backend` (Web Service)
    *   `articles-viewer-frontend` (Static Site)
    *   `articles-viewer-ai-worker` (Cron Job)
5.  **Important**: You must verify/fill in the Environment Variables that are marked as "Sync: false":
    *   **MONGO_URI**: Paste your MongoDB Atlas connection string (used by Backend and Worker).
    *   **GROQ_API_KEY**: Paste your Groq API Key (used by Backend and Worker).
6.  Click **Apply**.

Render will now:
1.  Deploy the Backend API.
2.  Deploy the Frontend (and automatically inject the correct backend URL via `VITE_API_BASE_URL`).
3.  Schedule the AI Worker to run every hour.

### 2. Manual Deployment (Alternative)

If you prefer to deploy services manually:

**Backend (Web Service)**
*   **Root Directory**: `backend`
*   **Build Command**: `npm install`
*   **Start Command**: `npm run server`
*   **Environment Variables**: `MONGO_URI`, `GROQ_API_KEY`

**Frontend (Static Site)**
*   **Root Directory**: `frontend`
*   **Build Command**: `npm install && npm run build`
*   **Publish Directory**: `dist`
*   **Environment Variables**: `VITE_API_BASE_URL` (Set this to your deployed Backend URL).

**AI Worker (Cron Job)**
*   **Root Directory**: `backend/ai-worker`
*   **Build Command**: `npm install`
*   **Start Command**: `npm start`
*   **Environment Variables**: `MONGO_URI`, `GROQ_API_KEY`, `API_URL` (Set to Backend URL).

## Troubleshooting

*   **Database Connection Failures**: Check your `MONGO_URI`. Ensure your MongoDB Atlas Network Access whitelist allows "Allow Access from Anywhere" (0.0.0.0/0) since Render IPs change, or lookup how to static IP on Render (paid feature).
*   **CORS Issues**: If the frontend cannot talk to the backend, check the browser console. The backend uses `cors()` which allows all origins by default, which is fine for this demo. For production, you might want to restrict it to your frontend domain in `backend/src/server.js`.
