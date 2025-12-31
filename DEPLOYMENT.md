# Deployment Guide

This project is configured for a split deployment strategy:
- **Backend**: Hosted on [Render](https://render.com/) (Web Service)
- **Frontend**: Hosted on [Vercel](https://vercel.com/) (Static Site)

## Prerequisites

1.  **GitHub Repository**: Push your code to GitHub.
2.  **MongoDB Atlas**: Get your connection string.
3.  **Groq API Key**: Get your API key from Groq Console.

---

## Part 1: Deploy Backend on Render

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Configure the service:
    *   **Name**: `articles-viewer-backend`
    *   **Root Directory**: `backend`
    *   **Runtime**: Node
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm run server`
5.  **Environment Variables**:
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `GROQ_API_KEY`: Your Groq API key.
    *   `PORT`: `5000` (Optional, Render sets `PORT` automatically).
6.  Click **Create Web Service**.
7.  **Copy your Backend URL** (e.g., `https://articles-viewer-backend.onrender.com`) once deployed.

### AI Worker (Optional)
The backend includes an AI worker. You have two options:
1.  **Manual Trigger**: The backend has an endpoint `POST /trigger-ai-update` that you can call manually or via a cron job service to trigger the worker.
2.  **Render Cron Job**: Create a new "Cron Job" on Render pointing to the same repo, Root Directory `backend`, Command `npm run worker`.

---

## Part 2: Deploy Frontend on Vercel

1.  Log in to [Vercel Dashboard](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  Configure the project:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Edit and select `frontend`.
5.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: Paste your **Render Backend URL** (e.g., `https://articles-viewer-backend.onrender.com`).
6.  Click **Deploy**.

---

## Troubleshooting

*   **CORS Issues**: If the frontend fails to fetch data, check the browser console. The backend is configured to allow all origins (`cors()`). Ensure your `VITE_API_BASE_URL` in Vercel is correct and has no trailing slash if your code appends `/`.
*   **Database**: Ensure MongoDB Atlas allows access from all IPs (`0.0.0.0/0`) as Render IPs change.
