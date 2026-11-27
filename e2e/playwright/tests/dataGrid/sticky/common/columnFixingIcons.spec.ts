import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getData } from '../../helpers/generateDataSourceData';

test.describe('Column Fixing', () => {
  test('Fixed columns: Check context menu items', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 5),
      width: '100%',
      columnFixing: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getHeaders().getHeaderRow(0).element.click({ button: 'right' });
    await contextMenu.getItemByText('Set Fixed Position').click();

    await expect(contextMenu.getItemByText('Left')).toBeVisible();

    await testScreenshot(page, 'sticky_columns_context_menu.png');
  });
});
