import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

interface WidgetArg {
  timeZone: string | undefined;
}

test.describe('Display* arguments in appointment templates and events', () => {
  [undefined, 'America/Los_Angeles'].forEach((timeZone) => {
    test(`displayStartDate and displayEndDate arguments should be right with timeZone='${timeZone}'`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', ({ timeZone: widgetTimeZone }: WidgetArg) => ({
        timeZone: widgetTimeZone,
        dataSource: [],
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2021, 1, 15),
        startDayHour: 9,
        height: 600,

        onAppointmentClick: (model) => {
          const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

          (window as any).testDisplayValue = `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
        },

        appointmentTooltipTemplate: (model) => {
          const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

          return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
        },

        appointmentTemplate: (model) => {
          const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

          return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
        },
      }), '#container', { arg: { timeZone } });

      const scheduler = new Scheduler(page, '#container');
      const etalon = '09:30:00 10:00:00';

      await scheduler.getDateTableCell(1, 0).dblclick();

      await scheduler.appointmentPopup.textEditor.input.pressSequentially('text');
      await scheduler.appointmentPopup.saveButton.element.click();

      await expect(scheduler.getAppointmentByIndex(0).element)
        .toHaveText(etalon, { useInnerText: true });

      await scheduler.getAppointmentByIndex(0).element.click();
      await expect(scheduler.appointmentTooltip.getListItem(undefined, 0).element)
        .toHaveText(etalon, { useInnerText: true });

      await expect.poll(() => page.evaluate(() => (window as any).testDisplayValue))
        .toBe(etalon);
    });
  });
});
