import { test } from '@playwright/test';
import { createWidget, insertStylesheetRulesToPage, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const MS_IN_DAY = 24 * 60 * 60 * 1000;

interface AppointmentData {
  startTime: string;
  endTime: string;
  endDateShiftDays?: number;
  text?: string;
  allDay?: boolean;
  recurrenceRule?: string;
}

const getIsoDate = (date: Date, additionalDays = 0): string => {
  const dateCopy = new Date(date.getTime() + additionalDays * MS_IN_DAY);
  const [dateISO] = dateCopy.toISOString().split('T');
  return dateISO;
};

const timeToText = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours}:${minutes}`;
};

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
  { startTime: '04:00:00', endTime: '08:00:00' },
  { startTime: '10:15:00', endTime: '16:15:00' },
  { startTime: '17:05:00', endTime: '22:05:00' },
  { startTime: '23:00:00', endTime: '03:30:00', endDateShiftDays: 1 },
];
const APPOINTMENTS_TIMELINE_TIME: AppointmentData[] = [
  { startTime: '04:00:00', endTime: '08:00:00', endDateShiftDays: 1 },
  { startTime: '10:15:00', endTime: '16:15:00', endDateShiftDays: 1 },
  { startTime: '17:05:00', endTime: '22:05:00', endDateShiftDays: 1 },
  { startTime: '23:00:00', endTime: '03:30:00', endDateShiftDays: 1 },
];

const APPOINTMENTS: Record<string, Record<string, unknown>[]> = {
  day: generateAppointments('2023-09-06', '2023-09-08', APPOINTMENTS_TIME),
  week: generateAppointments('2023-09-02', '2023-09-10', APPOINTMENTS_TIME),
  workWeekWithFirstDay: generateAppointments('2023-09-05', '2023-09-13', APPOINTMENTS_TIME),
  month: generateAppointments('2023-08-26', '2023-10-08', APPOINTMENTS_TIME),
  timelineDay: generateAppointments('2023-09-06', '2023-09-08', APPOINTMENTS_TIMELINE_TIME),
  timelineWeek: generateAppointments('2023-09-02', '2023-09-10', APPOINTMENTS_TIMELINE_TIME),
  timelineWeekWithFirstDay: generateAppointments('2023-09-05', '2023-09-13', APPOINTMENTS_TIMELINE_TIME),
  timelineMonth: generateAppointments('2023-08-31', '2023-09-08', APPOINTMENTS_TIMELINE_TIME),
};

const getScreenshotName = (viewType: string, offset: number, startDayHour: number, endDayHour: number, firstDay?: number) =>
  `view_markup_usual-appts_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}_first-day-${firstDay}.png`;

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
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.day },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.workWeekWithFirstDay },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.timelineDay },
  { views: [{ type: 'timelineWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.timelineWeek },
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.timelineWeek },
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.timelineWeekWithFirstDay },
  { views: [{ type: 'timelineMonth', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
];

const setupPage = async (page: any) => {
  await page.goto(containerUrl);
  await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
  await page.evaluate((theme: string) => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(theme);
  }), process.env.THEME || 'fluent.blue.light');
};

test.describe.configure({ timeout: 300000 });
  test.describe('Offset: Markup usual appointments', () => {
  test('Usual appointments render', async ({ page }) => {
    test.setTimeout(300000);
    for (const { views, dataSource } of VIEW_CONFIGS) {
      for (const offset of [0, 735, 1440, -735, -1440]) {
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
});
