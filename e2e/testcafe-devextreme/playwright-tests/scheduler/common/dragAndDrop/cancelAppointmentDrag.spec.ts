import { test, expect } from '@playwright/test';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Cancel appointment Drag-and-Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const APPOINTMENT_DRAG_SOURCE_CLASS = '.dx-scheduler-appointment-drag-source';

test('on escape - date should not changed when it\'s pressed during dragging (T832754)', async ({ page }) => {
  // Scheduler on '#container'
  const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
  await MouseUpEvents.disable(MouseAction.dragToElement);

  await t
    .dragToElement(draggableAppointment.element, page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(0))
    .pressKey('esc');

  await MouseUpEvents.enable(MouseAction.dragToElement);

  expect(page.locator('.dx-scheduler').find(APPOINTMENT_DRAG_SOURCE_CLASS).exists)
    .notOk()
    .expect(draggableAppointment.date.time)
    .eql('10:00 AM - 10:30 AM');
}).before(async () => createScheduler({
  _draggingMode: 'default',
  height: 600,
  views: ['day'],
  currentView: 'day',
  cellDuration: 30,
  dataSource: [{
    text: 'Appointment',
    startDate: new Date(2020, 9, 14, 10, 0),
    endDate: new Date(2020, 9, 14, 10, 30),
  }],
  currentDate: new Date(2020, 9, 14),
  showAllDayPanel: false,
}));
});
