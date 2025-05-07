1. Clone & Install
bash
git clone https://github.com/yourusername/ebay-iphone-scraper.git
cd ebay-iphone-scraper
npm install
2. Run the Server
bash
node product.js
API will run at → http://localhost:3000

API Documentation
GET /api/scrape
Scrapes eBay for products (default: iPhone 13).

Query Parameters:

Parameter	Default	Description
q	iphone 13	Search query (e.g., iphone 15)
pages	2	Number of pages to scrape (1-5)
Example Requests:

bash
# Default (iPhone 13, 2 pages)
curl "http://localhost:3000/api/scrape"

# Custom search (iPhone 15 Pro, 3 pages)
curl "http://localhost:3000/api/scrape?q=iphone%2015%20pro&pages=3"
Example Response:

json
{
  "success": true,
  "count": 48,
  "query": "iphone 15 pro",
  "products": [
    {
      "name": "Apple iPhone 15 Pro 256GB Blue Titanium",
      "price": "$999.00",
      "description": "Brand new in original packaging...",
      "image": "https://i.ebayimg.com/.../s-l1600.jpg",
      "link": "https://www.ebay.com/itm/123456789"
    }
  ]
}
