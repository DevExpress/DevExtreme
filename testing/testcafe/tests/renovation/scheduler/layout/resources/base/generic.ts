import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import { createDataSetForScreenShotTests } from '../../utils';
import { multiPlatformTest, createWidget } from '../../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../../helpers/multi-platform-test/platform-type';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.skip('Scheduler: Generic theme layout'); // TODO unskip after fixing tooltip

const createScheduler = async (
  platform: PlatformType,
  view: string,
  resourcesValue?: unknown[],
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
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
    test(`Base views layout test in generic theme with resources(view='${view})', resource=${!!resourcesValue}`,
      async (t, { screenshotComparerOptions }) => {
        const scheduler = new Scheduler('#container');
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
        await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

        await t.expect(await takeScreenshot(`generic-resource(view=${view}-resource=${!!resourcesValue}).png`, scheduler.workSpace, screenshotComparerOptions)).ok();

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (_, { platform }) => createScheduler(platform, view, resourcesValue));
  });
});

[undefined, resources].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in generic theme with resources(view='${view})', resource=${!!resourcesValue}`,
      async (t, { screenshotComparerOptions }) => {
        const scheduler = new Scheduler('#container');
        const { takeScreenshot } = createScreenshotsComparer(t);

        await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
        await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

        await t.expect(await takeScreenshot(`generic-resource(view=${view}-resource=${!!resourcesValue}).png`, scheduler.workSpace, screenshotComparerOptions)).ok();
      }).before(async (_, { platform }) => createScheduler(platform, view, resourcesValue));
  });
});
