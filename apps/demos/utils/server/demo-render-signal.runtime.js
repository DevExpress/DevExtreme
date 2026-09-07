export const MESSAGE_TYPE = 'demo-rendered';

// #app for React/Vue, demo-app for Angular.
export const ROOT_SELECTOR = '#app, demo-app';

export const RENDER_TIMEOUT_MS = 10000;

let posted = false;

export function signal() {
  if (posted) return;
  posted = true;
  try {
    window.parent.postMessage({ type: MESSAGE_TYPE }, '*');
  } catch {
    // A parent that rejects the message is the parent's problem.
  }
}

function signalAfterPaint() {
  if (typeof requestAnimationFrame !== 'function') {
    signal();
    return;
  }
  requestAnimationFrame(() => requestAnimationFrame(signal));
}

export function signalWhenRendered() {
  const root = document.querySelector(ROOT_SELECTOR);
  if (!root || root.children.length > 0 || typeof MutationObserver !== 'function') {
    signalAfterPaint();
    return;
  }

  const observer = new MutationObserver(() => {
    if (root.children.length === 0) return;
    observer.disconnect();
    clearTimeout(timeoutId);
    signalAfterPaint();
  });
  const timeoutId = setTimeout(() => {
    observer.disconnect();
    signal();
  }, RENDER_TIMEOUT_MS);
  observer.observe(root, { childList: true });
}
