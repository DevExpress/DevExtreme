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

  test('render with header filter enabled with filter values', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      columns: [
        'id',
        'filedA',
        { dataField: 'filedB', filterValues: ['B_0'] },
        { dataField: 'filedC', filterValues: ['C_0'] },
      ],
      headerFilter: { visible: true },
      width: 600,
    });

    await testScreenshot(page, 'header-filter-enabled-with-values.png', {
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

  test('render with single sorting and header filter enabled', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      columns: ['id', 'filedA', { dataField: 'filedB', sortOrder: 'asc' }, 'fieldC'],
      headerFilter: { visible: true },
      width: 600,
    });

    await testScreenshot(page, 'single-sorting-with-header-filter-enabled.png', {
      element: page.locator('.dx-cardview-headers'),
    });
  });

  test('render with multiple sorting', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      columns: [
        'id',
        'filedA',
        { dataField: 'filedB', sortOrder: 'asc', sortIndex: 1 },
        { dataField: 'filedC', sortOrder: 'desc', sortIndex: 0 },
      ],
      sorting: { mode: 'multiple' },
      width: 600,
    });

    await testScreenshot(page, 'multiple-sorting.png', {
      element: page.locator('.dx-cardview-headers'),
    });
  });

  test('render with multiple sorting and header filter', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, filedA: 'A_0', filedB: 'B_0', fieldC: 'C_0' }],
      columns: [
        'id',
        'filedA',
        { dataField: 'filedB', sortOrder: 'asc', sortIndex: 1 },
        { dataField: 'filedC', sortOrder: 'desc', sortIndex: 0 },
      ],
      sorting: { mode: 'multiple' },
      headerFilter: { visible: true },
      width: 600,
    });

    await testScreenshot(page, 'multiple-sorting-with-header-filter-enabled.png', {
      element: page.locator('.dx-cardview-headers'),
    });
  });

  test('render with horizontal scroll', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: [
        { dataField: 'A', caption: 'First long caption' },
        { dataField: 'B', caption: 'Second long caption' },
      ],
      width: 250,
    });

    await testScreenshot(page, 'render-with-horizontal-scroll.png', {
      element: page.locator('.dx-cardview-headers .dx-cardview-header-item').first(),
    });
  });

  test('headerPanel column chooser link opens column chooser on click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      height: 600,
      columns: [{ dataField: 'Column 1', visible: false }],
      columnChooser: { enabled: true },
    });

    await page.locator('.dx-cardview-headers .dx-link').click();

    await testScreenshot(page, 'card-view-column-chooser-opened-on-empty-header-panel-link-click.png', {
      element: page.locator('#container'),
    });
  });
});
