# 📰 RSS Feed Reader (Quarto + R)

A minimalist, Eleventy-inspired RSS feed reader built with Quarto and R. This static site generator creates a clean, readable interface for aggregating and displaying RSS feeds with optional AI-powered summaries.

**Server-side rendering. No JavaScript required (optional enhancement).**

## ✨ Features (Planned)

* **RSS Feed Aggregation:** Fetch and parse multiple RSS feeds using R
* **Static Site Generation:** Compile to static HTML using Quarto
* **Eleventy-inspired Design:** Clean typography, semantic HTML, minimal CSS
* **AI Summaries (Optional):** Integrate R-based text summarization
* **Responsive Layout:** Mobile-friendly, accessible design
* **Customizable Themes:** YAML-configured feed sources and styling
* **Fast Performance:** Pre-rendered static pages

## 🛠️ Tech Stack

* **Quarto:** Static site generator framework
* **R:** Data processing and RSS parsing (`xml2`, `tidyRSS`, `dplyr`)
* **Custom CSS:** Eleventy-inspired minimalist styling
* **Optional:** `text2vec` or similar for text analysis

## 📋 Prerequisites

* R (>= 4.0)
* Quarto CLI (>= 1.3)
* Required R packages:
  ```r
  install.packages(c("tidyRSS", "xml2", "dplyr", "lubridate", "glue"))
  ```

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CathalByrneGit/RSS_Feed.git
   cd RSS_Feed
   git checkout quarto/rss-reader-implementation
   ```

2. **Install R dependencies:**
   ```r
   # In R console
   install.packages(c("tidyRSS", "xml2", "dplyr", "lubridate", "glue"))
   ```

3. **Configure your feeds:**
   Edit `feeds.yml` with your RSS feed URLs

4. **Build the site:**
   ```bash
   quarto render
   ```

5. **Preview locally:**
   ```bash
   quarto preview
   ```

## 📁 Project Structure (Planned)

```
RSS_Feed/
├── _quarto.yml          # Quarto configuration
├── feeds.yml            # RSS feed sources
├── index.qmd            # Homepage template
├── styles.css           # Eleventy-inspired CSS
├── scripts/
│   ├── fetch-feeds.R    # RSS fetching logic
│   └── process-feeds.R  # Data processing
├── _site/               # Generated static site
└── README.md            # This file
```

## 🎨 Design Philosophy

Following Eleventy's minimalist aesthetic:
- System font stack for performance
- Semantic HTML5
- No JavaScript dependency (progressive enhancement)
- High contrast, readable typography
- Mobile-first responsive design

## 🔮 Roadmap

* [ ] Set up Quarto project structure
* [ ] Implement RSS fetching in R
* [ ] Create Eleventy-inspired CSS
* [ ] Build article listing page
* [ ] Add article detail pages
* [ ] Implement pagination
* [ ] Add search functionality (optional)
* [ ] Integrate AI summaries (optional)
* [ ] Deploy to GitHub Pages/Netlify

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
