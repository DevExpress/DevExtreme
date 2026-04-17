import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const baseData = [
  { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
  { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
  { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
  { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
];

const baseColumns = [{ dataField: 'id' }, { dataField: 'title' }, { dataField: 'name' }, { dataField: 'lastName' }];

test.describe('CardView - FilterPanel API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('filterPanel.customizeText API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: {
        visible: true,
        customizeText(e) {
          if (e.text === "[Title] Equals 'Mr.'") {
            return 'Men';
          }
          if (e.text === "[Title] Equals 'Mrs.'") {
            return 'Women';
          }
          return e.text;
        },
      },
      filterValue: ['title', '=', 'Mr.'],
    });

    const filterText = page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-text');
    await expect(filterText).toHaveText('Men');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterPanel.customizeText', (e) => {
        if (e.text === "[Title] Equals 'Mr.'") return 'Not women';
        if (e.text === "[Title] Equals 'Mrs.'") return 'Not men';
        return e.text;
      });
    });

    await expect(filterText).toHaveText('Not women');
  });

  test('filterEnabled API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true, filterEnabled: false },
      filterValue: ['title', '=', 'Mr.'],
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(4);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterPanel.filterEnabled', true);
    });

    await expect(cards).toHaveCount(3);
  });

  test('filterPanel.texts API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: {
        visible: true,
        texts: {
          clearFilter: 'Custom Clear Filter',
          createFilter: 'Custom Create Filter',
          filterEnabledHint: 'Custom Filter Enabled Hint',
        },
      },
      filterValue: ['title', '=', 'Mr.'],
    });

    const clearBtn = page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-clear-filter');
    await expect(clearBtn).toHaveText('Custom Clear Filter');

    const checkbox = page.locator('.dx-datagrid-filter-panel .dx-checkbox');
    await expect(checkbox).toHaveAttribute('title', 'Custom Filter Enabled Hint');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterPanel.texts.clearFilter', 'Custom Clear Filter2');
      ($('#container') as any).dxCardView('instance').option('filterPanel.texts.filterEnabledHint', 'Custom Filter Enabled Hint2');
    });

    await expect(clearBtn).toHaveText('Custom Clear Filter2');
    await expect(checkbox).toHaveAttribute('title', 'Custom Filter Enabled Hint2');

    await clearBtn.click();

    const filterText = page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-text');
    await expect(filterText).toHaveText('Custom Create Filter');

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterPanel.texts.createFilter', 'Custom Create Filter2');
    });

    await expect(filterText).toHaveText('Custom Create Filter2');
  });

  test('filterPanel.visible API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' }],
      columns: baseColumns,
      filterPanel: { visible: false },
      filterValue: ['title', '=', 'Mr.'],
    });

    const filterPanel = page.locator('.dx-datagrid-filter-panel');
    await expect(filterPanel).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterPanel.visible', true);
    });

    await expect(filterPanel).toBeVisible();
  });

  test('filterValue API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true },
      filterValue: ['title', '=', 'Mr.'],
    });

    const filterText = page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-text');
    await expect(filterText).toHaveText("[Title] Equals 'Mr.'");

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('filterValue', ['title', '=', 'Mrs.']);
    });

    await expect(filterText).toHaveText("[Title] Equals 'Mrs.'");
  });

  test('clearFilter API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: baseData,
      columns: baseColumns,
      filterPanel: { visible: true },
      filterValue: ['title', '=', 'Mr.'],
    });

    const cards = page.locator('.dx-cardview-card');
    await expect(cards).toHaveCount(3);

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').clearFilter();
    });

    await expect(cards).toHaveCount(4);

    const filterText = page.locator('.dx-datagrid-filter-panel .dx-datagrid-filter-panel-text');
    await expect(filterText).toHaveText('Create Filter');
  });
});
