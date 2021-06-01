import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from './utils';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (view: string, groupOrientation: string): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    startDayHour: 0,
    endDayHour: 4,
    views: [{
      type: view,
      name: view,
      groupOrientation,
    }],
    currentView: view,
    crossScrollingEnabled: true,
    resources: resourceDataSource,
    groups: ['priorityId'],
    height: 700,
  }, true);
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in generic theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      await t
        .expect(await compareScreenshot(t, `genericGroups-base-views-layout-with-groups(view=${view}-orientation=${groupOrientation}).png`)).ok();
    }).before(async () => createScheduler(view, groupOrientation));
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in generic theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      await t
        .expect(await compareScreenshot(t, `genericGroups-timeline-views-layout-with-groups(view=${view}-orientation=${groupOrientation}).png`)).ok();
    }).before(async () => createScheduler(view, groupOrientation));
  });
});
