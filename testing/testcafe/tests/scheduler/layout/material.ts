import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from './utils';

fixture`Scheduler: Material theme layout`
  .page(url(__dirname, '../../containerMaterial.html'));

test('Scheduler should have correct height in month view (T927862)', async (t) => {
  const scheduler = new Scheduler('#container');

  const boundingClientRect = await scheduler.dateTable.boundingClientRect;

  await t
    .expect(boundingClientRect.bottom)
    .eql((await scheduler.workspaceScrollable.boundingClientRect).bottom);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    height: 800,
  }, true);
});

const createScheduler = async (view: string, resourcesValue?: unknown[]): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    views: [view],
    currentView: view,
    resources: resourcesValue,
    height: 600,
  }, true);
};

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-layout-with-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async () => createScheduler(view, resourcesValue));
  });
});

[undefined, resourceDataSource].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-layout-with-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async () => createScheduler(view, resourcesValue));
  });
});
