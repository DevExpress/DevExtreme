import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Display* arguments in appointment templates and events`
  .page(url(__dirname, '../../container.html'));

[undefined, 'America/Los_Angeles'].forEach((timeZone) => {
  test(`displayStartDate and displayEndDate arguments should be right with timeZone='${timeZone}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const etalon = '2021-02-28T06:30:00.000Z 2021-02-28T07:00:00.000Z';

    await t.doubleClick(scheduler.getDateTableCell(1, 0), { speed: 0.1 });

    await t
      .typeText(scheduler.appointmentPopup.subjectElement, 'text')
      .click(scheduler.appointmentPopup.doneButton, { speed: 0.1 });

    await t
      .expect(scheduler.getAppointmentByIndex(0).element.innerText)
      .eql(etalon);

    await t
      .click(scheduler.getAppointmentByIndex(0).element, { speed: 0.1 })
      .expect(scheduler.appointmentTooltip.getListItem(undefined, 0).element.innerText)
      .eql(etalon);

    await t
      .expect(ClientFunction(() => (window as any).testDisplayValue)())
      .eql(etalon);

    await t.expect(true).eql(true);
  }).before(async () => createWidget('dxScheduler', {
    timeZone,
    dataSource: [],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 1, 28),
    startDayHour: 9,
    height: 600,

    onAppointmentClick: ClientFunction((model) => {
      const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

      (window as any).testDisplayValue = `${displayStartDate.toISOString()} ${displayEndDate.toISOString()}`;
    }),

    appointmentTooltipTemplate: (model) => {
      const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

      return `${displayStartDate.toISOString()} ${displayEndDate.toISOString()}`;
    },

    appointmentTemplate: (model) => {
      const { displayStartDate, displayEndDate } = model.targetedAppointmentData;

      return `${displayStartDate.toISOString()} ${displayEndDate.toISOString()}`;
    },
  }, true));
});
