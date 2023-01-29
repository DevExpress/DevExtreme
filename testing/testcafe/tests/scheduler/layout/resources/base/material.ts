import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import Scheduler from '../../../../../model/scheduler';
import url from '../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture.disablePageReloads`Scheduler: Material theme layout`
  .page(url(__dirname, '../../../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
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
});

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
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element);
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async (t) => {
      await t.click('html', { offsetX: 0, offsetY: 0 });

      await changeTheme('material.blue.light');

      return createScheduler(view, resourcesValue);
    });
  });
});

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');
      await t.click(scheduler.getAppointment('1 appointment', 0).element);
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async (t) => {
      await t.click('html', { offsetX: 0, offsetY: 0 });
      await changeTheme('material.blue.light');

      return createScheduler(view, resourcesValue);
    });
  });
});
