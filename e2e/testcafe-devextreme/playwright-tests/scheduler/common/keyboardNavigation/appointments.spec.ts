import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, insertStylesheetRulesToPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const SCHEDULER_SELECTOR = '#container';

const colors = [
  '#74d57b', '#1db2f5', '#f5564a', '#97c95c', '#ffc720', '#eb3573',
  '#a63db8', '#ffaa66', '#2dcdc4', '#c34cb9', '#3d44ec', '#4ddcca',
  '#2ec98d', '#ef9e44', '#45a5cc', '#a067bd', '#3d44ec', '#4ddcca',
  '#3ff6ca', '#f665aa', '#d1c974', '#ff6741', '#ee53dc', '#795ac3',
  '#ff7d8a', '#4cd482', '#9d67cc', '#5ab1ef', '#68e18f', '#4dd155',
];

const resources = colors.map((color, index) => ({ text: `Resource ${index + 1}`, id: index + 1, color }));
const resourceCount = 30;

const getPseudoRandomDuration = (durationState: number): number => {
  const durationMin = Math.floor((durationState % 23) / 3 + 5) * 15;
  return durationMin * 60 * 1000;
};

const generateAppointments = () => {
  const startDay = new Date(2021, 1, 1);
  const endDay = new Date(2021, 1, 6);
  let appointments: any[] = [];
  let durationState = 1;
  const durationIncrement = 19;

  resources.slice(0, resourceCount).forEach((resource) => {
    let startDate = startDay;
    while (startDate.getTime() < endDay.getTime()) {
      durationState += durationIncrement;
      const endDate = new Date(startDate.getTime() + getPseudoRandomDuration(durationState));
      appointments.push({ startDate, endDate, resourceId: resource.id });
      durationState += durationIncrement;
      startDate = new Date(endDate.getTime() + getPseudoRandomDuration(durationState));
    }
  });

  appointments = appointments.filter(({ startDate, endDate }) => (
    startDate.getDay() === endDate.getDay()
    && startDate.getHours() >= 7
    && endDate.getHours() <= 19));

  return appointments.map((a, i) => ({ ...a, text: `[Appointment ${i + 1}]` }));
};

const dataSource = generateAppointments();
const appointmentCount = dataSource.length;

const getConfig = () => ({
  views: [{ type: 'timelineWorkWeek', name: 'Timeline', groupOrientation: 'vertical' }, 'week'],
  dataSource,
  resources: [{ fieldExpr: 'resourceId', label: 'Resource', dataSource: resources }],
  groups: ['resourceId'],
  scrolling: { mode: 'virtual' },
  height: 600,
  cellDuration: 60,
  startDayHour: 8,
  endDayHour: 20,
  showAllDayPanel: false,
  currentView: 'Timeline',
  currentDate: new Date(2021, 1, 2),
});

const cellStyles = '#container .dx-scheduler-cell-sizes-vertical { height: 100px; } #container .dx-scheduler-cell-sizes-horizontal { width: 150px; }';

