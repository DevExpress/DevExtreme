import { test } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const APPOINTMENTS = [
  { startDate: '2023-08-01T10:00:00', endDate: '2023-08-01T14:00:00', recurrenceRule: 'FREQ=HOURLY;INTERVAL=24', text: 'Hourly 10-14' },
  { startDate: '2023-08-01T16:00:00', endDate: '2023-08-01T20:00:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR', text: 'Daily 16-20' },
  { startDate: '2023-08-01T23:00:00', endDate: '2023-08-02T05:00:00', recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=7', allDay: true, text: 'All day 01 -> 02' },
];
const APPOINTMENTS_TIMELINE = [
  { startDate: '2023-08-01T04:00:00', endDate: '2023-08-01T18:00:00', recurrenceRule: 'FREQ=HOURLY;INTERVAL=24', text: 'Hourly 04-18' },
  { startDate: '2023-08-01T20:00:00', endDate: '2023-08-02T10:00:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR', text: 'Daily 20-10' },
];

const getScreenshotName = (viewType: string, offset: number, startDayHour: number, endDayHour: number, firstDay?: number) =>
  `view_markup_recurrent-appts_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}_first-day-${firstDay}.png`;

const getScreenshotNameForEdgeCase = (edgeCaseName: string, viewType: string, offset: number, startDayHour: number, endDayHour: number) =>
  `view_markup_recurrent-appts_${edgeCaseName}_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

const getViewWithCorrectCellDuration = (
  view: { type: string; cellDuration?: number },
  startDayHour: number,
  endDayHour: number,
): { type: string; cellDuration?: number } => {
  switch (view.type) {
    case 'timelineWeek':
    case 'timelineWorkWeek':
      return { ...view, cellDuration: (endDayHour - startDayHour) * 60 };
    default:
      return view;
  }
};

const VIEW_CONFIGS = [
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 3 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineMonth', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
];

const SHORT_DAY_CASES = [
  {
    dataSource: [
      { startDate: '2023-09-01T10:00:00', endDate: '2023-09-01T14:00:00', text: '#0 WE 10:00->14:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
      { startDate: '2023-09-01T20:00:00', endDate: '2023-09-02T04:00:00', text: '#1 WE 20:00->04:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
      { startDate: '2023-09-01T10:00:00', endDate: '2023-09-01T14:00:00', text: '#2 TH 10:00->14:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH' },
      { startDate: '2023-09-01T00:00:00', endDate: '2023-09-01T00:00:00', text: '#3 All-day TH', allDay: true, recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH' },
    ],
    offset: 720, startDayHour: 0, endDayHour: 24,
  },
  {
    dataSource: [
      { startDate: '2023-09-01T20:00:00', endDate: '2023-09-01T22:00:00', text: '#0 WE 15:00->19:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
      { startDate: '2023-09-01T23:00:00', endDate: '2023-09-02T01:00:00', text: '#1 WE 23:00->01:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
      { startDate: '2023-09-01T04:00:00', endDate: '2023-09-01T06:00:00', text: '#2 TH 04:00->06:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH' },
      { startDate: '2023-09-01T00:00:00', endDate: '2023-09-01T00:00:00', text: '#3 All-day TH', allDay: true, recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH' },
    ],
    offset: 720, startDayHour: 9, endDayHour: 17,
  },
  {
    dataSource: [
      { startDate: '2023-09-01T10:00:00', endDate: '2023-09-01T14:00:00', text: '#0 TU 10:00->14:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU' },
      { startDate: '2023-09-01T20:00:00', endDate: '2023-09-02T04:00:00', text: '#1 TU 20:00->04:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU' },
      { startDate: '2023-09-01T10:00:00', endDate: '2023-09-01T14:00:00', text: '#2 WE 10:00->14:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
      { startDate: '2023-09-01T00:00:00', endDate: '2023-09-01T00:00:00', text: '#3 All-day WE', allDay: true, recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
    ],
    offset: -720, startDayHour: 0, endDayHour: 24,
  },
  {
    dataSource: [
      { startDate: '2023-09-01T20:00:00', endDate: '2023-09-01T22:00:00', text: '#0 TU 15:00->19:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU' },
      { startDate: '2023-09-01T23:00:00', endDate: '2023-09-02T01:00:00', text: '#1 TU 23:00->01:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU' },
      { startDate: '2023-09-01T04:00:00', endDate: '2023-09-01T06:00:00', text: '#2 WE 04:00->06:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
      { startDate: '2023-09-01T00:00:00', endDate: '2023-09-01T00:00:00', text: '#3 All-day WE', allDay: true, recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
    ],
    offset: -720, startDayHour: 9, endDayHour: 17,
  },
];

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe('Offset: Markup recurrent appointments', () => {
  test('Recurrence appointments render', async ({ page }) => {
    for (const { views, dataSource } of VIEW_CONFIGS) {
      for (const offset of [0, 735, -735]) {
        for (const { startDayHour, endDayHour } of [{ startDayHour: 0, endDayHour: 24 }, { startDayHour: 9, endDayHour: 17 }]) {
          await setupPage(page);

          const view = getViewWithCorrectCellDuration(views[0], startDayHour, endDayHour);

          await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
          await createWidget(page, 'dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            maxAppointmentsPerCell: 'unlimited',
            dataSource,
            views: [view],
            currentView: view.type,
            offset,
            startDayHour,
            endDayHour,
          });

          const workSpace = page.locator('.dx-scheduler-work-space');
          await testScreenshot(
            page,
            getScreenshotName(views[0].type, offset, startDayHour, endDayHour, (views[0] as any).firstDayOfWeek),
            { element: workSpace },
          );
        }
      }
    }
  });

  test('Recurrence appointments in short day views', async ({ page }) => {
    for (const viewConfig of [{ views: [{ type: 'day', cellDuration: 60 }] }, { views: [{ type: 'timelineDay', cellDuration: 240 }] }]) {
      for (const { dataSource, offset, startDayHour, endDayHour } of SHORT_DAY_CASES) {
        await setupPage(page);

        await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
        await createWidget(page, 'dxScheduler', {
          currentDate: '2023-09-06',
          height: 800,
          maxAppointmentsPerCell: 'unlimited',
          currentView: viewConfig.views[0].type,
          dataSource,
          views: viewConfig.views,
          offset,
          startDayHour,
          endDayHour,
        });

        const workSpace = page.locator('.dx-scheduler-work-space');
        await testScreenshot(
          page,
          getScreenshotNameForEdgeCase('short-day-views', viewConfig.views[0].type, offset, startDayHour, endDayHour),
          { element: workSpace },
        );
      }
    }
  });
});
