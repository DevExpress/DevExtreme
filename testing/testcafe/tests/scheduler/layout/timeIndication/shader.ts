import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Scheduler: Current Time Indication: Shader`
  .page(url(__dirname, '../../../container.html'));

const views = ['day', 'week', 'timelineDay', 'timelineWeek', 'timelineMonth'];
const style = `
.dx-scheduler-date-time-shader-top::before,
.dx-scheduler-date-time-shader-bottom::before,
.dx-scheduler-timeline .dx-scheduler-date-time-shader::before,
.dx-scheduler-date-time-shader-all-day {
  background-color: red !important;
}`;

const createScheduler = async (
  additionalProps: Record<string, unknown>,
): Promise<void> => {
  await createWidget('dxScheduler', {
    dataSource: [],
    currentDate: new Date(2021, 7, 1),
    height: 400,
    width: 700,
    startDayHour: 5,
    indicatorTime: new Date(2021, 7, 1, 6),
    currentView: 'day',
    resources: [{
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
    }],
    shadeUntilCurrentTime: true,
    ...additionalProps,
  });
};

[false, true].forEach((crossScrollingEnabled) => {
  test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`shader-in-${view}-crossScrolling=${crossScrollingEnabled}.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage(style);

    await createScheduler({
      views,
      crossScrollingEnabled,
    });
  });

  test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled} and horizontal grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`shader-in-${view}-crossScrolling=${crossScrollingEnabled}-horizontal-grouping.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage(style);

    await createScheduler({
      views: [{
        type: 'day',
        groupOrientation: 'horizontal',
      }, {
        type: 'week',
        groupOrientation: 'horizontal',
      }, {
        type: 'tiemlineDay',
        groupOrientation: 'horizontal',
      }, {
        type: 'timelineWeek',
        groupOrientation: 'horizontal',
      }, {
        type: 'timelineMonth',
        groupOrientation: 'horizontal',
      }],
      crossScrollingEnabled,
      groups: ['priorityId'],
    });
  });

  test(`Shader should be displayed correctly when crossScrollingEnabled=${crossScrollingEnabled} and vertical grouping is used`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // eslint-disable-next-line no-restricted-syntax
    for (const view of views) {
      await scheduler.option('currentView', view);

      await t.expect(
        await takeScreenshot(`shader-in-${view}-crossScrolling=${crossScrollingEnabled}-vertical-grouping.png`, scheduler.workSpace),
      ).ok();
    }

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await insertStylesheetRulesToPage(style);

    await createScheduler({
      views: [{
        type: 'day',
        groupOrientation: 'vertical',
      }, {
        type: 'week',
        groupOrientation: 'vertical',
      }, {
        type: 'tiemlineDay',
        groupOrientation: 'vertical',
      }, {
        type: 'timelineWeek',
        groupOrientation: 'vertical',
      }, {
        type: 'timelineMonth',
        groupOrientation: 'vertical',
      }],
      crossScrollingEnabled,
      groups: ['priorityId'],
    });
  });
});
