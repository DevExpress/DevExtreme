import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe.skip('Scheduler Timeline: Cross-Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Timeline should have Cross-Scrolling enabled', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      height: 400, width: 800, currentDate: new Date(2021, 1, 2), dataSource: [],
      views: ['timelineDay'], currentView: 'timelineDay', startDayHour: 8, endDayHour: 20, cellDuration: 60,
      showAllDayPanel: false, groups: ['humanId'],
      resources: [{ fieldExpr: 'humanId', dataSource: [
        { id: 0, text: 'David Carter', color: '#74d57b' }, { id: 1, text: 'Emma Lewis', color: '#1db2f5' },
        { id: 2, text: 'Noah Hill', color: '#f5564a' }, { id: 3, text: 'William Bell', color: '#97c95c' },
        { id: 4, text: 'Jane Jones', color: '#ffc720' }, { id: 5, text: 'Violet Young', color: '#eb3573' },
        { id: 6, text: 'Samuel Perry', color: '#a63db8' }, { id: 7, text: 'Luther Murphy', color: '#ffaa66' },
        { id: 8, text: 'Craig Morris', color: '#2dcdc4' },
      ], label: 'Employee' }],
    });
    const hasBothScrollbars = await page.evaluate(() => {
      const scrollable = document.querySelector('.dx-scheduler-work-space .dx-scrollable');
      if (!scrollable) return false;
      return scrollable.scrollHeight > scrollable.clientHeight && scrollable.scrollWidth > scrollable.clientWidth;
    });
    expect(hasBothScrollbars).toBeTruthy();
  });
});
