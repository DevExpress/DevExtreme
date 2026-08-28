import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('Appointment key should be deleted when removing an appointment from series (T1024213)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', () => ({
    dataSource: new (window as any).DevExpress.data.DataSource({
      store: {
        type: 'array',
        key: 'appointmentId',
        data: [{
          startDate: new Date(2021, 6, 12, 10),
          endDate: new Date(2021, 6, 12, 11),
          text: 'Test Appointment',
          recurrenceRule: 'FREQ=DAILY;COUNT=3',
          appointmentId: 0,
        }],
      },
    }),
    recurrenceEditMode: 'occurrence',
    views: ['week'],
    currentView: 'week',
    startDayHour: 9,
    currentDate: new Date(2021, 6, 12, 10),
    height: 600,
  }));

  const scheduler = new Scheduler(page, '#container');

  await scheduler.getAppointmentByIndex(1).element.dblclick();
  await scheduler.appointmentPopup.saveButton.element.click();

  await testScreenshot(
    page,
    'exclude-appointment-from-series-via-form-editing.png',
    { element: scheduler.workSpace },
  );
});
