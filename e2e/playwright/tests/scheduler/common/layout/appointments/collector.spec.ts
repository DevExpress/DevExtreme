import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { generateOptionMatrix } from '../../../../../helpers/generateOptionMatrix';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const getSchedulerBaseOptions = (view: string) => {
  const count = 20;
  const day = 1;
  const allDayAppointments = Array(Math.round(count / 4)).fill({
    allDay: true,
    text: 'text',
    startDate: new Date(2021, 7, day, 0),
    endDate: new Date(2021, 7, day, 2),
  });
  const regularAppointments = Array(Math.round((count * 3) / 4)).fill({
    text: 'text',
    startDate: new Date(2021, 7, day, 0),
    endDate: new Date(2021, 7, day, 2),
  });
  const width = ['month', 'week'].includes(view) ? 800 : 500;
  const height = ['month'].includes(view) ? 500 : 300;

  return {
    currentDate: new Date(2021, 7, day),
    views: [view],
    currentView: view,
    dataSource: [...allDayAppointments, ...regularAppointments],
    height,
    width,
  };
};

test('Appointment collector has correct offset when adaptivityEnabled=true (T1024299)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    adaptivityEnabled: true,
    currentDate: new Date(2021, 7, 1),
    views: ['timelineMonth'],
    currentView: 'timelineMonth',
    dataSource: [{
      text: 'text',
      startDate: new Date(2021, 7, 1),
      endDate: new Date(2021, 7, 2),
    }],
    height: 300,
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(
    page,
    'appointment-collector-adaptability-timelineMonth.png',
    { element: scheduler.workSpace },
  );
});

generateOptionMatrix({
  view: ['week', 'month', 'timelineWeek'],
  adaptivityEnabled: [true, false],
}).forEach(({ view, adaptivityEnabled }) => {
  test(`Appointment collector has correct offset when view=${view} adaptivityEnabled=${adaptivityEnabled}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      adaptivityEnabled,
      ...getSchedulerBaseOptions(view),
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `appointment-collector-${view}-adapt(${adaptivityEnabled}).png`,
      { element: scheduler.workSpace },
    );
  });
});

test('Appointment collector has correct offset when month view with double interval', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...getSchedulerBaseOptions('month'),
    views: [{ type: 'month', intervalCount: 2 }],
  });

  const scheduler = new Scheduler(page, '#container');

  await testScreenshot(
    page,
    'appointment-collector-month-double-interval.png',
    { element: scheduler.workSpace },
  );
});

generateOptionMatrix({
  view: ['week', 'month', 'timelineWeek'],
  rtlEnabled: [false, true],
}).forEach(({ view, rtlEnabled }) => {
  test(`Appointment collector has correct offset when view=${view} rtlEnabled=${rtlEnabled}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      ...getSchedulerBaseOptions(view),
      rtlEnabled,
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `appointment-collector-${view}-rtl(${rtlEnabled}).png`,
      { element: scheduler.workSpace },
    );
  });
});
