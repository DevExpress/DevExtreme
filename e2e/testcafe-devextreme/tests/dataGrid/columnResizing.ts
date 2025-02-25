import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Column resizing`
  .page(url(__dirname, '../container.html'));

test('column separator should starts from the parent', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  async function makeColumnSeparatorScreenshot(index: number) {
    await dataGrid.resizeHeader(index, 0, false);
    await t.expect(await takeScreenshot(`column-separator-${index}.png`)).ok();
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
