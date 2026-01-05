// script.js - Main Application Logic
import { fetchFeed, parseRSS } from './rss.js';
import { AIModel } from './ai.js';

// ============================================
// State Management
// ============================================
const state = {
    feeds: [],
    currentFeed: null,
    currentArticle: null,
    chatHistory: [],
    aiModel: null
};

// ============================================
// DOM Elements
// ============================================
const elements = {
    addFeedForm: document.getElementById('add-feed-form'),
    feedUrlInput: document.getElementById('feed-url'),
    feedsContainer: document.getElementById('feeds-container'),
    articleView: document.getElementById('article-view'),
    chatLog: document.getElementById('chat-log'),
    chatForm: document.getElementById('chat-form'),
    questionInput: document.getElementById('question-input'),
    modelStatus: document.getElementById('model-status'),
    loadingOverlay: document.getElementById('loading-overlay'),
    loadingText: document.getElementById('loading-text')
};

// ============================================
// Initialization
// ============================================
async function init() {
    console.log('Smart RSS Reader initializing...');

    // Load saved feeds from localStorage
    loadFeedsFromStorage();

    // Set up event listeners
    setupEventListeners();

    // Initialize AI model (lazy load on first question)
    updateModelStatus('AI model ready to load');
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Add feed form
    elements.addFeedForm.addEventListener('submit', handleAddFeed);

    // Chat form
    elements.chatForm.addEventListener('submit', handleChatSubmit);
}

// ============================================
// Feed Management
// ============================================
async function handleAddFeed(e) {
    e.preventDefault();

    const feedUrl = elements.feedUrlInput.value.trim();
    if (!feedUrl) return;

    showLoading('Fetching feed...');

    try {
        const xmlText = await fetchFeed(feedUrl);
        const articles = parseRSS(xmlText);

        const feed = {
            url: feedUrl,
            title: articles[0]?.feedTitle || 'Untitled Feed',
            articles: articles,
            addedAt: Date.now()
        };

        state.feeds.push(feed);
        saveFeedsToStorage();
        renderFeeds();

        elements.feedUrlInput.value = '';
        hideLoading();
        showSuccess(`Added feed: ${feed.title}`);

    } catch (error) {
        console.error('Error adding feed:', error);
        hideLoading();
        showError(`Failed to add feed: ${error.message}`);
    }
}

function renderFeeds() {
    if (state.feeds.length === 0) {
        elements.feedsContainer.innerHTML = '<p class="empty-state">No feeds yet. Add one to get started!</p>';
        return;
    }

    elements.feedsContainer.innerHTML = '';

    state.feeds.forEach((feed, index) => {
        const feedEl = document.createElement('div');
        feedEl.className = 'feed-item';
        feedEl.innerHTML = `
            <div class="feed-item-content">
                <h4>${escapeHtml(feed.title)}</h4>
                <p>${feed.articles.length} articles</p>
            </div>
            <button class="remove-feed-btn" data-index="${index}" title="Remove feed">×</button>
        `;

        // Click handler for selecting feed (only on the content area)
        const contentArea = feedEl.querySelector('.feed-item-content');
        contentArea.addEventListener('click', () => selectFeed(index));

        // Click handler for remove button
        const removeBtn = feedEl.querySelector('.remove-feed-btn');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent feed selection
            removeFeed(index);
        });

        elements.feedsContainer.appendChild(feedEl);
    });
}

function selectFeed(index) {
    state.currentFeed = state.feeds[index];
    renderArticles();
}

function removeFeed(index) {
    const feed = state.feeds[index];

    // Confirm before removing
    if (!confirm(`Remove "${feed.title}"?`)) {
        return;
    }

    // Remove the feed
    state.feeds.splice(index, 1);
    saveFeedsToStorage();

    // Clear current feed if it was the one removed
    if (state.currentFeed === feed) {
        state.currentFeed = null;
        state.currentArticle = null;
        elements.articleView.innerHTML = `
            <div class="welcome-screen">
                <h2>Feed Removed</h2>
                <p>Select another feed from the sidebar to continue reading.</p>
            </div>
        `;
        disableChat();
    }

    renderFeeds();
}

function renderArticles() {
    if (!state.currentFeed) return;

    const articles = state.currentFeed.articles;

    let html = `<h2>${escapeHtml(state.currentFeed.title)}</h2>`;
    html += '<div class="articles-list">';

    articles.forEach((article, index) => {
        html += `
            <article class="article-preview" data-index="${index}">
                <h3><a href="#" class="article-link">${escapeHtml(article.title)}</a></h3>
                <p class="article-meta">${article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}</p>
                <p>${escapeHtml(article.description || '').substring(0, 150)}...</p>
            </article>
        `;
    });

    html += '</div>';
    elements.articleView.innerHTML = html;

    // Add click handlers for articles
    elements.articleView.querySelectorAll('.article-link').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectArticle(index);
        });
    });
}

