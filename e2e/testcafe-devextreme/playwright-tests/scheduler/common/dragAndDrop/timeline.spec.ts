import { test, expect } from '@playwright/test';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Drag-and-drop appointments in the Scheduler timeline views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });

  await t
    .dragToElement(draggableAppointment.element, page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4))
    .expect(draggableAppointment.size.width).toBe('200px')
    .expect(draggableAppointment.date.time)
    .eql('11:00 AM - 11:30 AM');
}).before(async () => createScheduler({
  views: [view],
  currentView: view,
  dataSource,
})));

test('Drag-n-drop in the "timelineMonth" view', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });

  await t
    .dragToElement(draggableAppointment.element, page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4))
    .expect(parseInt(await draggableAppointment.size.height, 10))
    .within(139, 140)
    .expect(draggableAppointment.size.width)
    .eql('200px')
    .expect(draggableAppointment.date.time)
    .eql('9:00 AM - 9:30 AM');
}).before(async () => createScheduler({
  views: ['timelineMonth'],
  currentView: 'timelineMonth',
  dataSource,
}));
});
