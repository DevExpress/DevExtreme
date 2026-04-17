import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Scheduler Timeline: Grouping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => {
    test(`${view} view - header panel should contain group rows if horizontal grouping`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        groupOrientation: 'horizontal',
        views: [{ type: 'timelineDay', groupOrientation: 'horizontal' }],
        currentView: 'timelineDay', groups: ['one'],
        resources: [{ fieldExpr: 'one', dataSource: [{ id: 1, text: 'a' }, { id: 2, text: 'b' }] }],
      });
      const groupCellCount = await page.locator('.dx-scheduler-header-panel .dx-scheduler-group-header').count();
      expect(groupCellCount).toBe(2);
    });
  });
});
