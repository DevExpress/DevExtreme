import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const GRID_SELECTOR = '#container';

test.describe('Keyboard Navigation - screenshots', () => {
  test('Focused cells should look correctly', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 1,
          columnA: 'A_0',
          columnB: 'B_0',
        },
        {
          id: 2,
          columnA: 'A_1',
          columnB: 'B_1',
        },
        {
          id: 3,
          columnA: 'A_2',
          columnB: 'B_2',
        },
      ],
      keyExpr: 'id',
      columns: ['id', 'columnA', 'columnB'],
      sorting: {
        mode: 'none',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    const headerCellToFocus = headerRow.getHeaderCell(0);
    const dataCellToFocus = dataGrid.getDataCell(0, 0);

    await headerCellToFocus.element.click();
    await page.keyboard.press('Tab');

    await headerRow.getHeaderCell(1).expectFocused();
    await testScreenshot(page, 'data-grid_keyboard-navigation-header-cell-focused.png');

    await dataCellToFocus.element.click();
    await page.keyboard.press('Tab');

    await dataGrid.getDataCell(0, 1).expectFocusVisible();
    await testScreenshot(page, 'data-grid_keyboard-navigation-data-cell-focused.png');
  });

  test('Focused custom buttons should look correctly', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 1,
          columnA: 'A_0',
          columnB: 'B_0',
        },
        {
          id: 2,
          columnA: 'A_1',
          columnB: 'B_1',
        },
        {
          id: 3,
          columnA: 'A_2',
          columnB: 'B_2',
        },
      ],
      keyExpr: 'id',
      columns: [
        {
          type: 'buttons',
          buttons: [
            {
              hint: 'button_1',
              icon: 'edit',
            },
            {
              hint: 'button_2',
              icon: 'remove',
            },
          ],
        },
        'id',
        'columnA',
        'columnB',
      ],
      sorting: {
        mode: 'none',
      },
    });

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerCellToFocus = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);
    const customButtonsCell = dataGrid.getDataCell(0, 0);

    await headerCellToFocus.element.click();
    await page.keyboard.press('Tab');

    await customButtonsCell.expectFocusVisible();
    await testScreenshot(page, 'data-grid_keyboard-navigation-custom-buttons-cell-focused.png');

    await page.keyboard.press('Tab');

    await expect(customButtonsCell.getIconByTitle('button_1')).toBeFocused();
    await testScreenshot(page, 'data-grid_keyboard-navigation-custom-button-focused.png');
  });
});
