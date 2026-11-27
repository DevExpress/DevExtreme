import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('DataGrid - contrast', () => {
  // T1257970
  test('DataGrid - Contrast between icons in the Filter Row menu and their background doesn\'t comply with WCAG accessibility standards', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 5),
      filterRow: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getFilterCell(0);
    const searchButton = filterCell.menuButton;
    const filterMenu = filterCell.menu;

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await searchButton.click();
    await expect(filterMenu.element).toBeAttached();

    await testScreenshot(page, 'T1257970-datagrid-menu-icon-contrast.png', { element: dataGrid.element });
  });

  // T1286345
  test('DataGrid - Filter icon should remain visible when it\'s focused', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(2, 2),
      filterRow: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const searchIconContainer = dataGrid
      .getHeaders()
      .getFilterRow()
      .getFilterCell(1)
      .getSearchIcon()
      .element;

    await dataGrid.getFilterCell(0).element.click();
    await page.keyboard.press('Tab');
    await expect(searchIconContainer).toBeFocused();

    await testScreenshot(page, 'T1286345-datagrid-menu-icon-when-focused.png', { element: dataGrid.element });
  });
});
