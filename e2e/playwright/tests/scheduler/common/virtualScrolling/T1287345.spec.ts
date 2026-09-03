import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

test.describe(() => {
  test.use({ browserSize: [600, 800] });

  test('Cell width set in css should be correct for virtual scrolling after scroll down (T1287345)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `
    #container .dx-scheduler-cell-sizes-horizontal {
        width: 200px !important;
    }`);

    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: 'week',
      scrolling: {
        mode: 'virtual',
      },
      currentDate: new Date(2021, 2, 28),
      height: 300,
    });

    const scheduler = new Scheduler(page, '#container');

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 3000 });
    await scheduler.toolbar.navigator.nextButton.click();

    await testScreenshot(page, 'virtual_scroll_cell_width.png', { element: scheduler.workSpace });
  });
});
