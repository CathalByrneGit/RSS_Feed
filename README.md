# 📰 Smart RSS Reader (with Transformers.js)

A lightweight, privacy-focused RSS reader that runs entirely in your browser. It combines a clean reading experience with the power of local AI, allowing you to **chat with your news** using `transformers.js`.

**No data leaves your device.** The AI model downloads once and runs locally.

## ✨ Features

* **Simple RSS Fetching:** Add RSS URLs to fetch and render articles.
* **Local AI Analysis:** specific articles are analyzed using small, browser-compatible LLMs (e.g., Xenova's distilbert,mistralai/Ministral-3-3B-Instruct-2512-ONNX(also includes image understanding),
    onnx-community/granite-4.0-1b-ONNX-web or onnx-community/granite-4.0-350m-ONNX-web).
* **Q&A Interface:** Ask questions like "Summarize this," or "What are the key dates mentioned?" and get instant answers without server latency or API costs.
* **Minimalist Design:** Styled with raw, semantic CSS (inspired by the clean typography of Eleventy projects), avoiding heavy frameworks like Bootstrap.

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
   - Try these sample feeds:
     - `https://feeds.bbci.co.uk/news/rss.xml` (BBC News)
     - `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml` (NY Times)
     - `https://hnrss.org/frontpage` (Hacker News)

2. **Browse Articles:** Click on a feed to see its articles, then click an article to read it

3. **Chat with AI:** Once you've selected an article, ask questions in the chat panel:
   - "What is this article about?"
   - "Summarize the key points"
   - "What dates are mentioned?"
   - "Who are the main people discussed?"

**Note:** The first time you ask a question, the AI model will download (~40-60MB). This is a one-time download and will be cached for future use.

## 🧠 How it Works

1.  **Fetch:** The app requests the RSS feed. *Note: Due to CORS restrictions in browsers, you may need to use a CORS proxy or ensure the RSS feed supports cross-origin requests.*
2.  **Parse:** The XML is parsed into a readable list of headlines.
3.  **Embed:** When you select an article, the text is extracted.
4.  **Infer:** When you ask a question, `transformers.js` tokenizes the text and runs a specific task (Question Answering) against the context of the article.

## 💡 Usage Tips

* **Feed Management:** Click the × button next to any feed to remove it
* **Persistence:** Your feeds are saved in browser localStorage and will persist across sessions
* **Privacy:** All data stays in your browser - no server communication except for fetching RSS feeds
* **AI Model:** The AI runs entirely in your browser using WebAssembly
* **CORS Issues:** If a feed fails to load, the app automatically tries a CORS proxy

## 🔧 Troubleshooting

**Feed won't load:**
- Verify the RSS feed URL is correct
- Some feeds may block CORS requests
- The app will automatically try a proxy if direct access fails

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

## 🔮 Future Roadmap

* [ ] Add support for OPML import/export
* [ ] Allow user selection of different models
* [ ] Add article search/filter functionality
* [ ] Implement dark mode toggle
* [ ] Add keyboard shortcuts
* [ ] Service worker for offline support
* [ ] Better article formatting and media display
