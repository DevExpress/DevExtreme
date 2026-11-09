import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'];
const timelineViews = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

test.describe('Layout:Appointments:noSubject', () => {
  views.forEach((currentView) => {
    test(`Appointment without text should display "(No subject)" in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          startDate: new Date(2021, 0, 1, 10, 30),
          endDate: new Date(2021, 0, 1, 12, 0),
          text: '',
        }],
        views,
        currentView,
        currentDate: new Date(2021, 0, 1),
        startDayHour: 9,
        endDayHour: 18,
        height: 600,
        width: 600,
      });

      const scheduler = new Scheduler(page, '#container');

      const appointmentDate = new Date(2021, 0, 1, 10, 30);

      if (timelineViews.includes(currentView)) {
        await scheduler.scrollTo(appointmentDate);
        await expect(scheduler.getAppointmentByIndex(0).element).toBeInViewport();
      }

      await testScreenshot(
        page,
        `appointment-no-subject-${currentView}.png`,
        { element: scheduler.workSpace },
      );
    });
  });
});
