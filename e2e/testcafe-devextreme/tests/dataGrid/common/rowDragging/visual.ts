import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName, testScreenshot } from '../../../../helpers/themeUtils';

fixture`Row dragging.Visual`
  .page(url(__dirname, '../../../container.html'));

// T1179218
test('Rows should appear correctly during dragging when virtual scrolling is enabled and rowDragging.dropFeedbackMode = "push"', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const themeName = getThemeName();
  const scrollTopOffsetsByTheme = {
    generic: [150, 350, 75],
    fluent: [150, 350, 100],
    material: [150, 350, 100],
  };

  // drag the row down
  await dataGrid.moveRow(0, 30, scrollTopOffsetsByTheme[themeName][0], true);
  await dataGrid.moveRow(0, 30, scrollTopOffsetsByTheme[themeName][1]);

  // waiting for autoscrolling
  await t.wait(2000);

  // drag the row up
  await dataGrid.moveRow(0, 30, scrollTopOffsetsByTheme[themeName][2]);

  // waiting for autoscrolling
  await t.wait(1000);

  await testScreenshot(t, takeScreenshot, 'T1179218-virtual-scrolling-dragging-row.png', { element: dataGrid.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.maximizeWindow();
  return createWidget('dxDataGrid', {
    height: 440,
    keyExpr: 'id',
    scrolling: {
      mode: 'virtual',
    },
    dataSource: [...new Array(100)].fill(null).map((_, index) => ({ id: index })),
    columns: ['id'],
    rowDragging: {
      allowReordering: true,
      dropFeedbackMode: 'push',
    },
  });
});
