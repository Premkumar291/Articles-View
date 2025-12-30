import puppeteer from 'puppeteer';

export const searchGoogle = async (query) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        console.log(`Searching Google for: "${query}"...`);
        // Search query with some exclusions to refine results
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' -site:youtube.com -site:facebook.com -filetype:pdf')}`;

        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        const links = await page.evaluate(() => {
            const results = Array.from(document.querySelectorAll('.g, div[data-header-feature]'));
            const extractedLinks = [];

            for (const result of results) {
                const anchor = result.querySelector('a');
                if (anchor && anchor.href) {
                    const href = anchor.href;
                    // Basic filtering to ensure it's a valid article link
                    if (
                        href.startsWith('http') &&
                        !href.includes('google.com') &&
                        !href.includes('beyondchats.com') // Exclude our own site
                    ) {
                        extractedLinks.push(href);
                    }
                }
            }
            return extractedLinks;
        });

        await browser.close();

        // Return top 2 unique links
        return [...new Set(links)].slice(0, 2);

    } catch (error) {
        console.error('Google search failed:', error);
        await browser.close();
        return [];
    }
};
