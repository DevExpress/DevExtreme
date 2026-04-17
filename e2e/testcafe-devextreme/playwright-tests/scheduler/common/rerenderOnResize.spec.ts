import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const createScheduler = async (page, container: string, options?: Record<string, unknown>): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2020, 8, 7),
    startDayHour: 8,
    endDayHour: 20,
    cellDuration: 60,
    scrolling: {
      mode: 'virtual',
    },
    currentView: 'Timeline',
    views: [{
      type: 'timelineWorkWeek',
      name: 'Timeline',
      groupOrientation: 'vertical',
    }],
    dataSource: [{
      startDate: new Date(2020, 8, 7, 8),
      endDate: new Date(2020, 8, 7, 9),
      text: 'test',
    }],
    ...options,
  }, container);
};

test.describe('Re-render on resize', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Appointment should re-rendered on window resize-up (T1139566)', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 400 });

    await createScheduler(page, '#container', { currentView: 'workWeek' });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test' });
    await appointment.evaluate((el) => {
      (el as HTMLElement).style.backgroundColor = 'red';
    });

    const styleAttr = await appointment.evaluate((el) => (el as HTMLElement).style.cssText);
    expect(styleAttr).toMatch(/transform: translate\(0px, 0px\); width: \d+\.\d+px; height: \d+px; background-color: red;/);
  });

  test('Appointment should not re-rendered on window resize when width and height not set (T1139566)', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 300 });

    await createScheduler(page, '#container');

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test' });
    await appointment.evaluate((el) => {
      (el as HTMLElement).style.backgroundColor = 'red';
    });

    const styleAttr = await appointment.evaluate((el) => (el as HTMLElement).style.cssText);
    expect(styleAttr).toBe('transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
  });

  test('Appointment should not re-rendered on window resize when width and height have percent value (T1139566)', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 400 });

    await createScheduler(page, '#container', { width: '100%', height: '100%' });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test' });
    await appointment.evaluate((el) => {
      (el as HTMLElement).style.backgroundColor = 'red';
    });

    const styleAttr = await appointment.evaluate((el) => (el as HTMLElement).style.cssText);
    expect(styleAttr).toBe('transform: translate(0px, 30px); width: 200px; height: 70px; background-color: red;');
  });

  test('Appointment should not re-rendered on window resize when width and height have static value (T1139566)', async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 300 });

    await createScheduler(page, '#container', { width: 600, height: 400 });

    const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'test' });
    await appointment.evaluate((el) => {
      (el as HTMLElement).style.backgroundColor = 'red';
    });

    const styleAttr = await appointment.evaluate((el) => (el as HTMLElement).style.cssText);
    expect(styleAttr).toBe('transform: translate(0px, 30px); width: 200px; height: 61.7539px; background-color: red;');
  });
});
