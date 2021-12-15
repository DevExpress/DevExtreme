import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture('Renovated scheduler - Templates');

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
  test(`cell templates should work in ${view}`,
    async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      await t.expect(await compareScreenshot(
        t,
        `cell_templates_in_${view}.png`,
        scheduler.workSpace,
        screenshotComparerOptions,
      ))
        .ok();
    }).before(
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
  );
});
