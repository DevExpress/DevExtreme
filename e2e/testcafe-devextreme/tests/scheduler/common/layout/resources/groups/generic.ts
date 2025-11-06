import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../../../../helpers/createWidget';
import url from '../../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';
import { testScreenshot } from '../../../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../../../../container.html'));

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
  });
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `groups(view=${view}-orientation=${groupOrientation}).png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createScheduler(view, groupOrientation));
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `groups(view=${view}-orientation=${groupOrientation}).png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    })
      .before(async () => createScheduler(view, groupOrientation));
  });
});
