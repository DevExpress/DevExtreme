import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';
import { allDayData } from './data';

['auto', 'unlimited', 1, 3, 10].forEach((maxAppointmentsPerCellValue) => {
  test(`All day appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: allDayData,
      maxAppointmentsPerCell: maxAppointmentsPerCellValue,
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      allDayPanelMode: 'allDay',
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `all-day-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`,
      { element: scheduler.allDayRow.first() },
    );
  });
});
