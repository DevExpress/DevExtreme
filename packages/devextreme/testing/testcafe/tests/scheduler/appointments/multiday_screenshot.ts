import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture`Scheduler - Multiday appointments (screenshot)`
  .page(url(__dirname, '../../container.html'));

[
  'week',
  'month',
  'timelineMonth',
].forEach((currentView) => {
  test(`it should not cut multiday appointment in ${currentView} view`, async (t) => {
    const {
      takeScreenshot,
      compareResults,
    } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    await t
      .expect(await takeScreenshot(
        `multiday-appointment_${currentView}.png`,
        scheduler.element,
      ))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget(
      'dxScheduler',
      {
        width: 900,
        height: 400,
        dataSource: [{
          text: 'Website Re-Design Plan',
          startDate: new Date(2021, 2, 28, 8),
          endDate: new Date(2021, 3, 4, 8),
        }],
        views: ['week', 'month', 'timelineMonth'],
        currentView,
        currentDate: new Date(2021, 3, 4),
        startDayHour: 12,
      },
    );
  });
});
