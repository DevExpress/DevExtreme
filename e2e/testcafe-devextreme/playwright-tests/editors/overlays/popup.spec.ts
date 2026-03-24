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

  test.skip('Popup should be centered regarding the container even if container is animated (T920408)', async ({ page }) => {
    await page.waitForTimeout(500);

    const wrapper = page.locator('#content .dx-overlay-wrapper');
    const content = wrapper.find('.dx-overlay-content');

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

    });.before(async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'content', {});
    await setStyleAttribute(page, '#content', 'width: 100%; height: 100%;');
    await createWidget(page, 'dxPopup', {
      width: 600,
      height: 400,
      visible: true,
    }, undefined, { disableFxAnimation: false });

    await appendElementTo(page, '#container', 'div', 'innerContainer', {});
    await page.waitForTimeout(500);

    await createWidget(page, 'dxPopup', {
      position: { of: '#content' },
      container: '#content',
      visible: true,
      width: 100,
      height: 100,
    }, '#innerContainer', { disableFxAnimation: false });
  });

  test.skip('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async ({ page }) => {
    await page.waitForTimeout(500);

    const wrapper = page.locator('#content .dx-overlay-wrapper');
    const container = wrapper.parent();

    const wrapperRect: { top: number; left: number } = { top: 0, left: 0 };
    const containerRect: { top: number; left: number } = { top: 0, left: 0 };

    await asyncForEach(['left', 'top'], async (prop) => {
      wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
      containerRect[prop] = await container.getBoundingClientRectProperty(prop);
    });

    await page.expect(wrapperRect.top)
      .within(containerRect.top - 0.5, containerRect.top + 0.5);

    await page.expect(wrapperRect.left)
      .within(containerRect.left - 0.5, containerRect.left + 0.5);

    });.before(async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'content', {});
    await setStyleAttribute(page, '#content', 'width: 100%; height: 100%;');
    await createWidget(page, 'dxPopup', {
      width: 600,
      height: 400,
      visible: true,
    }, undefined, { disableFxAnimation: false });

    await appendElementTo(page, '#container', 'div', 'innerContainer', {});
    await page.waitForTimeout(500);

    await createWidget(page, 'dxPopup', {
      position: { of: '#content' },
      container: '#content',
      visible: true,
      width: 100,
      height: 100,
    }, '#innerContainer', { disableFxAnimation: false });
  });

  test.skip('There should not be any errors when position.of is html (T946851)', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    position: { of: 'html' },
    visible: true,
  });

    expect(true).toBeTruthy();

    });

  test.skip('Popup should be centered regarding the window after position.boundary is set to window', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 300,
    height: 200,
    visible: true,
    animation: undefined,
    position: {
      boundary: '#otherContainer',
    },
    onShown: ClientFunction((e) => {
      e.component.option('position.boundary', window);
    }),
  }, undefined, { disableFxAnimation: false });

    const popup = page.locator('#container');
    const initialRect: {
      bottom: number;
      top: number;
      left: number;
      right: number;
    } = {
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
    };
    const wrapperRect = initialRect;
    const contentRect = initialRect;

    await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
      wrapperRect[prop] = await popup
        .getWrapper()
        .getBoundingClientRectProperty(prop);
      contentRect[prop] = await popup.getContent()
        .getBoundingClientRectProperty(prop);
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
});
