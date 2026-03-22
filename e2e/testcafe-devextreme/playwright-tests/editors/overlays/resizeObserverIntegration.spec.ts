import { test, expect } from '@playwright/test';
import { createWidget, setStyleAttribute } from '../../../playwright-helpers';
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

  test('Popup should be centered regarding the container even if content dimension is changed during animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');

    await popup.show();
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');
    await page.waitForTimeout(100);

    const wrapper = popup.getWrapper();
    const content = popup.getContent();

    const wrapperRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };
    const contentRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };

    await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
      wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
      contentRect[prop] = await content.getBoundingClientRectProperty(prop);
    });

    const wrapperVerticalCenter = (wrapperRect.bottom + wrapperRect.top) / 2;
    const wrapperHorizontalCenter = (wrapperRect.left + wrapperRect.right) / 2;
    const contentVerticalCenter = (contentRect.bottom + contentRect.top) / 2;
    const contentHorizontalCenter = (contentRect.left + contentRect.right) / 2;

    await page.expect(wrapperVerticalCenter)
      .within(contentVerticalCenter - 0.5, contentVerticalCenter + 0.5);

    await page.expect(wrapperHorizontalCenter)
      .within(contentHorizontalCenter - 0.5, contentHorizontalCenter + 0.5);

    });

  test('Popup should be centered regarding the container even if popup dimension option is changed during animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');

    await popup.show();
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');
    await page.waitForTimeout(100);

    const wrapper = popup.getWrapper();
    const content = popup.getContent();

    const wrapperRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };
    const contentRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };

    await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
      wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
      contentRect[prop] = await content.getBoundingClientRectProperty(prop);
    });

    const wrapperVerticalCenter = (wrapperRect.bottom + wrapperRect.top) / 2;
    const wrapperHorizontalCenter = (wrapperRect.left + wrapperRect.right) / 2;
    const contentVerticalCenter = (contentRect.bottom + contentRect.top) / 2;
    const contentHorizontalCenter = (contentRect.left + contentRect.right) / 2;

    await page.expect(wrapperVerticalCenter)
      .within(contentVerticalCenter - 0.5, contentVerticalCenter + 0.5);

    await page.expect(wrapperHorizontalCenter)
      .within(contentHorizontalCenter - 0.5, contentHorizontalCenter + 0.5);

    });

  test('Popup should be centered regarding the container even if content dimension is changed', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
    animation: null,
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');

    await popup.show();
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');
    await page.waitForTimeout(100);

    const wrapper = popup.getWrapper();
    const content = popup.getContent();

    const wrapperRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };
    const contentRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };

    await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
      wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
      contentRect[prop] = await content.getBoundingClientRectProperty(prop);
    });

    const wrapperVerticalCenter = (wrapperRect.bottom + wrapperRect.top) / 2;
    const wrapperHorizontalCenter = (wrapperRect.left + wrapperRect.right) / 2;
    const contentVerticalCenter = (contentRect.bottom + contentRect.top) / 2;
    const contentHorizontalCenter = (contentRect.left + contentRect.right) / 2;

    await page.expect(wrapperVerticalCenter)
      .within(contentVerticalCenter - 0.5, contentVerticalCenter + 0.5);

    await page.expect(wrapperHorizontalCenter)
      .within(contentHorizontalCenter - 0.5, contentHorizontalCenter + 0.5);

    });

  test('popup should be repositioned after window resize', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    animation: null,
    visible: true,
    width: 100,
    height: 100,
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');

    const wrapper = popup.getWrapper();
    const content = popup.getContent();

    const wrapperRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };
    const contentRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };

    await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
      wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
      contentRect[prop] = await content.getBoundingClientRectProperty(prop);
    });

    const wrapperVerticalCenter = (wrapperRect.bottom + wrapperRect.top) / 2;
    const wrapperHorizontalCenter = (wrapperRect.left + wrapperRect.right) / 2;
    const contentVerticalCenter = (contentRect.bottom + contentRect.top) / 2;
    const contentHorizontalCenter = (contentRect.left + contentRect.right) / 2;

    await page.expect(wrapperVerticalCenter)
      .within(contentVerticalCenter - 0.5, contentVerticalCenter + 0.5);

    await page.expect(wrapperHorizontalCenter)
      .within(contentHorizontalCenter - 0.5, contentHorizontalCenter + 0.5);

    });

  test('Popup dimensions should be correct after width or height animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    visible: true,
    animation: {
      show: {
        from: { width: '10px', height: '10px' },
        to: { width: '300px', height: '300px' },
      },
    },
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');
    const content = popup.getContent();

    await page.waitForTimeout(500);

    const contentRect: { width: number; height: number } = {
      width: 0, height: 0,
    };

    await asyncForEach(['width', 'height'], async (prop) => {
      contentRect[prop] = await content.getBoundingClientRectProperty(prop);
    });

    expect(contentRect.width).toBe(300);

    expect(contentRect.height).toBe(300);

    });

  test('Showing and shown events should be raised only once even after resize during animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');

    await page.evaluate(() => {
      (window as any).shownCallCount = 0;
      (window as any).showingCallCount = 0;
    });

    const incShown = async () => page.evaluate(() => { ((window as any).shownCallCount as number) += 1; });
    const incShowing = async () => page.evaluate(() => { ((window as any).showingCallCount as number) += 1; });

    const getShownCounter = async () => page.evaluate(() => (window as any).shownCallCount);
    const getShowingCounter = async () => page.evaluate(() => (window as any).shownCallCount);

    await popup.option({
      onShown: incShown,
      onShowing: incShowing,
    });

    await popup.show();

    await page.expect(await getShownCounter())
      .eql(1);
    await page.expect(await getShowingCounter())
      .eql(1);

    });
});
