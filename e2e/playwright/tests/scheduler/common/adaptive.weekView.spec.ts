import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import Scheduler from '../../../models/scheduler';

const EPSILON = 1.5;

const createScheduler = async (
  page: Page,
  data: object[],
  width: string | number = '100%',
): Promise<void> => createWidget(page, 'dxScheduler', {
  dataSource: data,
  views: ['week'],
  currentView: 'week',
  adaptivityEnabled: true,
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  height: 600,
  width,
});

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

const boxOf = async (target: Locator): Promise<{
  top: number; left: number; bottom: number; width: number;
}> => {
  const box = await target.boundingBox();

  if (!box) {
    throw new Error('The element has no bounding box.');
  }

  return {
    top: box.y, left: box.x, bottom: box.y + box.height, width: box.width,
  };
};

const expectRoughly = (actual: number, expected: number): void => {
  expect(Math.abs(expected - actual)).toBeLessThanOrEqual(EPSILON);
};

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
  test.describe(() => {
    test.use({ browserSize: [windowWidth, 700] });

    test(`Mobile tooltip should be ${name} screen`, { tag: ['@generic.light'] }, async ({ page }) => {
      test.skip(!process.env.THEME?.startsWith('generic'), 'the layout under test is the generic one');

      await createScheduler(page, sampleData, '80%');

      const scheduler = new Scheduler(page, '#container');

      await scheduler.collectors.get(0).element.click();

      const box = await boxOf(scheduler.appointmentTooltip.mobileElement);

      expectRoughly(box.left, left);
      expectRoughly(box.bottom, bottom);
      expectRoughly(box.top, top);
      expectRoughly(box.width, width);
    });
  });
});

test.describe(() => {
  test.use({ browserSize: [350, 600] });

  test('Compact appointment should be center by vertical alignment', { tag: ['@generic.light'] }, async ({ page }) => {
    test.skip(!process.env.THEME?.startsWith('generic'), 'the layout under test is the generic one');

    await createScheduler(page, sampleDataNotRoundedMinutes);

    const scheduler = new Scheduler(page, '#container');

    expect(await scheduler.getAppointmentCount()).toBe(0);
    expect(await scheduler.collectors.count()).toBe(3);

    const [first, second, third] = await Promise.all([
      boxOf(scheduler.collectors.get(0).element),
      boxOf(scheduler.collectors.get(1).element),
      boxOf(scheduler.collectors.get(2).element),
    ]);

    expectRoughly(first.top, 150);
    expectRoughly(first.left, 101);
    expectRoughly(second.top, 150);
    expectRoughly(second.left, 139);
    expectRoughly(third.top, 450);
    expectRoughly(third.left, 177);
  });
});

test.describe(() => {
  test.use({ browserSize: [350, 600] });

  test('With a large browser width, should be visible common appointment instead of a compact', { tag: ['@generic.light'] }, async ({ page }) => {
    test.skip(!process.env.THEME?.startsWith('generic'), 'the layout under test is the generic one');

    await createScheduler(page, sampleData);

    const scheduler = new Scheduler(page, '#container');

    expect(await scheduler.getAppointmentCount()).toBe(0);
    expect(await scheduler.collectors.count()).toBe(2);

    const firstBefore = await boxOf(scheduler.collectors.find('1').element);
    const secondBefore = await boxOf(scheduler.collectors.find('2').element);

    expectRoughly(firstBefore.top, 138);
    expectRoughly(firstBefore.left, 101);
    expectRoughly(secondBefore.top, 250);
    expectRoughly(secondBefore.left, 101);

    await page.setViewportSize({ width: 700, height: 600 });

    expect(await scheduler.collectors.count()).toBe(2);
    expect(await scheduler.getAppointmentCount()).toBe(1);

    const firstAfter = await boxOf(scheduler.collectors.get(0).element);
    const secondAfter = await boxOf(scheduler.collectors.get(1).element);

    expectRoughly(firstAfter.top, 137.5);
    expectRoughly(firstAfter.left, 215);
    expectRoughly(secondAfter.top, 240);
    expectRoughly(secondAfter.left, 239.5);
  });
});
