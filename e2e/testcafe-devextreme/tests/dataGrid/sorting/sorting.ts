import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { changeTheme } from '../../../helpers/changeTheme';
import { Themes } from '../../../helpers/themes';

fixture.disablePageReloads`Sorting`.page(
  url(__dirname, '../../container.html'),
);

test('Filter expression should be valid when sortingMethod, remoteOperations, and autoNavigateToFocusedRow are specified (T1200546)', async (t) => {
  const dataGrid = new DataGrid('#container');
  // assert
  await t
    .expect(dataGrid.dataRows.count)
    .eql(6)
    .expect(dataGrid.getErrorRow().exists)
    .eql(false);
}).before(async () => createWidget('dxDataGrid', () => {
  const sampleData = Array.from({ length: 20 }, (_, i) => ({
    ID: i + 1,
    Name: `Name ${i + 1}`,
  }));
  const sampleAPI = new (window as any).DevExpress.data.ArrayStore(
    sampleData,
  );
  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'ID',
    load(o) {
      if (o.filter && typeof o.filter[0] === 'function') {
        return Promise.reject();
      }
      return Promise.all([sampleAPI.load(o), sampleAPI.totalCount(o)]).then(
        (res) => ({
          data: res[0],
          totalCount: res[1],
        }),
      );
    },
  });
  return {
    dataSource: store,
    remoteOperations: true,
    columns: [
      'ID',
      {
        dataField: 'Name',
        sortOrder: 'asc',
        sortingMethod() {
          return 1;
        },
      },
    ],
    paging: { pageSize: 5 },
    scrolling: { mode: 'virtual' },
    height: 200,
    showBorders: true,
    focusedRowEnabled: true,
    focusedRowKey: 18,
    autoNavigateToFocusedRow: true,
  };
}));

test('Multiple sorting alphabetical icons should be correct in Fluent Theme (T1243658)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .rightClick(dataGrid.getHeaders().element)
    .hover(dataGrid.element);
  await takeScreenshot(
    'datagrid-alphabetical-icons-should-be-correct.png',
    dataGrid.element,
  );
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(
  async () => {
    await changeTheme(Themes.fluentBlue);
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          ID: 1,
          FirstName: 'John',
        },
      ],
      keyExpr: 'ID',
      sorting: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'FirstName',
          sortOrder: 'asc',
        },
      ],
    });
  },
).after(async () => { await changeTheme(Themes.genericLight); });
