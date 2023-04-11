import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const testJquery = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery'],
});
const testReact = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['react'],
});

fixture.disablePageReloads.skip('Renovated scheduler - Templates');

const resources = [{
  id: 0,
  text: 'David Carter',
  color: '#74d57b',
}, {
  id: 1,
  text: 'Emma Lewis',
  color: '#1db2f5',
}];

['week', 'month', 'timelineDay', 'timelineMonth'].forEach((view) => {
  testJquery(
    `cell templates should work in JQuery in ${view}`,
    async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      await t.expect(await compareScreenshot(
        t,
        `cell_templates_in_${view}.png`,
        scheduler.workSpace,
        screenshotComparerOptions,
      ))
        .ok();
    },
  ).before(
    async (t, { platform }) => {
      await t.resizeWindow(1200, 800);
      await createWidget(platform, 'dxScheduler', {
        views: [view],
        currentView: view,
        currentDate: new Date(2021, 3, 4),
        startDayHour: 9,
        endDayHour: 14,
        cellDuration: 60,
        height: 500,
        groups: ['personId'],
        resources: [{
          fieldExpr: 'personId',
          dataSource: resources,
          label: 'Person',
        }],
        dataCellTemplate: (props) => props.startDate.getTime(),
        dateCellTemplate: (props) => props.date.getTime(),
        timeCellTemplate: (props) => props.date.getTime(),
        resourceCellTemplate: (props) => props.text,
      });
    },
  ).after(async (t) => restoreBrowserSize(t));

  testReact(
    `cell templates should work in React in ${view}`,
    async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      await t.expect(await compareScreenshot(
        t,
        `cell_templates_in_${view}.png`,
        scheduler.workSpace,
        screenshotComparerOptions,
      ))
        .ok();
    },
  ).before(
    async (t, { platform }) => {
      await t.resizeWindow(1200, 800);
      await createWidget(platform, 'dxScheduler', {
        views: [view],
        currentView: view,
        currentDate: new Date(2021, 3, 4),
        startDayHour: 9,
        endDayHour: 14,
        cellDuration: 60,
        height: 500,
        groups: ['personId'],
        resources: [{
          fieldExpr: 'personId',
          dataSource: resources,
          label: 'Person',
        }],
        dataCellTemplate: ({ data }) => data.startDate.getTime(),
        dateCellTemplate: ({ data }) => data.date.getTime(),
        timeCellTemplate: ({ data }) => data.date.getTime(),
        resourceCellTemplate: ({ data }) => data.text,
      });
    },
  ).after(async (t) => restoreBrowserSize(t));
});
