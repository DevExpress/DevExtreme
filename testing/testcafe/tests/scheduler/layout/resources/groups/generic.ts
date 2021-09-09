import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget, { disposeWidgets } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';

fixture.disablePageReloads`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../../../container.html'))
  .afterEach(async (t) => {
    await t.wait(200);
    await disposeWidgets();
  });

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
        .expect(await compareScreenshot(t, `generic-groups(view=${view}-orientation=${groupOrientation}).png`)).ok();
    }).before(async () => createScheduler(view, groupOrientation));
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in generic theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      await t
        .expect(await compareScreenshot(t, `generic-groups(view=${view}-orientation=${groupOrientation}).png`)).ok();
    }).before(async () => createScheduler(view, groupOrientation));
  });
});
