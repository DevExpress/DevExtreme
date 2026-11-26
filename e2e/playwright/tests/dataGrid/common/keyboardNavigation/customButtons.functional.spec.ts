import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const GRID_SELECTOR = '#container';

const createDataGrid = async (page: Page): Promise<void> => createWidget(page, 'dxDataGrid', () => ({
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
          onClick: (e) => $(e.event!.target).attr('has-been-clicked', 'true'),
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
}));

test.describe('Keyboard Navigation - custom buttons', () => {
  test('Custom buttons cell should be focused before custom buttons on tab navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(0, 0);
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Tab');

    await expectedFocusedCell.expectFocusVisible();
  });

  test('Custom buttons cell should be focused after custom buttons on shift+tab reverse navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const expectedFocusedCell = dataGrid.getDataCell(0, 0);
    const cellToStartNavigation = dataGrid.getDataCell(0, 1);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    await expectedFocusedCell.expectFocusVisible();
  });

  test('First custom button inside custom buttons cell should be focused on tab navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const customButtonsCell = dataGrid.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await expect(expectedFocusedButton).toBeFocused();
  });

  test('Last custom button inside custom buttons cell should be focused on shift+tab reverse navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const customButtonsCell = dataGrid.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.getIconByTitle('button_2');
    const cellToStartNavigation = dataGrid.getDataCell(0, 1);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Shift+Tab');

    await expect(expectedFocusedButton).toBeFocused();
  });

  test('Custom button inside custom buttons cell should be clickable by pressing enter key', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const customButtonsCell = dataGrid.getDataCell(0, 0);
    const expectedFocusedButton = customButtonsCell.getIconByTitle('button_1');
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await expect(expectedFocusedButton).toHaveAttribute('has-been-clicked');
  });
});
