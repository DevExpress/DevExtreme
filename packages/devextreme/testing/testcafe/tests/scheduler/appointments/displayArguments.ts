import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Display* arguments in appointment templates and events`
  .page(url(__dirname, '../../container.html'));

[undefined, 'America/Los_Angeles'].forEach((timeZone) => {
  test(`displayStartDate and displayEndDate arguments should be right with timeZone='${timeZone}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const etalon = '09:30:00 10:00:00';

    await t.doubleClick(scheduler.getDateTableCell(1, 0), { speed: 0.5 });

    await t
      .typeText(scheduler.appointmentPopup.subjectElement, 'text')
      .click(scheduler.appointmentPopup.doneButton);

    await t
      .expect(scheduler.getAppointmentByIndex(0).element.innerText)
      .eql(etalon);

    await t
      .click(scheduler.getAppointmentByIndex(0).element)
      .expect(scheduler.appointmentTooltip.getListItem(undefined, 0).element.innerText)
      .eql(etalon);

    await t
      .expect(ClientFunction(() => (window as any).testDisplayValue)())
      .eql(etalon);
  }).before(async () => createWidget('dxScheduler', {
    timeZone,
    dataSource: [],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 1, 15),
    startDayHour: 9,
    height: 600,

    onAppointmentClick: ClientFunction((model) => {
      const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

      (window as any).testDisplayValue = `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
    }),

    appointmentTooltipTemplate: (model) => {
      const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

      return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
    },

    appointmentTemplate: (model) => {
      const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

      return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
    },
  }));
});
