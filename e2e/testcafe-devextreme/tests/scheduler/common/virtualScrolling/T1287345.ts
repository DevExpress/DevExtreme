import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { scrollTo } from '../../helpers/utils';
import {
  insertStylesheetRulesToPage,
  removeStylesheetRulesFromPage,
} from '../../../../helpers/domUtils';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';

fixture.disablePageReloads`Scheduler: Virtual scrolling`
  .page(url(__dirname, '../../../container.html'));

safeSizeTest('Cell width set in css should be correct for virtual scrolling after scroll down (T1287345)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const scheduler = new Scheduler('#container');

  await scrollTo(0, 3000);
  await t.click(scheduler.toolbar.navigator.nextButton);
  await t.expect(await takeScreenshot('virtual_scroll_cell_width.png', scheduler.workSpace)).ok();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [600, 800]).before(async () => {
  await insertStylesheetRulesToPage(`
    #container .dx-scheduler-cell-sizes-horizontal {
        width: 200px !important;
    }`);
  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'week',
    scrolling: {
      mode: 'virtual',
    },
    currentDate: new Date(2021, 2, 28),
    height: 300,
  });
}).after(async () => {
  await removeStylesheetRulesFromPage();
});
