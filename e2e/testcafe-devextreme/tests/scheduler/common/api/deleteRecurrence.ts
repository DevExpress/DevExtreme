import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler API - deleteRecurrence`
  .page(url(__dirname, '../../../container.html'));

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
    endDayHour: 13,
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

  // fluent-next narrowed the left column by 1px (65 -> 64) and raised the header by 2px
  // (46 -> 48); the other themes were not touched
  const isFluentNext = getThemeName() === 'fluent-next';

  const rect0 = await appointment0.element.boundingClientRect;
  await t
    .expect(rect0.left)
    .within(isFluentNext ? 317 : 318, isFluentNext ? 318 : 319)
    .expect(rect0.top)
    .within(isFluentNext ? 142 : 140, isFluentNext ? 143 : 141);

  const rect1 = await appointment1.element.boundingClientRect;
  await t
    .expect(rect1.left)
    .within(562, 563)
    .expect(rect1.top)
    .within(isFluentNext ? 142 : 140, isFluentNext ? 143 : 141);
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
    endDayHour: 12,
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

test('should show delete recurrence dialog if mode is "dialog"', async (t) => {
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
    .wait(100)
    .expect(scheduler.getAppointmentCount())
    .eql(3)
    .click(deleteRecurrenceDialog.appointment)
    .wait(100)
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
    endDayHour: 13,
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
