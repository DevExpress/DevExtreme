import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - htmlEditor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', { value: '<p>Hello</p>', focusStateEnabled: true });
    await a11yCheck(page, {}, '#container');
  });

  test('readOnly mode', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      value: '<p>He<em>llo</em></p>',
      readOnly: true,
      focusStateEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with toolbar', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      value: '<p>He<em>llo</em></p>',
      focusStateEnabled: true,
      toolbar: { items: ['bold', 'color'] },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with name and placeholder', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      value: '<p>He<em>llo</em></p>',
      focusStateEnabled: true,
      name: 'name',
      placeholder: 'placeholder',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('with fixed height and width', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      value: '<p>He<em>llo</em></p>',
      focusStateEnabled: true,
      height: 300,
      width: 300,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('readOnly with toolbar', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      value: '<p>He<em>llo</em></p>',
      readOnly: true,
      focusStateEnabled: true,
      toolbar: { items: ['bold', 'color'] },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('empty value with placeholder', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      focusStateEnabled: true,
      placeholder: 'Type here...',
    });
    await a11yCheck(page, {}, '#container');
  });

  test('readOnly empty with placeholder', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      focusStateEnabled: true,
      readOnly: true,
      placeholder: 'placeholder',
    });
    await a11yCheck(page, {}, '#container');
  });
});
