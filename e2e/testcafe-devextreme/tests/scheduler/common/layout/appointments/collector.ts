import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { generateOptionMatrix } from '../../../../../helpers/generateOptionMatrix';
import { changeTheme } from '../../../../../helpers/changeTheme';

fixture.disablePageReloads`Appointments collector`
  .page(url(__dirname, '../../../../container.html'));

test('Appointment collector has correct offset when adaptivityEnabled=true (T1024299)', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('appointment-collector-adaptability-timelineMonth.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
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
}));

const getSchedulerBaseOptions = (view: string) => {
  const count = 20;
  const day = ['workWeek', 'timelineWorkWeek'].includes(view) ? 2 : 1;
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
  const width = ['month', 'week', 'workWeek'].includes(view) ? 800 : 500;
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

generateOptionMatrix({
  view: ['week', 'month', 'timelineWeek', 'timelineMonth'],
  variants: [
    { theme: 'generic.light', adaptivityEnabled: false },
    { theme: 'material.blue.light', adaptivityEnabled: false },
    { theme: 'fluent.blue.light', adaptivityEnabled: false },
    { theme: 'generic.light.compact', adaptivityEnabled: false },
    { theme: 'material.blue.light.compact', adaptivityEnabled: false },
    { theme: 'fluent.blue.light.compact', adaptivityEnabled: false },
    { theme: 'generic.light', adaptivityEnabled: true },
    { theme: 'material.blue.light', adaptivityEnabled: true },
    { theme: 'fluent.blue.light', adaptivityEnabled: true },
  ],
}).forEach(({ view, variants: { theme, adaptivityEnabled } }) => {
  test(`Appointment collector has correct offset when view=${view} adaptivityEnabled=${adaptivityEnabled} theme=${theme}`, async (t) => {
    const scheduler = new Scheduler('#container');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`appointment-collector-${view}-adapt(${adaptivityEnabled})-${theme}.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxScheduler', {
      adaptivityEnabled,
      ...getSchedulerBaseOptions(view),
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});

['generic.light', 'material.blue.light', 'fluent.blue.light'].forEach((theme) => {
  test(`Appointment collector has correct offset when month view with double interval theme=${theme}`, async (t) => {
    const scheduler = new Scheduler('#container');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`appointment-collector-month-double-interval-${theme}.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxScheduler', {
      ...getSchedulerBaseOptions('month'),
      views: [{ type: 'month', intervalCount: 2 }],
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});

generateOptionMatrix({
  view: ['week', 'month', 'timelineWeek', 'timelineMonth'],
  rtlEnabled: [false, true],
}).forEach(({
  view, rtlEnabled,
}) => {
  test(`Appointment collector has correct offset when view=${view} rtlEnabled=${rtlEnabled}`, async (t) => {
    const scheduler = new Scheduler('#container');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`appointment-collector-${view}-rtl(${rtlEnabled}).png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxScheduler', {
    ...getSchedulerBaseOptions(view),
    rtlEnabled,
  }));
});
