import { expect, test } from '../../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../../helpers/const';
import { createWidget } from '../../../../../helpers/createWidget';
import DataGrid from '../../../../../models/dataGrid';
import { gridData, gridOptions } from './options';

test.describe('Keyboard Navigation - screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await createWidget(page, 'dxDataGrid', gridOptions, DEFAULT_SELECTOR, { arg: gridData });
  });

  test('Focus goes inside master detail on tab', async ({ page }) => {
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    const innerDataGrid = new DataGrid(page, dataGrid.getMasterRow(0).element.locator(':has(> .dx-datagrid)'));

    await dataGrid.getDataCell(0, 4).element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).expectFocused();
  });

  test('Focus goes inside previous master detail on shift+tab', async ({ page }) => {
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    const innerDataGrid = new DataGrid(page, dataGrid.getMasterRow(0).element.locator(':has(> .dx-datagrid)'));

    await dataGrid.getDataCell(1, 1).element.click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    await innerDataGrid.getDataCell(0, 0).expectFocusVisible();
  });

  test('Focus goes on master detail using arrow keys', async ({ page }) => {
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();
    await dataGrid.getDataCell(0, 1).element.click();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getMasterRow(0).getCell()).toBeFocused();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getDataRow(1).getCommandCell(0).element).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(dataGrid.getMasterRow(0).getCell()).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(dataGrid.getDataRow(0).getCommandCell(0).element).toBeFocused();
  });

  test('Focus goes inside master detail on enter & goes out on esc', async ({ page }) => {
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    const innerDataGrid = new DataGrid(page, dataGrid.getMasterRow(0).element.locator(':has(> .dx-datagrid)'));

    await dataGrid.getDataCell(0, 1).element.click();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getMasterRow(0).getCell()).toBeFocused();

    await page.keyboard.press('Enter');
    await innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).expectFocused();

    await page.keyboard.press('Escape');
    await expect(dataGrid.getMasterRow(0).getCell()).toBeFocused();
  });

  test('up/down arrows works only on master detail, not on its content', async ({ page }) => {
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    const innerDataGrid = new DataGrid(page, dataGrid.getMasterRow(0).element.locator(':has(> .dx-datagrid)'));

    await dataGrid.getDataCell(0, 1).element.click();

    await page.keyboard.press('ArrowDown');
    await expect(dataGrid.getMasterRow(0).getCell()).toBeFocused();

    await page.keyboard.press('Enter');
    await innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).expectFocused();

    await page.keyboard.press('ArrowUp');
    await innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).expectFocused();

    await page.keyboard.press('ArrowDown');
    await innerDataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).expectFocused();
  });
});
