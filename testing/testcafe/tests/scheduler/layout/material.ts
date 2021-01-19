import { compareScreenshot } from '../../../helpers/screenshort-comparer';
import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler: Material theme layout`
  .page(url(__dirname, './material.html'));

test('Scheduler should have correct height in month view (T927862)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect((await scheduler.dateTable.boundingClientRect).bottom)
    .eql((await scheduler.workspaceScrollable.boundingClientRect).bottom);
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    views: ['month'],
    currentView: 'month',
    height: 800,
  }, true);
});

const createDataSetForScreenShotTests = () => {
  const result: {
    text: string;
    startDate: Date;
    endDate: Date;
    priorityId: number;
    allDay?: boolean;
  }[] = [];
    // eslint-disable-next-line no-plusplus
  for (let day = 1; day < 25; day++) {
    result.push({
      text: '1 appointment',
      startDate: new Date(2020, 6, day, 0),
      endDate: new Date(2020, 6, day, 1),
      priorityId: 0,
    });

    result.push({
      text: '2 appointment',
      startDate: new Date(2020, 6, day, 1),
      endDate: new Date(2020, 6, day, 2),
      priorityId: 1,
    });

    result.push({
      text: '3 appointment',
      startDate: new Date(2020, 6, day, 3),
      endDate: new Date(2020, 6, day, 5),
      allDay: true,
      priorityId: 0,
    });
  }

  return result;
};

const createScheduler = async (view: string, resourcesValue?: unknown[]) => {
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
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-layout-with-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(() => createScheduler(view, resourcesValue));
  });
});

[undefined, resources].forEach((resourcesValue) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in material theme with resources(view='${view})', resource=${!!resourcesValue}`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.getAppointment('1 appointment', 0).element, { speed: 0.5 });
      await t.expect(scheduler.appointmentTooltip.isVisible()).ok();

      await t.expect(await compareScreenshot(t, `material-layout-with-resource(view=${view}-resource=${!!resourcesValue}).png`)).ok();
    }).before(() => createScheduler(view, resourcesValue));
  });
});
