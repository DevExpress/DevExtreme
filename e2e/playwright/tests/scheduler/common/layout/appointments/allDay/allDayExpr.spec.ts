import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

test.describe('Layout:Appointments:allDayExpr', () => {
  test.use({ theme: 'generic.light' });

  [{
    config: {
      allDayExpr: 'AllDay',
    },
    data: {
      AllDay: true,
    },
  }, {
    config: {
    },
    data: {
      allDay: true,
    },
  }].forEach(({ config, data }) => {
    test(`All day appointment should be render valid in case without endDate property with allDayExpr=${config.allDayExpr}(T1155630)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'MY EVENT',
          startDate: new Date(2023, 2, 19, 23, 45),
          ...data,
        }],
        views: ['week', 'timelineWeek'],
        currentView: 'week',
        cellDuration: 360,
        startDayHour: 18,
        currentDate: new Date(2023, 2, 21),
        height: 600,
        ...config,
      });

      const { toolbar, workSpace } = new Scheduler(page, '#container');

      await testScreenshot(
        page,
        `week-all-day-expr-${config.allDayExpr}.png`,
        { element: workSpace },
      );

      await toolbar.viewSwitcher.getButton('Timeline Week').element.click();

      await testScreenshot(
        page,
        `timelineWeek-all-day-expr-${config.allDayExpr}.png`,
        { element: workSpace },
      );
    });
  });
});
