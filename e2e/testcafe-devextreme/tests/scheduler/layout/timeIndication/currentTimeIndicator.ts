import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture.disablePageReloads`Scheduler: Current Time Indication`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const TIMELINE_VIEWS = ['timelineDay', 'timelineWeek', 'timelineMonth'];

test('Current time indicator should be placed correctly when there are many groups and orientation is horizontal', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // eslint-disable-next-line no-restricted-syntax
  for (const view of ['day', 'week']) {
    await scheduler.option('currentView', view);

    await t.expect(
      await takeScreenshot(`current-time-indicator-in-${view}-with-many-groups.png`, scheduler.workSpace),
    ).ok();
  }

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentDate: new Date(2021, 7, 1),
    height: 400,
    width: 700,
    startDayHour: 5,
    indicatorTime: new Date(2021, 7, 1, 6),
    currentView: 'day',
    views: ['day', 'week'],
    groups: ['groupId'],
    resources: [{
      fieldExpr: 'groupId',
      label: 'group',
      dataSource: [
        { text: 'Group 1', id: 1 },
        { text: 'Group 2', id: 2 },
        { text: 'Group 3', id: 3 },
        { text: 'Group 4', id: 4 },
        { text: 'Group 5', id: 5 },
        { text: 'Group 6', id: 6 },
      ],
    }],
  });
}).after(async () => disposeWidget('dxScheduler'));

[
  'none',
  'vertical',
  'horizontal',
].forEach((grouping) => {
  [
    { view: 'day', cellDuration: 240 },
    { view: 'week', cellDuration: 240 },
    { view: 'timelineDay', cellDuration: 360 },
    { view: 'timelineWeek', cellDuration: 360 },
    // NOTE: cellDuration doesn't affect the timelineMonth view.
    { view: 'timelineMonth', cellDuration: 60 },
  ].forEach(({ view, cellDuration }) => {
    [
      [0, 24],
      [6, 18],
    ].forEach(([startDayHour, endDayHour]) => {
      [
        '2023-12-03T00:00:00',
        '2023-12-03T06:30:00',
        '2023-12-03T12:00:00',
        '2023-12-03T17:30:00',
        '2023-12-03T23:59:59',
      ].forEach((indicatorTime) => {
        // NOTE: Due the technical reasons we cannot test these cases by testcafe here.
        if (grouping === 'horizontal' && TIMELINE_VIEWS.includes(view)) {
          return;
        }

        // NOTE: The indicatorTime options works incorrectly
        // in the 'timelineMonth' view with startDayHour/endDayHour.
        if (view === 'timelineMonth' && startDayHour !== 0 && endDayHour !== 24) {
          return;
        }

        test(`
Current time indicator should be rendered correctly (
view: ${view},
now: ${indicatorTime},
grouping: ${grouping},
startDayHour: ${startDayHour},
endDayHour: ${endDayHour}
)`, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
          const scheduler = new Scheduler(SCHEDULER_SELECTOR);

          await takeScreenshot(
            `current-time-indicator_${view}_${indicatorTime.replace(/:/g, '-')}_g-${grouping}_${startDayHour}_${endDayHour}.png`,
            scheduler.workSpace,
          );

          await t.expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          const additionalOptions = grouping === 'none'
            ? {
              views: [{
                type: view,
                name: 'TEST_VIEW',
              }],
            }
            : {
              views: [{
                type: view,
                name: 'TEST_VIEW',
                groupOrientation: grouping,
              }],
              groups: ['any'],
              resources: [{
                fieldExpr: 'any',
                dataSource: [
                  { text: 'Group_0', id: 0 },
                  { text: 'Group_1', id: 1 },
                ],
              }],
            };

          await createWidget('dxScheduler', {
            dataSource: [],
            currentView: 'TEST_VIEW',
            shadeUntilCurrentTime: true,
            currentDate: indicatorTime,
            startDayHour,
            endDayHour,
            indicatorTime,
            cellDuration,
            ...additionalOptions,
          });
        }).after(async () => disposeWidget('dxScheduler'));
      });
    });
  });
});
