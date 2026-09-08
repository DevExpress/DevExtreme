import type { Page } from '@playwright/test';

export interface RequestLogger {
  count: () => number;
  clear: () => void;
  dispose: () => void;
}

// Counts the requests the page makes to a URL, the way the TestCafe RequestLogger did. It listens
// on "request", not on "response", so a request is counted even when the mock answers it.
export const createRequestLogger = (page: Page, urlPattern: RegExp): RequestLogger => {
  let requests = 0;

  const onRequest = (request: { url: () => string }): void => {
    if (urlPattern.test(request.url())) {
      requests += 1;
    }
  };

  page.on('request', onRequest);

  return {
    count: () => requests,
    clear: () => { requests = 0; },
    dispose: () => { page.off('request', onRequest); },
  };
};
