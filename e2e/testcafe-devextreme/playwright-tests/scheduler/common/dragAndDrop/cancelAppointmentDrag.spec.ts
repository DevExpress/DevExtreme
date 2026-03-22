import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const APPOINTMENT_DRAG_SOURCE_CLASS = 'dx-scheduler-appointment-drag-source';

test.describe('Cancel appointment Drag-and-Drop', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('on escape - date should not changed when it\'s pressed during dragging (T832754)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
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
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Appointment' });
    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(4).locator('.dx-scheduler-date-table-cell').nth(0);

    // TODO: Original test uses MouseUpEvents.disable/enable to prevent mouseup during drag.
    // Simulating: drag without releasing, press escape, then release.
    const targetBox = await targetCell.boundingBox();
    await draggableAppointment.hover();
    await page.mouse.down();
    await page.mouse.move(targetBox!.x + targetBox!.width / 2, targetBox!.y + targetBox!.height / 2, { steps: 10 });
    await page.keyboard.press('Escape');
    await page.mouse.up();

    const dragSourceCount = await page.locator(`.${APPOINTMENT_DRAG_SOURCE_CLASS}`).count();
    expect(dragSourceCount).toBe(0);

    const timeText = await draggableAppointment.locator('.dx-scheduler-appointment-content-date').textContent();
    expect(timeText).toContain('10:00 AM - 10:30 AM');
  });
});
