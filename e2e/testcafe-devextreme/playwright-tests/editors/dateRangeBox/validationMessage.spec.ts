import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import { DateRangeBox } from '../../../playwright-helpers/dateRangeBox';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateRangeBox validation message position', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The validation message overlay for DateRangeBox should be correctly positioned before and after opening', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container { display: flex; flex-direction: column; gap: 20px; }');

    const id1 = `drb-${Math.random().toString(36).slice(2, 8)}`;
    const id2 = `drb-${Math.random().toString(36).slice(2, 8)}`;

    await appendElementTo(page, '#container', 'div', id1, {});
    await appendElementTo(page, '#container', 'div', id2, {});

    await createWidget(page, 'dxDateRangeBox', {
      width: 500,
      isValid: false,
      validationError: { message: 'Error 1' },
    }, `#${id1}`);

    await createWidget(page, 'dxDateRangeBox', {
      width: 500,
      isValid: false,
      validationError: { message: 'Error 2' },
    }, `#${id2}`);

    await testScreenshot(page, 'The validation message overlay position for DateRangeBox before opening.png', { element: '#container' });

    const drb1 = new DateRangeBox(page, `#${id1}`);
    await drb1.getStartDateBox().input.click();
    await page.waitForTimeout(300);

    await testScreenshot(page, 'The validation message overlay position for DateRangeBox after opening.png', { element: '#container' });
  });
});
