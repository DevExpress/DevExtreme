import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const INITIAL_APPOINTMENT = {
  text: 'Test',
  startDate: '2023-01-01T01:00:00',
  endDate: '2023-01-01T02:00:00',
};

const TEST_CASES = [
  {
    view: 'month',
    expectedToItemData: { text: 'Test', startDate: '2023-01-05T01:00:00', endDate: '2023-01-05T02:00:00' },
  },
  {
    view: 'week',
    expectedToItemData: { text: 'Test', startDate: '2023-01-05T00:00:00', endDate: '2023-01-05T01:00:00', allDay: true },
  },
  {
    view: 'timelineDay',
    expectedToItemData: { text: 'Test', startDate: '2023-01-01T01:30:00', endDate: '2023-01-01T02:30:00', allDay: false },
  },
];

test.describe('Scheduler dragging - drag events', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  TEST_CASES.forEach(({ view, expectedToItemData }) => {
    test(`Should fire correct events with correct itemData inside during drag-n-drop in ${view} view.`, async ({ page }) => {
      await page.evaluate(() => {
        (window as any).clientTestingResults = {
          onDragStartItemData: [],
          onDragMoveItemData: [],
          onDragEndItemData: [],
          onDragEndToItemData: [],
        };
      });

      await createWidget(page, 'dxScheduler', {
        dataSource: [INITIAL_APPOINTMENT],
        currentView: view,
        currentDate: '2023-01-01',
        appointmentDragging: {
          onDragStart: new Function('e', 'window.clientTestingResults.onDragStartItemData.push(Object.assign({}, e.itemData));') as any,
          onDragMove: new Function('e', 'window.clientTestingResults.onDragMoveItemData.push(Object.assign({}, e.itemData));') as any,
          onDragEnd: new Function('e', 'window.clientTestingResults.onDragEndItemData.push(Object.assign({}, e.itemData)); window.clientTestingResults.onDragEndToItemData.push(Object.assign({}, e.toItemData));') as any,
        },
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' });
      const targetCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(4);

      await appointment.dragTo(targetCell);

      const results = await page.evaluate(() => (window as any).clientTestingResults);

      expect(results.onDragStartItemData.length).toBe(1);
      expect(results.onDragStartItemData[0]).toEqual(INITIAL_APPOINTMENT);

      for (const itemData of results.onDragMoveItemData) {
        expect(itemData).toEqual(INITIAL_APPOINTMENT);
      }

      expect(results.onDragEndItemData.length).toBe(1);
      expect(results.onDragEndToItemData.length).toBe(1);
      expect(results.onDragEndItemData[0]).toEqual(INITIAL_APPOINTMENT);
      expect(results.onDragEndToItemData[0]).toEqual(expectedToItemData);
    });
  });

  test('Should block appointment dragging while onAppointmentUpdating Promise is pending (T1308596)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test Appointment',
        startDate: new Date(2023, 0, 2, 10, 0),
        endDate: new Date(2023, 0, 2, 11, 0),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2023, 0, 2),
      height: 600,
      onAppointmentUpdating: new Function('e', 'e.cancel = new Promise(function(resolve) { setTimeout(function() { resolve(false); }, 5000); });') as any,
    });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test Appointment' });
    const targetCell1 = page.locator('.dx-scheduler-date-table-row').nth(18).locator('.dx-scheduler-date-table-cell').nth(2);
    const targetCell2 = page.locator('.dx-scheduler-date-table-row').nth(18).locator('.dx-scheduler-date-table-cell').nth(5);

    const initialPosition = await appointment.boundingBox();

    await appointment.dragTo(targetCell1);
    await appointment.dragTo(targetCell2);
    await appointment.dragTo(targetCell2);
    await appointment.dragTo(targetCell2);

    await page.waitForTimeout(6000);

    const positionAfterPromiseResolved = await appointment.boundingBox();
    const cell1Position = await targetCell1.boundingBox();

    expect(positionAfterPromiseResolved!.x).not.toBe(initialPosition!.x);
    expect(positionAfterPromiseResolved!.x).toBe(cell1Position!.x);
  });
});
