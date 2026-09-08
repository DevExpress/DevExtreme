import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const ETALON = '09:30:00 10:00:00';

[undefined, 'America/Los_Angeles'].forEach((timeZone) => {
  test(`displayStartDate and displayEndDate arguments should be right with timeZone='${timeZone}'`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone,
      dataSource: [],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 1, 15),
      startDayHour: 9,
      height: 600,

      onAppointmentClick(model: any) {
        const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

        (window as any).testDisplayValue = `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
      },

      appointmentTooltipTemplate: (model: any) => {
        const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

        return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
      },

      appointmentTemplate: (model: any) => {
        const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

        return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
      },
    });

    const scheduler = new Scheduler(page, '#container');

    await scheduler.getDateTableCell(1, 0).dblclick();

    await scheduler.appointmentPopup.textEditor.input.pressSequentially('text');
    await scheduler.appointmentPopup.saveButton.element.click();

    const appointment = scheduler.getAppointmentByIndex(0);

    await expect(appointment.element).toHaveText(ETALON, { useInnerText: true });

    await appointment.element.click();

    await expect(scheduler.appointmentTooltip.getListItem(undefined, 0).element)
      .toHaveText(ETALON, { useInnerText: true });

    await expect
      .poll(async () => page.evaluate(() => (window as any).testDisplayValue))
      .toBe(ETALON);
  });
});
