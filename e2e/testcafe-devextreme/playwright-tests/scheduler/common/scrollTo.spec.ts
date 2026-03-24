import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Scheduler: ScrollTo', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  async function scrollToDate(page) {
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      const currentDate = instance.option('currentDate');
      const date = new Date(currentDate.getTime());
      date.setHours(date.getHours() + 6, 30, 0, 0);
      instance.scrollTo(date);
    });
  }

  async function scrollToDateWithGroups(page) {
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      const currentDate = instance.option('currentDate');
      const date = new Date(currentDate.getTime());
      date.setHours(date.getHours() + 6, 30, 0, 0);
      instance.scrollTo(date, { priority: 1 });
    });
  }

  async function scrollToAllDay(page) {
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      const currentDate = instance.option('currentDate');
      const date = new Date(currentDate.getTime());
      date.setHours(date.getHours() + 6, 30, 0, 0);
      instance.scrollTo(date, undefined, true);
    });
  }

  async function getScrollTop(page): Promise<number> {
    return page.evaluate(() => {
      const scrollable = ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable();
      return scrollable.scrollTop();
    });
  }

  test('ScrollTo works correctly with week and day views', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week', 'day'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      height: 580,
    });

    const views = [{ name: 'week', initValue: 0 }, { name: 'day', initValue: 0 }];

    for (const view of views) {
      const { name, initValue } = view;

      await page.evaluate((v) => {
        const instance = ($('#container') as any).dxScheduler('instance');
        instance.option('currentView', v);
      }, name);
      await page.waitForTimeout(1000);

      await scrollToDate(page);
      await page.waitForTimeout(1000);

      const scrollTop = await getScrollTop(page);
      expect(scrollTop).toBeGreaterThan(initValue);
    }
  });

  test('ScrollTo works correctly with grouping in week view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      groups: ['priority'],
      resources: [{
        fieldExpr: 'priority',
        dataSource: [
          { id: 1, text: 'High Priority' },
          { id: 2, text: 'Low Priority' },
        ],
      }],
      height: 580,
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.option('currentView', 'week');
    });
    await page.waitForTimeout(1000);

    const initialTop = await getScrollTop(page);

    await scrollToDateWithGroups(page);
    await page.waitForTimeout(1000);

    const scrollTop = await getScrollTop(page);
    expect(scrollTop).toBeGreaterThan(initialTop);
  });

  test('ScrollTo works correctly with all-day panel', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      showAllDayPanel: true,
      height: 580,
    });

    const initValue = 0;
    const expectedTopValue = 0;

    const initialScrollTop = await getScrollTop(page);
    expect(initialScrollTop).toBe(initValue);

    await scrollToAllDay(page);
    await page.waitForTimeout(3000);

    const scrollTop = await getScrollTop(page);
    expect(scrollTop).toBe(expectedTopValue);
  });

  test('ScrollTo works correctly with RTL mode', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2019, 5, 1, 9, 40),
      firstDayOfWeek: 0,
      startDayHour: 0,
      endDayHour: 20,
      height: 580,
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.option('currentView', 'week');
      instance.option('rtlEnabled', true);
    });
    await page.waitForTimeout(1000);

    const initialBrowserTop = await getScrollTop(page);

    await scrollToDate(page);
    await page.waitForTimeout(1000);

    const browserTop = await getScrollTop(page);
    expect(browserTop).toBeGreaterThan(initialBrowserTop);
  });

  // TODO: needs Scheduler page object (scheduler.option, getWSLeft/getHeaderLeft helpers need proper conversion)
  test.skip('ScrollTo works correctly with timeline views (native, sync header/workspace) (T749957)', async ({ page }) => {
    // Complex test using scheduler.option and scroll synchronization checks
  });

  // TODO: needs Scheduler page object (scheduler.option)
  test.skip('ScrollTo works correctly in timeline RTL (native, sync header/workspace)', async ({ page }) => {
    // Complex test using scheduler.option and scroll synchronization checks
  });

  // TODO: needs Scheduler page object (scheduler.getCellDataAtViewportCenter)
  [
    { offset: 0, targetDate: new Date(2021, 1, 3, 4, 0), expectedDate: new Date(2021, 1, 3, 6, 0) },
    { offset: 0, targetDate: new Date(2021, 1, 3, 12, 0), expectedDate: new Date(2021, 1, 3, 12, 0) },
    { offset: 0, targetDate: new Date(2021, 1, 3, 20, 0), expectedDate: new Date(2021, 1, 3, 18, 0) },
    { offset: 720, targetDate: new Date(2021, 1, 3, 10, 0), expectedDate: new Date(2021, 1, 3, 6, 0) },
    { offset: 720, targetDate: new Date(2021, 1, 3, 20, 0), expectedDate: new Date(2021, 1, 3, 20, 0) },
    { offset: 720, targetDate: new Date(2021, 1, 4, 1, 0), expectedDate: new Date(2021, 1, 4, 1, 0) },
    { offset: 720, targetDate: new Date(2021, 1, 4, 7, 0), expectedDate: new Date(2021, 1, 4, 6, 0) },
    { offset: -720, targetDate: new Date(2021, 1, 3, 16, 0), expectedDate: new Date(2021, 1, 3, 18, 0) },
    { offset: -720, targetDate: new Date(2021, 1, 3, 21, 0), expectedDate: new Date(2021, 1, 3, 21, 0) },
    { offset: -720, targetDate: new Date(2021, 1, 4, 3, 0), expectedDate: new Date(2021, 1, 4, 3, 0) },
    { offset: -720, targetDate: new Date(2021, 1, 3, 7, 0), expectedDate: new Date(2021, 1, 3, 6, 0) },
  ].forEach(({ offset, targetDate, expectedDate }) => {
    test.skip(`scrollTo should scroll to date with offset=${offset}, targetDate=${targetDate.toString()} (T1310544)`, async ({ page }) => {
      // needs scheduler.getCellDataAtViewportCenter() page object
    });
  });
});
