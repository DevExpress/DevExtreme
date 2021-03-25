import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests } from './utils';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (view: string, crossScrollingEnabled: boolean): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    views: [view],
    currentView: view,
    crossScrollingEnabled,
    height: 600,
    width: 300, // In this case, dx-scheduler-small class is added to the scheduler
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

[undefined].forEach((crossScrollingEnabled) => {
  ['day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Adaptive base views layout test in generic theme (view='${view})', crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
      await t.expect(await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}).png`)).ok();
    }).before(() => createScheduler(view, false));
  });
});

[undefined].forEach((crossScrollingEnabled) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Adaptive timeline views layout test in generic theme (view='${view})', crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
      await t.expect(await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}).png`)).ok();
    }).before(() => createScheduler(view, false));
  });
});
