import type { AppointmentDeletingEvent } from 'devextreme/ui/scheduler';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const data = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2021, 3, 27, 1, 30),
    endDate: new Date(2021, 3, 27, 2, 30),
  },
];

interface WidgetArg {
  cancel: boolean;
  dataSource: typeof data;
}

test.describe('onAppointmentDeleting event', () => {
  [{
    cancel: false,
    expectedCount: 0,
  }, {
    cancel: true,
    expectedCount: 1,
  }].forEach(({ cancel, expectedCount }) => {
    const arg: WidgetArg = { cancel, dataSource: data };

    test(`UI behaviour should be valid in case argument pass boolean value, e.cancel=${cancel}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', ({ cancel: cancelValue, dataSource }: WidgetArg) => ({
        dataSource,
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2021, 3, 27),
        startDayHour: 1,
        endDayHour: 7,
        height: 600,
        cellDuration: 30,
        onAppointmentDeleting: (e: AppointmentDeletingEvent) => {
          e.cancel = cancelValue;
        },
      }), '#container', { arg });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Brochure Design Review');
      const { appointmentTooltip } = scheduler;

      await appointment.element.click();
      await appointmentTooltip.expectVisible(true);
      await appointmentTooltip.deleteButton.click();
      await expect(scheduler.appointments).toHaveCount(expectedCount);
    });

    test(`UI behaviour should be valid in case argument pass Promise resolved, e.cancel=${cancel}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', ({ cancel: cancelValue, dataSource }: WidgetArg) => ({
        dataSource,
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2021, 3, 27),
        startDayHour: 1,
        endDayHour: 7,
        height: 600,
        cellDuration: 30,
        onAppointmentDeleting: (e: AppointmentDeletingEvent) => {
          e.cancel = new Promise((resolve) => {
            resolve(cancelValue);
          });
        },
      }), '#container', { arg });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Brochure Design Review');
      const { appointmentTooltip } = scheduler;

      await appointment.element.click();
      await appointmentTooltip.expectVisible(true);
      await appointmentTooltip.deleteButton.click();
      await expect(scheduler.appointments).toHaveCount(expectedCount);
    });
  });
});
