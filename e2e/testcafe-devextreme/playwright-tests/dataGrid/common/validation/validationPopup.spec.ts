import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Validation popup screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataCell(0, 0).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    await expect(dataGrid.getRevertTooltip()).toBeVisible();
    await expect(dataGrid.getInvalidMessageTooltip()).toBeVisible();

    await testScreenshot(page, 'validation-popup.png', { element: page.locator('#container') });
  });

  test('Validation popup with open master detail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      masterDetail: { enabled: true },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(5).getDataCell(0).click();
    await dataGrid.getDataCell(5, 2).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    await expect(dataGrid.getRevertTooltip()).toBeVisible();
    await expect(dataGrid.getInvalidMessageTooltip()).toBeVisible();

    await testScreenshot(page, 'validation-popup_master-detail.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ y: 150 });
    await testScreenshot(page, 'validation-popup_master-detail_after-scroll.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ y: 0 });
  });

  test('Validation popup with open master detail and fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{
        dataField: 'field_0',
        validationRules: [{ type: 'required' }],
        fixed: true,
      }, {
        dataField: 'field_1',
        validationRules: [{ type: 'required' }],
      }],
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
      },
      masterDetail: { enabled: true },
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.getFixedDataRow(5).getDataCell(0).click();
    await dataGrid.getDataCell(5, 2).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    await expect(dataGrid.getRevertTooltip()).toBeVisible();
    await expect(dataGrid.getInvalidMessageTooltip()).toBeVisible();

    await testScreenshot(page, 'validation-popup_master-detail_fixed-column.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ y: 150 });
    await testScreenshot(page, 'validation-popup_master-detail_fixed-column_after-scroll.png', { element: page.locator('#container') });

    await dataGrid.scrollTo({ y: 0 });
  });
});
