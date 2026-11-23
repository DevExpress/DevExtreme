import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';
import { ACCESSIBILITY_VIEWPORT } from './utils/visual-tests/playwright/const';

export default defineConfig(baseConfig, {
  testMatch: 'accessibility.spec.ts',
  use: { viewport: ACCESSIBILITY_VIEWPORT },
});
