import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'];
const timelineViews = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

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

    if (timelineViews.includes(currentView)) {
      await scheduler.scrollTo(new Date(2021, 0, 1, 10, 30));

      // The TestCafe test waited out the scroll with a fixed pause; the appointment reaching the
      // viewport is the state that pause was waiting for.
      await expect(scheduler.getAppointmentByIndex(0).element).toBeInViewport();
    }

    await testScreenshot(
      page,
      `appointment-no-subject-${currentView}.png`,
      { element: scheduler.workSpace },
    );
  });
});
