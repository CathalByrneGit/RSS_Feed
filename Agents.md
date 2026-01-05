# 🤖 Agent Directives: Smart RSS Reader Implementation

**Role:** You are an expert Frontend Engineer specializing in Vanilla JS and browser-based AI implementation.

**Goal:** Build a functional RSS reader that uses transformers.js to perform Q&A on article content.

## Constraints:

1. NO Bootstrap/Tailwind. Use vanilla CSS.
2. Style: Mimic the "Eleventy" default style—clean typography, system fonts, max-width containers, and high readability.
3. Architecture: Use ES Modules. No complex build steps (Webpack/Parcel) unless absolutely necessary. Prefer CDN imports for simplicity in this prototype.

## 📂 Project Structure

Create the following file structure:
```
/
├── index.html        # Main entry point
├── styles.css        # Minimalist CSS
├── script.js         # Main application logic
├── rss.js            # RSS fetching and parsing logic
└── ai.js             # Transformers.js integration
```

## 📝 Step-by-Step Implementation Guide

### 1. UI Skeleton (index.html)

Create a 2-column layout (on desktop):

* Left Sidebar: Feed list and "Add Feed" input.
* Main Content: The selected article content.
* Right/Bottom Panel: A "Chat with Article" section containing a chat log and an input field.
* Use semantic HTML5 (`<header>`, `<main>`, `<article>`, `<aside>`).

### 2. Styling (styles.css)

* Typography: Use a system font stack (-apple-system, BlinkMacSystemFont, "Segoe UI"...). Set base font size to 1.125rem for readability.
* Colors: Dark text (#333) on off-white background (#fdfdfd). Use a subtle accent color (e.g., #0055cc) for links and buttons.
* Layout: Use CSS Grid or Flexbox. Ensure the "Chat" interface sticks to the bottom or side of the article view.
* Loading States: Create a simple CSS spinner for when the AI model is loading.

### 3. RSS Logic (rss.js)

* Function `fetchFeed(url)`: Fetch XML data.
* Critical: Handle CORS. If the direct fetch fails, fallback to a public CORS proxy (like `https://api.allorigins.win/raw?url=`).
* Function `parseRSS(xmlText)`: Use DOMParser to extract `<item>` title, link, description, and content.
* Export these functions to be used in script.js.

### 4. AI Logic (ai.js) using transformers.js

* Import `pipeline` from `https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0`.
* Create a singleton class `AIModel` to load the pipeline only once.
* Task: Use the 'question-answering' task.
* Model: Use a quantized, small model suitable for browsers (e.g., `onnx-community/granite-4.0-350m-ONNX-web`).
* Function `askQuestion(context, question)`:
  * context: The text of the currently selected article.
  * question: The user's input.
  * Returns: The answer string and a confidence score.

### 5. Integration (script.js)

* Wire up the DOM elements.
* Maintain state: `currentFeed`, `currentArticle`, `chatHistory`.
* Event Listener: On article selection, strip HTML tags from the content to prepare plain text for the AI context.
* Event Listener: On specific questions (e.g., "Summarize"), you might need a separate pipeline, but for now, rely on the Q&A pipeline or prompt engineering.

## ⚠️ Important Notes for the Agent

* Error Handling: If transformers.js fails to load (e.g., WebGPU not supported), alert the user gracefully.
* Performance: The first run will be slow as it downloads the model weights (~40-60MB). Add a visual progress bar or status text indicating "Downloading AI Model...".
* Security: Sanitize RSS content before rendering to prevent XSS (basic `textContent` is safer than `innerHTML`, but if you must render HTML, be careful).

