# eBay Product Scraper

This project is a simple web scraping tool built with **Node.js** and **Puppeteer** to extract product data from eBay based on a search query.

## ✅ Features

- Scrapes product information including:
  - Name (title)
  - Price
  - Description
  - Image URL
  - Product URL
- Supports multiple pages with pagination.
- Avoids duplicate URLs using a `Map` structure.
- Logs scraping progress to the console.

## 📦 Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ebay-product-scraper
