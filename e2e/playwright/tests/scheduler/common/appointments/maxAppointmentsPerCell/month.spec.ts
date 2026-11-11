import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test.describe('Scheduler: max appointments per cell: Month', () => {
  ['auto', 'unlimited', 1, 3, 10].forEach((maxAppointmentsPerCellValue) => {
    test(`Month appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
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
        views: ['month'],
        currentView: 'month',
        currentDate: new Date(2021, 3, 29),
        startDayHour: 9,
        height: 700,
      });

      const scheduler = new Scheduler(page, '#container');

      await testScreenshot(
        page,
        `month-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`,
        { element: scheduler.workSpace },
      );
    });
  });
});
