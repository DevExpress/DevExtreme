import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const APPOINTMENT_TITLE = 'Test';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS = {
  week: [{
    startDate: '2023-09-05T05:00:00',
    endDate: '2023-09-05T09:00:00',
    text: APPOINTMENT_TITLE,
  }],
  month: [{
    startDate: '2023-09-05T10:00:00',
    endDate: '2023-09-06T15:00:00',
    text: APPOINTMENT_TITLE,
  }],
  timelineMonth: [{
    startDate: '2023-09-02T10:00:00',
    endDate: '2023-09-03T15:00:00',
    text: APPOINTMENT_TITLE,
  }],
  allDayWeek: [{
    startDate: '2023-09-05T05:00:00',
    endDate: '2023-09-05T09:00:00',
    text: APPOINTMENT_TITLE,
    allDay: true,
  }],
  allDayMonth: [{
    startDate: '2023-09-05T10:00:00',
    endDate: '2023-09-06T15:00:00',
    text: APPOINTMENT_TITLE,
    allDay: true,
  }],
  allDayTimelineMonth: [{
    startDate: '2023-09-02T10:00:00',
    endDate: '2023-09-03T15:00:00',
    text: APPOINTMENT_TITLE,
    allDay: true,
  }],
};

const getDragCoordinatesByView = (
  viewType: string,
): { x: number; y: number } => {
  switch (viewType) {
    case 'week':
      return { x: 150, y: 0 };
    case 'month':
      return { x: 300, y: 300 };
    default:
      return { x: 300, y: 0 };
  }
};

const getScreenshotName = (
  viewType: string,
  offset: number,
  isAllDay: boolean,
) => `offset_drag-n-drop_${isAllDay ? 'all-day' : 'usual'}-appts_${viewType}_offset-${offset}.png`;

[
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.week, isAllDay: false },
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.allDayWeek, isAllDay: true },
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS.month, isAllDay: false },
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS.allDayMonth, isAllDay: true },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.timelineMonth, isAllDay: false },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.allDayTimelineMonth, isAllDay: true },
].forEach(({ views, dataSource, isAllDay }) => {
  [
    0,
    735,
    -735,
  ].forEach((offset) => {
    const viewType = views[0].type;

    test(`Usual appointments drag-n-drop (view: ${viewType}, all-day: ${isAllDay}, offset: ${offset})`, async ({ page }) => {
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
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);

      const { x, y } = getDragCoordinatesByView(viewType);
      await dragToOffset(page, appointment.element, x, y);

      await testScreenshot(
        page,
        getScreenshotName(viewType, offset, isAllDay),
        { element: scheduler.workSpace },
      );
    });
  });
});
