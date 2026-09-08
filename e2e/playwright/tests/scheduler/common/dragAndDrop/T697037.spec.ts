import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';

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
    onAppointmentUpdating(e) {
      (window as any).recurrenceException = e.newData.recurrenceException;
    },
  });

  const scheduler = new Scheduler(page, '#container');
  const targetCell = scheduler.getDateTableCell(3, 3);
  const appointment = scheduler.getAppointment('Test', 2);

  await dragToElement(page, appointment.element, targetCell);

  await expect
    .poll(async () => page.evaluate(() => (window as any).recurrenceException))
    .toBe('20181128T020000Z');
});
