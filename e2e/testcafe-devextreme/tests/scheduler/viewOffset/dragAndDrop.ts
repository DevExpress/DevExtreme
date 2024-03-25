import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture.disablePageReloads`Offset: Drag-n-drop appointments`
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
    test('Usual appointments drag-n-drop', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const appointment = scheduler.getAppointment(APPOINTMENT_TITLE);
      const viewType = views[0].type;

      const { x, y } = getDragCoordinatesByView(viewType);
      await t.drag(appointment.element, x, y);
      await takeScreenshot(
        getScreenshotName(
          viewType,
          offset,
          isAllDay,
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
