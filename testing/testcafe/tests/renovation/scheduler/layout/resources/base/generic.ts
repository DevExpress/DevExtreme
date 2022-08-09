import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../../../helpers/multi-platform-test';
import { PlatformType } from '../../../../../../helpers/multi-platform-test/platform-type';
import { createDataSetWithAllDay, createDataSetWithoutAllDay } from '../../../../../scheduler/layout/utils';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: [/* 'jquery', */'react'], // TODO unskip jQuery after fix children in Inferno
});

fixture('Scheduler: Generic theme layout');

const createScheduler = async (
  platform: PlatformType,
  view: string,
  supportAllDay: boolean,
  resourcesValue?: unknown[],
): Promise<void> => {
  await createWidget(platform, 'dxScheduler', {
    dataSource: supportAllDay
      ? createDataSetWithAllDay()
      : createDataSetWithoutAllDay(),
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
        const appointment = scheduler.getAppointment('1 appointment', 0);
        const { appointmentTooltip } = scheduler;
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await t
          .expect(appointment.element.exists)
          .ok()
          .expect(appointmentTooltip.wrapper.exists)
          .notOk()
          .click(appointment.element, { speed: 0.5 })
          .expect(appointmentTooltip.wrapper.exists)
          .ok();

        await t
          .expect(await takeScreenshot(`generic-resource(view=${view}-resource=${!!resourcesValue}).png`,
            scheduler.workSpace,
            screenshotComparerOptions))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (_, { platform }) => createScheduler(platform, view, true, resourcesValue));
  });
});

[undefined, resources].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in generic theme with resources(view='${view})', resource=${!!resourcesValue}`,
      async (t, { screenshotComparerOptions }) => {
        const scheduler = new Scheduler('#container');
        const appointment = scheduler.getAppointment('1 appointment', 0);
        const { appointmentTooltip } = scheduler;
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await t
          .expect(appointment.element.exists)
          .ok()
          .expect(appointmentTooltip.wrapper.exists)
          .notOk()
          .click(appointment.element, { speed: 0.5 })
          .expect(appointmentTooltip.wrapper.exists)
          .ok();

        await t
          .expect(await takeScreenshot(`generic-resource(view=${view}-resource=${!!resourcesValue}).png`,
            scheduler.workSpace,
            screenshotComparerOptions))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async (_, { platform }) => createScheduler(platform, view, false, resourcesValue));
  });
});
