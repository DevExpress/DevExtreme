import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('DataGrid.VirtualScrolling')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'VirtualScrolling', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('VirtualScrolling', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.hover($('.dx-scrollbar-vertical .dx-scrollable-scroll'));
    await takeScreenshot('datagrid_virtual_scrolling_2_desktop.png');

    await t.scrollBy('.dx-scrollable-container', 0, 2000000);

    await takeScreenshot('datagrid_virtual_scrolling_3_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
