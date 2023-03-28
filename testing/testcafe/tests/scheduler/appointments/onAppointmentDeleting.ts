import { ClientFunction } from 'testcafe';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`onAppointmentDeleting event`
  .page(url(__dirname, '../../container.html'));

const data = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2021, 3, 27, 1, 30),
    endDate: new Date(2021, 3, 27, 2, 30),
  },
];

[{
  cancel: false,
  expectedCount: 0,
}, {
  cancel: true,
  expectedCount: 1,
}].forEach(({ cancel, expectedCount }) => {
  test(`UI behaviour should be valid in case argument pass boolean value, e.cancel=${cancel}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Brochure Design Review');
    const { appointmentTooltip } = scheduler;

    await t
      .click(appointment.element)
      .expect(appointmentTooltip.isVisible())
      .ok()
      .click(appointmentTooltip.deleteButton)
      .expect(scheduler.getAppointmentCount())
      .eql(expectedCount);
  }).before(async () => createWidget('dxScheduler', {
    dataSource: data,
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 1,
    endDayHour: 7,
    height: 600,
    cellDuration: 30,
    onAppointmentDeleting: ClientFunction((e) => {
      e.cancel = cancel;
    }, {
      dependencies: { cancel },
    }),
  }));

  test(`UI behaviour should be valid in case argument pass Promise resolved, e.cancel=${cancel}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Brochure Design Review');
    const { appointmentTooltip } = scheduler;

    await t
      .click(appointment.element)
      .expect(appointmentTooltip.isVisible())
      .ok()
      .click(appointmentTooltip.deleteButton)
      .expect(scheduler.getAppointmentCount())
      .eql(expectedCount);
  }).before(async () => createWidget('dxScheduler', {
    dataSource: data,
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
    startDayHour: 1,
    endDayHour: 7,
    height: 600,
    cellDuration: 30,
    onAppointmentDeleting: ClientFunction((e) => {
      e.cancel = new Promise((resolve) => {
        resolve(cancel);
      });
    }, {
      dependencies: { cancel },
    }),
  }));
});
