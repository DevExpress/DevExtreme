import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $, ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.RemoteGrouping')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

const scroll = ClientFunction((pixels) => {
  document.querySelector('.dx-scrollable-container').scrollTop = pixels;
});

runManualTest('DataGrid', 'RemoteGrouping', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('RemoteGrouping', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await $('.dx-scrollable-container')();
    await scroll(5000);

    await testScreenshot(t, takeScreenshot, 'datagrid_remote_grouping_2_desktop.png');

    await t
      .click($('.dx-group-row td').withText('Madrid Store').prevSibling());

    await testScreenshot(t, takeScreenshot, 'datagrid_remote_grouping_3_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
