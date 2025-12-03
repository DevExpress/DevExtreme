import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Column resizing`
  .page(url(__dirname, '../../container.html'));

test('column separator should starts from the parent', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  async function makeColumnSeparatorScreenshot(index: number) {
    await dataGrid.resizeHeader(index, 0, false);
    await testScreenshot(t, takeScreenshot, `column-separator-${index}.png`);

    await t.dispatchEvent(dataGrid.element, 'mouseup');
  }

  await makeColumnSeparatorScreenshot(1);
  await makeColumnSeparatorScreenshot(2);
  await makeColumnSeparatorScreenshot(3);
  await makeColumnSeparatorScreenshot(4);
  await makeColumnSeparatorScreenshot(5);
  await makeColumnSeparatorScreenshot(6);
  await makeColumnSeparatorScreenshot(7);
  await makeColumnSeparatorScreenshot(8);
  await makeColumnSeparatorScreenshot(9);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
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
}));

// T1314667
test('DataGrid – Resize indicator is moved when resizing a grouped column if showWhenGrouped is set to true', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.expect(dataGrid.isReady()).ok();

  await dataGrid.resizeHeader(3, 30, false);

  await t
    .expect(dataGrid.getHeaders().getHeaderRow(1).getHeaderCell(0).element.clientWidth)
    .within(128, 130);
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [{
      ID: 1,
      Country: 'Brazil',
      Area: 8515767,
      Population_Urban: 0.85,
      Population_Rural: 0.15,
      Population_Total: 205809000,
    }],
    keyExpr: 'ID',
    allowColumnResizing: true,
    columnResizingMode: 'widget',
    width: 500,
    columns: [
      {
        dataField: 'ID',
        fixed: true,
        allowReordering: false,
        width: 50,
      },

      {
        caption: 'Population',
        columns: [
          {
            dataField: 'Country',
            showWhenGrouped: true,
            width: 100,
            groupIndex: 0,
          },
          { dataField: 'Area' },
          { dataField: 'Population_Total' },
          { dataField: 'Population_Urban' },
          { dataField: 'Population_Rural' },
        ],
      },
    ],
  });
});
