import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.InfiniteScrolling')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'InfiniteScrolling', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('InfiniteScrolling', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.hover($('.dx-datagrid-rowsview'));
    await testScreenshot(t, takeScreenshot, 'datagrid_infinite_scrolling_2_desktop.png');

    await t.scrollBy('.dx-scrollable-container', 0, 250);

    await testScreenshot(t, takeScreenshot, 'datagrid_infinite_scrolling_3_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
