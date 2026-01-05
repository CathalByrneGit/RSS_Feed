# 🤖 Agent Directives: Quarto RSS Reader Implementation

**Role:** You are an expert R Developer and Quarto specialist with expertise in static site generation and data journalism.

**Goal:** Build a minimalist RSS feed reader using Quarto and R that aggregates feeds into a clean, Eleventy-inspired static website.

## Constraints:

1. **Pure Static:** No runtime server required (static HTML/CSS only)
2. **Eleventy-inspired Design:** Clean typography, system fonts, semantic HTML, minimal CSS
3. **R-based Processing:** All RSS fetching and data processing in R
4. **No Complex Dependencies:** Use base R and tidyverse where possible

## 📂 Project Structure

Create the following structure:

```
RSS_Feed/
├── _quarto.yml           # Quarto project configuration
├── feeds.yml             # RSS feed sources (user-configurable)
├── index.qmd             # Homepage listing all articles
├── about.qmd             # About page (optional)
├── styles.css            # Custom Eleventy-inspired CSS
├── scripts/
│   ├── fetch-feeds.R     # Fetch RSS feeds
│   ├── process-feeds.R   # Process and clean data
│   └── utils.R           # Helper functions
├── _site/                # Generated static site (gitignored)
├── .gitignore
└── README.md
```

## 📝 Step-by-Step Implementation Guide

### 1. Quarto Configuration (`_quarto.yml`)

```yaml
project:
  type: website
  output-dir: _site

website:
  title: "RSS Feed Reader"
  navbar:
    left:
      - href: index.qmd
        text: Home
      - href: about.qmd
        text: About

format:
  html:
    theme: none
    css: styles.css
    toc: false
```

### 2. Feed Configuration (`feeds.yml`)

```yaml
feeds:
  - name: "Hacker News"
    url: "https://hnrss.org/frontpage"
  - name: "NY Times World"
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
  - name: "Ars Technica"
    url: "https://feeds.arstechnica.com/arstechnica/index"
```

### 3. R Scripts

**fetch-feeds.R:**
```r
library(tidyRSS)
library(dplyr)
library(yaml)

# Read feed configuration
config <- read_yaml("feeds.yml")

# Fetch all feeds
fetch_all_feeds <- function() {
  all_articles <- list()

  for (feed in config$feeds) {
    tryCatch({
      articles <- tidyfeed(feed$url)
      articles$source <- feed$name
      all_articles[[feed$name]] <- articles
    }, error = function(e) {
      message(sprintf("Failed to fetch %s: %s", feed$name, e$message))
    })
  }

  bind_rows(all_articles)
}
```

**process-feeds.R:**
```r
library(dplyr)
library(lubridate)
library(glue)

process_articles <- function(articles) {
  articles %>%
    mutate(
      pub_date = as_datetime(item_pub_date),
      date_formatted = format(pub_date, "%B %d, %Y"),
      excerpt = substr(item_description, 1, 200)
    ) %>%
    arrange(desc(pub_date)) %>%
    select(source, item_title, item_link, excerpt, date_formatted, pub_date)
}
```

### 4. Homepage (`index.qmd`)

```yaml
---
title: "RSS Feed Reader"
format: html
---

```{r}
#| echo: false
#| message: false

source("scripts/fetch-feeds.R")
source("scripts/process-feeds.R")

# Fetch and process feeds
raw_articles <- fetch_all_feeds()
articles <- process_articles(raw_articles)
```

## Latest Articles

```{r}
#| echo: false
#| results: asis

for (i in 1:nrow(articles)) {
  article <- articles[i, ]

  cat(sprintf('
  <article class="article-card">
    <div class="article-meta">%s • %s</div>
    <h2><a href="%s" target="_blank">%s</a></h2>
    <p class="article-excerpt">%s...</p>
  </article>
  ',
  article$source,
  article$date_formatted,
  article$item_link,
  article$item_title,
  article$excerpt
  ))
}
```
```

### 5. Styling (`styles.css`)

Use Eleventy-inspired minimalist design:
- System font stack
- High contrast colors (#333 text, #fdfdfd background)
- Clean typography hierarchy
- Responsive grid layout
- No frameworks

### 6. Build & Deploy

**Build:**
```bash
quarto render
```

**Preview:**
```bash
quarto preview
```

**Deploy to GitHub Pages:**
```bash
quarto publish gh-pages
```

## ⚠️ Important Notes

* **CORS:** No CORS issues since fetching happens server-side in R
* **Performance:** Cache feed data to avoid repeated fetches during development
* **Updates:** Set up scheduled rebuilds (GitHub Actions, cron) for fresh content
* **Error Handling:** Gracefully handle feed fetch failures
* **Dependencies:** Document all R package requirements in README

## 🎨 Design Principles

1. **Minimal:** No unnecessary elements
2. **Fast:** Static files, no JavaScript
3. **Readable:** High contrast, generous spacing
4. **Semantic:** Proper HTML5 structure
5. **Accessible:** WCAG 2.1 AA compliance

## 📦 Key R Packages

* **tidyRSS:** RSS feed parsing
* **yaml:** Configuration file handling
* **dplyr:** Data manipulation
* **lubridate:** Date/time handling
* **glue:** String interpolation
