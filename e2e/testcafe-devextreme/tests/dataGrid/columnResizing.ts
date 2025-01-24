import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';

import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Column resizing`
  .page(url(__dirname, '../container.html'));

test('column separator should starts from the parent', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const dataGridOffset = {
    offsetX: await dataGrid.element.offsetLeft ?? 0,
    offsetY: await dataGrid.element.offsetTop ?? 0,
  };
  let screenshotIndex = 0;
  async function makeColumnSeparatorScreenshot(offsetX: number, offsetY: number) {
    const correctedOffsetX = offsetX + 1; // 1px for grid left border
    await t.hover(dataGrid.element, { offsetX: correctedOffsetX, offsetY });
    await t.dispatchEvent(
      dataGrid.getColumnsSeparator().element,
      'mousedown',
      {
        offsetX: correctedOffsetX + dataGridOffset.offsetX,
        offsetY: offsetY + dataGridOffset.offsetY,
      },
    );
    await t.expect(await takeScreenshot(`column-separator-${screenshotIndex}.png`)).ok();
    await t.dispatchEvent(dataGrid.getColumnsSeparator().element, 'mouseup');
    screenshotIndex += 1;
  }

  // first row
  await makeColumnSeparatorScreenshot(0, 15);
  await makeColumnSeparatorScreenshot(100, 15);
  await makeColumnSeparatorScreenshot(6 * 100, 15);
  await makeColumnSeparatorScreenshot(8 * 100, 15);
  await makeColumnSeparatorScreenshot(9 * 100, 15);
  await makeColumnSeparatorScreenshot(10 * 100, 15);
  // second row
  await makeColumnSeparatorScreenshot(2 * 100, 45);
  await makeColumnSeparatorScreenshot(6 * 100, 45);
  await makeColumnSeparatorScreenshot(7 * 100, 45);
  await makeColumnSeparatorScreenshot(8 * 100, 45);
  // third row
  await makeColumnSeparatorScreenshot(3 * 100, 75);
  await makeColumnSeparatorScreenshot(4 * 100, 75);
  await makeColumnSeparatorScreenshot(5 * 100, 75);
  await makeColumnSeparatorScreenshot(6 * 100, 75);

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
