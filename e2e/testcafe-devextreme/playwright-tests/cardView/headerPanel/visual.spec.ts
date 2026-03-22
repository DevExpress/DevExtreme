import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - HeaderPanel Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      width: 600,
    });

    await testScreenshot(page, 'default-render.png', {
      element: page.locator('.dx-cardview-headers'),
    });
  });

  test('render with header filter enabled', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      headerFilter: { visible: true },
      width: 600,
    });

    await testScreenshot(page, 'header-filter-enabled.png', {
      element: page.locator('.dx-cardview-headers'),
    });
  });

  test('render with single sorting', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      columns: ['id', 'filedA', { dataField: 'filedB', sortOrder: 'asc' }, 'fieldC'],
      width: 600,
    });

    await testScreenshot(page, 'single-sorting.png', {
      element: page.locator('.dx-cardview-headers'),
    });
  });

  test('headerPanel column chooser link opens column chooser on click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      height: 600,
      columns: [{ dataField: 'Column 1', visible: false }],
      columnChooser: { enabled: true },
    });

    await page.locator('.dx-cardview-headers .dx-cardview-column-chooser-link').click();

    await testScreenshot(page, 'card-view-column-chooser-opened-on-empty-header-panel-link-click.png', {
      element: page.locator('#container'),
    });
  });
});
