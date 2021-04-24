import { compareScreenshot, createScreenshotsComparer } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { createDataSetForScreenShotTests } from './utils';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../container.html'));

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

const resources = [{
  fieldExpr: 'priorityId',
  dataSource: [
    {
      text: 'Low Priority',
      id: 0,
      color: '#24ff50',
    }, {
      text: 'High Priority',
      id: 1,
      color: '#ff9747',
    },
  ],
  label: 'Priority',
}];

[undefined, resources].forEach((resourcesValue) => {
  ['day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in generic theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `generic-layout-with-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(() => createScheduler(view, resourcesValue));
  });
});

[undefined, resources].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in generic theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `generic-layout-with-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(() => createScheduler(view, resourcesValue));
  });
});

['horizontal', 'vertical'].forEach((groupOrientation) => {
  [true, false].forEach((showAllDayPanel) => {
    const testName = `Day view with interval and crossScrollingEnabled, groupOrientation='${groupOrientation}', showAllDayPanel='${showAllDayPanel}'
      layout test`;

    test(testName, async (t) => {
      const scheduler = new Scheduler('#container');
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const pngName = `day-view-with-interval-crossScrollingEnabled-groupOrientation=${groupOrientation}-showAllDayPanel=${showAllDayPanel}.png`;

      await t
        .expect(await takeScreenshot(pngName, scheduler.workSpace))
        .ok()

        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(() => createWidget('dxScheduler', {
      resources: [{
        fieldExpr: 'roomId',
        dataSource: [{
          text: 'Room 1',
          id: 1,
        }, {
          text: 'Room 2',
          id: 2,
        }],
        label: 'Room',
      }],
      dataSource: [],
      views: [{
        name: 'dayView',
        type: 'day',
        intervalCount: 2,
        groupOrientation,
      }],
      currentView: 'dayView',
      currentDate: new Date(2021, 4, 25),
      height: 600,
      groups: ['roomId'],
      showAllDayPanel,
      crossScrollingEnabled: true,
    }));
  });
});
