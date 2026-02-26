// Add this to your existing background.js
async function processWithLlama(text) {
    try {
        console.log('Sending text to LLM server...');
        
        const prompt = `
            Analyze this job posting and extract the following information. 
            Respond in valid JSON format:
            {
                "jobTitle": "the job title",
                "company": "the company name",
                "description": "a brief 2-3 sentence summary"
            }

            Job posting text:
            ${text}
        `;

        const response = await fetch('http://localhost:3000/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('LLM server response:', data);

        if (data.error) {
            throw new Error(data.error);
        }

        // Try to parse the response if it's a string
        try {
            const result = typeof data.response === 'string' 
                ? JSON.parse(data.response) 
                : data.response;
                
            console.log('Parsed result:', result);
            return result;
        } catch (e) {
            console.error('Failed to parse LLM response:', e);
            throw new Error('Invalid response format from LLM');
        }

    } catch (error) {
        console.error('Error in processWithLlama:', error);
        throw error;
    }
}

// Error types for better error handling
const ErrorTypes = {
    NETWORK: 'NetworkError',
    SERVER: 'ServerError',
    TIMEOUT: 'TimeoutError',
    VALIDATION: 'ValidationError'
};

// Main message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background received message:', message);

    if (message.action === 'PROCESS_WITH_AI') {
        processWithLlama(message.data.pageText)
            .then(result => {
                console.log('Sending processed result:', result);
                sendResponse(result);
            })
            .catch(error => {
                console.error('Processing error:', error);
                sendResponse({ 
                    error: true, 
                    message: error.message || 'LLM processing error'
                });
            });
        return true;
    }

    if (message.action === 'SAVE_TO_CSV') {
        console.log('Received SAVE_TO_CSV request:', message.data);
        
        saveToCSV(message.data)
            .then(result => {
                console.log('Save successful:', result);
                sendResponse({ success: true });
            })
            .catch(error => {
                console.error('Save failed:', error);
                sendResponse({ 
                    success: false, 
                    error: error.message 
                });
            });
        return true; // Keep message channel open for async response
    }
});

async function handleAIProcessing(message, sender) {
    try {
        // Validate input data
        if (!message.data?.pageText) {
            throw new ValidationError('Missing page text data');
        }

        // Construct prompt with error checking
        const prompt = constructPrompt(message.data);
        
        // Call LLM server with timeout and retry
        const result = await fetchWithRetry('http://localhost:3000/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        // Validate LLM response
        if (!result.response) {
            throw new Error('Invalid response from LLM');
        }

        return result;

    } catch (error) {
        logError(error);
        throw error;
    }
}

// Retry mechanism for API calls
async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
    try {
        const response = await fetchWithTimeout(url, options);
        
        if (!response.ok) {
            throw new NetworkError(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}

// Timeout wrapper for fetch
function fetchWithTimeout(url, options, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
            setTimeout(() => reject(new TimeoutError('Request timed out')), timeout)
        )
    ]);
}

async function saveToCSV(data) {
    try {
        console.log('Sending data to server:', data);
        const response = await fetch('http://localhost:3000/save-csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save to CSV: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in saveToCSV:', error);
        throw error;
    }
}