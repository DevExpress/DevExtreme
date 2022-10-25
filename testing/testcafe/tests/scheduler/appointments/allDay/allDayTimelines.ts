import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';

const CLICK_OPTIONS = { speed: 0.1 };
const SCHEDULER_SELECTOR = '#container';

fixture`Scheduler - All day appointments`
  .page(url(__dirname, '../../../container.html'));

test('it should display the all-day appointment in two dates if the end date equals midnight',
  async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await scheduler.scrollTo(new Date('2021-04-30T00:00:00Z'));

    await takeScreenshot('timeline-month_all-day-midnight-first-day.png', scheduler.workSpace);

    await t.click(await scheduler.toolbar.navigator.nextButton(), CLICK_OPTIONS);
    await scheduler.scrollTo(new Date('2021-05-01T00:00:00Z'));

    await takeScreenshot('timeline-month_all-day-midnight-second-day.png', scheduler.workSpace);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
  await createWidget(
    'dxScheduler',
    {
      timeZone: 'Etc/GMT',
      dataSource: [{
        text: 'Test',
        startDate: '2021-04-30T00:00:00Z',
        endDate: '2021-05-01T00:00:00Z',
        allDay: true,
      }],
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssZ',
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      currentDate: '2021-04-30T00:00:00Z',
    },
  );
  await restoreBrowserSize(t);
});
