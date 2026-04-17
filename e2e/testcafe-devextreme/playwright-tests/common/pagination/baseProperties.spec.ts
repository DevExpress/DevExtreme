import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Pagination Base Properties', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Pagination width and height property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      width: 270,
      height: '95px',
      itemCount: 50,
    });

    const pagination = page.locator('#container');
    const width = await pagination.evaluate((el) => getComputedStyle(el).width);
    const height = await pagination.evaluate((el) => getComputedStyle(el).height);
    expect(width).toBe('270px');
    expect(height).toBe('95px');
    expect(await pagination.getAttribute('width')).toBeNull();
    expect(await pagination.getAttribute('height')).toBeNull();
  });

  test('Pagination elementAttr property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      elementAttr: {
        'aria-label': 'some description',
        'data-test': 'custom data',
      },
    });

    const pagination = page.locator('#container');
    expect(await pagination.getAttribute('aria-label')).toBe('some description');
    expect(await pagination.getAttribute('data-test')).toBe('custom data');
  });

  test('Pagination hint and accessKey properties', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      hint: 'Best Pagination',
      accessKey: 'F',
      itemCount: 50,
      focusStateEnabled: true,
    });

    const pagination = page.locator('#container');
    expect(await pagination.getAttribute('accesskey')).toBe('F');
    expect(await pagination.getAttribute('title')).toBe('Best Pagination');
  });

  test('Pagination disabled property', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      disabled: true,
      itemCount: 50,
    });

    const pagination = page.locator('#container');
    expect(await pagination.getAttribute('aria-disabled')).toBe('true');
    expect(await pagination.evaluate((el) => el.classList.contains('dx-state-disabled'))).toBe(true);
  });

  test('Pagination tabindex and state properties', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      itemCount: 50,
      disabled: false,
      width: '100%',
      focusStateEnabled: true,
      hoverStateEnabled: true,
      activeStateEnabled: true,
      tabIndex: 7,
    });

    const pagination = page.locator('#container');
    expect(await pagination.getAttribute('tabindex')).toBe('7');

    await pagination.locator('.dx-page').filter({ hasText: '3' }).click();
    expect(await pagination.evaluate((el) => el.classList.contains('dx-state-focused'))).toBe(true);
  });

  test('Pagination focus method & accessKey propery without focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      focusStateEnabled: false,
      accessKey: 'F',
      itemCount: 50,
    });

    const pagination = page.locator('#container');
    expect(await pagination.getAttribute('accesskey')).toBeNull();

    await page.evaluate(() => {
      ($('#container') as any).dxPagination('instance').focus();
    });

    const pageSizeElement = pagination.locator('.dx-page-size').first();
    await expect(pageSizeElement).toBeFocused();
  });

  test('Pagination focus method with focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxPagination', {
      focusStateEnabled: true,
      itemCount: 50,
    });

    const pagination = page.locator('#container');
    await expect(pagination).not.toBeFocused();

    await page.evaluate(() => {
      ($('#container') as any).dxPagination('instance').focus();
    });

    await expect(pagination).toBeFocused();
  });
});
