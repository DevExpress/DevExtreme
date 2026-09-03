import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const APPOINTMENT_TITLES = {
  usual: 'Usual',
  allDay: 'All-day',
};
const APPOINTMENTS = {
  week: [
    {
      StartDate2: '2023-09-06T04:00:00',
      EndDate2: '2023-09-06T06:00:00',
      Text2: APPOINTMENT_TITLES.usual,
    },
    {
      StartDate2: '2023-09-06T00:00:00',
      EndDate2: '2023-09-06T00:00:00',
      Text2: APPOINTMENT_TITLES.allDay,
      AllDay2: true,
    },
  ],
};

[
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS.week },
].forEach(({ views, dataSource }) => {
  [
    0,
    180,
    -180,
  ].forEach((offset) => {
    const viewType = views[0].type;

    test(`Appointment with expr common test (view: ${viewType}, offset: ${offset})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: '2023-09-05',
        height: 800,
        dataSource,
        views,
        currentView: viewType,
        offset,
        startDateExpr: 'StartDate2',
        endDateExpr: 'EndDate2',
        textExpr: 'Text2',
        allDayExpr: 'AllDay2',
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
      const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);
      const allDayAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.allDay);

      await testScreenshot(
        page,
        `offset_appt-expr_${viewType}_offset-${offset}.png`,
        { element: scheduler.workSpace },
      );

      await dragToOffset(page, usualAppointment.element, 100, 100);
      await dragToOffset(page, allDayAppointment.element, -100, 0);

      await testScreenshot(
        page,
        `offset_appt-expr_drag-n-drop_${viewType}_offset-${offset}.png`,
        { element: scheduler.workSpace },
      );

      await dragToOffset(page, usualAppointment.resizableHandle.bottom, 0, 100);
      await dragToOffset(page, allDayAppointment.resizableHandle.left, -100, 0);

      await testScreenshot(
        page,
        `offset_appt-expr_resize_${viewType}_offset-${offset}.png`,
        { element: scheduler.workSpace },
      );
    });
  });
});
