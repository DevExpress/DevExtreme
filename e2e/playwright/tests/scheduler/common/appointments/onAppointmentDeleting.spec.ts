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

const schedulerOptions = {
  dataSource: data,
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 3, 27),
  startDayHour: 1,
  endDayHour: 7,
  height: 600,
  cellDuration: 30,
};

[{
  cancel: false,
  expectedCount: 0,
}, {
  cancel: true,
  expectedCount: 1,
}].forEach(({ cancel, expectedCount }) => {
  // The handler is stringified on its way into the page, so a closure over the flag would not
  // survive: each variant carries the value in its own source.
  const booleanHandler = cancel
    ? (e: any) => { e.cancel = true; }
    : (e: any) => { e.cancel = false; };

  const promiseHandler = cancel
    ? (e: any) => { e.cancel = new Promise((resolve) => { resolve(true); }); }
    : (e: any) => { e.cancel = new Promise((resolve) => { resolve(false); }); };

  const deleteAppointment = async (scheduler: Scheduler): Promise<void> => {
    const appointment = scheduler.getAppointment('Brochure Design Review');
    const { appointmentTooltip } = scheduler;

    await appointment.element.click();

    await expect.poll(async () => appointmentTooltip.isVisible()).toBe(true);

    await appointmentTooltip.deleteButton.click();
  };

  test(`UI behaviour should be valid in case argument pass boolean value, e.cancel=${cancel}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...schedulerOptions,
      onAppointmentDeleting: booleanHandler,
    });

    const scheduler = new Scheduler(page, '#container');

    await deleteAppointment(scheduler);

    await expect.poll(async () => scheduler.getAppointmentCount()).toBe(expectedCount);
  });

  test(`UI behaviour should be valid in case argument pass Promise resolved, e.cancel=${cancel}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...schedulerOptions,
      onAppointmentDeleting: promiseHandler,
    });

    const scheduler = new Scheduler(page, '#container');

    await deleteAppointment(scheduler);

    await expect.poll(async () => scheduler.getAppointmentCount()).toBe(expectedCount);
  });
});
