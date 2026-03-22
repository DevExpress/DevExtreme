import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container-extended.html')}`;

test.describe('HtmlEditor - lists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const orderedListMarkup = `
    <ol>
      <li>Item 1
        <ol>
          <li></li>
          <ol>
            <li></li>
          </ol>
        </ol>
      </li>
      <li>Item 2
        <ol>
          <li></li>
          <ol>
            <li></li>
          </ol>
        </ol>
      </li>
    </ol>
  `;

  const orderedListWithTextMarkup = `
    <p>Text</p>
    <ol>
      <li>Text
        <ol>
          <li>1</li>
          <li>2</li>
        </ol>
      </li>
      <li>Text
        <ol>
          <li>1</li>
          <li>2</li>
        </ol>
      </li>
    </ol>
  `;

  test('ordered list numbering sequence should reset for each list item (T1220554)', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 200,
      width: 200,
      value: orderedListMarkup,
    });

    await testScreenshot(page, 'htmleditor-ordered-list-appearance.png', { element: '#container' });

    });

  test('should reset nested ordered list counters when preceded by text (T1320286)', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 200,
      width: 200,
      value: orderedListWithTextMarkup,
    });

    await testScreenshot(page, 'htmleditor-ordered-list-text-appearance.png', { element: '#container' });

    });
});
