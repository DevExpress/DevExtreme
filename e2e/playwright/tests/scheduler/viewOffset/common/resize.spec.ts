import type { Locator, Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import type Appointment from '../../../../models/scheduler/appointment';

const SCHEDULER_SELECTOR = '#container';
const APPOINTMENT_TITLES = {
  usual: 'Usual',
  allDay: 'All-day',
};
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS = {
  week: [
    {
      startDate: '2023-09-05T05:00:00',
      endDate: '2023-09-05T09:00:00',
      text: APPOINTMENT_TITLES.usual,
    },
    {
      startDate: '2023-09-05T00:00:00',
      endDate: '2023-09-06T00:00:00',
      text: APPOINTMENT_TITLES.allDay,
      allDay: true,
    },
  ],
  month: [
    {
      startDate: '2023-09-05T10:00:00',
      endDate: '2023-09-06T15:00:00',
      text: APPOINTMENT_TITLES.usual,
    },
    {
      startDate: '2023-09-05T00:00:00',
      endDate: '2023-09-06T00:00:00',
      text: APPOINTMENT_TITLES.allDay,
      allDay: true,
    },
  ],
  timelineMonth: [
    {
      startDate: '2023-09-02T10:00:00',
      endDate: '2023-09-03T15:00:00',
      text: APPOINTMENT_TITLES.usual,
    },
    {
      startDate: '2023-09-02T00:00:00',
      endDate: '2023-09-03T00:00:00',
      text: APPOINTMENT_TITLES.allDay,
      allDay: true,
    },
  ],
};
enum ResizeType {
  startPlus = 'start-plus',
  startMinus = 'start-minus',
  endPlus = 'end-plus',
  endMinus = 'end-minus',
}

const isVerticalView = (viewType: string, isAllDay: boolean): boolean => !isAllDay && viewType === 'week';
const isStartResize = (
  resizeType: ResizeType,
): boolean => resizeType === ResizeType.startPlus || resizeType === ResizeType.startMinus;

const VERTICAL_RESIZE_OFFSETS: Record<ResizeType, { x: number; y: number }> = {
  [ResizeType.startPlus]: { x: 0, y: -100 },
  [ResizeType.startMinus]: { x: 0, y: 50 },
  [ResizeType.endPlus]: { x: 0, y: 100 },
  [ResizeType.endMinus]: { x: 0, y: -50 },
};

const HORIZONTAL_RESIZE_OFFSETS: Record<ResizeType, { x: number; y: number }> = {
  [ResizeType.startPlus]: { x: -100, y: 0 },
  [ResizeType.startMinus]: { x: 50, y: 0 },
  [ResizeType.endPlus]: { x: 100, y: 0 },
  [ResizeType.endMinus]: { x: -50, y: 0 },
};

const getResizableHandle = (
  appointment: Appointment,
  viewType: string,
  resizeType: ResizeType,
  isAllDay: boolean,
): Locator => {
  if (isVerticalView(viewType, isAllDay)) {
    return isStartResize(resizeType)
      ? appointment.resizableHandle.top
      : appointment.resizableHandle.bottom;
  }

  return isStartResize(resizeType)
    ? appointment.resizableHandle.left
    : appointment.resizableHandle.right;
};

const getResizableValues = (
  viewType: string,
  resizeType: ResizeType,
  isAllDay: boolean,
): { x: number; y: number } => (isVerticalView(viewType, isAllDay)
  ? VERTICAL_RESIZE_OFFSETS[resizeType]
  : HORIZONTAL_RESIZE_OFFSETS[resizeType]);

const doResize = async (
  page: Page,
  appointment: Appointment,
  viewType: string,
  resizeType: ResizeType,
  isAllDay: boolean,
): Promise<void> => {
  const handle = getResizableHandle(appointment, viewType, resizeType, isAllDay);
  const { x, y } = getResizableValues(viewType, resizeType, isAllDay);

  await dragToOffset(page, handle, x, y);
};

const getScreenshotName = (
  viewType: string,
  resizeType: string,
  offset: number,
) => `offset_resize-appts_${viewType}_${resizeType}_offset-${offset}.png`;

[
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.timelineMonth },
].forEach(({ views, dataSource }) => {
  [
    0,
    735,
    -735,
  ].forEach((offset) => {
    const viewType = views[0].type;

    test(`Appointments resize common cases (view: ${viewType}, offset: ${offset})`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
      await createWidget(page, 'dxScheduler', {
        currentDate: '2023-09-07',
        height: 800,
        dataSource,
        views,
        currentView: viewType,
        offset,
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);
      const allDayAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.allDay);

      await doResize(page, usualAppointment, viewType, ResizeType.startMinus, false);
      await doResize(page, allDayAppointment, viewType, ResizeType.startMinus, true);
      await testScreenshot(
        page,
        getScreenshotName(viewType, ResizeType.startMinus, offset),
        { element: scheduler.workSpace },
      );

      await doResize(page, usualAppointment, viewType, ResizeType.startPlus, false);
      await doResize(page, allDayAppointment, viewType, ResizeType.startPlus, true);
      await testScreenshot(
        page,
        getScreenshotName(viewType, ResizeType.startPlus, offset),
        { element: scheduler.workSpace },
      );

      await doResize(page, usualAppointment, viewType, ResizeType.endMinus, false);
      await doResize(page, allDayAppointment, viewType, ResizeType.endMinus, true);
      await testScreenshot(
        page,
        getScreenshotName(viewType, ResizeType.endMinus, offset),
        { element: scheduler.workSpace },
      );

      await doResize(page, usualAppointment, viewType, ResizeType.endPlus, false);
      await doResize(page, allDayAppointment, viewType, ResizeType.endPlus, true);
      await testScreenshot(
        page,
        getScreenshotName(viewType, ResizeType.endPlus, offset),
        { element: scheduler.workSpace },
      );
    });
  });
});

