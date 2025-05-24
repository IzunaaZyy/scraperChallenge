# eBay Product Scraper

This project is a simple web scraping tool built with **Node.js** and **Puppeteer** to extract product data from eBay based on a search query.

##  Features

- Scrapes product information including:
  - Name (title)
  - Price
  - Description
  - Image URL
  - Product URL
- Supports multiple pages with pagination.
- Avoids duplicate URLs using a `Map` structure.
- Logs scraping progress to the console.

##  Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

##  Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ebay-product-scraper
2. Install dependencies:
   ```bash
   npm install puppeteer

##  Usage 

1. Run the script:
node index.js
2. By default, it scrapes 1 page of results for the search term "nike".
You can change the term and number of pages in this section:
const result = await scrapeEbayProducts('nike', 1);
3. Output example:
{
  "status": "success",
  "count": 10,
  "products": [
    {
      "name": "Nike Air Max 270",
      "price": "129.99",
      "description": "Comfortable and stylish running shoes...",
      "imageUrl": "https://i.ebayimg.com/images/...",
      "productUrl": "https://www.ebay.com/itm/..."
    }
  ]
}

