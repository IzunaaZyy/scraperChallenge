eBay Product Scraper
This project is a simple web scraping tool built with Node.js and Puppeteer to extract product data from eBay based on a search query.

✅ Features
Scrapes product information including:

Name (title)

Price

Description

Image URL

Product URL

Supports multiple pages with pagination.

Avoids duplicate URLs using a Map structure.

Logs scraping progress to the console.

📦 Prerequisites
Node.js (v16 or later)

npm (v7 or later)

🔧 Installation
Clone the repository:

git clone <repository-url>
cd ebay-product-scraper

Install dependencies:

npm install puppeteer

🚀 Usage
Run the script:

node index.js

By default, it scrapes 1 page of results for the search term "nike".
You can change the term and number of pages in this section:

const result = await scrapeEbayProducts('nike', 1);

Example output:

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

📂 Project Structure
ebay-product-scraper/
├── index.js # Main file containing the scraping logic
└── README.md # Project documentation

🧪 Dependencies
Puppeteer – Headless Chrome for web scraping.

⚠️ Notes
This script is for educational and personal use only.

Always comply with eBay's Terms of Service.

eBay's website structure may change, so selectors may need to be updated over time.

👨‍💻 Author
Created by Fauzi Maulana.
