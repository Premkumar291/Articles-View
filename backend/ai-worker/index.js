import axios from 'axios';
import dotenv from 'dotenv';
import { searchGoogle } from './src/services/googleSearchService.js';
import { scrapePageContent } from './src/services/pageScraperService.js';
import { rewriteArticle } from './src/services/llmService.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

if (!process.env.API_URL) {
    console.warn('API_URL is not defined in environment variables. Defaulting to http://localhost:5000/articles');
}
let API_URL = process.env.API_URL || 'http://localhost:5000/articles';
if (!API_URL.startsWith('http')) {
    API_URL = `https://${API_URL}/articles`;
}

const runAIUpdate = async () => {
    try {
        console.log('--- Starting AI Article Updater ---');

        // 1. Fetch articles from Backend
        console.log('Fetching articles from backend...');
        const response = await axios.get(API_URL);
        const articles = response.data.data;

        // Filter for not-yet-updated articles
        const pendingArticles = articles.filter(a => !a.isUpdatedVersion);
        console.log(`Found ${pendingArticles.length} articles pending update.`);

        if (pendingArticles.length === 0) {
            console.log('No articles to update.');
            process.exit(0);
        }

        // Process one at a time to be polite
        for (const article of pendingArticles) {
            console.log(`\nProcessing: "${article.title}"`);

            // 2. Search Google
            const referenceLinks = await searchGoogle(article.title);
            console.log(`Found references: ${referenceLinks.join(', ')}`);

            // 3. Scrape Reference Content
            const referenceContents = [];
            for (const link of referenceLinks) {
                const content = await scrapePageContent(link);
                if (content) referenceContents.push(content);
            }

            // 4. Rewrite with LLM
            const enhancedContent = await rewriteArticle(article, referenceContents);

            // 5. Publish Update
            if (enhancedContent && enhancedContent !== article.content) {
                const newArticleData = {
                    title: article.title, // Keep title or let AI improve it? Keeping for now.
                    content: enhancedContent,
                    sourceUrl: article.sourceUrl, // Keeping original source
                    isUpdatedVersion: true,
                    references: referenceLinks
                };


                newArticleData.sourceUrl = article.sourceUrl + '-V2';

                try {
                    await axios.post(API_URL, newArticleData);
                    console.log(`SUCCESS: Published updated version for "${article.title}"`);
                } catch (postError) {
                    console.error('Failed to post updated article:', postError.response?.data || postError.message);
                }
            } else {
                console.log('Skipping save: Content unchanged or generation failed.');
            }

            // Wait a bit to avoid rate limits
            await new Promise(r => setTimeout(r, 2000));
        }

        console.log('\n--- AI Update Job Completed ---');
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error:', error.message);
        process.exit(1);
    }
};

runAIUpdate();
