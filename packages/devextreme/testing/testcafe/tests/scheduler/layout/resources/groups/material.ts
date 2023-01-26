import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests, resourceDataSource } from '../../utils';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture.disablePageReloads`Scheduler: Material theme layout`
  .page(url(__dirname, '../../../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
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
  });
};

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['agenda', 'day', 'week', 'workWeek', 'month'].forEach((view) => {
    test(`Base views layout test in material theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      await t
        .expect(await compareScreenshot(t, `material-groups(view=${view}-orientation=${groupOrientation}).png`)).ok();
    }).before(async () => {
      await changeTheme('material.blue.light');

      return createScheduler(view, groupOrientation);
    });
  });
});

['vertical', 'horizontal'].forEach((groupOrientation) => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'].forEach((view) => {
    test(`Timeline views layout test in material theme with groups(view='${view}', groupOrientation=${groupOrientation})`, async (t) => {
      await t
        .expect(await compareScreenshot(t, `material-groups(view=${view}-orientation=${groupOrientation}).png`)).ok();
    }).before(async () => {
      await changeTheme('material.blue.light');

      return createScheduler(view, groupOrientation);
    });
  });
});
