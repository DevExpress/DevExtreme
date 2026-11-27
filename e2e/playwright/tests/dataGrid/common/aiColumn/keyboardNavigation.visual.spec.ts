import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Ai Column.KeyboardNavigation.Visual', () => {
  test('Check keyboard navigation for AI column', async ({ page }) => {
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
        { dataField: 'id', caption: 'ID' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // The click sorts the column: the grid renders the headers again a moment later.
    await dataGrid.waitForContentReady(() => headerRow.getHeaderCell(0).element.click());
    await headerRow.getHeaderCell(0).expectFocused();

    await page.keyboard.press('Tab');

    await expect(headerRow.getCommandCell(1).element).toBeFocused();

    await page.keyboard.press('Tab');

    await headerRow.getCommandCell(1).getAIDropDownButton().expectFocused();

    await testScreenshot(page, 'datagrid__ai-column__focused-dropdown-button.png', { element: dataGrid.element });

    await page.keyboard.press('Tab');

    await headerRow.getHeaderCell(2).expectFocused();
  });
});
