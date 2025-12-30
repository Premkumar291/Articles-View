import puppeteer from 'puppeteer';

export const scrapePageContent = async (url) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        console.log(`Scraping content from: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const content = await page.evaluate(() => {
            // Attempt to find the main content container
            const selectors = [
                'article',
                'main',
                '.post-content',
                '.entry-content',
                '#content',
                '.article-body',
            ];

            let container;
            for (const selector of selectors) {
                container = document.querySelector(selector);
                if (container) break;
            }

            // Fallback to body if no container found, but try to exclude common clutter
            const elementToScrape = container || document.body;

            // Helper to clean text
            return elementToScrape.innerText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 50) // Filter out short nav items/ads
                .join('\n');
        });

        await browser.close();
        return content.slice(0, 5000); // Limit context size for LLM

    } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.message);
        await browser.close();
        return '';
    }
};
