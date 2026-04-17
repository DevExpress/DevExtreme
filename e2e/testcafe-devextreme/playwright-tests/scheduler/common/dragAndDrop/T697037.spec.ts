import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('T697037', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Recurrence exception date should equal date of appointment, which excluded from recurrence(T697037)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test',
        startDate: '2018-11-26T02:00:00Z',
        endDate: '2018-11-26T02:15:00Z',
        recurrenceRule: 'FREQ=DAILY;COUNT=5',
        recurrenceException: '',
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2018, 10, 26),
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
      timeZone: 'Etc/UTC',
      showAllDayPanel: false,
      recurrenceEditMode: 'occurrence',
      onAppointmentUpdating: new Function('e', `
        window.recurrenceException = e.newData.recurrenceException;
      `) as any,
    });

    const targetCell = page.locator('.dx-scheduler-date-table-row').nth(3).locator('.dx-scheduler-date-table-cell').nth(3);
    const appointments = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Test' });
    const appointment = appointments.nth(2);

    await appointment.dragTo(targetCell);

    const recurrenceException = await page.evaluate(() => (window as any).recurrenceException);
    expect(recurrenceException).toBe('20181128T020000Z');
  });
});
