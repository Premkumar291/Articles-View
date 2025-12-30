import puppeteer from 'puppeteer';

export const scrapeBeyondChats = async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        console.log('Navigating to BeyondChats blogs...');
        await page.goto('https://beyondchats.com/blogs/', { waitUntil: 'networkidle2' });


        // Removed pagination logic to scrape the main page (latest articles)

        // Scrape articles from the current page
        const articlesData = await page.evaluate(() => {
            const articleElements = Array.from(document.querySelectorAll('article, .post, .blog-post, .card')); // Generic selectors
            // If no article elements found, try finding h2s inside divs
            const elementsToUse = articleElements.length > 0 ? articleElements : Array.from(document.querySelectorAll('.entry-title, h2 a, h3 a')).map(el => el.closest('div') || el.closest('li') || el.parentElement);

            const results = elementsToUse.map(el => {
                const titleEl = el.querySelector('h2, h3, .title, .entry-title');
                const linkEl = el.querySelector('a');

                return {
                    title: titleEl ? titleEl.innerText : (linkEl ? linkEl.innerText : 'No Title'),
                    url: linkEl ? linkEl.href : null,
                };
            });
            return results.filter(r => r.url);
        });

        const latestArticlesSummaries = articlesData.slice(0, 5); // Scrape first 5 (latest)

        console.log(`Found ${latestArticlesSummaries.length} articles to scrape details for.`);

        const detailedArticles = [];

        for (const articleSummary of latestArticlesSummaries) {

            console.log(`Scraping details for: ${articleSummary.title}`);
            try {
                await page.goto(articleSummary.url, { waitUntil: 'domcontentloaded' });

                const articleDetails = await page.evaluate(() => {
                    // Remove header, footer, ads, nav
                    const contentEl = document.querySelector('.entry-content, .post-content, article .content, main');

                    // Crude cleanup
                    if (contentEl) {
                        return contentEl.innerText;
                    }
                    return document.body.innerText; // Fallback
                });

                detailedArticles.push({
                    title: articleSummary.title,
                    content: articleDetails,
                    sourceUrl: articleSummary.url,
                    isUpdatedVersion: false,
                    references: [],
                    createdAt: new Date(),
                });

            } catch (err) {
                console.error(`Failed to scrape ${articleSummary.url}: ${err.message}`);
            }
        }

        await browser.close();
        return detailedArticles;

    } catch (error) {
        console.error('Scraping failed:', error);
        await browser.close();
        throw error;
    }
};
