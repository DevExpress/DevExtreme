import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler: max appointments per cell: Week`
  .page(url(__dirname, '../../../container.html'));

['auto', 'unlimited', 3, 10].forEach((maxAppointmentsPerCellValue) => {
  test(`Week appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async (t) => {
    const { compareResults, takeScreenshot } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    await t
      .expect(await takeScreenshot(`week-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`, scheduler.workSpace))
      .ok();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'test_1',
        startDate: new Date(2021, 3, 27, 9),
        endDate: new Date(2021, 3, 27, 9, 30),
      }, {
        text: 'test_2',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_3',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_4',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_5',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_6',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_7',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_8',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_9',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_10',
        startDate: new Date(2021, 3, 27, 10),
        endDate: new Date(2021, 3, 27, 11),
      }, {
        text: 'test_1',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_12',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_13',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_14',
        startDate: new Date(2021, 3, 27, 9, 30),
        endDate: new Date(2021, 3, 27, 10),
      }, {
        text: 'test_15',
        startDate: new Date(2021, 3, 27, 10, 30),
        endDate: new Date(2021, 3, 27, 11, 30),
      }, {
        text: 'test_16',
        startDate: new Date(2021, 3, 27, 12),
        endDate: new Date(2021, 3, 27, 12, 30),
      }, {
        text: 'test_17',
        startDate: new Date(2021, 3, 27, 12),
        endDate: new Date(2021, 3, 27, 14),
      }, {
        text: 'test_18',
        startDate: new Date(2021, 3, 27, 12),
        endDate: new Date(2021, 3, 27, 13, 30),
      }],
      maxAppointmentsPerCell: maxAppointmentsPerCellValue,
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 700,
    });
  });
});
