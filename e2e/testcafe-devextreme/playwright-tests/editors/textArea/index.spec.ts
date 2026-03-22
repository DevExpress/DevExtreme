import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TextArea_Height', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.';

  test('TextArea should have correct height when height is 7em & maxHeight is 5em', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'width: 300px; height: 400px;');

    const config = {
      maxHeight: '5em',
      height: '7em',
      width: '100%',
      value: text,
    };

    await appendElementTo(page, '#container', 'div', 'textArea1');
    await appendElementTo(page, '#container', 'div', 'textArea2');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: true,
    }, '#textArea1');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: false,
    }, '#textArea2');

    await testScreenshot(page, 'TextArea appearance, height=7em & maxHeight=5em.png', { element: '#container' });

    });

  test('TextArea should have correct height when height is 5em & maxHeight is 7em', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'width: 300px; height: 400px;');

    const config = {
      maxHeight: '7em',
      height: '5em',
      width: '100%',
      value: text,
    };

    await appendElementTo(page, '#container', 'div', 'textArea1');
    await appendElementTo(page, '#container', 'div', 'textArea2');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: true,
    }, '#textArea1');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: false,
    }, '#textArea2');

    await testScreenshot(page, 'TextArea appearance, height=5em & maxHeight=7em.png', { element: '#container' });

    });

  test('TextArea should have correct height when maxHeight is 5em', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'width: 300px; height: 400px;');

    const config = {
      maxHeight: '5em',
      width: '100%',
      value: text,
    };

    await appendElementTo(page, '#container', 'div', 'textArea1');
    await appendElementTo(page, '#container', 'div', 'textArea2');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: true,
    }, '#textArea1');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: false,
    }, '#textArea2');

    await testScreenshot(page, 'TextArea appearance, maxHeight=5em.png', { element: '#container' });

    });

  test('TextArea with font-size style has correct height when maxHeight option is 5em', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'width: 300px; height: 400px; font-size: 12px;');

    const config = {
      maxHeight: '5em',
      width: '100%',
      value: text,
    };

    await appendElementTo(page, '#container', 'div', 'textArea1');
    await appendElementTo(page, '#container', 'div', 'textArea2');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: true,
    }, '#textArea1');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: false,
    }, '#textArea2');

    await testScreenshot(page, 'TextArea appearance, maxHeight=5em, font-size=12px.png', { element: '#container' });

    });

  test('TextArea has correct height when maxHeight is not defined', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'width: 300px;');

    const config = {
      width: '100%',
      value: text,
      autoResizeEnabled: true,
    };

    await appendElementTo(page, '#container', 'div', 'textArea1');
    await appendElementTo(page, '#container', 'div', 'textArea2');

    await createWidget(page, 'dxTextArea', {
      ...config,
    }, '#textArea1');

    await createWidget(page, 'dxTextArea', {
      ...config,
      value: text + text,
    }, '#textArea2');

    await testScreenshot(page, 'TextArea appearance, maxHeight is not defined.png', { element: '#container' });

    });

  test('Height of TextArea input should have the correct height when the maxHeight option is set to 80px (T1221869)', async ({ page }) => {

    await setAttribute(page, '#container', 'style', 'width: 300px; height: 400px;');

    const config = {
      value: text,
      width: '100%',
      maxHeight: 80,
      autoResizeEnabled: true,
    };

    await appendElementTo(page, '#container', 'div', 'textArea1');
    await appendElementTo(page, '#container', 'div', 'textArea2');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: true,
    }, '#textArea1');

    await createWidget(page, 'dxTextArea', {
      ...config,
      autoResizeEnabled: false,
    }, '#textArea2');

    await testScreenshot(page, 'TextArea appearance, maxHeight=80px.png', { element: '#container' });

    });
});
