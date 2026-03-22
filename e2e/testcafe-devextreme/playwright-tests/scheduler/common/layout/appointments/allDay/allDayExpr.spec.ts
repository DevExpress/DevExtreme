import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Layout:Appointments:allDayExpr', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [{
    config: {
      allDayExpr: 'AllDay',
    },
    data: {
      AllDay: true,
    },
  }, {
    config: {},
    data: {
      allDay: true,
    },
  }].forEach(({ config, data }) => {
    test(`All day appointment should be render valid in case without endDate property with allDayExpr=${(config as any).allDayExpr}(T1155630)`, async ({ page }) => {
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

      await testScreenshot(page, `week-all-day-expr-${(config as any).allDayExpr}.png`, {
        element: page.locator('.dx-scheduler-work-space'),
      });

      await page.locator('.dx-scheduler-view-switcher .dx-buttongroup .dx-button').filter({ hasText: 'Timeline Week' }).click();

      await testScreenshot(page, `timelineWeek-all-day-expr-${(config as any).allDayExpr}.png`, {
        element: page.locator('.dx-scheduler-work-space'),
      });
    });
  });
});
