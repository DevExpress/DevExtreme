import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { getOffsetToTriggerAutoScroll, isScrollAtEnd } from '../../helpers/rowDraggingHelpers';

fixture`Row dragging.Visual`
  .page(url(__dirname, '../../../container.html'));

// T1179218
test('Rows should appear correctly during dragging when virtual scrolling is enabled and rowDragging.dropFeedbackMode = "push"', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // drag the row down
  await dataGrid.moveRow(0, 30, 150, true);
  await dataGrid.moveRow(0, 30, await getOffsetToTriggerAutoScroll(0, 1, 'down'));

  // waiting for autoscrolling
  await t.wait(2000);

  await t
    .expect(dataGrid.getDataRow(99).getDataCell(1).element.textContent)
    .eql('99')
    .expect(isScrollAtEnd('vertical'))
    .ok();

  // drag the row up
  await dataGrid.moveRow(0, 30, await getOffsetToTriggerAutoScroll(0, 1));

  // waiting for autoscrolling
  await t.wait(2000);

  await t
    .expect(dataGrid.getDataRow(0).getDataCell(1).element.textContent)
    .eql('0')
    .expect(dataGrid.getScrollTop())
    .eql(0);

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
