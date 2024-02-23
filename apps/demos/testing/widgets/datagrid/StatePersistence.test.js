import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.StatePersistence')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'StatePersistence', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('StatePersistence', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .drag($('.dx-header-row .dx-datagrid-action').nth(0), 100, -50, {
        offsetX: 5,
        offsetY: 5,
      })
      .drag($('.dx-scrollbar-vertical .dx-scrollable-scroll'), 0, 250);

    await testScreenshot(t, takeScreenshot, 'datagrid_state_persistence_2_desktop.png');

    await t.eval(() => location.reload(true));

    await testScreenshot(t, takeScreenshot, 'datagrid_state_persistence_3_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
