import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler: Current Time Indication: Shader with Virtual Scrolling`
  .page(url(__dirname, '../../../../container.html'))
  .beforeEach(async (t) => {
    await t.resizeWindow(2560, 600);
  });

const style = `
.dx-scheduler-date-time-shader-top::before,
.dx-scheduler-date-time-shader-bottom::before,
.dx-scheduler-timeline .dx-scheduler-date-time-shader::before,
.dx-scheduler-date-time-shader-all-day {
  background-color: red !important;
}`;

const resources = [
  { text: 'Room 1', id: 1, color: '#cb6bb2' },
  { text: 'Room 2', id: 2, color: '#56ca85' },
  { text: 'Room 3', id: 3, color: '#1e90ff' },
  { text: 'Room 4', id: 4, color: '#ff9747' },
  { text: 'Room 5', id: 5, color: '#ff6a00' },
  { text: 'Room 6', id: 6, color: '#ffc0cb' },
];

test('Should render shader correct with virtual scrolling without current time indicator', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'shader-virtual-scrolling-week-start.png',
  );

  await scheduler.scrollTo(new Date(2025, 9, 15, 17, 30), { roomId: 6 });

  await testScreenshot(
    t,
    takeScreenshot,
    'shader-virtual-scrolling-week-end.png',
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(style);

  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'week',
    views: ['week'],
    groups: ['roomId'],
    resources: [{ fieldExpr: 'roomId', dataSource: resources, label: 'Room' }],
    startDayHour: 8,
    endDayHour: 18,
    currentDate: new Date(2025, 9, 15),
    height: 400,
    shadeUntilCurrentTime: true,
    scrolling: { mode: 'virtual' },
  });
});

test('Should render shader correctly with virtual scrolling and current time indicator', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'shader-virtual-scrolling-week-start-with-current-time-indicator.png',
  );

  await scheduler.scrollTo(new Date(2025, 9, 15, 17, 30), { roomId: 6 });

  await testScreenshot(
    t,
    takeScreenshot,
    'shader-virtual-scrolling-week-end-with-current-time-indicator.png',
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(style);

  await createWidget('dxScheduler', {
    dataSource: [],
    currentView: 'week',
    views: ['week'],
    groups: ['roomId'],
    resources: [{ fieldExpr: 'roomId', dataSource: resources, label: 'Room' }],
    startDayHour: 8,
    endDayHour: 18,
    currentDate: new Date(2025, 9, 15),
    indicatorTime: new Date(2025, 9, 15, 17, 30),
    height: 400,
    shadeUntilCurrentTime: true,
    scrolling: { mode: 'virtual' },
  });
});
