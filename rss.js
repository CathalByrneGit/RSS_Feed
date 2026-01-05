// rss.js - RSS Fetching and Parsing Logic

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Fetches an RSS feed from the given URL
 * Attempts direct fetch first, falls back to CORS proxy if needed
 * @param {string} url - The RSS feed URL
 * @returns {Promise<string>} - The XML text of the feed
 */
export async function fetchFeed(url) {
    // Validate URL
    try {
        new URL(url);
    } catch (error) {
        throw new Error('Invalid URL format');
    }

    // Try direct fetch first
    try {
        console.log('Attempting direct fetch:', url);
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/rss+xml, application/xml, text/xml, */*'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const text = await response.text();
        return text;

    } catch (directError) {
        console.log('Direct fetch failed, trying CORS proxy:', directError.message);

        // Try with CORS proxy
        try {
            const proxyUrl = CORS_PROXY + encodeURIComponent(url);
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const text = await response.text();
            return text;

        } catch (proxyError) {
            throw new Error(`Failed to fetch feed: ${proxyError.message}`);
        }
    }
}

/**
 * Parses RSS XML and extracts articles
 * @param {string} xmlText - The XML text to parse
 * @returns {Array<Object>} - Array of article objects
 */
export function parseRSS(xmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error('Invalid RSS/XML format');
    }

    // Detect feed type (RSS 2.0 or Atom)
    const isAtom = doc.querySelector('feed');

    if (isAtom) {
        return parseAtomFeed(doc);
    } else {
        return parseRSSFeed(doc);
    }
}

/**
 * Parses RSS 2.0 feed format
 */
function parseRSSFeed(doc) {
    const channel = doc.querySelector('channel');
    if (!channel) {
        throw new Error('Invalid RSS format: no channel element found');
    }

    const feedTitle = getElementText(channel, 'title') || 'Untitled Feed';
    const items = doc.querySelectorAll('item');

    const articles = Array.from(items).map(item => {
        return {
            feedTitle: feedTitle,
            title: getElementText(item, 'title') || 'Untitled',
            link: getElementText(item, 'link') || '',
            description: getElementText(item, 'description') || '',
            content: getElementText(item, 'content:encoded') ||
                     getElementText(item, 'content') ||
                     getElementText(item, 'description') || '',
            pubDate: getElementText(item, 'pubDate') ||
                     getElementText(item, 'dc:date') || '',
            author: getElementText(item, 'author') ||
                    getElementText(item, 'dc:creator') || '',
            guid: getElementText(item, 'guid') || getElementText(item, 'link') || ''
        };
    });

    return articles;
}

/**
 * Parses Atom feed format
 */
function parseAtomFeed(doc) {
    const feed = doc.querySelector('feed');
    const feedTitle = getElementText(feed, 'title') || 'Untitled Feed';
    const entries = doc.querySelectorAll('entry');

    const articles = Array.from(entries).map(entry => {
        // Atom links are in attributes
        const linkEl = entry.querySelector('link[rel="alternate"]') ||
                       entry.querySelector('link');
        const link = linkEl ? linkEl.getAttribute('href') : '';

        // Get content or summary
        const content = getElementText(entry, 'content') ||
                       getElementText(entry, 'summary') || '';

        return {
            feedTitle: feedTitle,
            title: getElementText(entry, 'title') || 'Untitled',
            link: link,
            description: getElementText(entry, 'summary') || '',
            content: content,
            pubDate: getElementText(entry, 'published') ||
                     getElementText(entry, 'updated') || '',
            author: getElementText(entry, 'author > name') || '',
            guid: getElementText(entry, 'id') || link
        };
    });

    return articles;
}

/**
 * Helper to safely get text content from an element
 */
function getElementText(parent, selector) {
    const element = parent.querySelector(selector);
    return element ? element.textContent.trim() : '';
}

/**
 * Test function to validate feed parsing
 */
export function testRSSParser() {
    const sampleRSS = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>Test Feed</title>
            <item>
                <title>Test Article</title>
                <link>https://example.com/article</link>
                <description>Test description</description>
                <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
            </item>
        </channel>
    </rss>`;

    const articles = parseRSS(sampleRSS);
    console.log('RSS Parser Test:', articles);
    return articles;
}
