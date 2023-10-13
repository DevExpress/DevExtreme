import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import Appointment from '../../../model/scheduler/appointment';

fixture.disablePageReloads`Offset: Resize appointments`
  .page(url(__dirname, '../../container.html'));

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
};
enum ResizeType {
  startPlus = 'start-plus',
  startMinus = 'start-minus',
  endPlus = 'end-plus',
  endMinus = 'end-minus',
}

const isVerticalView = (viewType: string): boolean => viewType === 'week';
const isStartResize = (
  resizeType: ResizeType,
): boolean => resizeType === ResizeType.startPlus || resizeType === ResizeType.startMinus;

const getResizableHandle = (
  appointment: Appointment,
  viewType: string,
  resizeType: ResizeType,
): Selector => {
  switch (true) {
    case isVerticalView(viewType) && isStartResize(resizeType):
      return appointment.resizableHandle.top;
    case isVerticalView(viewType) && !isStartResize(resizeType):
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
): { x; y } => {
  switch (true) {
    case isVerticalView(viewType) && resizeType === ResizeType.startPlus:
      return { x: 0, y: -100 };
    case isVerticalView(viewType) && resizeType === ResizeType.startMinus:
      return { x: 0, y: 50 };
    case isVerticalView(viewType) && resizeType === ResizeType.endPlus:
      return { x: 0, y: 100 };
    case isVerticalView(viewType) && resizeType === ResizeType.endMinus:
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
): Promise<void> => {
  const handle = getResizableHandle(appointment, viewType, resizeType);
  const { x, y } = getResizableValues(viewType, resizeType);

  await t.drag(handle, x, y);
};

const getScreenshotName = (
  viewType: string,
  resizeType: string,
  offset: number,
) => `offset_resize_usual-appts_${viewType}_${resizeType}_offset-${offset}.png`;

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
    test('Usual appointments resize', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);
      const viewType = views[0].type;

      await doResize(t, appointment, viewType, ResizeType.startMinus);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.startMinus,
          offset,
        ),
        scheduler.workSpace,
      );

      await doResize(t, appointment, viewType, ResizeType.startPlus);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.startPlus,
          offset,
        ),
        scheduler.workSpace,
      );

      await doResize(t, appointment, viewType, ResizeType.endMinus);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          ResizeType.endMinus,
          offset,
        ),
        scheduler.workSpace,
      );

      await doResize(t, appointment, viewType, ResizeType.endPlus);
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
