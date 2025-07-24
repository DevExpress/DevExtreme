import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { getTimezoneTest, MACHINE_TIMEZONES } from '../../../../helpers/machineTimezones';
import createScheduler from './init/widget.setup';

fixture.disablePageReloads`Resize all day panel appointments`
  .page(url(__dirname, '../../../container.html'));

[true, false].forEach((rtlEnabled) => {
  test(`Resize all day appointment rtlEnabled=${rtlEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;
    const text = 'Appointment: February 9, 2015, All day';
    const startDateExtendedText = 'Appointment: February 8, 2015 - February 9, 2015, All day';
    const endDateExtendedText = 'Appointment: February 9, 2015 - February 10, 2015, All day';

    await t
      .drag(right, 100, 0)
      .expect(appointment.getAriaLabel())
      .eql(rtlEnabled ? startDateExtendedText : endDateExtendedText);
    await t
      .drag(right, -100, 0)
      .expect(appointment.getAriaLabel())
      .eql(text);
    await t
      .drag(left, -100, 0)
      .expect(appointment.getAriaLabel())
      .eql(rtlEnabled ? endDateExtendedText : startDateExtendedText);
    await t
      .drag(left, 100, 0)
      .expect(appointment.getAriaLabel())
      .eql(text);
  }).before(async () => createScheduler({
    currentDate: new Date(2015, 1, 9),
    currentView: 'week',
    firstDayOfWeek: 0,
    rtlEnabled,
    height: 400,
    dataSource: [{
      text: 'Appointment',
      startDate: new Date(2015, 1, 9, 8),
      endDate: new Date(2015, 1, 9, 10),
      allDay: true,
    }],
  }));

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Shrink long appointment endDate rtlEnabled=${rtlEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    rtlEnabled
      ? await t.drag(right, -100, 0)
      : await t.drag(left, 100, 0);
    await t.expect(appointment.getAriaLabel())
      .eql('Appointment: February 10, 2015, 12:00 AM - 10:00 AM');
  }).before(async () => createScheduler({
    currentDate: new Date(2015, 1, 9),
    currentView: 'week',
    firstDayOfWeek: 0,
    rtlEnabled,
    height: 400,
    dataSource: [{
      text: 'Appointment',
      startDate: new Date(2015, 1, 9, 8),
      endDate: new Date(2015, 1, 10, 10),
    }],
  }));

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Shrink long appointment startDate rtlEnabled=${rtlEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    rtlEnabled
      ? await t.drag(left, 100, 0)
      : await t.drag(right, -100, 0);
    await t.expect(appointment.getAriaLabel())
      .eql('Appointment: February 9, 2015, 8:00 AM - February 10, 2015, 12:00 AM');
  }).before(async () => createScheduler({
    currentDate: new Date(2015, 1, 9),
    currentView: 'week',
    firstDayOfWeek: 0,
    rtlEnabled,
    height: 400,
    dataSource: [{
      text: 'Appointment',
      startDate: new Date(2015, 1, 9, 8),
      endDate: new Date(2015, 1, 10, 10),
    }],
  }));

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Resize long appointment endDate with offset rtlEnabled=${rtlEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;
    const drag = async () => (rtlEnabled
      ? t.drag(left, 100, 0)
      : t.drag(right, -100, 0));

    await drag();
    await t
      .expect(appointment.getAriaLabel())
      .eql('Appointment: March 30, 2021, 5:00 AM - March 31, 2021, 6:00 AM');
    await drag();
    await t
      .expect(appointment.getAriaLabel())
      .eql('Appointment: March 30, 2021, 5:00 AM - 6:00 AM');
  }).before(async () => createScheduler({
    timeZone: 'Europe/Berlin',
    dataSource: [{
      text: 'Appointment',
      startDate: new Date('2021-03-30T03:00:00.000Z'),
      endDate: new Date('2021-04-01T03:00:00.000Z'),
    }],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    height: 400,
    offset: 360,
    rtlEnabled,
    firstDayOfWeek: 0,
  }));

  getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])(`Resize long appointment startDate with offset rtlEnabled=${rtlEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');
    const appointment = scheduler.getAppointment('Appointment');
    const { left, right } = appointment.resizableHandle;
    const drag = async () => (rtlEnabled
      ? t.drag(right, -100, 0)
      : t.drag(left, 100, 0));

    await drag();
    await t
      .expect(appointment.getAriaLabel())
      .eql('Appointment: March 30, 2021, 6:00 AM - April 1, 2021, 5:00 AM');
    await drag();
    await t
      .expect(appointment.getAriaLabel())
      .eql('Appointment: March 31, 2021, 6:00 AM - April 1, 2021, 5:00 AM');
  }).before(async () => createScheduler({
    dataSource: [{
      text: 'Appointment',
      startDate: new Date('2021-03-30T03:00:00.000Z'),
      endDate: new Date('2021-04-01T03:00:00.000Z'),
    }],
    currentView: 'week',
    currentDate: new Date('2021-03-30T03:00:00.000Z'),
    height: 400,
    offset: 360,
    rtlEnabled,
    firstDayOfWeek: 0,
  }));
});

getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])('Resize long appointment rtlEnabled=true', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Appointment');
  const { left, right } = appointment.resizableHandle;

  await t
    .drag(right, 100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 8, 2015, 12:00 AM - February 10, 2015, 10:00 AM');
  await t
    .drag(right, -100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 9, 2015, 12:00 AM - February 10, 2015, 10:00 AM');
  await t
    .drag(left, -100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 9, 2015, 12:00 AM - February 12, 2015, 12:00 AM');
  await t
    .drag(left, 100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 9, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
}).before(async () => createScheduler({
  currentDate: new Date(2015, 1, 9),
  currentView: 'week',
  firstDayOfWeek: 0,
  rtlEnabled: true,
  height: 400,
  dataSource: [{
    text: 'Appointment',
    startDate: new Date(2015, 1, 9, 8),
    endDate: new Date(2015, 1, 10, 10),
  }],
}));

getTimezoneTest([MACHINE_TIMEZONES.EuropeBerlin])('Resize long appointment rtlEnabled=false', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Appointment');
  const { left, right } = appointment.resizableHandle;

  await t
    .drag(right, 100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 9, 2015, 8:00 AM - February 12, 2015, 12:00 AM');
  await t
    .drag(right, -100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 9, 2015, 8:00 AM - February 11, 2015, 12:00 AM');
  await t
    .drag(left, -100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 8, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
  await t
    .drag(left, 100, 0)
    .expect(appointment.getAriaLabel())
    .eql('Appointment: February 9, 2015, 12:00 AM - February 11, 2015, 12:00 AM');
}).before(async () => createScheduler({
  currentDate: new Date(2015, 1, 9),
  currentView: 'week',
  firstDayOfWeek: 0,
  rtlEnabled: false,
  height: 400,
  dataSource: [{
    text: 'Appointment',
    startDate: new Date(2015, 1, 9, 8),
    endDate: new Date(2015, 1, 10, 10),
  }],
}));
