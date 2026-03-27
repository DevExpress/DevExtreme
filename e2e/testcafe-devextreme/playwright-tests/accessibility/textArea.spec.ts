import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - textArea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { value: 'Test text', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea disabled', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { value: 'Test text', disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea readOnly', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { value: 'Test text', readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea with label', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { value: 'Test text', label: 'label', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea with placeholder', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { placeholder: 'placeholder', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea with name', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { value: 'Test text', name: 'textAreaName', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea with spellcheck', async ({ page }) => {
    await createWidget(page, 'dxTextArea', { value: 'Test text', spellcheck: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textArea with long text', async ({ page }) => {
    const longText = 'Prepare 2013 Marketing Plan: We need to double revenues in 2013 and our marketing strategy is going to be key here.';
    await createWidget(page, 'dxTextArea', { value: longText, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
