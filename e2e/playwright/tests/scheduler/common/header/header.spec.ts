import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import { isMaterialBased } from '../../../../helpers/themeUtils';
import Scheduler from '../../../../models/scheduler';

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

test('dateNavigator buttons should not be selected after clicking', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentView: 'day',
    views: ['day'],
    height: 580,
  });

  const { toolbar } = new Scheduler(page, '#container');

  await toolbar.navigator.nextButton.click();

  await expect(toolbar.navigator.prevButton).not.toHaveClass(/dx-item-selected/);
  await expect(toolbar.navigator.caption).not.toHaveClass(/dx-item-selected/);
  await expect(toolbar.navigator.nextButton).not.toHaveClass(/dx-item-selected/);
});

test('dateNavigator buttons should have "contained" styling mode with generic theme', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  // The TestCafe test named a theme to run in, and the runner dropped it everywhere else. The
  // material-based themes style these buttons as text, which the "text" styling mode test covers.
  test.skip(isMaterialBased(), 'only the generic theme styles the navigator buttons as contained');

  await createWidget(page, 'dxScheduler', {
    currentView: 'day',
    views: ['day'],
    height: 580,
  });

  const { toolbar } = new Scheduler(page, '#container');

  await expect(toolbar.navigator.prevButton).toHaveClass(/dx-button-mode-contained/);
  await expect(toolbar.navigator.caption).toHaveClass(/dx-button-mode-contained/);
  await expect(toolbar.navigator.nextButton).toHaveClass(/dx-button-mode-contained/);
});

test('Scheduler: maintain layout after horizontal scroll (T1306971)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
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

  const scheduler = new Scheduler(page, '#container');

  await insertStylesheetRulesToPage(page, SCROLLBAR_STYLES);

  await scheduler.repaint();

  const container = scheduler.dateTableScrollableContainer;

  // The forced "overflow: scroll" only takes effect on the repainted work space, so the amount
  // the table can scroll is what says the layout is ready to be shot.
  await expect
    .poll(async () => container.evaluate((element) => element.scrollWidth - element.clientWidth))
    .toBeGreaterThan(0);

  await testScreenshot(page, 'T1306971__scheduler__horizontal-scrolling__before.png', { element: scheduler.element });

  const maxScrollLeft = await container.evaluate(
    (element) => element.scrollWidth - element.clientWidth,
  );

  await container.evaluate((element, left) => element.scrollTo({ left }), maxScrollLeft);

  const finalScrollLeft = await container.evaluate((element) => element.scrollLeft);

  expect(maxScrollLeft).toBeGreaterThan(0);
  expect(finalScrollLeft).toBeGreaterThan(0);

  // The header panel follows the work space on its own scrollable, so the shot is taken only
  // once both are at the same offset.
  await expect
    .poll(async () => (await scheduler.getHeaderSpaceScroll()).left)
    .toBe(finalScrollLeft);

  await testScreenshot(page, 'T1306971__scheduler__horizontal-scrolling__after.png', { element: scheduler.element });
});
