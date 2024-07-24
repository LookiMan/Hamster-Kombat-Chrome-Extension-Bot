
function getTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs[0].id);
      }
    });
  });
}

document.getElementById('startButton').addEventListener('click', function() {
  getTabId().then(tabId => {
    chrome.scripting.executeScript({
      target: { tabId },
      function: startInterval
    });
  }).catch(error => {
    console.error('Error:', error);
  });
});

document.getElementById('pauseButton').addEventListener('click', function() {
  getTabId().then(tabId => {
    chrome.scripting.executeScript({
      target: { tabId },
      function: stopInterval
    });
  }).catch(error => {
    console.error('Error:', error);
  });
});

document.getElementById('loginButton').addEventListener('click', function() {
  chrome.storage.local.get('newSrc', function(result) {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving newSrc:', chrome.runtime.lastError);
      return;
    }

    const newSrc = result.newSrc;

    if (newSrc) {
      getTabId().then(tabId => {
        chrome.tabs.update(tabId, { url: newSrc }, function(tab) {
          if (chrome.runtime.lastError) {
            console.error('Error updating tab URL:', chrome.runtime.lastError);
          } else {
            console.log('Tab URL updated to:', newSrc);
            chrome.tabs.reload(tabId);
          }
        });
      }).catch(error => {
        console.error('Error getting tab ID:', error);
      });
    } else {
      console.log('No newSrc found in storage.');
    }
  });
});

function startInterval() {
  if (window.intervalId) {
    clearInterval(window.intervalId);
  }
  window.intervalId = setInterval(checkAndTrigger, 100);
  window.isRunning = true;
}

function stopInterval() {
  if (window.intervalId) {
    clearInterval(window.intervalId);
    window.intervalId = null;
    window.isRunning = false;

  }
}
