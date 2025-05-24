const puppeteer = require('puppeteer');

async function scrapeEbayProducts(searchQuery, maxPages = 3) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    let allProducts = new Map();
    let currentPage = 1;

    while (currentPage <= maxPages) {
        const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}&_pgn=${currentPage}`;
        console.log(`Scraping page ${currentPage}: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await page.waitForSelector('.s-item__wrapper', { timeout: 5000 });

            const productLinks = await page.$$eval('.s-item__wrapper .s-item__link', links =>
                links.map(link => link.href).filter((v, i, a) => a.indexOf(v) === i)
            );

            for (const link of productLinks) {
                if (allProducts.has(link)) continue;

                const data = await scrapeProductDetail(page, link);
                if (data) {
                    allProducts.set(link, data);
                }
            }

            const hasNext = await page.$eval('.pagination__next', el => !el.disabled).catch(() => false);
            if (!hasNext) break;

            currentPage++;
        } catch (err) {
            console.warn(`Failed scraping page ${currentPage}: ${err.message}`);
            break;
        }
    }

    await browser.close();

    return {
        status: 'success',
        count: allProducts.size,
        products: Array.from(allProducts.values())
    };
}

async function scrapeProductDetail(page, productUrl) {
    try {
        await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForSelector('#mainContent', { timeout: 5000 });

        return await page.evaluate((url) => {
            const clean = text => text?.trim().replace(/\s+/g, ' ') || '-';

            const getFirst = (selectors) => {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.textContent?.trim()) return clean(el.textContent);
                }
                return '-';
            };

            const getImage = (selectors) => {
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el?.src) return el.src;
                }
                return '-';
            };

            return {
                name: getFirst(['h1.x-item-title__mainTitle span', 'h1.product-title', 'h1.item-title']),
                price: getFirst(['div.x-price-primary span', 'span.ux-textspans', 'span.item-price']).replace(/[^\d.,]/g, ''),
                description: getFirst(['div.d-item-description', 'div.item-description', 'div.product-description']),
                imageUrl: getImage(['div.ux-image-carousel-item img', 'div.image img', 'img.img.img300']),
                productUrl: url
            };
        }, productUrl);
    } catch (err) {
        console.warn(`Detail error @ ${productUrl}: ${err.message}`);
        return null;
    }
}

// Example usage
(async () => {
    const result = await scrapeEbayProducts('nike', 1);
    console.log(JSON.stringify(result, null, 2));
})();
