import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import Scheduler from '../../../../models/scheduler';
import { generateAppointmentsWithResources, resources } from '../../helpers/generateAppointmentsWithResources';

const SCHEDULER_SELECTOR = '#container';

const resourceCount = 30;

const dataSource = generateAppointmentsWithResources({
  startDay: new Date(2021, 1, 1),
  endDay: new Date(2021, 1, 6),
  startDayHour: 8,
  endDayHour: 20,
  resourceCount,
});

const appointmentCount = dataSource.length;

const getConfig = (): object => ({
  views: [
    {
      type: 'timelineWorkWeek',
      name: 'Timeline',
      groupOrientation: 'vertical',
    },
    'week',
  ],
  dataSource,
  resources: [
    { fieldExpr: 'resourceId', label: 'Resource', dataSource: resources },
  ],
  groups: ['resourceId'],
  scrolling: {
    mode: 'virtual',
  },
  height: 600,
  cellDuration: 60,
  startDayHour: 8,
  endDayHour: 20,
  showAllDayPanel: false,
  currentView: 'Timeline',
  currentDate: new Date(2021, 1, 2),
});

const cellStyles = '#container .dx-scheduler-cell-sizes-vertical { height: 100px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }';

const createScheduler = async (page: Page, scrollingMode: string): Promise<void> => {
  await insertStylesheetRulesToPage(page, cellStyles);
  await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });
};

const pressKeyTimes = async (page: Page, key: string, times: number): Promise<void> => {
  for (let index = 0; index < times; index += 1) {
    await page.keyboard.press(key);
  }
};

