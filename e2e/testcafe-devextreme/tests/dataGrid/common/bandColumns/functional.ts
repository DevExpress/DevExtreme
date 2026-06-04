import Button from 'devextreme-testcafe-models/button';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Band columns.Functional`
  .page(url(__dirname, '../../../container.html'));

const GRID_CONTAINER = '#container';

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

// Initial state (width: 350px, all columns visible):
//
// Header Rows:
// ┌───────────────────────┬──────────┬──────────┐
// │  Band 1 (colspan=2)   │  field3  │ adaptive │
// │     [FIRST ✓]         │(rowspan2)│(rowspan2)│
// ├───────────┬───────────┤          │          │
// │  field1   │  field2   │          │          │
// │ [FIRST ✓] │           │          │          │
// └───────────┴───────────┴──────────┴──────────┘
//
// After resize (width: 275px, field1 hidden — hidingPriority: 0):
//
// Header Rows:
// ┌───────────────────────┬──────────┬──────────┐
// │  Band 1 (colspan=2)   │  field3  │ adaptive │
// │     [FIRST ✓]         │(rowspan2)│(rowspan2)│
// ├───────────┬───────────┤          │          │
// │  field1   │  field2   │          │          │
// │ [HIDDEN]  │ [FIRST ✓] │          │          │
// └───────────┴───────────┴──────────┴──────────┘
test('The first header class should update correctly when the first data column is hidden in responsive mode', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const firstHeaderRow = dataGrid.getHeaders().getHeaderRow(0);
  const secondHeaderRow = dataGrid.getHeaders().getHeaderRow(1);

  await t
    .expect(dataGrid.isReady()).ok()
    .expect(firstHeaderRow.getHeaderCell(0).isFirstCell) // Band 1
    .ok()
    .expect(firstHeaderRow.getHeaderCell(2).isFirstCell) // field3
    .notOk()
    .expect(secondHeaderRow.getHeaderCell(0).isFirstCell) // field1
    .ok()
    .expect(secondHeaderRow.getHeaderCell(1).isFirstCell) // field2
    .notOk();

  await dataGrid.apiOption('width', 275);

  await t
    .expect(firstHeaderRow.getHeaderCell(0).isFirstCell) // Band 1
    .ok()
    .expect(firstHeaderRow.getHeaderCell(2).isFirstCell) // field3
    .notOk()
    .expect(secondHeaderRow.getHeaderCell(0).isFirstCell) // field1
    .notOk()
    .expect(secondHeaderRow.getHeaderCell(1).isFirstCell) // field2
    .ok();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 350,
    columnWidth: 100,
    columnHidingEnabled: true,
    dataSource: [{ field1: 1, field2: 2, field3: 3 }],
    columns: [
      {
        caption: 'Band 1',
        columns: [
          { dataField: 'field1', hidingPriority: 0 },
          { dataField: 'field2', hidingPriority: 1 },
        ],
      },
      { dataField: 'field3', hidingPriority: 2 },
    ],
  });
});

// Initial state (width: 350px, all columns visible):
//
// Header Rows:
// ┌──────────┬───────────────────────┬──────────┐
// │  field1  │  Band 1 (colspan=2)   │ adaptive │
// │(rowspan2)│                       │(rowspan2)│
// │[FIRST ✓] ├───────────┬───────────┤          │
// │          │  field2   │  field3   │          │
// │          │           │           │          │
// └──────────┴───────────┴───────────┴──────────┘
//
// After resize (width: 275px, field1 hidden):
//
// Header Rows:
// ┌──────────┬───────────────────────┬──────────┐
// │  field1  │  Band 1 (colspan=2)   │ adaptive │
// │(rowspan2)│       [FIRST ✓]       │(rowspan2)│
// │ [HIDDEN] ├───────────┬───────────┤          │
// │          │  field2   │  field3   │          │
// │          │ [FIRST ✓] │           │          │
// └──────────┴───────────┴───────────┴──────────┘
test('The first header class should update correctly when the first nested data column is hidden in responsive mode', async (t) => {
  const dataGrid = new DataGrid(GRID_CONTAINER);
  const firstHeaderRow = dataGrid.getHeaders().getHeaderRow(0);
  const secondHeaderRow = dataGrid.getHeaders().getHeaderRow(1);

  await t
    .expect(dataGrid.isReady()).ok()
    .expect(firstHeaderRow.getHeaderCell(0).isFirstCell) // field 1
    .ok()
    .expect(firstHeaderRow.getHeaderCell(1).isFirstCell) // Band 1
    .notOk()
    .expect(secondHeaderRow.getHeaderCell(0).isFirstCell) // field2
    .notOk()
    .expect(secondHeaderRow.getHeaderCell(1).isFirstCell) // field3
    .notOk();

  await dataGrid.apiOption('width', 275);

  await t
    .expect(firstHeaderRow.getHeaderCell(0).isFirstCell) // field 1
    .notOk()
    .expect(firstHeaderRow.getHeaderCell(1).isFirstCell) // Band 1
    .ok()
    .expect(secondHeaderRow.getHeaderCell(0).isFirstCell) // field2
    .ok()
    .expect(secondHeaderRow.getHeaderCell(1).isFirstCell) // field3
    .notOk();
}).before(async () => {
  await createWidget('dxDataGrid', {
    width: 350,
    columnWidth: 100,
    columnHidingEnabled: true,
    dataSource: [{ field1: 1, field2: 2, field3: 3 }],
    columns: [
      { dataField: 'field1', hidingPriority: 0 },
      {
        caption: 'Band 1',
        columns: [
          { dataField: 'field2', hidingPriority: 1 },
          { dataField: 'field3', hidingPriority: 2 },
        ],
      },
    ],
  });
});
