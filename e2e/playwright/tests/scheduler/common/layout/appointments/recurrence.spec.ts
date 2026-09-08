import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'].forEach((currentView) => {
  [true, false].forEach((rtlEnabled) => {
    // The TestCafe fixture gave every combination the same name; Playwright needs each one to
    // carry the parameters that tell it apart.
    test(`Appointemt form tests (view=${currentView}, rtl=${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'Long Long Long Long Long Long Long Long Long Description',
          startDate: new Date(2021, 0, 1, 1, 30),
          endDate: new Date(2021, 0, 1, 3, 0),
          recurrenceRule: 'FREQ=DAILY;COUNT=30',
        }],
        currentDate: new Date(2021, 0, 4),
        height: 600,
        currentView,
        rtlEnabled,
      });

      const scheduler = new Scheduler(page, '#container');

      await testScreenshot(
        page,
        `recurrent-appointment-in-${currentView}_view-and-${rtlEnabled ? 'rtl' : 'non-rtl'}_mode.png`,
        { element: scheduler.element },
      );
    });
  });
});
