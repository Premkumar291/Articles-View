import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import { scrapeBeyondChats } from '../src/services/scraperService.js';
import Article from '../src/models/Article.js';
import dotenv from 'dotenv';
import process from 'process';

// Load env
dotenv.config()

const run = async () => {
    await connectDB();

    try {
        console.log('Starting scraper...');
        const articles = await scrapeBeyondChats();
        console.log(`Scraped ${articles.length} articles.`);

        for (const articleData of articles) {
            // Check for duplicate sourceUrl
            const exists = await Article.findOne({ sourceUrl: articleData.sourceUrl });
            if (exists) {
                console.log(`Article already exists (skipped): ${articleData.title}`);
                continue;
            }

            await Article.create(articleData);
            console.log(`Saved article: ${articleData.title}`);
        }

        console.log('Scraping and saving completed.');
        process.exit(0);
    } catch (error) {
        console.error('Error running script:', error);
        process.exit(1);
    }
};

run();