[
  -720,
  720,
].forEach((offset) => {
  test(`Should resize appointment correctly with startDayHour and endDayHour (view: 'week', offset: ${offset})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          startDate: '2023-09-06T22:00:00',
          endDate: '2023-09-07T00:00:00',
          text: APPOINTMENT_TITLES.usual,
        },
        {
          startDate: '2023-09-06T00:00:00',
          endDate: '2023-09-06T00:00:00',
          allDay: true,
          text: APPOINTMENT_TITLES.allDay,
        },
      ],
      currentView: 'week',
      startDayHour: 10,
      endDayHour: 12,
      currentDate: '2023-09-07',
      height: 800,
      offset,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);
    const allDayAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.allDay);

    await dragToOffset(page, usualAppointment.resizableHandle.bottom, 0, -50);
    await dragToOffset(page, usualAppointment.resizableHandle.top, 0, 50);
    await dragToOffset(page, allDayAppointment.resizableHandle.left, -100, 0);
    await dragToOffset(page, allDayAppointment.resizableHandle.right, 100, 0);

    await testScreenshot(
      page,
      `offset_resize-appts_week_offset-${offset}_startDayHour-10_endDayHour-12.png`,
      { element: scheduler.workSpace },
    );
  });
});

[
  { offset: -720, currentDate: '2023-09-07' },
  { offset: 720, currentDate: '2023-09-06' },
].forEach(({ offset, currentDate }) => {
  test(`Should resize appointment correctly with startDayHour and endDayHour (view: 'timelineDay', offset: ${offset})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        startDate: '2023-09-06T22:00:00',
        endDate: '2023-09-07T00:00:00',
        text: APPOINTMENT_TITLES.usual,
      }],
      currentView: 'timelineDay',
      startDayHour: 10,
      endDayHour: 12,
      height: 800,
      currentDate,
      offset,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);

    await dragToOffset(page, usualAppointment.resizableHandle.left, 200, 0);
    await dragToOffset(page, usualAppointment.resizableHandle.right, -200, 0);

    await testScreenshot(
      page,
      `offset_resize-appts_timelineDay_offset-${offset}_startDayHour-10_endDayHour-12.png`,
      { element: scheduler.workSpace },
    );
  });
});
