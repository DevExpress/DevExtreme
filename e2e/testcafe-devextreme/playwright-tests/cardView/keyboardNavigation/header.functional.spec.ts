import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should navigate between items by arrows', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, A: 'A_0', B: 'B_0', C: 'C_0' }],
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    await headerItems.nth(0).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await expect(headerItems.nth(2)).toBeFocused();
  });

  test('Should focus item by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, A: 'A_0', B: 'B_0', C: 'C_0' }],
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    await headerItems.nth(1).click();

    await expect(headerItems.nth(1)).toBeFocused();
  });

  test('Should continue arrow navigation from last focused item', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, A: 'A_0', B: 'B_0', C: 'C_0' }],
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    await headerItems.nth(1).click();
    await page.keyboard.press('ArrowRight');

    await expect(headerItems.nth(2)).toBeFocused();
  });

  test('Should enable sorting by Enter', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'focusable-start';
      document.body.insertBefore(el, document.getElementById('container'));
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1 }, { id: 0 }, { id: 3 }, { id: 2 }],
      columns: ['id'],
      keyExpr: 'id',
      height: 700,
    });

    await page.locator('#focusable-start').focus();
    await page.keyboard.press('Tab');
    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await expect(headerItem).toBeFocused();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    const cardTexts = await page.locator('.dx-cardview-card').allInnerTexts();
    const idValues = cardTexts.map(t => t.trim()).filter(t => /^\d+$/.test(t));
    expect(idValues).toEqual(['0', '1', '2', '3']);
  });

  test('Should switch sorting by Enter', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'focusable-start';
      document.body.insertBefore(el, document.getElementById('container'));
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1 }, { id: 0 }, { id: 3 }, { id: 2 }],
      columns: ['id'],
      keyExpr: 'id',
      height: 700,
    });

    await page.locator('#focusable-start').focus();
    await page.keyboard.press('Tab');
    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await expect(headerItem).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    const cards = page.locator('.dx-cardview-card');
    const firstCardText = await cards.nth(0).textContent();
    const lastCardText = await cards.nth(3).textContent();
    expect(firstCardText).toContain('3');
    expect(lastCardText).toContain('0');
  });

  test('Should open header filter by alt+ArrowDown', async ({ page }) => {
    await page.evaluate(() => {
      const el = document.createElement('button');
      el.id = 'focusable-start';
      document.body.insertBefore(el, document.getElementById('container'));
    });

    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 1 }, { id: 0 }, { id: 3 }, { id: 2 }],
      columns: ['id'],
      keyExpr: 'id',
      height: 700,
    });

    await page.locator('#focusable-start').focus();
    await page.keyboard.press('Tab');
    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await expect(headerItem).toBeFocused();
    await page.keyboard.press('Alt+ArrowDown');

    const popup = page.locator('.dx-popup-wrapper.dx-header-filter-menu');
    await expect(popup).toBeVisible();
  });
});
