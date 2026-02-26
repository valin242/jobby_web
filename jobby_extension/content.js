// Add this at the top of content.js
console.log('Jobby Extension: Content script loaded at:', new Date().toISOString());

// Global variable to track initialization
window.jobbyContentScriptLoaded = true;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);

    if (message.action === 'START_SCRAPE') {
        console.log('Starting scrape process');
        // Send immediate response to confirm receipt
        sendResponse({ received: true });

        scrapeAndProcess()
            .then(data => {
                console.log('Scrape complete, sending data:', data);
                chrome.runtime.sendMessage({
                    action: 'SCRAPE_COMPLETE',
                    data: data
                });
            })
            .catch(error => {
                console.error('Scraping error:', error);
                chrome.runtime.sendMessage({
                    action: 'SCRAPE_COMPLETE',
                    error: error.message
                });
            });
        return true; // Keep message channel open
    }
});

async function scrapeAndProcess() {
    try {
        // Get page text
        const pageText = document.body.innerText;
        console.log('Scraped text length:', pageText.length);
        console.log('First 100 characters:', pageText.substring(0, 100));

        // Get current URL
        const currentUrl = window.location.href;

        // Send to background script for LLM processing
        console.log('Sending to background script...');
        const response = await chrome.runtime.sendMessage({
            action: 'PROCESS_WITH_AI',
            data: { 
                pageText,
                url: currentUrl,  // Add URL to the data
                debug: true
            }
        });

        console.log('Raw LLM Response:', response);

        if (response.error) {
            console.error('LLM Processing Error:', response.message);
            throw new Error(response.message || 'Failed to process with AI');
        }

        const processedData = {
            company: response.company || '',
            jobTitle: response.jobTitle || '',
            description: response.description || '',
            url: currentUrl  // Include URL in processed data
        };
        
        console.log('Processed Data:', processedData);
        return processedData;

    } catch (error) {
        console.error('Detailed error in scrapeAndProcess:', error);
        throw error;
    }
}

// Helper function to handle message timeouts
function sendMessageWithTimeout(message, timeout) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Message processing timed out'));
        }, timeout);

        chrome.runtime.sendMessage(message, response => {
            clearTimeout(timeoutId);
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
            } else {
                resolve(response);
            }
        });
    });
}

async function scrapeJobData() {
    // Get all visible text from the page
    const pageText = document.body.innerText;
    
    // Common selectors for different job sites
    const selectors = {
      title: [
        'h1',
        '[data-job-title]',
        '.job-title',
        '.posting-title',
        '[class*="title" i]'
      ],
      company: [
        '[data-company]',
        '.company-name',
        '.employer',
        '[class*="company" i]',
        '[class*="employer" i]'
      ],
      description: [
        '[data-job-description]',
        '.job-description',
        '.description',
        '[class*="description" i]',
        'article'
      ]
    };
  
    // Helper function to try multiple selectors
    function trySelectors(selectorList) {
      for (const selector of selectorList) {
        const element = document.querySelector(selector);
        if (element) return element.innerText.trim();
      }
      return '';
    }
  
    // Get initial data from DOM
    const scrapedData = {
      jobTitle: trySelectors(selectors.title),
      company: trySelectors(selectors.company),
      description: trySelectors(selectors.description),
      url: window.location.href,
      date: new Date().toISOString().split('T')[0]
    };
  
    // Send data to background script for AI processing
    chrome.runtime.sendMessage({
      action: 'PROCESS_WITH_AI',
      data: {
        pageText: pageText,
        scrapedData: scrapedData
      }
    });
  }