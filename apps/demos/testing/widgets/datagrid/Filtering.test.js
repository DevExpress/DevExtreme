import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector as $ } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('DataGrid.Filtering')
  .page('http://localhost:8080/')
  .beforeEach(async (t) => {
    await t
      .resizeWindow(900, 600);
  });

runManualTest('DataGrid', 'Filtering', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Filtering', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .hover(
        $('.dx-datagrid-filter-row')
          .find('.dx-menu-horizontal')
          .nth(3)
          .find('.dx-menu-item')
          .nth(0),
      )
      .expect($('.dx-overlay-wrapper').find('.dx-menu-item').count).eql(8);

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_by_range_1_desktop.png');

    await t
      .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(6));

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_by_range_2_desktop.png');

    await t
      .typeText($('.dx-overlay-wrapper').find('.dx-texteditor-input').nth(0), '1000')
      .typeText($('.dx-overlay-wrapper').find('.dx-texteditor-input').nth(1), '5000');

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_by_range_3_desktop.png');

    await t
      .click($('body'), { offsetX: 0, offsetY: 0 });

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_by_range_4_desktop.png');

    await t
      .hover($('.dx-datagrid-filter-row').find('.dx-menu-horizontal').nth(3).find('.dx-menu-item')
        .nth(0))
      .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(7))
      .expect($('.dx-overlay-wrapper').exists).notOk();

    await t
      .typeText($('.dx-datagrid-filter-row td').nth(4).find('input').nth(0), 'Harv Mudd');

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_2_desktop.png');

    await t
      .hover($('.dx-datagrid-filter-row').find('.dx-menu-horizontal').nth(4).find('.dx-menu-item')
        .nth(0))
      .expect($('.dx-overlay-wrapper').find('.dx-menu-item').count).eql(7);

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_3_desktop.png');

    await t
      .hover($('.dx-overlay-wrapper').find('.dx-menu-item').nth(1))
      .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(1))
      .expect($('.dx-overlay-wrapper').find('.dx-menu-item').exists).notOk();

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_4_desktop.png');

    // Selected operation does not contain twice(T195965)
    /* await t
        .hover(
          $('.dx-datagrid-filter-row')
          .find('.dx-menu-horizontal')
          .nth(4)')
          .find('.dx-menu-item')
          .nth(0)
        )
        .expect($('.dx-overlay-wrapper').find('.dx-menu-item').count).eql(7);

    await t
        .hover($('.dx-overlay-wrapper').find('.dx-menu-item').nth(1))
        .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(1))
        .expect($('.dx-overlay-wrapper').exists).notOk(); */

    await t
      .hover($('.dx-datagrid-filter-row').find('.dx-menu-horizontal').nth(4).find('.dx-menu-item')
        .nth(0))
      .expect($('.dx-overlay-wrapper').find('.dx-menu-item').count).eql(7);

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_5_desktop.png');

    await t
      .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(6));

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_6_desktop.png');

    await t
      .typeText($('.dx-datagrid-search-panel').nth(0), 'Harv Mudd');

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_7_desktop.png');

    await t
      .click($('.dx-datagrid-search-panel').find('.dx-icon-clear'))
      .click($('.dx-selectbox-container'))
      .click($('.dx-list-item').nth(1))
      .typeText($('.dx-datagrid-filter-row td').nth(4).find('input').nth(0), 'Harv Mudd');

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_7_1_desktop.png');

    await t
      .click($('.dx-apply-button'));

    await testScreenshot(t, takeScreenshot, 'datagrid_filtering_8_desktop.png');

    // -------------Focus on filter row widgets-------------
    await t
      .click($('#gridContainer').find('.dx-texteditor-input').nth(1))
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'datagrid_focus_on_filter_1_desktop.png');

    await t
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'datagrid_focus_on_filter_2_desktop.png');

    await t
      .hover($('.dx-datagrid-filter-row').find('.dx-menu-horizontal').nth(4).find('.dx-menu-item')
        .nth(0))
      .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(3))
      .click($('#gridContainer').find('.dx-texteditor-input').nth(1))
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, 'datagrid_focus_on_filter_3_desktop.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
