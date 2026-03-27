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
  allDay?: boolean;
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
      const { startTime, endTime, endDateShiftDays, allDay } = appointments[timeIdx];
      const appointmentIdx = dayIdx * appointments.length + timeIdx;
      const appointmentStartISO = getIsoDate(date);
      const appointmentEndISO = getIsoDate(date, endDateShiftDays ?? 0);
      const [, , dayISO] = appointmentStartISO.split('-');
      const titleText = `#${appointmentIdx}: ${dayISO.padStart(2, '0')} ${allDay ? 'All' : ''} ${timeToText(startTime)}-${timeToText(endTime)}`;
      return {
        startDate: `${appointmentStartISO}T${startTime}`,
        endDate: `${appointmentEndISO}T${endTime}`,
        text: titleText,
        allDay,
      };
    });
  }).flat();
};

const ALL_DAY_APPOINTMENTS_DATA: AppointmentData[] = [
  { startTime: '02:00:00', endTime: '02:00:00', allDay: true, endDateShiftDays: 1 },
  { startTime: '20:30:00', endTime: '23:30:00', allDay: true },
];

const APPOINTMENTS: Record<string, Record<string, unknown>[]> = {
  day: [
    ...generateAppointments('2023-09-06', '2023-09-08', ALL_DAY_APPOINTMENTS_DATA),
    { startDate: '2023-09-05T14:00:00', endDate: '2023-09-09T16:00:00', text: 'LONG APPT', allDay: true },
  ],
  week: [
    ...generateAppointments('2023-09-02', '2023-09-10', ALL_DAY_APPOINTMENTS_DATA),
    { startDate: '2023-09-01T14:00:00', endDate: '2023-09-12T16:00:00', text: 'LONG APPT', allDay: true },
  ],
  workWeekWithFirstDay: [
    ...generateAppointments('2023-09-05', '2023-09-13', ALL_DAY_APPOINTMENTS_DATA),
    { startDate: '2023-09-03T14:00:00', endDate: '2023-09-15T16:00:00', text: 'LONG APPT', allDay: true },
  ],
  month: [
    ...generateAppointments('2023-08-26', '2023-10-08', ALL_DAY_APPOINTMENTS_DATA),
    { startDate: '2023-08-24T14:00:00', endDate: '2023-10-10T16:00:00', text: 'LONG APPT', allDay: true },
  ],
};

const getScreenshotName = (viewType: string, offset: number, startDayHour: number, endDayHour: number, firstDay?: number) =>
  `view_markup_all-day_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}_first-day-${firstDay}.png`;

const VIEW_CONFIGS = [
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.day },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.workWeekWithFirstDay },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.day },
  { views: [{ type: 'timelineWeek', cellDuration: 480, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'timelineWorkWeek', cellDuration: 480, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'timelineWorkWeek', cellDuration: 480, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.workWeekWithFirstDay },
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

test.describe('Offset: Markup all-day appointments', () => {
  test('All-day appointments render', async ({ page }) => {
    for (const { views, dataSource } of VIEW_CONFIGS) {
      for (const offset of [0, 735, 1440, -735, -1440]) {
        for (const { startDayHour, endDayHour } of [{ startDayHour: 0, endDayHour: 24 }, { startDayHour: 9, endDayHour: 17 }]) {
          await setupPage(page);

          await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
          await createWidget(page, 'dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            maxAppointmentsPerCell: 'unlimited',
            dataSource,
            views,
            currentView: views[0].type,
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
