import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { getThemeName } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

type ReduceType = 'head' | 'body' | 'tail' | undefined;

// clientWidth and clientHeight, not the bounding box: the TestCafe assertions were written
// against the border-less measurements the DOM properties give.
const clientWidthOf = async (
  scheduler: Scheduler,
  title: string,
  index: number,
): Promise<number> => scheduler.getAppointment(title, index).element
  .evaluate((element) => element.clientWidth);

const clientHeightOf = async (
  scheduler: Scheduler,
  title: string,
  index: number,
): Promise<number> => scheduler.getAppointment(title, index).element
  .evaluate((element) => element.clientHeight);

const expectReduceType = async (
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: ReduceType,
): Promise<void> => {
  const appointment = scheduler.getAppointment(title, index);

  await expect(appointment.reducedIcon).toHaveCount(reduceType === undefined ? 0 : 1);
  expect(await appointment.isReducedHead()).toBe(reduceType === 'head');
  expect(await appointment.isReducedBody()).toBe(reduceType === 'body');
  expect(await appointment.isReducedTail()).toBe(reduceType === 'tail');
};

const expectWithin = (actual: number, expected: number): void => {
  expect(actual).toBeGreaterThanOrEqual(expected - 1);
  expect(actual).toBeLessThanOrEqual(expected + 1);
};

const checkAllDayAppointment = async (
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: ReduceType,
  width: number,
): Promise<void> => {
  await expectReduceType(scheduler, title, index, reduceType);

  expect(await scheduler.getAppointment(title, index).isAllDay()).toBe(true);

  expectWithin(await clientWidthOf(scheduler, title, index), width);
};

const checkRegularAppointment = async (
  scheduler: Scheduler,
  title: string,
  index: number,
  reduceType: ReduceType,
  height: number,
): Promise<void> => {
  await expectReduceType(scheduler, title, index, reduceType);

  expectWithin(await clientHeightOf(scheduler, title, index), height);
};

test('it should render multi-day and multi-view appointments correctly if allDayPanelMode is "hidden"', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  // The TestCafe test named a theme to run in: the expected sizes are the generic layout ones.
  test.skip(getThemeName() !== 'generic', 'the expected sizes are the generic ones');

  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(4);

  let appointmentCount = await scheduler.getAppointmentCount();

  await checkRegularAppointment(scheduler, 'appt-00', 0, undefined, 200);

  await checkRegularAppointment(scheduler, 'appt-01', 0, 'head', 100);
  for (let i = 1; i < appointmentCount - 2; i += 1) {
    await checkRegularAppointment(scheduler, 'appt-01', i, 'body', 200);
  }

  await scheduler.toolbar.navigator.nextButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(7);

  appointmentCount = await scheduler.getAppointmentCount();

  for (let i = 0; i < appointmentCount; i += 1) {
    await checkRegularAppointment(scheduler, 'appt-01', i, 'body', 200);
  }

  await scheduler.toolbar.navigator.nextButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(3);

  await checkRegularAppointment(scheduler, 'appt-01', 0, 'body', 200);
  await checkRegularAppointment(scheduler, 'appt-01', 1, 'body', 200);
  await checkRegularAppointment(scheduler, 'appt-01', 2, 'tail', 50);
});

test('it should render all-day appointments if allDayPanelMode is "all"', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  test.skip(getThemeName() !== 'generic', 'the expected sizes are the generic ones');

  await createWidget(page, 'dxScheduler', {
    width: 900,
    height: 400,
    dataSource: [{
      text: 'appt-00',
      startDate: new Date(2021, 2, 22, 8),
      endDate: new Date(2021, 2, 22, 10, 30),
      allDay: true,
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
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(2);

  await checkAllDayAppointment(scheduler, 'appt-00', 0, undefined, 109);
  await checkAllDayAppointment(scheduler, 'appt-01', 0, 'head', 337);

  await scheduler.toolbar.navigator.nextButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(1);

  await checkAllDayAppointment(scheduler, 'appt-01', 0, 'body', 793);

  await scheduler.toolbar.navigator.nextButton.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(1);

  await checkAllDayAppointment(scheduler, 'appt-01', 0, 'tail', 337);
});

test('it should render all-day and multi-day appointments if allDayPanelMode is "allDay"', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(5);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 117);
  await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 151);
  await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 151);
  await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 151);
  await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);
});

test('it should correctly change allDayPanelOption at runtime', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(2);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
  await checkAllDayAppointment(scheduler, 'multiDay', 0, undefined, 417);

  await scheduler.option('allDayPanelMode', 'allDay');

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(5);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
  await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);

  await scheduler.option('allDayPanelMode', 'hidden');

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(5);
  await expect(scheduler.allDayTableCells).toHaveCount(0);

  await checkRegularAppointment(scheduler, 'allDay', 0, undefined, 303);
  await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);

  await scheduler.option('allDayPanelMode', 'allDay');

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(5);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
  await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 303);
  await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 113);

  await scheduler.option('allDayPanelMode', 'all');

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(2);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 103);
  await checkAllDayAppointment(scheduler, 'multiDay', 0, undefined, 417);
});

test('it should correctly handle allDayPanelMode for the workspace', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  test.skip(getThemeName() !== 'generic', 'the expected sizes are the generic ones');

  await createWidget(page, 'dxScheduler', {
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
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(2);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 109);
  await checkAllDayAppointment(scheduler, 'multiDay', 0, undefined, 451);

  await scheduler.toolbar.viewSwitcher.getButton('weekAllDay').element.click();

  await expect.poll(async () => scheduler.getAppointmentCount()).toBe(5);

  await checkAllDayAppointment(scheduler, 'allDay', 0, undefined, 109);
  await checkRegularAppointment(scheduler, 'multiDay', 0, 'head', 200);
  await checkRegularAppointment(scheduler, 'multiDay', 1, 'body', 200);
  await checkRegularAppointment(scheduler, 'multiDay', 2, 'body', 200);
  await checkRegularAppointment(scheduler, 'multiDay', 3, 'tail', 150);
});
