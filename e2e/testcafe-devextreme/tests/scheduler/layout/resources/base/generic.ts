import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests } from '../../utils';

fixture.disablePageReloads`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../../../container.html'));

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

      await t.click(scheduler.getAppointment('1 appointment', 0).element);
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `generic-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async () => createScheduler(view, resourcesValue));
  });
});

[undefined, resources].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    const testCase = resourcesValue != null && view === 'timelineWorkWeek' ? test.skip : test;
    testCase(`Timeline views layout test in generic theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element);
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `generic-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(async () => createScheduler(view, resourcesValue));
  });
});
