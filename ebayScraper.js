const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeEbayProducts(searchQuery, maxPages = 3) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        let allProducts = [];
        let currentPage = 1;
        let hasNextPage = true;
        
        while (hasNextPage && currentPage <= maxPages) {
            const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchQuery)}&_pgn=${currentPage}`;
            console.log(`Scraping page ${currentPage}: ${url}`);
            
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
            await page.waitForSelector('.s-item__wrapper', { timeout: 5000 });
            
            // Get all product links on the page
            const productLinks = await page.$$eval('.s-item__wrapper .s-item__link', links => 
                links.map(link => link.href).filter(href => !href.includes('google'))
            );
            
            // Process each product
            for (const link of productLinks) {
                try {
                    const productData = await scrapeProductDetail(browser, link);
                    if (productData) {
                        allProducts.push(productData);
                    }
                } catch (error) {
                    console.error(`Error scraping product at ${link}:`, error.message);
                }
            }
            
            // Check if there's a next page
            const nextPageExists = await page.evaluate(() => {
                const nextButton = document.querySelector('.pagination__next');
                return nextButton && !nextButton.disabled;
            });
            
            hasNextPage = nextPageExists;
            currentPage++;
            
            // Add delay between pages to avoid rate limiting
            if (hasNextPage && currentPage <= maxPages) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        return {
            status: 'success',
            count: allProducts.length,
            products: allProducts
        };
        
    } catch (error) {
        console.error('Error during scraping:', error);
        return {
            status: 'error',
            message: error.message
        };
    } finally {
        await browser.close();
    }
}

async function scrapeProductDetail(browser, productUrl) {
    const page = await browser.newPage();
    try {
        await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Wait for critical elements to load
        await page.waitForSelector('#mainContent', { timeout: 5000 });
        
        // Extract data using AI-like analysis of DOM structure
        const productData = await page.evaluate(() => {
            // Helper function to clean text
            const cleanText = (text) => text ? text.trim().replace(/\s+/g, ' ') : '-';
            
            // Extract name
            let name = '-';
            const nameSelectors = [
                'h1.x-item-title__mainTitle span', 
                'h1.product-title',
                'h1.item-title'
            ];
            for (const selector of nameSelectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent.trim()) {
                    name = cleanText(el.textContent);
                    break;
                }
            }
            
            // Extract price
            let price = '-';
            const priceSelectors = [
                'div.x-price-primary span',
                'span.ux-textspans',
                'span.item-price'
            ];
            for (const selector of priceSelectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent.trim()) {
                    price = cleanText(el.textContent.replace(/[^\d.,]/g, ''));
                    break;
                }
            }
            
            // Extract description
            let description = '-';
            const descSelectors = [
                'div.d-item-description',
                'div.item-description',
                'div.product-description'
            ];
            for (const selector of descSelectors) {
                const el = document.querySelector(selector);
                if (el && el.textContent.trim()) {
                    description = cleanText(el.textContent);
                    break;
                }
            }
            
            // Extract image URL
            let imageUrl = '-';
            const imgSelectors = [
                'div.ux-image-carousel-item img',
                'div.image img',
                'img.img.img300'
            ];
            for (const selector of imgSelectors) {
                const el = document.querySelector(selector);
                if (el && el.src) {
                    imageUrl = el.src;
                    break;
                }
            }
            
            return {
                name,
                price,
                description,
                imageUrl,
                productUrl
            };
        });
        
        return productData;
        
    } catch (error) {
        console.error(`Error scraping product detail at ${productUrl}:`, error.message);
        return null;
    } finally {
        await page.close();
    }
}

// Example usage
(async () => {
    const result = await scrapeEbayProducts('iphone 13', 2); // Scrape 2 pages
    console.log(JSON.stringify(result, null, 2));
})();