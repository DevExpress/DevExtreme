import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import Appointment from '../../../model/scheduler/appointment';

fixture.disablePageReloads`Offset: Resize appointments`
  .page(url(__dirname, '../../container.html'));

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

const getResizableHandle = (
  appointment: Appointment,
  viewType: string,
  resizeType: ResizeType,
  isAllDay: boolean,
): Selector => {
  switch (true) {
    case isVerticalView(viewType, isAllDay) && isStartResize(resizeType):
      return appointment.resizableHandle.top;
    case isVerticalView(viewType, isAllDay) && !isStartResize(resizeType):
      return appointment.resizableHandle.bottom;
    case isStartResize(resizeType):
      return appointment.resizableHandle.left;
    default:
      return appointment.resizableHandle.right;
  }
};

const getResizableValues = (
  viewType: string,
  resizeType: ResizeType,
  isAllDay: boolean,
): { x; y } => {
  switch (true) {
    case isVerticalView(viewType, isAllDay) && resizeType === ResizeType.startPlus:
      return { x: 0, y: -100 };
    case isVerticalView(viewType, isAllDay) && resizeType === ResizeType.startMinus:
      return { x: 0, y: 50 };
    case isVerticalView(viewType, isAllDay) && resizeType === ResizeType.endPlus:
      return { x: 0, y: 100 };
    case isVerticalView(viewType, isAllDay) && resizeType === ResizeType.endMinus:
      return { x: 0, y: -50 };
    case resizeType === ResizeType.startPlus:
      return { x: -100, y: 0 };
    case resizeType === ResizeType.startMinus:
      return { x: 50, y: 0 };
    case resizeType === ResizeType.endPlus:
      return { x: 100, y: 0 };
    default:
      return { x: -50, y: 0 };
  }
};

const doResize = async (
  t: TestController,
  appointment: Appointment,
  viewType: string,
  resizeType: ResizeType,
  isAllDay: boolean,
): Promise<void> => {
  const handle = getResizableHandle(appointment, viewType, resizeType, isAllDay);
  const { x, y } = getResizableValues(viewType, resizeType, isAllDay);

  await t.drag(handle, x, y);
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
    test('Appointments resize common cases', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);
      const allDayAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.allDay);
      const viewType = views[0].type;

      await doResize(t, usualAppointment, viewType, ResizeType.startMinus, false);
      await doResize(t, allDayAppointment, viewType, ResizeType.startMinus, true);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.startMinus,
          offset,
        ),
        scheduler.workSpace,
      );

      await doResize(t, usualAppointment, viewType, ResizeType.startPlus, false);
      await doResize(t, allDayAppointment, viewType, ResizeType.startPlus, true);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.startPlus,
          offset,
        ),
        scheduler.workSpace,
      );

      await doResize(t, usualAppointment, viewType, ResizeType.endMinus, false);
      await doResize(t, allDayAppointment, viewType, ResizeType.endMinus, true);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.endMinus,
          offset,
        ),
        scheduler.workSpace,
      );

      await doResize(t, usualAppointment, viewType, ResizeType.endPlus, false);
      await doResize(t, allDayAppointment, viewType, ResizeType.endPlus, true);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.endPlus,
          offset,
        ),
        scheduler.workSpace,
      );

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
      await createWidget('dxScheduler', {
        currentDate: '2023-09-07',
        height: 800,
        dataSource,
        views,
        currentView: views[0].type,
        offset,
      });
    })
      .after(async () => {
        await removeStylesheetRulesFromPage();
      });
  });
});

[
  -720,
  720,
].forEach((offset) => {
  test(`Should resize appointment correctly with startDayHour and endDayHour (view: 'week', offset: ${offset})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);
    const allDayAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.allDay);

    await t.drag(usualAppointment.resizableHandle.bottom, 0, -50);
    await t.drag(usualAppointment.resizableHandle.top, 0, 50);
    await t.drag(allDayAppointment.resizableHandle.left, -100, 0);
    await t.drag(allDayAppointment.resizableHandle.right, 100, 0);

    await takeScreenshot(`offset_resize-appts_week_offset-${offset}_startDayHour-10_endDayHour-12.png`, scheduler.workSpace);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
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
  });
});

[
  { offset: -720, currentDate: '2023-09-07' },
  { offset: 720, currentDate: '2023-09-06' },
].forEach(({ offset, currentDate }) => {
  test(`Should resize appointment correctly with startDayHour and endDayHour (view: 'timelineDay', offset: ${offset})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);

    await t.drag(usualAppointment.resizableHandle.left, 200, 0);
    await t.drag(usualAppointment.resizableHandle.right, -200, 0);

    await takeScreenshot(`offset_resize-appts_timelineDay_offset-${offset}_startDayHour-10_endDayHour-12.png`, scheduler.workSpace);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
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
  });
});
