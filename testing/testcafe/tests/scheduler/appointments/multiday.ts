import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

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

fixture`Scheduler - Multiday appointments`
  .page(url(__dirname, '../../container.html'));

[
  'week',
  'month',
  'timelineMonth',
].forEach((currentView) => {
  test.skip(`it should not cut multiday appointment in ${currentView} view`, async (t) => {
    const {
      takeScreenshot,
      compareResults,
    } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    await t
      .expect(await takeScreenshot(
        `multiday-appointment_${currentView}.png`,
        scheduler.element,
      ))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget(
    'dxScheduler',
    {
      width: 900,
      height: 400,
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 28, 8),
        endDate: new Date(2021, 3, 4, 8),
      }],
      views: ['week', 'month', 'timelineMonth'],
      currentView,
      currentDate: new Date(2021, 3, 4),
      startDayHour: 12,
    },
    true,
  ));
});

test('it should render multi-day and multi-view appointments correctly if showAllDayAppointments is "none"', async (t) => {
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
    showAllDayAppointments: 'none',
  },
));

test('it should render all-day appointments if showAllDayAppointments is "auto"', async (t) => {
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
    showAllDayAppointments: 'auto',
  },
));

test('it should render all-day and multi-day appointments if showAllDayAppointments is "allDay"', async (t) => {
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
    showAllDayAppointments: 'allDay',
  },
));

test('it should correctly handle showAllDayAppointments for the wokrspace', async (t) => {
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
        showAllDayAppointments: 'allDay',
      },
    ],
    currentView: 'week',
    currentDate: new Date(2021, 2, 21),
    startDayHour: 8,
    endDayHour: 10,
  },
));
