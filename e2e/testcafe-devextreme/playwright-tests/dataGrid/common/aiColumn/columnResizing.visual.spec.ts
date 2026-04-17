import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.ColumnResizing.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('Resize AI Column when wordWrapEnabled is true', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (dataGrid undefined)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      allowColumnResizing: true,
      wordWrapEnabled: true,
      columnWidth: 100,
      columns: [
        {
          type: 'ai',
          caption: 'AI Column AI Column',
          width: 250,
        },
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    // arrange
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'datagrid__ai-column__column-resizing(wordWrapEnabled=true)-1.png', { element: page.locator('#container') });

    // act
    await dataGrid.resizeHeader(1, -150);

    await testScreenshot(page, 'datagrid__ai-column__column-resizing(wordWrapEnabled=true)-2.png', { element: page.locator('#container') });

    // assert
  });
});
