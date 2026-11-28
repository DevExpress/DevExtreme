import type { Page } from '@playwright/test';

// The test page is new for every test, so the list holds the warnings of this test only.
export const collectWarnings = (page: Page, code: string): string[] => {
  const warnings: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().startsWith(code)) {
      warnings.push(message.text());
    }
  });

  return warnings;
};
