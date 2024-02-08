import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';

fixture('DataGrid.ColumnCustomization')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'ColumnCustomization', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('ColumnCustomization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.click('.dx-icon-column-chooser');
    await takeScreenshot('datagrid_column_customization_2.png');

    await t.drag(
      $('td').withAttribute('aria-label', 'Column Birth Date'),
      500, 200,
      { offsetX: 5, offsetY: 5 },
    );
    await takeScreenshot('datagrid_column_customization_3.png');

    await t.click('.dx-closebutton');
    await takeScreenshot('datagrid_column_customization_4.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
