import { test } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const getIsoDate = (date: Date, additionalDays = 0): string => {
  const dateCopy = new Date(date.getTime() + additionalDays * MS_IN_DAY);
  const [dateISO] = dateCopy.toISOString().split('T');
  return dateISO;
};

const timeToText = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

interface AppointmentData {
  startTime: string;
  endTime: string;
  endDateShiftDays?: number;
  text?: string;
  allDay?: boolean;
  recurrenceRule?: string;
}

const generateAppointments = (
  startDateISO: string,
  endDateISO: string,
  appointments: AppointmentData[],
) => {
  const startDate = new Date(startDateISO);
  const endDate = new Date(endDateISO);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const daysCount = Math.ceil((diffTime / MS_IN_DAY) + 1);
  return new Array(daysCount).fill(null).map((_, dayIdx) => {
    const date = new Date(startDate.getTime() + MS_IN_DAY * dayIdx);
    return new Array(appointments.length).fill(null).map((__, timeIdx) => {
      const { startTime, endTime, endDateShiftDays, text, allDay, recurrenceRule } = appointments[timeIdx];
      const appointmentIdx = dayIdx * appointments.length + timeIdx;
      const appointmentStartISO = getIsoDate(date);
      const appointmentEndISO = getIsoDate(date, endDateShiftDays ?? 0);
      const [, , dayISO] = appointmentStartISO.split('-');
      const titleText = `#${appointmentIdx}: ${dayISO.padStart(2, '0')} ${allDay ? 'All' : ''} ${!text ? `${timeToText(startTime)}-${timeToText(endTime)}` : text}`;
      return { startDate: `${appointmentStartISO}T${startTime}`, endDate: `${appointmentEndISO}T${endTime}`, text: titleText, allDay, recurrenceRule };
    });
  }).flat();
};

const APPOINTMENTS_TIME: AppointmentData[] = [
  { startTime: '10:15:00', endTime: '16:15:00' },
  { startTime: '17:05:00', endTime: '22:05:00' },
];
const APPOINTMENTS_TIMELINE_TIME: AppointmentData[] = [
  { startTime: '04:00:00', endTime: '08:00:00', endDateShiftDays: 1 },
  { startTime: '10:15:00', endTime: '16:15:00', endDateShiftDays: 1 },
  { startTime: '17:05:00', endTime: '22:05:00', endDateShiftDays: 1 },
];

const RECURRENT_APPOINTMENTS_MONTH = [
  { startDate: '2023-08-01T15:00:00', endDate: '2023-08-01T19:00:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR', text: 'Daily 15-19' },
];
const RECURRENT_APPOINTMENTS_MONTH_TIMELINE = [
  { startDate: '2023-08-01T09:00:00', endDate: '2023-08-01T13:00:00', recurrenceRule: 'FREQ=HOURLY;INTERVAL=24', text: 'Hourly 09-13' },
  { startDate: '2023-08-01T15:00:00', endDate: '2023-08-01T19:00:00', recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR', text: 'Daily 15-19' },
];

const APPOINTMENTS: Record<string, Record<string, unknown>[]> = {
  month: [...generateAppointments('2023-08-26', '2023-10-08', APPOINTMENTS_TIME), ...RECURRENT_APPOINTMENTS_MONTH],
  timelineMonth: [...generateAppointments('2023-08-31', '2023-09-08', APPOINTMENTS_TIMELINE_TIME), ...RECURRENT_APPOINTMENTS_MONTH_TIMELINE],
};

const getScreenshotName = (viewType: string, offset: number, startDayHour: number, endDayHour: number) =>
  `view_markup_ordering-appts_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

const VIEW_CONFIGS = [
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.timelineMonth },
];

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe.skip('Offset: Markup appointments ordering', () => {
  test('Appointments ordering render', async ({ page }) => {
    for (const { views, dataSource } of VIEW_CONFIGS) {
      for (const offset of [0, 735, -735, 1440, -1440]) {
        for (const { startDayHour, endDayHour } of [{ startDayHour: 0, endDayHour: 24 }, { startDayHour: 9, endDayHour: 17 }]) {
          await setupPage(page);

          await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
          await createWidget(page, 'dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            maxAppointmentsPerCell: 'unlimited',
            dataSource,
            views: [views[0]],
            currentView: views[0].type,
            offset,
            startDayHour,
            endDayHour,
          });

          const workSpace = page.locator('.dx-scheduler-work-space');
          await testScreenshot(page, getScreenshotName(views[0].type, offset, startDayHour, endDayHour), { element: workSpace });
        }
      }
    }
  });

  test('Appointments are ordered correctly with both recurrent and usual appointments (T1212573)', async ({ page }) => {
    const data = [
      { text: 'Recurr 1', startDate: new Date('2020-11-01T17:30:00.000Z'), endDate: new Date('2020-11-01T19:00:00.000Z'), recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10' },
      { text: 'Recurr 2', startDate: new Date('2020-11-01T17:30:00.000Z'), endDate: new Date('2020-11-01T19:00:00.000Z'), recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,WE;COUNT=10' },
      { text: 'Recurr 3', startDate: new Date('2020-11-01T20:00:00.000Z'), endDate: new Date('2020-11-01T21:00:00.000Z'), recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU;WKST=TU;INTERVAL=2;COUNT=2' },
      { text: 'Recurr 4', startDate: new Date('2020-11-01T17:00:00.000Z'), endDate: new Date('2020-11-01T17:15:00.000Z'), recurrenceRule: 'FREQ=DAILY;BYDAY=TU;UNTIL=20201203' },
      { text: 'Test 1', startDate: new Date('2020-11-01T15:00:00.000Z'), endDate: new Date('2020-11-01T15:30:00.000Z') },
      { text: 'Test 2', startDate: new Date('2020-11-01T18:00:00.000Z'), endDate: new Date('2020-11-01T18:30:00.000Z') },
      { text: 'Test 3', startDate: new Date('2020-11-02T15:00:00.000Z'), endDate: new Date('2020-11-02T15:30:00.000Z') },
      { text: 'Test 4', startDate: new Date('2020-11-02T18:00:00.000Z'), endDate: new Date('2020-11-02T18:30:00.000Z') },
      { text: 'Test 5', startDate: new Date('2020-11-03T15:00:00.000Z'), endDate: new Date('2020-11-03T15:30:00.000Z') },
      { text: 'Test 6', startDate: new Date('2020-11-03T18:00:00.000Z'), endDate: new Date('2020-11-03T18:30:00.000Z') },
      { text: 'Test 7', startDate: new Date('2020-11-04T15:00:00.000Z'), endDate: new Date('2020-11-04T15:30:00.000Z') },
      { text: 'Test 8', startDate: new Date('2020-11-04T18:00:00.000Z'), endDate: new Date('2020-11-04T18:30:00.000Z') },
    ];

    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme: string) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');

    await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
    await createWidget(page, 'dxScheduler', {
      currentDate: '2020-11-07',
      height: 800,
      dataSource: data,
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
    });

    const workSpace = page.locator('.dx-scheduler-work-space');
    await testScreenshot(page, 'view_markup_ordering-appts_T1212573.png', { element: workSpace });
  });
});
