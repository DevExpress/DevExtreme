import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../tests/container.html')}`;

test.describe('Accessibility - gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('accessibility check', async ({ page }) => {
    await createWidget(page, 'dxGallery', { height: 300, width: 300, dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }] });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery without nav buttons', async ({ page }) => {
    await createWidget(page, 'dxGallery', { height: 300, width: 300, dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }], showNavButtons: false, showIndicator: true });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery with nav buttons', async ({ page }) => {
    await createWidget(page, 'dxGallery', { height: 300, width: 300, dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }], showNavButtons: true, showIndicator: true });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery without indicator', async ({ page }) => {
    await createWidget(page, 'dxGallery', { height: 300, width: 300, dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }], showIndicator: false });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery with swipe disabled', async ({ page }) => {
    await createWidget(page, 'dxGallery', { height: 300, width: 300, dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }], swipeEnabled: false });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery with swipe enabled and nav buttons', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
      height: 300,
      width: 300,
      dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }, { imageAlt: 'Image 3', imageSrc: '' }],
      swipeEnabled: true,
      showNavButtons: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery without indicator and without nav buttons', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
      height: 300,
      width: 300,
      dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }],
      showIndicator: false,
      showNavButtons: false,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery with stretchImages', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
      height: 300,
      width: 300,
      dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }],
      stretchImages: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery with focusStateEnabled', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
      height: 300,
      width: 300,
      dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }],
      focusStateEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('gallery with second item selected', async ({ page }) => {
    await createWidget(page, 'dxGallery', {
      height: 300,
      width: 300,
      dataSource: [{ imageAlt: 'Image 1', imageSrc: '' }, { imageAlt: 'Image 2', imageSrc: '' }, { imageAlt: 'Image 3', imageSrc: '' }],
      selectedIndex: 1,
    });
    await a11yCheck(page, {}, '#container');
  });
});
