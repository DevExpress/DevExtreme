import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler: Horizontal Scroll Screenshot`
  .page(url(__dirname, './container.html'));

const testData = [
  {
    text: 'Website Re-Design Plan',
    startDate: new Date('2021-03-29T16:30:00.000Z'),
    endDate: new Date('2021-03-29T18:30:00.000Z'),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date('2021-03-29T19:00:00.000Z'),
    endDate: new Date('2021-03-29T20:00:00.000Z'),
    allDay: true,
  }, {
    text: 'Install New Router in Dev Room',
    startDate: new Date('2021-03-29T21:30:00.000Z'),
    endDate: new Date('2021-03-29T22:30:00.000Z'),
  }, {
    text: 'Approve Personal Computer Upgrade Plan',
    startDate: new Date('2021-03-30T17:00:00.000Z'),
    endDate: new Date('2021-03-30T18:00:00.000Z'),
  }, {
    text: 'Final Budget Review',
    startDate: new Date('2021-03-30T19:00:00.000Z'),
    endDate: new Date('2021-03-30T20:35:00.000Z'),
  }, {
    text: 'New Brochures',
    startDate: new Date('2021-03-30T21:30:00.000Z'),
    endDate: new Date('2021-03-30T22:45:00.000Z'),
  }, {
    text: 'Install New Database',
    startDate: new Date('2021-03-31T16:45:00.000Z'),
    endDate: new Date('2021-03-31T18:15:00.000Z'),
  }, {
    text: 'Approve New Online Marketing Strategy',
    startDate: new Date('2021-03-31T19:00:00.000Z'),
    endDate: new Date('2021-03-31T21:00:00.000Z'),
  }, {
    text: 'Upgrade Personal Computers',
    startDate: new Date('2021-03-31T22:15:00.000Z'),
    endDate: new Date('2021-03-31T23:30:00.000Z'),
  }, {
    text: 'Customer Workshop',
    startDate: new Date('2021-04-01T18:00:00.000Z'),
    endDate: new Date('2021-04-01T19:00:00.000Z'),
    allDay: true,
  }, {
    text: 'Prepare 2021 Marketing Plan',
    startDate: new Date('2021-04-01T18:00:00.000Z'),
    endDate: new Date('2021-04-01T20:30:00.000Z'),
  }, {
    text: 'Brochure Design Review',
    startDate: new Date('2021-04-01T21:00:00.000Z'),
    endDate: new Date('2021-04-01T22:30:00.000Z'),
  }, {
    text: 'Create Icons for Website',
    startDate: new Date('2021-04-02T17:00:00.000Z'),
    endDate: new Date('2021-04-02T18:30:00.000Z'),
  }, {
    text: 'Upgrade Server Hardware',
    startDate: new Date('2021-04-02T21:30:00.000Z'),
    endDate: new Date('2021-04-02T23:00:00.000Z'),
  }, {
    text: 'Submit New Website Design',
    startDate: new Date('2021-04-02T23:30:00.000Z'),
    endDate: new Date('2021-04-03T01:00:00.000Z'),
  }, {
    text: 'Launch New Website',
    startDate: new Date('2021-04-02T19:20:00.000Z'),
    endDate: new Date('2021-04-02T21:00:00.000Z'),
  },
];

const scrollHorizontallyToEnd = ClientFunction(() => {
  const scheduler = document.querySelector('.dx-scheduler');
  if (!scheduler) return { success: false, message: 'Scheduler not found' };

  const dateTableScrollable = scheduler.querySelector('.dx-scheduler-date-table-scrollable');
  if (!dateTableScrollable) return { success: false, message: 'Date table scrollable not found' };

  const scrollableContainer = dateTableScrollable.querySelector('.dx-scrollable-container');
  if (!scrollableContainer) return { success: false, message: 'Scrollable container not found' };

  const initialScrollLeft = scrollableContainer.scrollLeft;
  const maxScrollLeft = scrollableContainer.scrollWidth - scrollableContainer.clientWidth;

  scrollableContainer.scrollLeft = maxScrollLeft;

  return {
    success: true,
    initialScrollLeft,
    maxScrollLeft,
    finalScrollLeft: scrollableContainer.scrollLeft,
    hasHorizontalScroll: maxScrollLeft > 0,
  };
});

test('Scheduler horizontal scroll screenshot test', async (t) => {
  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await t.expect(
    await takeScreenshot('scheduler-horizontal-scroll-before.png', scheduler.element),
  ).ok();

  const scrollResult = await scrollHorizontallyToEnd();

  await t
    .expect(scrollResult.success).ok(`Scroll failed: ${scrollResult.message}`)
    .expect(scrollResult.hasHorizontalScroll).ok('No horizontal scroll available')
    .expect(scrollResult.finalScrollLeft)
    .gt(0, 'Scroll position should be greater than 0');

  await t.wait(500);

  await t.expect(
    await takeScreenshot('scheduler-horizontal-scroll-after.png', scheduler.element),
  ).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: testData,
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    height: 730,
    crossScrollingEnabled: true,
    width: 800,
  });
});
