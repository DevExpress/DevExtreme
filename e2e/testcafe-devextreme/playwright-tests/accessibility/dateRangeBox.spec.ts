import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe.skip('Accessibility - dateRangeBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', { endDateInputAttr: { 'aria-label': 'aria-label' }, startDateInputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox with value', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox disabled', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', { disabled: true, endDateInputAttr: { 'aria-label': 'aria-label' }, startDateInputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', { readOnly: true, endDateInputAttr: { 'aria-label': 'aria-label' }, startDateInputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox opened', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      opened: true,
      deferRendering: true,
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox with showClearButton', async ({ page }) => {
    await createWidget(page, 'dxDateRangeBox', { showClearButton: true, showDropDownButton: true, endDateInputAttr: { 'aria-label': 'aria-label' }, startDateInputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox opened without multiView', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      opened: true,
      multiView: false,
      deferRendering: true,
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox with startDatePlaceholder', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      startDatePlaceholder: 'Start date',
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox with custom button', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      buttons: [{ name: 'custom', location: 'before', options: { text: 'Custom', stylingMode: 'text' } }],
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox with label', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      label: 'Date Range',
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox readOnly with value', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      readOnly: true,
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('dateRangeBox disabled with value', async ({ page }) => {
    const msInDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    await createWidget(page, 'dxDateRangeBox', {
      value: [new Date(now.getTime() - msInDay * 3), new Date(now.getTime() + msInDay * 3)],
      disabled: true,
      endDateInputAttr: { 'aria-label': 'aria-label' },
      startDateInputAttr: { 'aria-label': 'aria-label' },
    });
    await a11yCheck(page, {}, '#container');
  });
});