test.describe.skip('KeyboardNavigation.Appointments', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['virtual', 'standard'].forEach((scrollingMode) => {
    test(`focus next appointment on single tab (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' }).click();
      await page.keyboard.press('Tab');

      const isFocused = await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 2]' }).evaluate(
        (el) => el.classList.contains('dx-state-focused'),
      );
      expect(isFocused).toBe(true);
    });

    test(`focus next appointment on 5 tab (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' }).click();
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
      }

      const isFocused = await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 6]' }).evaluate(
        (el) => el.classList.contains('dx-state-focused'),
      );
      expect(isFocused).toBe(true);
    });

    test(`focus last appointment on End (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' }).click();
      await page.keyboard.press('End');

      const isFocused = await page.locator('.dx-scheduler-appointment').filter({ hasText: `[Appointment ${appointmentCount}]` }).evaluate(
        (el) => el.classList.contains('dx-state-focused'),
      );
      expect(isFocused).toBe(true);
    });

    test(`should focus appointment after close edit popup (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' }).click();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');

      const isFocused = await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 2]' }).evaluate(
        (el) => el.classList.contains('dx-state-focused'),
      );
      expect(isFocused).toBe(true);
    });

    test(`focus prev appointment on single shift+tab (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      const lastAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: `[Appointment ${appointmentCount}]` });
      await lastAppt.scrollIntoViewIfNeeded();
      await lastAppt.click();
      await page.keyboard.press('Shift+Tab');

      const prevAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: `[Appointment ${appointmentCount - 1}]` });
      const isFocused = await prevAppt.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`focus prev appointment on 5 shift+tab (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      const lastAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: `[Appointment ${appointmentCount}]` });
      await lastAppt.scrollIntoViewIfNeeded();
      await lastAppt.click();
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Shift+Tab');
      }

      const targetAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: `[Appointment ${appointmentCount - 5}]` });
      const isFocused = await targetAppt.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`focus first appointment on Home (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      const lastAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: `[Appointment ${appointmentCount}]` });
      await lastAppt.scrollIntoViewIfNeeded();
      await lastAppt.click();
      await page.keyboard.press('Home');

      const firstAppt = page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' });
      const isFocused = await firstAppt.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`focus first appointment in the next group by tab (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 14]' }).click();
      await page.keyboard.press('Tab');

      const appt15 = page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 15]' });
      const isFocused = await appt15.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`focus last appointment in the prev group by shift+tab (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 15]' }).click();
      await page.keyboard.press('Shift+Tab');

      const appt14 = page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 14]' });
      const isFocused = await appt14.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`first appointment should be focusable when navigating by tab second time (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' }).click();
      await page.keyboard.press('Tab');
      await page.locator('.dx-scheduler-view-switcher').click();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const appt1 = page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' });
      const isFocused = await appt1.evaluate((el) => el.classList.contains('dx-state-focused'));
      expect(isFocused).toBe(true);
    });

    test(`should not reset scroll after appointment focus and scrolling down (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' }).click();
      await page.keyboard.press('Tab');

      await page.evaluate(() => {
        const scrollable = ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable();
        scrollable.scrollTo({ y: 1000 });
      });
      await page.waitForTimeout(200);

      const scrollTop = await page.evaluate(() => {
        const scrollable = ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable();
        return scrollable.scrollTop();
      });
      expect(scrollTop).toBeGreaterThan(0);
    });

    test(`should focus next appointment on tab after any appointment was clicked (${scrollingMode} scrolling)`, async ({ page }) => {
      await insertStylesheetRulesToPage(page, cellStyles);
      await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: scrollingMode } });

      await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 15]' }).click();
      await page.keyboard.press('Tab');

      const isFocused = await page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 16]' }).evaluate(
        (el) => el.classList.contains('dx-state-focused'),
      );
      expect(isFocused).toBe(true);
    });
  });

  test('should focus first visible appointment on tab (virtual scrolling)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, cellStyles);
    await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: 'virtual' } });

    await page.evaluate(() => {
      const scrollable = ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable();
      scrollable.scrollTo({ y: 1000 });
    });
    await page.waitForTimeout(300);

    await page.locator('.dx-scheduler-view-switcher').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const firstVisible = page.locator('.dx-scheduler-appointment.dx-state-focused');
    await expect(firstVisible).toBeVisible();
  });

  test('should focus first rendered appointment on tab (standard scrolling)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, cellStyles);
    await createWidget(page, 'dxScheduler', { ...getConfig(), scrolling: { mode: 'standard' } });

    await page.evaluate(() => {
      const scrollable = ($('#container') as any).dxScheduler('instance').getWorkSpaceScrollable();
      scrollable.scrollTo({ y: 1000 });
    });
    await page.waitForTimeout(200);

    await page.locator('.dx-scheduler-view-switcher').click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const appt1 = page.locator('.dx-scheduler-appointment').filter({ hasText: '[Appointment 1]' });
    const isFocused = await appt1.evaluate((el) => el.classList.contains('dx-state-focused'));
    expect(isFocused).toBe(true);
  });
});
