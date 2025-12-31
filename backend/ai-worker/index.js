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
        console.log('Starting AI Article Updater...');

        const response = await axios.get(API_URL);
        const articles = response.data.data;
        const pendingArticles = articles.filter(a => !a.isUpdatedVersion);

        if (pendingArticles.length === 0) {
            console.log('No articles pending update.');
            process.exit(0);
        }

        console.log(`Found ${pendingArticles.length} articles to process.`);

        for (const article of pendingArticles) {
            try {
                const referenceLinks = await searchGoogle(article.title);

                const referenceContents = [];
                for (const link of referenceLinks) {
                    const content = await scrapePageContent(link);
                    if (content) referenceContents.push(content);
                }

                const enhancedContent = await rewriteArticle(article, referenceContents);

                if (enhancedContent && enhancedContent !== article.content) {
                    const newArticleData = {
                        title: article.title,
                        content: enhancedContent,
                        sourceUrl: `${article.sourceUrl}-V2`,
                        isUpdatedVersion: true,
                        references: referenceLinks
                    };

                    await axios.post(API_URL, newArticleData);
                    console.log(`Updated: "${article.title}"`);
                }
            } catch (err) {
                console.error(`Failed to process "${article.title}":`, err.message);
            }

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('Update job completed.');
        process.exit(0);
    } catch (error) {
        console.error('Job failed:', error.message);
        process.exit(1);
    }
};

runAIUpdate();
