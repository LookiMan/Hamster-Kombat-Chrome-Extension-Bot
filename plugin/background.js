
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'logMessage') {
        console.log(message.text);
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'saveNewSrc') {
        chrome.storage.local.set({ newSrc: message.newSrc }, function() {
            if (chrome.runtime.lastError) {
                sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
            } else {
                sendResponse({ status: 'success' });
            }
        });
        return true;
    } else if (message.action === 'getNewSrc') {
        chrome.storage.local.get('newSrc', function(result) {
            if (chrome.runtime.lastError) {
                console.error('Error retrieving newSrc:', chrome.runtime.lastError);
                sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
            } else {
                sendResponse({ status: 'success', newSrc: result.newSrc });
            }
        });
        return true;
    }
});
