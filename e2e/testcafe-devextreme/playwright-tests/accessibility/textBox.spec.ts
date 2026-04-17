import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - textBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox disabled', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox readOnly', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', readOnly: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox mode password', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'secret', mode: 'password', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox mode search', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'query', mode: 'search', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with label', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', label: 'label', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with showClearButton', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', showClearButton: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox mode email', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'test@test.com', mode: 'email', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox mode tel', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: '+1-555-0100', mode: 'tel', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox mode url', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'https://example.com', mode: 'url', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with name', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', name: 'name', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with placeholder', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { placeholder: 'placeholder', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with spellcheck', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', spellcheck: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox disabled with placeholder', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { placeholder: 'placeholder', disabled: true, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with maxLength', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: 'value', maxLength: 50, inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox with custom button', async ({ page }) => {
    await createWidget(page, 'dxTextBox', {
      value: 'value',
      inputAttr: { 'aria-label': 'aria-label' },
      buttons: [{ name: 'custom', location: 'after', options: { icon: 'search', stylingMode: 'text' } }],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('textBox mode number', async ({ page }) => {
    await createWidget(page, 'dxTextBox', { value: '42', mode: 'number', inputAttr: { 'aria-label': 'aria-label' } });
    await a11yCheck(page, {}, '#container');
  });
});
