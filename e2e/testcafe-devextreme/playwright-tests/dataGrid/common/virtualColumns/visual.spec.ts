import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: needs DataGrid page object for apiUpdateDimensions
test.describe('Virtual Columns.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};

      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
      }

      items.push(item);
    }

    return items;
  };

  test.skip('The updateDimensions method should render the grid if a container was hidden and columnRenderingMode is virtual', async ({ page }) => {
    // TODO: Playwright migration - screenshot mismatch
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.evaluate(() => {
      $('#container').wrap('<div id=\'wrapperContainer\' style=\'display: none;\'></div>');
    });

    await createWidget(page, 'dxDataGrid', {
      height: 440,
      dataSource: generateData(150, 500),
      columnWidth: 100,
      scrolling: {
        columnRenderingMode: 'virtual',
      },
    });

    await expect(page.locator('#wrapperContainer')).toBeHidden();

    await page.evaluate(() => {
      $('#wrapperContainer').css('display', '');
    });

    await page.waitForTimeout(200);
    await expect(page.locator('#wrapperContainer')).toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxDataGrid('instance').updateDimensions();
    });

    await testScreenshot(page, 'T1090735-grid-virtual-columns.png', { element: '#wrapperContainer' });
  });
});
