import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

test.describe('Ai Column.Adaptivity', () => {
  test('The AI column should not hidden when columnHidingEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      width: 390,
      columnWidth: 100,
      columnHidingEnabled: true,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const thirdHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(2);
    const fourthHeaderCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    // The adaptivity has hidden a column, so the AI column was a candidate too.
    await thirdHeaderCell.expectHidden();

    await expect(fourthHeaderCell.element).toHaveText('AI Column');
    await fourthHeaderCell.expectHidden(false);

    await expect(dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton()).toBeVisible();
  });
});
