import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';

fixture.disablePageReloads`Band columns: runtime change`
  .page(url(__dirname, '../../container.html'));

const GRID_CONTAINER = '#container';

const dataSource = [
  {
    id: 0,
    A: 'A_0',
    B: 0,
  },
  {
    id: 1,
    A: 'A_1',
    B: 1,
  },
  {
    id: 2,
    A: 'A_2',
    B: 2,
  },
];

const lookUpDataSource = [
  {
    id: 0,
    text: 'Lookup_value_0',
  },
  {
    id: 1,
    text: 'Lookup_value_1',
  },
  {
    id: 2,
    text: 'Lookup_value_2',
  },
];

const columns = [
  {
    dataField: 'A',
  },
  {
    dataField: 'B',
    lookup: {
      dataSource: lookUpDataSource,
      valueExpr: 'id',
      displayExpr: 'text',
    },
  },
];

const nestedColumns = [
  {
    dataField: 'A',
  },
  {
    name: 'Nested',
    caption: 'Nested',
    columns: [
      {
        dataField: 'B',
        lookup: {
          dataSource: lookUpDataSource,
          valueExpr: 'id',
          displayExpr: 'text',
        },
      },
    ],
  },
];

const changeDataGridColumnsReactWay = ClientFunction(() => {
  const dataGridWidget = ($(`${GRID_CONTAINER}`) as any).dxDataGrid('instance');

  dataGridWidget.beginUpdate();

  dataGridWidget.option('columns[1].dataField', undefined);
  dataGridWidget.option('columns[1].lookup', undefined);
  dataGridWidget.option('columns[1].columns', nestedColumns[1].columns);
  dataGridWidget.option('columns[1].name', nestedColumns[1].name);
  dataGridWidget.option('columns[1].caption', nestedColumns[1].caption);

  dataGridWidget.endUpdate();
}, { dependencies: { GRID_CONTAINER, nestedColumns } });

test('Should change usual columns to band columns without error in React (T1213679)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_CONTAINER);

  await takeScreenshot('band-columns_before-runtime-update.png', dataGrid.element);

  await changeDataGridColumnsReactWay();

  await takeScreenshot('band-columns_after-runtime-update.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [...dataSource],
    columns: [...columns],
    keyExpr: 'id',
    showBorders: true,
  });
});