function selectArticle(index) {
    state.currentArticle = state.currentFeed.articles[index];
    state.chatHistory = [];

    renderArticleView();
    enableChat();
}

function renderArticleView() {
    const article = state.currentArticle;

    const html = `
        <div class="article-header">
            <h1 class="article-title">${escapeHtml(article.title)}</h1>
            <p class="article-meta">
                ${article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}
                ${article.link ? `| <a href="${escapeHtml(article.link)}" target="_blank">Read original</a>` : ''}
            </p>
        </div>
        <div class="article-content">
            ${sanitizeArticleContent(article.content || article.description)}
        </div>
    `;

    elements.articleView.innerHTML = html;
}

function enableChat() {
    elements.chatForm.removeAttribute('disabled');
    elements.questionInput.removeAttribute('disabled');
    elements.chatForm.querySelector('button').removeAttribute('disabled');
    elements.chatLog.innerHTML = '<p class="chat-empty-state">Ask me anything about this article!</p>';
}

function disableChat() {
    elements.chatForm.setAttribute('disabled', 'disabled');
    elements.questionInput.setAttribute('disabled', 'disabled');
    elements.chatForm.querySelector('button').setAttribute('disabled', 'disabled');
    elements.chatLog.innerHTML = '<p class="chat-empty-state">Select an article to start asking questions</p>';
}

// ============================================
// Chat / AI Interaction
// ============================================
async function handleChatSubmit(e) {
    e.preventDefault();

    const question = elements.questionInput.value.trim();
    if (!question || !state.currentArticle) return;

    // Add user message to chat
    addChatMessage('user', question);
    elements.questionInput.value = '';

    // Get article context (plain text only)
    const context = getArticleContext(state.currentArticle);

    showLoading('Thinking...');

    try {
        // Initialize AI model if needed
        if (!state.aiModel) {
            updateModelStatus('Loading AI model... (this may take a minute)');
            state.aiModel = new AIModel();
            await state.aiModel.initialize();
            updateModelStatus('AI model loaded');
        }

        // Get answer from AI
        const answer = await state.aiModel.askQuestion(context, question);

        hideLoading();
        addChatMessage('assistant', answer);

    } catch (error) {
        console.error('Error getting AI response:', error);
        hideLoading();
        addChatMessage('assistant', `❌ Error: ${error.message}`);
        showError('Failed to get AI response. Please try again.');
    }
}

function getArticleContext(article) {
    // Strip HTML and get plain text for AI context
    const content = article.content || article.description || '';
    const plainText = stripHtml(content);

    // Combine title and content
    return `${article.title}\n\n${plainText}`;
}

function addChatMessage(role, content) {
    // Remove empty state if present
    const emptyState = elements.chatLog.querySelector('.chat-empty-state');
    if (emptyState) emptyState.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${role}`;
    messageEl.innerHTML = `
        <strong>${role === 'user' ? 'You' : 'AI'}:</strong>
        <p>${escapeHtml(content)}</p>
    `;

    elements.chatLog.appendChild(messageEl);
    elements.chatLog.scrollTop = elements.chatLog.scrollHeight;

    // Save to history
    state.chatHistory.push({ role, content });
}

// ============================================
// Storage
// ============================================
function saveFeedsToStorage() {
    try {
        localStorage.setItem('rss_feeds', JSON.stringify(state.feeds));
    } catch (error) {
        console.error('Error saving feeds:', error);
    }
}

function loadFeedsFromStorage() {
    try {
        const saved = localStorage.getItem('rss_feeds');
        if (saved) {
            state.feeds = JSON.parse(saved);
            renderFeeds();
        }
    } catch (error) {
        console.error('Error loading feeds:', error);
    }
}

// ============================================
// UI Helpers
// ============================================
function showLoading(text = 'Loading...') {
    elements.loadingText.textContent = text;
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

function updateModelStatus(text) {
    elements.modelStatus.textContent = text;
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button class="close-error">×</button>
    `;

    document.body.appendChild(errorDiv);

    // Add close button handler
    errorDiv.querySelector('.close-error').addEventListener('click', () => {
        errorDiv.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'success-notification';
    successDiv.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button class="close-success">×</button>
    `;

    document.body.appendChild(successDiv);

    // Add close button handler
    successDiv.querySelector('.close-success').addEventListener('click', () => {
        successDiv.remove();
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// ============================================
// Utility Functions
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function sanitizeArticleContent(html) {
    // Basic sanitization - allow common formatting tags
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove script tags and other dangerous elements
    const dangerousTags = div.querySelectorAll('script, iframe, object, embed');
    dangerousTags.forEach(tag => tag.remove());

    return div.innerHTML;
}

// ============================================
// Start the app
// ============================================
init();
