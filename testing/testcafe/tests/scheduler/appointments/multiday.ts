import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler - Multiday appointments`
  .page(url(__dirname, '../../container.html'));

const checkAllDayAppointment = async (
  t: TestController,
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: 'head' | 'body' | 'tail' | undefined,
  width: number,
): Promise<void> => {
  const appointment = scheduler.getAppointment(title, index);
  const isReduced = reduceType !== undefined;

  await t
    .expect(appointment.reducedIcon.exists)
    .eql(isReduced)
    .expect(appointment.isReducedHead)
    .eql(reduceType === 'head')
    .expect(appointment.isReducedBody)
    .eql(reduceType === 'body')
    .expect(appointment.isReducedTail)
    .eql(reduceType === 'tail')
    .expect(appointment.isAllDay)
    .ok()
    .expect(appointment.element.clientWidth)
    .within(width - 1, width + 1);
};

const checkRegularAppointment = async (
  t: TestController,
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: 'head' | 'body' | 'tail' | undefined,
  height: number,
): Promise<void> => {
  const appointment = scheduler.getAppointment(title, index);
  const isReduced = reduceType !== undefined;

  await t
    .expect(appointment.reducedIcon.exists)
    .eql(isReduced)
    .expect(appointment.isReducedHead)
    .eql(reduceType === 'head')
    .expect(appointment.isReducedBody)
    .eql(reduceType === 'body')
    .expect(appointment.isReducedTail)
    .eql(reduceType === 'tail')
    .expect(appointment.element.clientHeight)
    .within(height - 1, height + 1);
};

test('it should render multi-day and multi-view appointments correctly if allDayPanelMode is "hidden"', async (t) => {
  const scheduler = new Scheduler('#container');

  let appointmentCount = await scheduler.getAppointmentCount();
  await t
    .expect(appointmentCount)
    .eql(4);

  await checkRegularAppointment(t, scheduler, 'appt-00', 0, undefined, 200);

  await checkRegularAppointment(t, scheduler, 'appt-01', 0, 'head', 100);
  for (let i = 1; i < appointmentCount - 2; i += 1) {
    await checkRegularAppointment(t, scheduler, 'appt-01', i, 'body', 200);
  }

  await t
    .click(scheduler.toolbar.navigator.nextButton);

  appointmentCount = await scheduler.getAppointmentCount();
  await t
    .expect(appointmentCount)
    .eql(7);

  for (let i = 0; i < appointmentCount; i += 1) {
    await checkRegularAppointment(t, scheduler, 'appt-01', i, 'body', 200);
  }

  await t
    .click(scheduler.toolbar.navigator.nextButton);

  appointmentCount = await scheduler.getAppointmentCount();
  await t
    .expect(appointmentCount)
    .eql(3);
  await checkRegularAppointment(t, scheduler, 'appt-01', 0, 'body', 200);
  await checkRegularAppointment(t, scheduler, 'appt-01', 1, 'body', 200);
  await checkRegularAppointment(t, scheduler, 'appt-01', 2, 'tail', 50);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 900,
    height: 400,
    dataSource: [{
      text: 'appt-00',
      startDate: new Date(2021, 2, 22, 8),
      endDate: new Date(2021, 2, 22, 10, 30),
    }, {
      text: 'appt-01',
      startDate: new Date(2021, 2, 25, 9),
      endDate: new Date(2021, 3, 6, 8, 30),
    }],
    views: ['week', 'month', 'timelineMonth'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 21),
    startDayHour: 8,
    endDayHour: 10,
    allDayPanelMode: 'hidden',
  },
));

test('it should render all-day appointments if allDayPanelMode is "all"', async (t) => {
  const scheduler = new Scheduler('#container');

  let appointmentCount = await scheduler.getAppointmentCount();
  await t
    .expect(appointmentCount)
    .eql(2);
  await checkAllDayAppointment(t, scheduler, 'appt-00', 0, undefined, 109);
  await checkAllDayAppointment(t, scheduler, 'appt-01', 0, 'head', 337);

  await t
    .click(scheduler.toolbar.navigator.nextButton);

  appointmentCount = await scheduler.getAppointmentCount();
  await t
    .expect(appointmentCount)
    .eql(1);
  await checkAllDayAppointment(t, scheduler, 'appt-01', 0, 'head', 793);

  await t
    .click(scheduler.toolbar.navigator.nextButton);

  appointmentCount = await scheduler.getAppointmentCount();
  await t
    .expect(appointmentCount)
    .eql(1);
  await checkAllDayAppointment(t, scheduler, 'appt-01', 0, undefined, 337);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 900,
    height: 400,
    dataSource: [{
      text: 'appt-00',
      startDate: new Date(2021, 2, 22, 8),
      endDate: new Date(2021, 2, 22, 10, 30),
    }, {
      text: 'appt-01',
      startDate: new Date(2021, 2, 25, 9),
      endDate: new Date(2021, 3, 6, 8, 30),
    }],
    views: ['week', 'month', 'timelineMonth'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 21),
    startDayHour: 8,
    endDayHour: 10,
    allDayPanelMode: 'all',
  },
));

test('it should render all-day and multi-day appointments if allDayPanelMode is "allDay"', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount())
    .eql(5);

  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 109);
  await checkRegularAppointment(t, scheduler, 'multiDay', 0, 'head', 200);
  await checkRegularAppointment(t, scheduler, 'multiDay', 1, 'body', 200);
  await checkRegularAppointment(t, scheduler, 'multiDay', 2, 'body', 200);
  await checkRegularAppointment(t, scheduler, 'multiDay', 3, 'tail', 150);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 900,
    height: 400,
    dataSource: [{
      text: 'allDay',
      startDate: new Date(2021, 2, 22),
      allDay: true,
    }, {
      text: 'multiDay',
      startDate: new Date(2021, 2, 22, 8),
      endDate: new Date(2021, 2, 25, 9, 30),
    }],
    views: ['week', 'month', 'timelineMonth'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 21),
    startDayHour: 8,
    endDayHour: 10,
    allDayPanelMode: 'allDay',
  },
));

test('it should correctly change allDayPanelOption at runtime', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount())
    .eql(2);
  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 95);
  await checkAllDayAppointment(t, scheduler, 'multiDay', 0, undefined, 395);

  await scheduler.option('allDayPanelMode', 'allDay');
  await t
    .expect(scheduler.getAppointmentCount())
    .eql(5);
  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 95);
  await checkRegularAppointment(t, scheduler, 'multiDay', 0, 'head', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 1, 'body', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 2, 'body', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 3, 'tail', 150);

  await scheduler.option('allDayPanelMode', 'hidden');
  await t
    .expect(scheduler.getAppointmentCount())
    .eql(5)
    .expect(scheduler.allDayTableCells.exists)
    .notOk();
  await checkRegularAppointment(t, scheduler, 'allDay', 0, undefined, 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 0, 'head', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 1, 'body', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 2, 'body', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 3, 'tail', 150);

  await scheduler.option('allDayPanelMode', 'allDay');
  await t
    .expect(scheduler.getAppointmentCount())
    .eql(5);
  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 95);
  await checkRegularAppointment(t, scheduler, 'multiDay', 0, 'head', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 1, 'body', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 2, 'body', 400);
  await checkRegularAppointment(t, scheduler, 'multiDay', 3, 'tail', 150);

  await scheduler.option('allDayPanelMode', 'all');
  await t
    .expect(scheduler.getAppointmentCount())
    .eql(2);
  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 95);
  await checkAllDayAppointment(t, scheduler, 'multiDay', 0, undefined, 395);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 800,
    height: 600,
    dataSource: [
      {
        text: 'allDay',
        startDate: new Date(2021, 2, 22),
        allDay: true,
      },
      {
        text: 'multiDay',
        startDate: new Date(2021, 2, 22, 8),
        endDate: new Date(2021, 2, 25, 9, 30),
      }],
    views: ['week', 'workWeek'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 22),
    maxAppointmentsPerCell: 2,
    startDayHour: 8,
    endDayHour: 12,
  },
));

test('it should correctly handle allDayPanelMode for the wokrspace', async (t) => {
  const scheduler = new Scheduler('#container');

  await t
    .expect(scheduler.getAppointmentCount())
    .eql(2);

  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 109);
  await checkAllDayAppointment(t, scheduler, 'multiDay', 0, undefined, 451);

  await t
    .click(scheduler.toolbar.viewSwitcher.getButton('weekAllDay').element)
    .expect(scheduler.getAppointmentCount())
    .eql(5);

  await checkAllDayAppointment(t, scheduler, 'allDay', 0, undefined, 109);
  await checkRegularAppointment(t, scheduler, 'multiDay', 0, 'head', 200);
  await checkRegularAppointment(t, scheduler, 'multiDay', 1, 'body', 200);
  await checkRegularAppointment(t, scheduler, 'multiDay', 2, 'body', 200);
  await checkRegularAppointment(t, scheduler, 'multiDay', 3, 'tail', 150);
}).before(async () => createWidget(
  'dxScheduler',
  {
    width: 900,
    height: 400,
    dataSource: [{
      text: 'allDay',
      startDate: new Date(2021, 2, 22),
      allDay: true,
    }, {
      text: 'multiDay',
      startDate: new Date(2021, 2, 22, 8),
      endDate: new Date(2021, 2, 25, 9, 30),
    }],
    views: [
      'week',
      {
        type: 'week',
        name: 'weekAllDay',
        allDayPanelMode: 'allDay',
      },
    ],
    currentView: 'week',
    currentDate: new Date(2021, 2, 21),
    startDayHour: 8,
    endDayHour: 10,
  },
));
