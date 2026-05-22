import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $, ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.RemoteGrouping')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

const scroll = ClientFunction((pixels) => {
  document.querySelector('.dx-scrollable-container').scrollTop = pixels;
});

runManualTest('DataGrid', 'RemoteGrouping', (test) => {
  // Remote WidgetsGalleryDataService is unstable
  test.skip('RemoteGrouping', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await $('.dx-scrollable-container')();

    await testScreenshot(t, takeScreenshot, 'datagrid_remote_grouping_initial.png');

    await scroll(5000);

    await testScreenshot(t, takeScreenshot, 'datagrid_remote_grouping_scrolled.png');

    await t.click($('.dx-group-row').nth(2).child('.dx-datagrid-expand'));

    await testScreenshot(t, takeScreenshot, 'datagrid_remote_grouping_expanded.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
