import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';

fixture`Scheduler API - deleteRecurrence`
  .page(url(__dirname, '../../container.html'));

test('should delete recurrent appointment if mode is "series"', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('test-appt');
  const { appointmentTooltip } = scheduler;

  await t
    .click(appointment.element)
    .expect(appointmentTooltip.exists)
    .ok()
    .click(appointmentTooltip.deleteButton)
    .expect(scheduler.getAppointmentCount())
    .eql(0);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 800,
    height: 600,
    views: [{
      type: 'day',
      intervalCount: 3,
    }],
    currentView: 'day',
    currentDate: new Date(2022, 3, 12),
    startDayHour: 8,
    endDayHour: 12.5,
    onAppointmentDeleting: (e) => {
      e.component.deleteRecurrence(
        e.appointmentData,
        e.targetedAppointmentData.startDate,
        'series',
      );

      e.cancel = true;
    },
    dataSource: [{
      text: 'test-appt',
      startDate: new Date(2022, 3, 12, 8),
      endDate: new Date(2022, 3, 12, 9),
      apptColor: 1,
      recurrenceRule: 'FREQ=DAILY;COUNT=4',
    }],
  },
));

test('should exclude from recurrence if mode is "occurrence"', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment0 = scheduler.getAppointment('test-appt', 0);
  const appointment1 = scheduler.getAppointment('test-appt', 1);
  const { appointmentTooltip } = scheduler;

  await t
    .click(appointment0.element)
    .expect(appointmentTooltip.exists)
    .ok()
    .click(appointmentTooltip.deleteButton)
    .expect(scheduler.getAppointmentCount())
    .eql(2);

  const rect0 = await appointment0.element.boundingClientRect;
  await t
    .expect(rect0.left)
    .within(341, 342)
    .expect(rect0.top)
    .within(139, 140);

  const rect1 = await appointment1.element.boundingClientRect;
  await t
    .expect(rect1.left)
    .within(574, 575)
    .expect(rect1.top)
    .within(139, 140);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 800,
    height: 600,
    views: [{
      type: 'day',
      intervalCount: 3,
    }],
    currentView: 'day',
    currentDate: new Date(2022, 3, 12),
    startDayHour: 8,
    endDayHour: 12.5,
    onAppointmentDeleting: (e) => {
      e.component.deleteRecurrence(
        e.appointmentData,
        e.targetedAppointmentData.startDate,
        'occurrence',
      );

      e.cancel = true;
    },
    dataSource: [{
      text: 'test-appt',
      startDate: new Date(2022, 3, 12, 8),
      endDate: new Date(2022, 3, 12, 9),
      apptColor: 1,
      recurrenceRule: 'FREQ=DAILY;COUNT=4',
    }],
  },
));

test.skip('should show delete recurrence dialog if mode is "dialog"', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('test-appt');
  const { appointmentTooltip } = scheduler;
  const deleteRecurrenceDialog = Scheduler.getDeleteRecurrenceDialog();

  await t
    .click(appointment.element)
    .expect(appointmentTooltip.isVisible())
    .ok()
    .expect(appointmentTooltip.deleteButton.visible)
    .ok()
    .click(appointmentTooltip.deleteButton)
    .expect(scheduler.getAppointmentCount())
    .eql(3)
    .click(deleteRecurrenceDialog.appointment)
    .expect(scheduler.getAppointmentCount())
    .eql(2);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 800,
    height: 600,
    views: [{
      type: 'day',
      intervalCount: 3,
    }],
    currentView: 'day',
    currentDate: new Date(2022, 3, 12),
    startDayHour: 8,
    endDayHour: 12.5,
    onAppointmentDeleting: (e) => {
      e.component.deleteRecurrence(
        e.appointmentData,
        e.targetedAppointmentData.startDate,
        'dialog',
      );

      e.cancel = true;
    },
    dataSource: [{
      text: 'test-appt',
      startDate: new Date(2022, 3, 12, 8),
      endDate: new Date(2022, 3, 12, 9),
      apptColor: 1,
      recurrenceRule: 'FREQ=DAILY;COUNT=4',
    }],
  },
));
