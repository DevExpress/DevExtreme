import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`Layout:Appointments:noSubject`
  .page(url(__dirname, '../../../../container.html'));

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'];
const timelineViews = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

views.forEach((currentView) => {
  test(`Appointment without text should display "(No subject)" in ${currentView} view`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const appointmentDate = new Date(2021, 0, 1, 10, 30);

    if (timelineViews.includes(currentView)) {
      await scheduler.scrollTo(appointmentDate);
      await t.wait(300);
    }

    await testScreenshot(
      t,
      takeScreenshot,
      `appointment-no-subject-${currentView}.png`,
      { element: scheduler.workSpace },
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
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
  });
});
