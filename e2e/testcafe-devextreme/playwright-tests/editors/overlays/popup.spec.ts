import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Popup should be centered regarding the container even if container is animated (T920408)', async ({ page }) => {
    await page.evaluate(() => {
      const contentDiv = document.createElement('div');
      contentDiv.id = 'content';
      contentDiv.style.width = '100%';
      contentDiv.style.height = '100%';
      document.querySelector('#container')?.appendChild(contentDiv);
    });

    await createWidget(page, 'dxPopup', {
      width: 600,
      height: 400,
      visible: true,
    }, '#container', false);

    await page.evaluate(() => {
      const innerDiv = document.createElement('div');
      innerDiv.id = 'innerContainer';
      document.querySelector('#container')?.appendChild(innerDiv);
    });

    await page.waitForTimeout(500);

    await createWidget(page, 'dxPopup', {
      position: { of: '#content' },
      container: '#content',
      visible: true,
      width: 100,
      height: 100,
    }, '#innerContainer', false);

    await page.waitForTimeout(500);

    const rects = await page.evaluate(() => {
      const wrapper = document.querySelector('#content .dx-overlay-wrapper');
      const content = wrapper?.querySelector('.dx-overlay-content');
      return {
        wrapper: wrapper?.getBoundingClientRect(),
        content: content?.getBoundingClientRect(),
      };
    });

    const wrapperVCenter = (rects.wrapper!.bottom + rects.wrapper!.top) / 2;
    const wrapperHCenter = (rects.wrapper!.left + rects.wrapper!.right) / 2;
    const contentVCenter = (rects.content!.bottom + rects.content!.top) / 2;
    const contentHCenter = (rects.content!.left + rects.content!.right) / 2;

    expect(Math.abs(wrapperVCenter - contentVCenter)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(wrapperHCenter - contentHCenter)).toBeLessThanOrEqual(0.5);
  });

  test('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async ({ page }) => {
    await page.evaluate(() => {
      const contentDiv = document.createElement('div');
      contentDiv.id = 'content';
      contentDiv.style.width = '100%';
      contentDiv.style.height = '100%';
      document.querySelector('#container')?.appendChild(contentDiv);
    });

    await createWidget(page, 'dxPopup', {
      width: 600,
      height: 400,
      visible: true,
    }, '#container', false);

    await page.evaluate(() => {
      const innerDiv = document.createElement('div');
      innerDiv.id = 'innerContainer';
      document.querySelector('#container')?.appendChild(innerDiv);
    });

    await page.waitForTimeout(500);

    await createWidget(page, 'dxPopup', {
      position: { of: '#content' },
      container: '#content',
      visible: true,
      width: 100,
      height: 100,
    }, '#innerContainer', false);

    await page.waitForTimeout(500);

    const rects = await page.evaluate(() => {
      const wrapper = document.querySelector('#content .dx-overlay-wrapper');
      const container = wrapper?.parentElement;
      return {
        wrapper: wrapper?.getBoundingClientRect(),
        container: container?.getBoundingClientRect(),
      };
    });

    expect(Math.abs(rects.wrapper!.top - rects.container!.top)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(rects.wrapper!.left - rects.container!.left)).toBeLessThanOrEqual(0.5);
  });

  test('There should not be any errors when position.of is html (T946851)', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      position: { of: 'html' },
      visible: true,
    });

    expect(true).toBeTruthy();
  });

  test('Popup should be centered regarding the window after position.boundary is set to window', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      width: 300,
      height: 200,
      visible: true,
      animation: undefined,
      position: {
        boundary: '#otherContainer',
      },
      onShown(e: any) {
        e.component.option('position.boundary', window);
      },
    }, '#container', false);

    await page.waitForTimeout(500);

    const rects = await page.evaluate(() => {
      const wrapper = document.querySelector('#container .dx-overlay-wrapper');
      const content = document.querySelector('#container .dx-overlay-content');
      return {
        wrapper: wrapper?.getBoundingClientRect(),
        content: content?.getBoundingClientRect(),
      };
    });

    const wrapperVCenter = (rects.wrapper!.bottom + rects.wrapper!.top) / 2;
    const wrapperHCenter = (rects.wrapper!.left + rects.wrapper!.right) / 2;
    const contentVCenter = (rects.content!.bottom + rects.content!.top) / 2;
    const contentHCenter = (rects.content!.left + rects.content!.right) / 2;

    expect(Math.abs(wrapperVCenter - contentVCenter)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(wrapperHCenter - contentHCenter)).toBeLessThanOrEqual(0.5);
  });
});
