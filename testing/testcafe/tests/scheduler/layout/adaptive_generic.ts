import { compareScreenshot } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { createDataSetForScreenShotTests } from './utils';

fixture`Scheduler: Generic theme layout`
  .page(url(__dirname, '../../container.html'));

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: createDataSetForScreenShotTests(),
    currentDate: new Date(2020, 6, 15),
    height: 600,
    ...additionalProps,
  }, true);
};

const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

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

[false, true].forEach((crossScrollingEnabled) => {
  views.forEach((view) => {
    test(`Adaptive views layout test in generic theme (view='${view})', crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
      await t.resizeWindow(400, 600);

      await t.expect(
        await compareScreenshot(t, `adaptive-generic-layout(view=${view}-crossScrollingEnabled=${!!crossScrollingEnabled}).png`),
      ).ok();
    }).before(() => createScheduler({
      views: [view],
      currentView: view,
      crossScrollingEnabled,
    }))
      .after(async (t) => {
        await t.resizeWindow(1200, 800);
      });
  });
});

[false, true].forEach((crossScrollingEnabled) => {
  views
    .map((viewType) => ({
      type: viewType,
      groupOrientation: 'horizontal',
    }))
    .forEach((view) => {
      test(`Adaptive views layout test in generic theme (view='${view.type})', crossScrollingEnabled=${crossScrollingEnabled} when horizontal grouping is used`, async (t) => {
        await t.resizeWindow(400, 600);

        await t.expect(
          await compareScreenshot(t, `adaptive-generic-layout(view=${view.type}-crossScrollingEnabled=${!!crossScrollingEnabled}-horizontal-grouping).png`),
        ).ok();
      }).before(() => createScheduler({
        views: [view],
        currentView: view,
        crossScrollingEnabled,
        groups: ['priorityId'],
        resources,
      }))
        .after(async (t) => {
          await t.resizeWindow(1200, 800);
        });
    });
});
