export const DEFAULT_BROWSER_SIZE: [number, number] = [1200, 800];

export const DEFAULT_THEME = 'fluent.blue.light';

export const DEFAULT_SELECTOR = '#container';

export const SERVER_PORT = 8080;

export const TEST_PAGE_URL = '/e2e/playwright/tests/container.html';

// A matrix input that is not set for the job arrives as an empty string, not as undefined.
export const readEnv = (value: string | undefined, fallback: string): string => (
  value === undefined || value === '' ? fallback : value
);