['virtual', 'standard'].forEach((scrollingMode) => {
  test(`focus next appointment on single tab (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 1]').element.click();
    await page.keyboard.press('Tab');

    expect(await scheduler.getAppointment('[Appointment 2]').isFocused()).toBe(true);
  });

  test(`focus next appointment on 5 tab (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 1]').element.click();
    await pressKeyTimes(page, 'Tab', 5);

    expect(await scheduler.getAppointment('[Appointment 6]').isFocused()).toBe(true);
  });

  test(`focus prev appointment on single shift+tab (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: resourceCount });

    await scheduler.getAppointment(`[Appointment ${appointmentCount}]`).element.click();
    await page.keyboard.press('Shift+Tab');

    expect(await scheduler.getAppointment(`[Appointment ${appointmentCount - 1}]`).isFocused())
      .toBe(true);
  });

  test(`focus prev appointment on 5 shift+tab (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: resourceCount });

    await scheduler.getAppointment(`[Appointment ${appointmentCount}]`).element.click();
    await pressKeyTimes(page, 'Shift+Tab', 5);

    expect(await scheduler.getAppointment(`[Appointment ${appointmentCount - 5}]`).isFocused())
      .toBe(true);
  });

  test(`focus last appointment on End (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 1]').element.click();
    await page.keyboard.press('End');

    expect(await scheduler.getAppointment(`[Appointment ${appointmentCount}]`).isFocused())
      .toBe(true);
  });

  test(`focus first appointment on Home (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: resourceCount });

    await scheduler.getAppointment(`[Appointment ${appointmentCount}]`).element.click();
    await page.keyboard.press('Home');

    expect(await scheduler.getAppointment('[Appointment 1]').isFocused()).toBe(true);
  });

  test(`focus first appointment in the next group by tab (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2021, 1, 5), { resourceId: 1 });

    await scheduler.getAppointment('[Appointment 14]').element.click();
    await page.keyboard.press('Tab');

    expect(await scheduler.getAppointment('[Appointment 15]').isFocused()).toBe(true);
  });

  test(`focus last appointment in the prev group by shift+tab (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 15]').element.click();
    await page.keyboard.press('Shift+Tab');

    expect(await scheduler.getAppointment('[Appointment 14]').isFocused()).toBe(true);
  });

  test(`should focus appointment after close edit popup (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 1]').element.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');

    expect(await scheduler.getAppointment('[Appointment 2]').isFocused()).toBe(true);
  });

  test(`first appointment should be focusable when navigating by tab second time (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 1]').element.click();
    await page.keyboard.press('Tab');
    await scheduler.toolbar.viewSwitcher.element.click();
    await page.keyboard.press('Tab');

    expect(await scheduler.getAppointment('[Appointment 1]').isFocused()).toBe(true);
  });

  test(`should not reset scroll after appointment focus and scrolling down (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 1]').element.click();
    await page.keyboard.press('Tab');
    await scheduler.scrollWorkSpaceTo({ left: 0, top: 1000 });

    await expect.poll(async () => (await scheduler.getWorkSpaceScroll()).top).toBe(1000);
  });

  test(`should focus next appointment on tab after any appointment was clicked (${scrollingMode} scrolling)`, async ({ page }) => {
    await createScheduler(page, scrollingMode);

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAppointment('[Appointment 15]').element.click();
    await page.keyboard.press('Tab');

    expect(await scheduler.getAppointment('[Appointment 16]').isFocused()).toBe(true);
  });
});

test('should focus first visible appointment on tab (virtual scrolling)', async ({ page }) => {
  await createScheduler(page, 'virtual');

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 1000 });
  await scheduler.toolbar.viewSwitcher.element.click();
  await page.keyboard.press('Tab');

  expect(await scheduler.getAppointment('[Appointment 135]').isFocused()).toBe(true);
});

test('should focus first rendered appointment on tab (standard scrolling)', async ({ page }) => {
  await createScheduler(page, 'standard');

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 1000 });
  await scheduler.toolbar.viewSwitcher.element.click();
  await page.keyboard.press('Tab');

  expect(await scheduler.getAppointment('[Appointment 1]').isFocused()).toBe(true);
});

const getDeleteFocusConfig = (): object => ({
  dataSource: [
    { text: 'Appointment 1', startDate: new Date(2021, 1, 2, 9), endDate: new Date(2021, 1, 2, 10) },
    { text: 'Appointment 2', startDate: new Date(2021, 1, 2, 10), endDate: new Date(2021, 1, 2, 11) },
    { text: 'Appointment 3', startDate: new Date(2021, 1, 2, 11), endDate: new Date(2021, 1, 2, 12) },
  ],
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 1, 2),
  startDayHour: 8,
  endDayHour: 20,
  height: 600,
});

test('should focus next appointment after deleting appointment by Delete key', async ({ page }) => {
  await createWidget(page, 'dxScheduler', getDeleteFocusConfig());

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.getAppointment('Appointment 2').element.click();
  await page.keyboard.press('Delete');

  await expect.poll(() => scheduler.getAppointmentCount()).toBe(2);
  expect(await scheduler.getAppointment('Appointment 3').isFocused()).toBe(true);
});

test('should focus previous appointment after deleting the last appointment by Delete key', async ({ page }) => {
  await createWidget(page, 'dxScheduler', getDeleteFocusConfig());

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.getAppointment('Appointment 3').element.click();
  await page.keyboard.press('Delete');

  await expect.poll(() => scheduler.getAppointmentCount()).toBe(2);
  expect(await scheduler.getAppointment('Appointment 2').isFocused()).toBe(true);
});

test('should focus toolbar element when no appointments remain after deleting by Delete key', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...getDeleteFocusConfig(),
    dataSource: [
      { text: 'Appointment 1', startDate: new Date(2021, 1, 2, 9), endDate: new Date(2021, 1, 2, 10) },
    ],
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.getAppointment('Appointment 1').element.click();
  await page.keyboard.press('Delete');

  await expect.poll(() => scheduler.getAppointmentCount()).toBe(0);
  await expect(scheduler.toolbar.element.locator(':focus')).toHaveCount(1);
});

test('should focus next occurrence after deleting recurring occurrence via dialog', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    ...getDeleteFocusConfig(),
    views: ['week'],
    currentView: 'week',
    dataSource: [{
      text: 'Recurring Appointment',
      startDate: new Date(2021, 1, 1, 9),
      endDate: new Date(2021, 1, 1, 10),
      recurrenceRule: 'FREQ=DAILY;COUNT=5',
    }],
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

  await scheduler.getAppointment('Recurring Appointment', 2).element.click();
  await page.keyboard.press('Delete');
  await page.locator('.dx-dialog-button').filter({ hasText: 'Delete appointment' }).click();

  await expect.poll(() => scheduler.getAppointmentCount()).toBe(4);
  expect(await scheduler.getAppointment('Recurring Appointment', 2).isFocused()).toBe(true);
});
