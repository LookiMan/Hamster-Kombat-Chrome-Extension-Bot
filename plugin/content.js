console.log('Plugin is loading...');
let intervalId;
let isRunning = false;

function checkAndTrigger() {
  const element = document.querySelector('.user-tap-energy p');
  if (!element) return;

  const textContent = element.textContent.trim();
  const values = textContent.split('/').map(value => parseInt(value.trim(), 10));

  if (values.length !== 2) return;

  const [firstValue, secondValue] = values;

  if (!window.isRunning && firstValue >= (secondValue / 2)) {
    window.isRunning = true;
  }

  if (!window.isRunning) {
    return;
  }

  if (firstValue > (secondValue * 0.05)) {
    const targetElement = document.querySelector('.user-tap-button-inner');
    if (targetElement) {
      triggerPointerEvents(targetElement);
    }
  } else {
    window.isRunning = false;
  }
}

function triggerPointerEvents(element) {
  const pointerDownEvent = new PointerEvent('pointerdown', {
    bubbles: true,
    cancelable: true,
    pointerType: 'mouse'
  });

  const pointerUpEvent = new PointerEvent('pointerup', {
    bubbles: true,
    cancelable: true,
    pointerType: 'mouse'
  });

  const delay = Math.floor(Math.random() * 11) + 10;

  element.dispatchEvent(pointerDownEvent);

  setTimeout(() => {
    element.dispatchEvent(pointerUpEvent);
  }, delay);
}

function getHashParameter(url, parameterName) {
  const hash = new URL(url).hash.substring(1);
  const hashParams = new URLSearchParams(hash);
  return hashParams.get(parameterName);
}

function openHamsterKombatGame(iframe) {
  let src = iframe.getAttribute('src');
  if (src && src.startsWith('https://hamsterkombatgame.io/clicker/')) {
    const newSrc = src.replace('tgWebAppPlatform=weba', 'tgWebAppPlatform=android');
    iframe.setAttribute('src', newSrc);

    chrome.runtime.sendMessage({ action: 'saveNewSrc', newSrc: newSrc }, function(response) {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to background:', chrome.runtime.lastError);
      } else {
        console.log('Response from background:', response);
      }
    });

    document.querySelector('.modal-dialog .modal-header button').click();
    window.open(newSrc, '_blank');
  }
}

console.log('Start plugin...');

const iframe = document.querySelector('iframe');
if (iframe) {
  openHamsterKombatGame(iframe);
} else if (String(document.location).startsWith('https://web.telegram.org/')) {
  setInterval(() => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      openHamsterKombatGame(iframe);
    }
  }, 2500);
} else if (String(document.location).startsWith('https://hamsterkombatgame.io/')) {
  window.intervalId = setInterval(checkAndTrigger, 100);
  window.isRunning = true;

  const tgWebAppData = getHashParameter(window.location.href, 'tgWebAppData');
  if (!tgWebAppData) {
    chrome.runtime.sendMessage({ action: 'getNewSrc' }, function(response) {
        if (response && response.newSrc) {
            window.location.href = response.newSrc;
            window.location.reload();
        } else {
            console.error('No newSrc in response or response is undefined.');
        }
    });
  }
}
