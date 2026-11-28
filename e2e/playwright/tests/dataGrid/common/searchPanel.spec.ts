import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';

test.describe('Search Panel', () => {
  test.use({ browserSize: [800, 800] });

  // T1046688
  test('searchPanel has correct view inside masterDetail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ column1: 'first' }],
      columns: ['column1'],
      masterDetail: {
        enabled: true,
        template(container) {
          ($('<div>') as any)
            .dxDataGrid({
              searchPanel: {
                visible: true,
                width: 240,
                placeholder: 'Search...',
              },
              columns: ['detail1'],
              dataSource: [],
            })
            .appendTo(container);
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // act
    await dataGrid.getDataRow(0).getCommandCell(0).element.click();

    const masterRow = dataGrid.getMasterRow(0);
    const masterGrid = masterRow.getDataGrid();

    // assert
    await testScreenshot(page, 'T1046688.searchPanel.png', { element: masterGrid.element });
  });

  // T1272535
  test('Base sensitivity search should accept rows with accent letters in lookup columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { id: 1, text: 'tešt', lookup: 1 },
          { id: 2, text: 'test', lookup: 2 },
          { id: 3, text: 'chest', lookup: 3 },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: {
            sensitivity: 'base',
          },
        },
      },
      keyExpr: 'id',
      searchPanel: { visible: true },
      columns: ['id', 'text', {
        dataField: 'lookup',
        lookup: {
          dataSource: [
            { id: 1, text: 'another' },
            { id: 2, text: 'ánother' },
            { id: 3, text: 'other' },
          ],
          valueExpr: 'id',
          displayExpr: 'text',
        },
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getSearchBox().input.click();
    await page.keyboard.press('a');

    await expect(dataGrid.getDataRows()).toHaveCount(2);
    await expect(dataGrid.getDataRows().filter({ hasText: 'another' }).first()).toBeAttached();
    await expect(dataGrid.getDataRows().filter({ hasText: 'ánother' }).first()).toBeAttached();
  });
});
