import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Accordion_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Accordion items render (T865742)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'accordion');
    await appendElementTo(page, '#container', 'div', 'accordion2');

    await setAttribute(page, '#container', 'style', 'display: flex; gap: 50px;');

    const items: any[] = [
      { title: 'Some text 1', icon: 'coffee' },
      { title: 'Some text 2' },
      { title: 'Some text 3' },
    ];

    await createWidget(page, 'dxAccordion', { items, width: 500 }, '#accordion');
    await createWidget(page, 'dxAccordion', { items, rtlEnabled: true, width: 500 }, '#accordion2');

    const screenshotName = 'Accordion items render.png';

    await testScreenshot(page, screenshotName, { element: '#container' });

    });

  test('Icon-only button should be rendered correctly (T851081)', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'accordion');

    const itemTitleTemplate = () => ($('<div>') as any).dxButton({ icon: 'coffee' });

    await createWidget(page, 'dxAccordion', { dataSource: [{}], itemTitleTemplate }, '#accordion');

    const screenshotName = 'Accordion with icon-only button.png';

    await testScreenshot(page, screenshotName, { element: '#container' });

    });
});
