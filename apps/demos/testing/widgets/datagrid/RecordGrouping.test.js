import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.RecordGrouping')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('DataGrid', 'RecordGrouping', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('RecordGrouping', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click($('#autoExpand'));

    await testScreenshot(t, takeScreenshot, 'datagrid_record_grouping_2_desktop.png');

    await t
      .click($('#autoExpand'));

    await testScreenshot(t, takeScreenshot, 'datagrid_record_grouping_3_desktop.png');

    await t
      .drag(
        $('.dx-datagrid-headers .dx-datagrid-drag-action').nth(0),
        50,
        -50,
        { offsetX: 5, offsetY: 5 },
      );

    await testScreenshot(t, takeScreenshot, 'datagrid_record_grouping_4_desktop.png');

    await t
      .click($('.dx-datagrid-group-opened').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_record_grouping_5_desktop.png');

    await t
      .click($('.dx-datagrid-group-opened').nth(0));

    await testScreenshot(t, takeScreenshot, 'datagrid_record_grouping_6_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
