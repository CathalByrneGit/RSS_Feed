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

* Node.js (optional, but recommended for serving).
* A modern browser (Chrome, Edge, Firefox).

### Installation

1.  **Clone the repository:**
    ....

2.  **Start a local server:**
    ....

3.  **Open in Browser:**
    ...

## 🧠 How it Works

1.  **Fetch:** The app requests the RSS feed. *Note: Due to CORS restrictions in browsers, you may need to use a CORS proxy or ensure the RSS feed supports cross-origin requests.*
2.  **Parse:** The XML is parsed into a readable list of headlines.
3.  **Embed:** When you select an article, the text is extracted.
4.  **Infer:** When you ask a question, `transformers.js` tokenizes the text and runs a specific task (Question Answering) against the context of the article.

## 🔮 Future Roadmap

* [ ] Add support for OPML import/export.
* [ ] Cache models in `localStorage` for offline support.
* [ ] Allow user selection of different models (e.
