export const MESSAGE_TYPE = 'demo-rendered';

// #app for React/Vue, demo-app for Angular.
export const ROOT_SELECTOR = '#app, demo-app';

export const RENDER_TIMEOUT_MS = 10000;

export const DEFAULT_ALLOWED_ORIGINS = [
  'localhost',
  'js.devexpress.com',
];

const PATTERN = /^(?:([a-z][a-z0-9+.-]*):\/\/)?([^/:]+)(?::(\d+))?$/i;

let allowedOrigins = DEFAULT_ALLOWED_ORIGINS;
let posted = false;

export function setAllowedOrigins(origins) {
  if (Array.isArray(origins) && origins.length > 0) {
    allowedOrigins = origins;
  }
}

function hostMatches(hostname, patternHost) {
  if (!patternHost.startsWith('*.')) return hostname === patternHost;

  const suffix = patternHost.slice(1);
  return hostname.length > suffix.length && hostname.endsWith(suffix);
}

function matchesPattern(url, pattern) {
  const parts = PATTERN.exec(pattern);
  if (!parts) return false;

  const [, scheme, host, port] = parts;
  if (scheme && `${scheme.toLowerCase()}:` !== url.protocol) return false;
  if (port && port !== url.port) return false;

  return hostMatches(url.hostname, host.toLowerCase());
}

function isAllowed(origin) {
  let url;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  return allowedOrigins.some((pattern) => matchesPattern(url, pattern));
}

function parentOrigin() {
  const { ancestorOrigins } = window.location;
  if (ancestorOrigins && ancestorOrigins.length > 0) return ancestorOrigins[0];

  if (!document.referrer) return null;
  try {
    return new URL(document.referrer).origin;
  } catch {
    return null;
  }
}

export function resolveTargetOrigin() {
  const ownOrigin = window.location.origin;
  if (window.parent === window) return ownOrigin;

  const origin = parentOrigin();
  if (!origin) return null;
  if (origin === ownOrigin) return origin;

  return isAllowed(origin) ? origin : null;
}

export function signal() {
  if (posted) return;
  posted = true;

  const targetOrigin = resolveTargetOrigin();
  if (!targetOrigin) {
    console.warn(`Demo render signal was not sent: the embedding origin is unknown or not in [${allowedOrigins.join(', ')}].`);
    return;
  }

  try {
    window.parent.postMessage({ type: MESSAGE_TYPE }, targetOrigin);
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
