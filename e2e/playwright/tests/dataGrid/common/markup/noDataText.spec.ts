import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import SelectBox from '../../../../models/selectBox';
import { typeText } from '../../helpers/typeText';

test.describe('No Data', () => {
  test('The noDataText element should be rendered when a lookup column is filtered (T1293839)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { ID: 1, Name: 'John', Lookup: 1 },
        { ID: 2, Name: 'Jane', Lookup: 2 },
      ],
      keyExpr: 'ID',
      columns: ['Name', {
        dataField: 'Lookup',
        lookup: {
          dataSource: [
            { ID: 1, Text: 'Item 1' },
            { ID: 2, Text: 'Item 2' },
          ],
          valueExpr: 'ID',
          displayExpr: 'Text',
        },
      }],
      showBorders: true,
      filterRow: { visible: true },
      onEditorPreparing(e) {
        e.updateValueTimeout = 0;
      },
    }));

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const nameFilterInput = dataGrid.getFilterCell(0).getEditorInput().element;
    const lookupFilterEditor = dataGrid.getFilterEditor(1, SelectBox);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await lookupFilterEditor.element.click();

    // assert
    await expect.poll(() => lookupFilterEditor.isOpened()).toBe(true);

    // act
    const lookupList = await lookupFilterEditor.getList();
    const lookupItem = lookupList.getItem(1);
    await lookupItem.element.click();
    await typeText(nameFilterInput, 'test');

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1293839-grid-no-data-text-rendered.png', { element: dataGrid.element });
  });

  test('The noDataText element should be centered (T1178289)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      columns: ['column1', 'column2', 'column3', 'column4', 'column5'],
      showBorders: true,
      columnMinWidth: 200,
      width: 600,
      stateStoring: {
        enabled: true,
        storageKey: 'testStorageKey',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.option('dataSource', []);

    await testScreenshot(page, 'grid-no-data-text-position.png', { element: dataGrid.element });
  });
});
