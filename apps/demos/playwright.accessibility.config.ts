import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';
import { ACCESSIBILITY_VIEWPORT } from './utils/visual-tests/playwright/const';

export default defineConfig(baseConfig, {
  testMatch: 'accessibility.spec.ts',
  retries: 0,
  use: { viewport: ACCESSIBILITY_VIEWPORT, trace: 'off', screenshot: 'off' },
});
