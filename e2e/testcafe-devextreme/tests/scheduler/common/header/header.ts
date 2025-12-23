import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Scheduler header`
  .page(url(__dirname, '../../../container.html'));

test('dateNavigator buttons should not be selected after clicking', async (t) => {
  const { toolbar } = new Scheduler('#container');

  await t
    .click(toolbar.navigator.nextButton)

    .expect(toolbar.navigator.prevButton.hasClass('dx-item-selected'))
    .notOk()

    .expect(toolbar.navigator.caption.hasClass('dx-item-selected'))
    .notOk()

    .expect(toolbar.navigator.nextButton.hasClass('dx-item-selected'))
    .notOk();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

test.meta({ runInTheme: 'generic.blue.light' })('dateNavigator buttons should have "contained" styling mode with generic theme', async (t) => {
  const { toolbar } = new Scheduler('#container');

  await t
    .expect(toolbar.navigator.prevButton.hasClass('dx-button-mode-contained'))
    .ok()

    .expect(toolbar.navigator.caption.hasClass('dx-button-mode-contained'))
    .ok()

    .expect(toolbar.navigator.nextButton.hasClass('dx-button-mode-contained'))
    .ok();
}).before(async () => createWidget('dxScheduler', {
  currentView: 'day',
  views: ['day'],
  height: 580,
}));

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

const SCROLLBAR_STYLES = `
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 7px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(0, 0, 0, .5);
      -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
    .dx-scheduler-date-table-scrollable .dx-scrollable-container {
      overflow: scroll !important;
    }
`;

test('Scheduler: maintain layout after horizontal scroll (T1306971)', async (t) => {
  const {
    takeScreenshot,
    compareResults,
  } = createScreenshotsComparer(t);
  const scheduler = new Scheduler('#container');

  await insertStylesheetRulesToPage(SCROLLBAR_STYLES);

  await t.wait(100);

  await scheduler.repaint();

  await t.wait(100);

  await testScreenshot(t, takeScreenshot, 'T1306971__scheduler__horizontal-scrolling__before.png', { element: scheduler.element });

  const container = scheduler.dateTableScrollableContainer;
  const scrollWidth = await container.scrollWidth;
  const clientWidth = await container.clientWidth;
  const maxScrollLeft = scrollWidth - clientWidth;

  await t.scroll(scheduler.workspaceScrollable, maxScrollLeft, 0);

  const finalScrollLeft = await container.scrollLeft;

  await t
    .expect(maxScrollLeft).gt(0, 'No horizontal scroll available')
    .expect(finalScrollLeft).gt(0, 'Scroll position should be greater than 0');

  await t.wait(500);

  await testScreenshot(t, takeScreenshot, 'T1306971__scheduler__horizontal-scrolling__after.png', { element: scheduler.element });

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
    width: 500,
  });
});
