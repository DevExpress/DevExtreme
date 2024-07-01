import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Offset: Appointment expressions`
  .page(url(__dirname, '../../container.html'));

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
    test('Appointment with expr common test', async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const usualAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.usual);
      const allDayAppointment = scheduler.getAppointment(APPOINTMENT_TITLES.allDay);
      const viewType = views[0].type;

      await takeScreenshot(`offset_appt-expr_${viewType}_offset-${offset}.png`, scheduler.workSpace);

      await t.drag(usualAppointment.element, 100, 100);
      await t.drag(allDayAppointment.element, -100, 0);

      await takeScreenshot(`offset_appt-expr_drag-n-drop_${viewType}_offset-${offset}.png`, scheduler.workSpace);

      await t.drag(usualAppointment.resizableHandle.bottom, 0, 100);
      await t.drag(allDayAppointment.resizableHandle.left, -100, 0);

      await takeScreenshot(`offset_appt-expr_resize_${viewType}_offset-${offset}.png`, scheduler.workSpace);

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createWidget('dxScheduler', {
        currentDate: '2023-09-05',
        height: 800,
        dataSource,
        views,
        currentView: views[0].type,
        offset,
        startDateExpr: 'StartDate2',
        endDateExpr: 'EndDate2',
        textExpr: 'Text2',
        allDayExpr: 'AllDay2',
      });
    });
  });
});
