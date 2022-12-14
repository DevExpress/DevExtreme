import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../../helpers/createWidget';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Scheduler: max appointments per cell: All day`
  .page(url(__dirname, '../../../container.html'))
  .afterEach(async () => disposeWidgets());

['auto', 'unlimited', 1, 3, 10].forEach((maxAppointmentsPerCellValue) => {
  test(`All day appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async (t) => {
    const { compareResults, takeScreenshot } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    await t
      .expect(await takeScreenshot(`all-day-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`, scheduler.allDayRow))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget(
      'dxScheduler', {
        dataSource: [{
          text: 'test_26',
          startDate: new Date(2021, 3, 26),
          endDate: new Date(2021, 3, 26),
          allDay: true,
        }, {
          text: 'test_27',
          startDate: new Date(2021, 3, 27),
          endDate: new Date(2021, 3, 27),
          allDay: true,
        }, {
          text: 'test_27',
          startDate: new Date(2021, 3, 27),
          endDate: new Date(2021, 3, 27),
          allDay: true,
        }, {
          text: 'test_28',
          startDate: new Date(2021, 3, 28),
          endDate: new Date(2021, 3, 28),
          allDay: true,
        }, {
          text: 'test_28',
          startDate: new Date(2021, 3, 28),
          endDate: new Date(2021, 3, 28),
          allDay: true,
        }, {
          text: 'test_28',
          startDate: new Date(2021, 3, 28),
          endDate: new Date(2021, 3, 28),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }],
        maxAppointmentsPerCell: maxAppointmentsPerCellValue,
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 3, 29),
        startDayHour: 9,
        allDayPanelMode: 'allDay',
      },
    );
  });
});
