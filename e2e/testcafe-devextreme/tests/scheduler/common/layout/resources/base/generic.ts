import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../../helpers/createWidget';
import url from '../../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';
import { changeTheme } from '../../../../../../helpers/changeTheme';
import { testScreenshot } from '../../../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../../../../container.html'));

const createScheduler = async (view: string, resourcesValue?: unknown[]): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    views: [view],
    currentView: view,
    resources: resourcesValue,
    height: 600,
  });
};

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['agenda', 'day', 'week', 'month', 'workWeek'].forEach((view) => {
    test(`Base views layout test with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click(scheduler.toolbar.viewSwitcher.element);
      await t.click(scheduler.getAppointment('1 appointment', 0).element);
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await testScreenshot(t, takeScreenshot, `resource(view=${view}-resource=${!!resourcesValue}).png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createScheduler(view, resourcesValue));
  });
});

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineMonth', 'timelineWorkWeek'].forEach((view) => {
    test(`Timeline views layout test with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      /*
       * If appointment position is the same in the next view,then mouse doesn't change
       * their position and doesn't trigger hover effect. This is the reason for the instability
       * of the tests. The following operation ensures that the mouse position is changed.
       */
      await t.click(scheduler.toolbar.viewSwitcher.element);
      await t.click(scheduler.getAppointment('1 appointment', 0).element);
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await testScreenshot(t, takeScreenshot, `resource(view=${view}-resource=${!!resourcesValue}).png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createScheduler(view, resourcesValue));
  });
});

test('Scheduler should have correct height in month view (T927862)', async (t) => {
  const scheduler = new Scheduler('#container');

  const dataTableBoundingClientRect = await scheduler.dateTable.boundingClientRect;
  const workspaceBoundingClientRect = await scheduler.workspaceScrollable.boundingClientRect;

  await t
    .expect(dataTableBoundingClientRect.bottom)
    .eql(workspaceBoundingClientRect.bottom);
}).before(async () => {
  await changeTheme('material.blue.light');

  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    height: 800,
  });
}).after(async () => {
  await changeTheme('generic.light');
});
