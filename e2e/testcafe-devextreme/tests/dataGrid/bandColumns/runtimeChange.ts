import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Button from 'devextreme-testcafe-models/button';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

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

test('Changing dataField for a banded column with the columnOption method does not work as expected (T1210340)', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const changeFieldButton = new Button('#otherContainer');

  await t
    .expect(dataGrid.getDataCell(0, 4).element.innerText)
    .eql('2353025')
    .click(changeFieldButton.element)
    .expect(dataGrid.getDataCell(0, 4).element.innerText)
    .eql('0.672');
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      id: 1,
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
    columns: [
      'Country',
      'Area', {
        caption: 'Population',
        columns: [
          'Population_Total',
          'Population_Urban',
        ],
      }, {
        caption: 'Nominal GDP',
        columns: [{
          caption: 'Total, mln $',
          dataField: 'GDP_Total',
          name: 'GDP_Total',
        }, {
          caption: 'By Sector',
          columns: [{
            caption: 'Agriculture',
            dataField: 'GDP_Agriculture',
          }, {
            caption: 'Industry',
            dataField: 'GDP_Industry',
            format: {
              type: 'percent',
            },
          }, {
            caption: 'Services',
            dataField: 'GDP_Services',
          }],
        }],
      }],
    keyExpr: 'id',
    showBorders: true,
  });

  await createWidget('dxButton', {
    text: 'Change fields',
    onClick() {
      const grid = ($('#container') as any).dxDataGrid('instance');
      grid.columnOption('GDP_Total', 'dataField', 'GDP_Services');
    },
  }, '#otherContainer');
});
