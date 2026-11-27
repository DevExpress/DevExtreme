import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Column resizing', () => {
  test('column separator should starts from the parent', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        Country: 'Brazil',
        Area: 8515767,
        Population_Urban: 0.85,
        Population_Rural: 0.15,
        Population_Total: 205809000,
        GDP_Agriculture: 0.054,
        GDP_Industry: 0.274,
        GDP_Services: 0.672,
        GDP_Total: 2353025,
      }],
      keyExpr: 'ID',
      columnWidth: 100,
      allowColumnResizing: true,
      showBorders: true,
      editing: {
        allowUpdating: true,
      },
      columns: ['Country', {
        dataField: 'Population_Total',
        visible: false,
      }, {
        caption: 'Population',
        columns: ['Population_Rural', {
          caption: 'By Sector',
          columns: ['GDP_Total', {
            caption: 'not resizable',
            dataField: 'ID',
            allowResizing: false,
          }, 'GDP_Agriculture', 'GDP_Industry'],
        }],
      }, {
        caption: 'Nominal GDP',
        columns: ['GDP_Total', 'Population_Urban'],
      }, 'Area'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const makeColumnSeparatorScreenshot = async (index: number): Promise<void> => {
      await dataGrid.resizeHeader(index, 0, false);
      await testScreenshot(page, `column-separator-${index}.png`);

      // A dispatched mouseup ends the resizing, as in TestCafe. Releasing the real button where it
      // was pressed would click the header and sort the column.
      await dataGrid.element.dispatchEvent('mouseup');
    };

    await makeColumnSeparatorScreenshot(1);
    await makeColumnSeparatorScreenshot(2);
    await makeColumnSeparatorScreenshot(3);
    await makeColumnSeparatorScreenshot(4);
    await makeColumnSeparatorScreenshot(5);
    await makeColumnSeparatorScreenshot(6);
    await makeColumnSeparatorScreenshot(7);
    await makeColumnSeparatorScreenshot(8);
    await makeColumnSeparatorScreenshot(9);
  });
});
