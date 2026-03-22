import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column - Column Chooser.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('The AI column can be hidden when columnChooser.mode is "dragAndDrop"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columnChooser: {
        enabled: true,
        mode: 'dragAndDrop',
      },
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
      const headerRow = page.locator('.dx-header-row').nth(0);
    const columnChooser = page.locator('.dx-datagrid-column-chooser');

    expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    // assert
    expect(await dataGrid.apiColumnOption('myAiColumn', 'visible')).toBeTruthy();
    expect(await headerRow.getHeaderTexts()).toBe(['AI Column', 'ID', 'Name', 'Value']);

    // act
    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').showColumnChooser());

    // assert
    expect(await columnChooser.isVisible()).toBeTruthy();
    expect(await columnChooser.getColumnTexts()).toBe([]);

    // act
    await t.dragToElement(
      page.locator('.dx-header-row').nth(0).locator('td').nth(0),
      page.locator('.dx-datagrid-column-chooser').content,
    );

    // assert
    expect(await dataGrid.apiColumnOption('myAiColumn', 'visible')).toBeFalsy();
    expect(await headerRow.getHeaderTexts()).toBe(['ID', 'Name', 'Value']);
    expect(await columnChooser.getColumnTexts()).toBe(['AI Column']);
  });
});
