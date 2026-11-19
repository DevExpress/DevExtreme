import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const createScheduler = async (page: Page, data, width = '100%'): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: data,
    views: ['week'],
    currentView: 'week',
    adaptivityEnabled: true,
    currentDate: new Date(2017, 4, 25),
    startDayHour: 9,
    height: 600,
    width,
  });
};

const sampleData = [
  {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 22, 9, 30),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 22, 9, 40),
    endDate: new Date(2017, 4, 22, 11, 40),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2017, 4, 22, 12, 0),
    endDate: new Date(2017, 4, 22, 13, 0),
    allDay: true,
  },
];

const sampleDataNotRoundedMinutes = [
  {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 22, 9, 10),
    endDate: new Date(2017, 4, 22, 11, 30),
  }, {
    text: 'Website Re-Design Plan',
    startDate: new Date(2017, 4, 23, 9, 5),
    endDate: new Date(2017, 4, 23, 11, 40),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    startDate: new Date(2017, 4, 24, 12, 12),
    endDate: new Date(2017, 4, 24, 13, 30),
  },
];

const EPSILON = 1.5;

type RectProperty = 'left' | 'top' | 'bottom' | 'width';

const expectRoughEqual = async (
  locator: Locator,
  property: RectProperty,
  expected: number,
): Promise<void> => {
  await expect.poll(
    async () => Math.abs(
      await locator.evaluate((element, name) => element.getBoundingClientRect()[name], property)
      - expected,
    ),
    { message: `${property} should be about ${expected}` },
  ).toBeLessThanOrEqual(EPSILON);
};

test.describe('Week view in adaptive mode', () => {
  [{
    top: 623,
    bottom: 700,
    left: 0,
    width: 350,
    windowWidth: 350,
    name: 'snap to bottom in phone',
  }, {
    top: 312,
    bottom: 389,
    left: 80,
    width: 640,
    windowWidth: 800,
    name: 'align by center in tablet',
  }].forEach(({
    windowWidth, name, left, bottom, top, width,
  }) => {
    test.describe(`${windowWidth}x700`, () => {
      test.use({ theme: 'generic.light', browserSize: [windowWidth, 700] });

      test(`Mobile tooltip should be ${name} screen`, async ({ page }) => {
        await createScheduler(page, sampleData, '80%');

        const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

        await scheduler.collectors.get(0).click();

        const { mobileElement } = scheduler.appointmentTooltip;

        await expectRoughEqual(mobileElement, 'left', left);
        await expectRoughEqual(mobileElement, 'bottom', bottom);
        await expectRoughEqual(mobileElement, 'top', top);
        await expectRoughEqual(mobileElement, 'width', width);
      });
    });
  });

  test.describe('350x600', () => {
    test.use({ theme: 'generic.light', browserSize: [350, 600] });

    test('Compact appointment should be center by vertical alignment', async ({ page }) => {
      await createScheduler(page, sampleDataNotRoundedMinutes);

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      await expect(scheduler.appointments).toHaveCount(0);
      await expect(scheduler.collectors.all).toHaveCount(3);

      await expectRoughEqual(scheduler.collectors.get(0).element, 'top', 150);
      await expectRoughEqual(scheduler.collectors.get(0).element, 'left', 101);
      await expectRoughEqual(scheduler.collectors.get(1).element, 'top', 150);
      await expectRoughEqual(scheduler.collectors.get(1).element, 'left', 139);
      await expectRoughEqual(scheduler.collectors.get(2).element, 'top', 450);
      await expectRoughEqual(scheduler.collectors.get(2).element, 'left', 177);
    });

    test('With a large browser width, should be visible common appointment instead of a compact', async ({ page }) => {
      await createScheduler(page, sampleData);

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      await expect(scheduler.appointments).toHaveCount(0);
      await expect(scheduler.collectors.all).toHaveCount(2);

      await expectRoughEqual(scheduler.collectors.find('1').element, 'top', 138);
      await expectRoughEqual(scheduler.collectors.find('1').element, 'left', 101);
      await expectRoughEqual(scheduler.collectors.find('2').element, 'top', 250);
      await expectRoughEqual(scheduler.collectors.find('2').element, 'left', 101);

      await page.setViewportSize({ width: 700, height: 600 });

      await expect(scheduler.appointments).toHaveCount(1);
      await expect(scheduler.collectors.all).toHaveCount(2);

      await expectRoughEqual(scheduler.collectors.get(0).element, 'top', 137.5);
      await expectRoughEqual(scheduler.collectors.get(0).element, 'left', 215);
      await expectRoughEqual(scheduler.collectors.get(1).element, 'top', 240);
      await expectRoughEqual(scheduler.collectors.get(1).element, 'left', 239.5);
    });
  });
});
