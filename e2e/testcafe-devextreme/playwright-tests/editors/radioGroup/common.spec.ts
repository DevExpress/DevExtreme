import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Radio Group', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Radio buttons placed into the template should not be selected after clicking the parent radio button (T816449)', async ({ page }) => {
    // skipped: requires RadioGroup page object with getItem/radioButton nested accessors
  });

  test('Dot of Radio button placed in scaled container should have valid centering(T1165339)', async ({ page }) => {

    await setStyleAttribute(page, '#container', 'width: 600px; height: 100px;');

    await appendElementTo(page, '#container', 'div', 'radioGroup');
    await setStyleAttribute(page, '#radioGroup', 'transform: scale(0.7);');

    await createWidget(page, 'dxRadioGroup', {
      items: ['One', 'Two', 'Three'],
      value: 'Two',
    }, '#radioGroup');

    await testScreenshot(page, 'RadioGroup in scaled container.png', { element: '#container' });
  });
});
