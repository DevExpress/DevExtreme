import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';
import { timedData } from './data';

['auto', 'unlimited', 3, 10].forEach((maxAppointmentsPerCellValue) => {
  test(`Day appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: timedData,
      maxAppointmentsPerCell: maxAppointmentsPerCellValue,
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      height: 700,
      width: 500,
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `day-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`,
      { element: scheduler.workSpace },
    );
  });
});
