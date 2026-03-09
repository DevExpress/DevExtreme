import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import SelectBox from 'devextreme-testcafe-models/selectBox';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`No Data`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

test('The noDataText element should be rendered when a lookup column is filtered (T1293839)', async (t) => {
  // arrange
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const nameFilterInput = dataGrid.getFilterCell(0).getEditorInput().element;
  const lookupFilterEditor = dataGrid.getFilterEditor(1, SelectBox);

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.click(lookupFilterEditor.element);

  // assert
  await t.expect(lookupFilterEditor.isOpened()).ok();

  // act
  const lookupList = await lookupFilterEditor.getList();
  const lookupItem = lookupList.getItem(1);
  await t.click(lookupItem.element);
  await t.typeText(nameFilterInput, 'test');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  await testScreenshot(t, takeScreenshot, 'T1293839-grid-no-data-text-rendered.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
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
  });
});

test('The noDataText element should be centered (T1178289)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  await dataGrid.option('dataSource', []);

  await testScreenshot(t, takeScreenshot, 'grid-no-data-text-position.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    columns: ['column1', 'column2', 'column3', 'column4', 'column5'],
    showBorders: true,
    columnMinWidth: 200,
    width: 600,
    stateStoring: {
      enabled: true,
      storageKey: 'testStorageKey',
    },
  });
});
