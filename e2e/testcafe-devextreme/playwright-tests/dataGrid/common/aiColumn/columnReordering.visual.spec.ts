import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.ColumnReordering.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('The draggable AI column should display correctly', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (dataGrid undefined, t.notOk, compareResults)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      allowColumnReordering: true,
      columnWidth: 200,
      columns: [
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    // arrange
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await dataGrid.moveHeader(0, 100, 5, true);

    // assert
    expect(await dataGrid.getDraggableHeader().visible).toBeTruthy();

    await testScreenshot(page, 'datagrid__ai-column__dragging.png', { element: page.locator('#container') });

    // act
    await dataGrid.dropHeader(0);

    // assert
    expect(await dataGrid.getDraggableHeader().visible);
    await t.notOk();
    expect(await compareResults.isValid());
    await t.ok(compareResults.errorMessages());
  });
});
