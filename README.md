# BeyondChats Articles Viewer

A full-stack application that scrapes articles from the BeyondChats blog, enhances them using AI (Groq), and displays them in a modern, dual-view interface.

## 🚀 Features

*   **Automated Scraping**: Fetches articles directly from the BeyondChats blog.
*   **AI Enhancement**: Uses an LLM (Llama 3 via Groq) to rewrite and improve articles by synthesizing information from high-quality external search results (Google).
*   **Dual-View Interface**: Browse "Original" and "AI Enhanced" articles side-by-side using a clean, responsive React UI.
*   **Duplicate Prevention**: Intelligently updates existing records and prevents duplicates.
*   **Modular Architecture**: Separated concerns between the Frontend, Backend API, and the AI Worker service.

## 📂 Project Structure

*   **`frontend/`**: A React + Vite application for viewing the articles.
*   **`backend/`**: The core Express.js API server.
    *   **`ai-worker/`**: A specialized internal service that handles the AI enhancement pipeline (Search -> Scrape References -> Rewrite).
    *   **`scripts/`**: Utility scripts for data seeding.
*   **`scraper/`**: (Legacy) Standalone scraping script.

## 🛠️ Prerequisites

*   **Node.js** (v18+ recommended)
*   **MongoDB** (Running locally or a cloud Atlas URI)
*   **Groq API Key** (For AI features) - Get one at [console.groq.com](https://console.groq.com/)

---

## ⚡ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Beyond-charts-assignment/Articles-Viewer
```

### 2. Backend Setup
The backend serves the API and controls the AI worker.

```bash
cd backend
npm install
```

Create a `.env` file in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/beyondchats_articles
```

### 3. AI Worker Setup
The AI worker needs your Groq API key to enhance articles.

```bash
cd backend/ai-worker
npm install
```

Create a `.env` file in `backend/ai-worker/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
# Optional: defaults to http://localhost:5000/articles
API_URL=http://localhost:5000/articles 
```

### 4. Frontend Setup
The user interface.

```bash
cd ../../frontend
npm install
```

---

## 🏃 Running the Application

You will need three terminal instances (or use the concurrent scripts).

### Step 1: Seed Initial Data
Before the AI can enhance anything, you need to fetch the original articles. We use the backend's seeding script for this.

**In the `backend` directory:**
```bash
node scripts/scrapeBlogs.js
```
*   This will scrape the BeyondChats blog and save the initial "Original" articles to MongoDB.

### Step 2: Start Backend & AI Worker
This command starts the Express API *and* triggers the AI Worker to process any pending articles.

**In the `backend` directory:**
```bash
npm run dev
```
*   **API**: Runs on `http://localhost:5000`
*   **AI Worker**: Will automatically start, find the new articles you just seeded, and begin enhancing them. You will see logs in the terminal as it searches Google and rewrites content.

> **Note**: The AI Worker runs once per startup. If you add more articles later, restart this command or run `npm run worker` manually.

### Step 3: Start Frontend

**In the `frontend` directory:**
```bash
npm run dev
```
*   Open your browser at `http://localhost:5173`
*   You should now see the "Original" articles. As the AI worker completes its jobs, the "AI Enhanced" column will populate with the updated versions.

---

## 🧩 How the AI Pipeline Works

1.  **Fetch**: The worker looks for articles in the DB that haven't been updated (`isUpdatedVersion: false`).
2.  **Search**: It uses Puppeteer to search Google for the article's topic.
3.  **Reference**: It scrapes content from the top 2 relevant search results to use as context.
4.  **Rewrite**: It sends the original content + reference content to Groq (Llama 3) to produce a high-quality, structured rewrite.
5.  **Update**: The new version is saved as a new entry in the database with `isUpdatedVersion: true`.

## 🐛 Troubleshooting

*   **MongoDB Connection Error**: Ensure your MongoDB service is running (`mongod`).
*   **Groq API Error**: Verify your API key is correct in `backend/ai-worker/.env`.
*   **Puppeteer Issues**: If Puppeteer fails to launch, try installing Chrome manually or ensure all OS dependencies are met.
