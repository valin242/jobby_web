document.addEventListener('DOMContentLoaded', function() {
    // Request current tab data when popup opens
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'START_SCRAPE'});
    });

    const fillButton = document.getElementById('fill');
    const saveButton = document.getElementById('save');
    
    // Fill button handler
    fillButton.addEventListener('click', async function() {
        try {
            fillButton.disabled = true;
            fillButton.textContent = 'Loading...';
            
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            // Send message to content script
            chrome.tabs.sendMessage(tab.id, {action: 'START_SCRAPE'}, function(response) {
                if (chrome.runtime.lastError) {
                    showMessage('Error: Could not connect to page', 'error');
                    fillButton.disabled = false;
                    fillButton.textContent = 'Fill';
                }
            });
        } catch (error) {
            console.error('Error:', error);
            showMessage('Error: ' + error.message, 'error');
            fillButton.disabled = false;
            fillButton.textContent = 'Fill';
        }
    });

    // Save button handler
    saveButton.addEventListener('click', async function() {
        try {
            saveButton.disabled = true;
            saveButton.textContent = 'Saving...';

            const applicationData = {
                company: document.getElementById('company').value,
                jobTitle: document.getElementById('jobTitle').value,
                description: document.getElementById('description').value,
                status: document.getElementById('status').value,
                date: new Date().toISOString().split('T')[0],
                url: document.getElementById('jobUrl')?.value || window.location.href
            };

            console.log('Sending data to save:', applicationData);  // Debug log

            // Send to background script for CSV processing
            chrome.runtime.sendMessage({
                action: 'SAVE_TO_CSV',
                data: applicationData
            }, function(response) {
                console.log('Received save response:', response);  // Debug log
                
                if (response && response.success) {
                    showMessage('Application saved successfully!', 'success');
                    saveButton.textContent = 'Saved!';
                    
                    // Reset button after delay
                    setTimeout(() => {
                        saveButton.disabled = false;
                        saveButton.textContent = 'Save Application';
                    }, 2000);
                } else {
                    const errorMsg = response?.error || 'Failed to save application';
                    showMessage('Error: ' + errorMsg, 'error');
                    saveButton.disabled = false;
                    saveButton.textContent = 'Save Application';
                }
            });

        } catch (error) {
            console.error('Error in save handler:', error);
            showMessage('Error: ' + error.message, 'error');
            saveButton.disabled = false;
            saveButton.textContent = 'Save Application';
        }
    });

    // Message listener for scraped data
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'SCRAPE_COMPLETE') {
            fillButton.disabled = false;
            fillButton.textContent = 'Fill';

            if (message.error) {
                showMessage(message.error, 'error');
                return;
            }

            if (message.data) {
                document.getElementById('company').value = message.data.company || '';
                document.getElementById('jobTitle').value = message.data.jobTitle || '';
                document.getElementById('description').value = message.data.description || '';
                
                // Store URL in a hidden input or data attribute
                if (!document.getElementById('jobUrl')) {
                    const urlInput = document.createElement('input');
                    urlInput.type = 'hidden';
                    urlInput.id = 'jobUrl';
                    document.querySelector('.container').appendChild(urlInput);
                }
                document.getElementById('jobUrl').value = message.data.url || '';
                
                showMessage('Data filled successfully!', 'success');
            }
        }
    });

    function showMessage(text, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
});

// Listen for scraped data
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Popup received message:', message);
    
    if (message.action === 'SCRAPE_COMPLETE') {
        const fillButton = document.getElementById('fill');
        fillButton.textContent = 'Fill';
        fillButton.disabled = false;

        if (message.error) {
            showMessage(message.error, 'error');
            return;
        }

        if (message.data) {
            document.getElementById('company').value = message.data.company || '';
            document.getElementById('jobTitle').value = message.data.jobTitle || '';
            document.getElementById('description').value = message.data.description || '';
            showMessage('Data filled successfully!', 'success');
        } else {
            showMessage('No data received', 'error');
        }
    }
});

// Save button handler - modified to handle Excel
document.getElementById('save').addEventListener('click', function() {
  const applicationData = {
    company: document.getElementById('company').value,
    jobTitle: document.getElementById('jobTitle').value,
    description: document.getElementById('description').value,
    status: document.getElementById('status').value,
    date: new Date().toISOString().split('T')[0],
    url: window.location.href
  };

  // Send to background script for Excel processing
  chrome.runtime.sendMessage({
    action: 'SAVE_TO_EXCEL',
    data: applicationData
  });
});

// Listen for save response
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SAVE_COMPLETE') {
    showMessage('Application saved successfully!', 'success');
  } else if (request.action === 'SAVE_ERROR') {
    showMessage('Error saving application.', 'error');
  }
});