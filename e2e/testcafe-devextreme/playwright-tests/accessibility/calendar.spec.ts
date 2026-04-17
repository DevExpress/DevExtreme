import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'month' });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with century zoom level', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'century' });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with decade zoom level', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'decade' });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar disabled', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'month', disabled: true });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar readOnly', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'month', readOnly: true });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with multiple selection mode', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = Date.now();
    await createWidget(page, 'dxCalendar', {
      zoomLevel: 'month',
      selectionMode: 'multiple',
      value: [now, now + msInDay],
      showWeekNumbers: true,
    });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with range selection mode and today button', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = Date.now();
    await createWidget(page, 'dxCalendar', {
      zoomLevel: 'month',
      selectionMode: 'range',
      value: [now, now + msInDay],
      showTodayButton: true,
    });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with year zoom level', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'year' });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with name', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'month', name: 'name' });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar disabled with century zoom level', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'century', disabled: true });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar range selection without today button', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = Date.now();
    await createWidget(page, 'dxCalendar', {
      zoomLevel: 'month',
      selectionMode: 'range',
      value: [now, now + msInDay],
      showTodayButton: false,
      showWeekNumbers: false,
    });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with first day of week set', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'month', firstDayOfWeek: 1 });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar with week numbers and year zoom level', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'year', showWeekNumbers: true });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });

  test('calendar readOnly with selected value', async ({ page }) => {
    await createWidget(page, 'dxCalendar', { zoomLevel: 'month', readOnly: true, value: Date.now() });
    await a11yCheck(page, { rules: { 'empty-table-header': { enabled: false } } }, '#container');
  });
});
