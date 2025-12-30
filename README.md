# BeyondChats Articles Viewer

A full-stack application to scrape, store, and view articles from the BeyondChats blog.

## Project Structure

This repository is organized into three main components:

-   **`frontend/`**: The React application for viewing articles.
-   **`backend/`**: The Express.js API server.
-   **`scraper/`**: A standalone Puppeteer script to fetch articles.

## Prerequisites

-   Node.js (v14+)
-   MongoDB (Running locally or a cloud URI)

## Installation & Setup

### 1. Backend Setup

The backend serves the API at `http://localhost:5000`.

```bash
cd backend
npm install
```

Create a `.env` file in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/beyondchats_articles
```

### 2. Scraper Setup

The scraper fetches articles and saves them to the database.

```bash
cd scraper
npm install
```

Create a `.env` file in `scraper/.env`:
```env
MONGO_URI=mongodb://localhost:27017/beyondchats_articles
```

### 3. Frontend Setup

The user interface.

```bash
cd frontend
npm install
```

## Running the Project

You will typically need three terminal instances running.

### 1. Start the Scraper (To fetch data)
Run this whenever you want to update the latest articles.
```bash
cd scraper
npm start
```
*   It fetches the latest 5 articles and saves them to MongoDB.

### 2. Start the Backend API
```bash
cd backend
npm run dev
```
*   Server runs on `http://localhost:5000`

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```
*   Open your browser at the URL provided (usually `http://localhost:5173`)

## Features
-   **Automated Scraping**: Puppeteer script fetches content directly from the source.
-   **Duplicate Prevention**: Scraper checks for existing URLs before saving.
-   **Decoupled Architecture**: Scraper and Backend are separate, keeping the production API lightweight.
