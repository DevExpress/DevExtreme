import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';
import { timedData } from './data';

['auto', 'unlimited', 1, 3, 10, 20].forEach((maxAppointmentsPerCellValue) => {
  test(`Timeline appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: timedData,
      maxAppointmentsPerCell: maxAppointmentsPerCellValue,
      views: ['timelineDay'],
      currentView: 'timelineDay',
      currentDate: new Date(2021, 3, 27),
      startDayHour: 9,
      height: 700,
    });

    const scheduler = new Scheduler(page, '#container');

    await testScreenshot(
      page,
      `timeline-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`,
      { element: scheduler.workSpace },
    );
  });
});
