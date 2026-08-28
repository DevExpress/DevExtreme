import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import { getThemeName } from '../../../../../../helpers/themeUtils';
import Scheduler from '../../../../../../models/scheduler';

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
  test(`All day appointment should be render valid in case without endDate property with allDayExpr=${(config as { allDayExpr?: string }).allDayExpr}(T1155630)`, {
    tag: ['@generic.light'],
  }, async ({ page }) => {
    // The etalons of this test were recorded in the generic theme only, the way the TestCafe test
    // named it as the one theme to run in.
    test.skip(getThemeName() !== 'generic', 'the etalons are generic only');

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
    const { allDayExpr } = config as { allDayExpr?: string };

    await testScreenshot(
      page,
      `week-all-day-expr-${allDayExpr}.png`,
      { element: workSpace },
    );

    await toolbar.viewSwitcher.getButton('Timeline Week').element.click();

    await testScreenshot(
      page,
      `timelineWeek-all-day-expr-${allDayExpr}.png`,
      { element: workSpace },
    );
  });
});
