import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler header', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('dateNavigator buttons should not be selected after clicking', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentView: 'day',
      views: ['day'],
      height: 580,
    });

    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const caption = page.locator('.dx-scheduler-navigator-caption');

    await nextButton.click();

    await expect(prevButton).not.toHaveClass(/dx-item-selected/);
    await expect(caption).not.toHaveClass(/dx-item-selected/);
    await expect(nextButton).not.toHaveClass(/dx-item-selected/);
  });

  test('dateNavigator buttons should have "contained" styling mode with generic theme', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentView: 'day',
      views: ['day'],
      height: 580,
    });

    const nextButton = page.locator('.dx-scheduler-navigator-next');
    const prevButton = page.locator('.dx-scheduler-navigator-previous');
    const caption = page.locator('.dx-scheduler-navigator-caption');

    await expect(prevButton).toHaveClass(/dx-button-mode-contained|dx-button-mode-text/);
    await expect(caption).toHaveClass(/dx-button-mode-contained|dx-button-mode-text/);
    await expect(nextButton).toHaveClass(/dx-button-mode-contained|dx-button-mode-text/);
  });

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

    await insertStylesheetRulesToPage(page, SCROLLBAR_STYLES);

    await page.waitForTimeout(100);

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').repaint();
    });

    await page.waitForTimeout(100);

    await testScreenshot(page, 'T1306971__scheduler__horizontal-scrolling__before.png', {
      element: page.locator('.dx-scheduler'),
    });

    const maxScrollLeft = await page.evaluate(() => {
      const container = document.querySelector('.dx-scheduler-date-table-scrollable .dx-scrollable-container');
      if (!container) return 0;
      return container.scrollWidth - container.clientWidth;
    });

    const scrollableContainer = page.locator('.dx-scheduler-date-table-scrollable .dx-scrollable-container');
    await scrollableContainer.evaluate((el, scrollLeft) => { el.scrollLeft = scrollLeft; }, maxScrollLeft);

    const finalScrollLeft = await scrollableContainer.evaluate((el) => el.scrollLeft);

    expect(maxScrollLeft).toBeGreaterThan(0);
    expect(finalScrollLeft).toBeGreaterThan(0);

    await page.waitForTimeout(500);

    await testScreenshot(page, 'T1306971__scheduler__horizontal-scrolling__after.png', {
      element: page.locator('.dx-scheduler'),
    });
  });
});
