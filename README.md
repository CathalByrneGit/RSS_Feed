# 📰 Smart RSS Reader (with Transformers.js)

A lightweight, privacy-focused RSS reader that runs entirely in your browser. It combines a clean reading experience with the power of local AI, allowing you to **chat with your news** using `transformers.js`.

**No data leaves your device.** The AI model downloads once and runs locally.

## ✨ Features

* **Simple RSS Fetching:** Add RSS URLs to fetch and render articles (supports RSS 2.0 and Atom formats)
* **Article Search:** Filter articles by keyword in real-time
* **Local AI Analysis:** Articles are analyzed using DistilBERT running entirely in your browser
* **Q&A Interface:** Ask questions like "Summarize this," or "What are the key dates mentioned?" and get instant answers without server latency or API costs
* **Dark Mode:** Toggle between light and dark themes with preference persistence
* **Keyboard Shortcuts:** Navigate efficiently with keyboard commands
* **Feed Management:** Add/remove feeds with confirmation and localStorage persistence
* **Minimalist Design:** Clean, semantic CSS inspired by Eleventy's typography, avoiding heavy frameworks

## 🛠️ Tech Stack

* **Frontend:** HTML5, Vanilla JavaScript (ES Modules).
* **Styling:** Custom CSS (Semantic, responsive, accessible).
* **AI Engine:** [Transformers.js](https://huggingface.co/docs/transformers.js/index) by Hugging Face.
* **RSS Parsing:** A lightweight XML parser or a CORS proxy (if needed) to handle feed fetching.

## 🚀 Getting Started

Since this uses modern browser APIs and ES modules, you cannot run it by simply opening the HTML file. You need a local server.

### Prerequisites

* A modern browser (Chrome, Edge, or Firefox recommended)
* Python 3 (usually pre-installed on macOS/Linux) or Node.js

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/CathalByrneGit/RSS_Feed.git
    cd RSS_Feed
    ```

2.  **Start a local server:**

    **Option A: Using Python (recommended)**
    ```bash
    python3 -m http.server 8000
    # or
    npm start
    ```

    **Option B: Using Node.js**
    ```bash
    npx http-server -p 8000
    ```

3.  **Open in Browser:**
    Navigate to `http://localhost:8000` in your browser.

### First Time Setup

When you first open the app:

1. **Add an RSS Feed:** Paste an RSS feed URL into the input field and click "Add Feed"
   - Try these **verified working** sample feeds:
     - `https://hnrss.org/frontpage` (Hacker News - usually works)
     - `https://rss.nytimes.com/services/xml/rss/nyt/World.xml` (NY Times World)
     - `https://feeds.arstechnica.com/arstechnica/index` (Ars Technica)
     - `https://www.reddit.com/r/programming/.rss` (Reddit Programming)

2. **Browse Articles:** Click on a feed to see its articles, then click an article to read it

3. **Chat with AI:** Once you've selected an article, ask questions in the chat panel:
   - "What is this article about?"
   - "Summarize the key points"
   - "What dates are mentioned?"
   - "Who are the main people discussed?"

**Note:** The first time you ask a question, the AI model will download (~40-60MB). This is a one-time download and will be cached for future use.

**CORS Note:** Some RSS feeds have strict CORS policies and may not load even with proxies. If a feed fails, try one of the verified feeds above.

## 🧠 How it Works

1.  **Fetch:** The app requests the RSS feed. *Note: Due to CORS restrictions in browsers, you may need to use a CORS proxy or ensure the RSS feed supports cross-origin requests.*
2.  **Parse:** The XML is parsed into a readable list of headlines.
3.  **Embed:** When you select an article, the text is extracted.
4.  **Infer:** When you ask a question, `transformers.js` tokenizes the text and runs a specific task (Question Answering) against the context of the article.

## 💡 Usage Tips

* **Feed Management:** Click the × button next to any feed to remove it
* **Article Search:** Use the search box in the feed header to filter articles
* **Dark Mode:** Click the theme toggle button (🌙/☀️) in the header or press `Ctrl/Cmd + D`
* **Persistence:** Your feeds and theme preference are saved in browser localStorage
* **Privacy:** All data stays in your browser - no server communication except for fetching RSS feeds
* **AI Model:** The AI runs entirely in your browser using WebAssembly
* **CORS Issues:** If a feed fails to load, the app automatically tries a CORS proxy

## ⌨️ Keyboard Shortcuts

* `Ctrl/Cmd + K` - Focus article search
* `Ctrl/Cmd + /` - Focus question input
* `Ctrl/Cmd + D` - Toggle dark mode
* `Escape` - Clear article search (when search is focused)

## 🔧 Troubleshooting

**Feed won't load:**
- **CORS Error:** Many RSS feeds block cross-origin requests. This is the most common issue.
- The app tries 3 different CORS proxies automatically, but some feeds block all proxies
- **Solution:** Try one of the verified feeds listed in "First Time Setup" above
- **Alternative:** Some feeds work better with `/rss` or `/feed` at the end of the URL
- If all proxies fail, the feed cannot be accessed from a browser-based app

**AI model won't load:**
- Ensure you have a stable internet connection for the initial download
- Try using Chrome or Edge (best WebAssembly support)
- Clear browser cache if model loading fails repeatedly

**Application not loading:**
- Make sure you're using a local server (not opening file:// directly)
- Check browser console for errors (F12)
- Ensure you're using a modern browser

## 🏗️ Project Structure

```
RSS_Feed/
├── index.html      # Main HTML structure
├── styles.css      # Minimalist Eleventy-inspired CSS
├── script.js       # Main application logic and state management
├── rss.js          # RSS/Atom feed fetching and parsing
├── ai.js           # Transformers.js AI integration
├── package.json    # Project metadata and scripts
└── README.md       # This file
```

## ⚠️ Known Limitations

* **Model Download:** The first AI query requires downloading ~40-60MB (one-time, cached afterward)
* **Context Length:** Articles are truncated to 2000 characters for AI processing
* **CORS Restrictions:** **Major limitation** - Many RSS feeds block browser-based access due to CORS policies. The app tries 3 different CORS proxies, but some feeds still won't load. This is a browser security limitation, not a bug.
* **Browser Support:** Works best in Chrome/Edge; Firefox supported but may have slower AI performance
* **No Mobile App:** This is a web app only; no native mobile version
* **Single Model:** Currently uses DistilBERT for Q&A; no model selection available yet
* **No Offline Mode:** Requires internet for fetching feeds and initial model download
* **Feed Reliability:** RSS feed availability depends on third-party CORS proxy services

## 🔮 Future Roadmap

* [ ] Add support for OPML import/export
* [ ] Allow user selection of different AI models
* [ ] Service worker for offline support
* [ ] Better article formatting and media display
* [ ] Feed refresh/update functionality
* [ ] Article bookmarking and favorites
* [ ] Export chat conversations
