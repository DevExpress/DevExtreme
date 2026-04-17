import { test, expect } from '@playwright/test';
import { createWidget, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

async function getPopupRects(page: any) {
  return page.evaluate(() => {
    const wrappers = document.querySelectorAll('.dx-overlay-wrapper');
    const wrapper = wrappers[wrappers.length - 1];
    const content = document.querySelector('.dx-overlay-content');
    return {
      wrapper: wrapper ? {
        bottom: wrapper.getBoundingClientRect().bottom,
        top: wrapper.getBoundingClientRect().top,
        left: wrapper.getBoundingClientRect().left,
        right: wrapper.getBoundingClientRect().right,
      } : null,
      content: content ? {
        bottom: content.getBoundingClientRect().bottom,
        top: content.getBoundingClientRect().top,
        left: content.getBoundingClientRect().left,
        right: content.getBoundingClientRect().right,
        width: content.getBoundingClientRect().width,
        height: content.getBoundingClientRect().height,
      } : null,
    };
  });
}

async function showPopup(page: any) {
  await page.evaluate(() => {
    const instance = (window as any).DevExpress.ui.dxPopup.getInstance($('#container').get(0));
    if (instance) instance.show();
  });
}

test.describe('Popup', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 200, height: 200 });
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
  }, undefined, false);

    await showPopup(page);
    await page.waitForTimeout(400);
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');
    await page.waitForTimeout(400);

    const rects = await getPopupRects(page);

    const wrapperVerticalCenter = (rects.wrapper!.bottom + rects.wrapper!.top) / 2;
    const wrapperHorizontalCenter = (rects.wrapper!.left + rects.wrapper!.right) / 2;
    const contentVerticalCenter = (rects.content!.bottom + rects.content!.top) / 2;
    const contentHorizontalCenter = (rects.content!.left + rects.content!.right) / 2;

    expect(wrapperVerticalCenter).toBeGreaterThanOrEqual(contentVerticalCenter - 0.5);
    expect(wrapperVerticalCenter).toBeLessThanOrEqual(contentVerticalCenter + 0.5);

    expect(wrapperHorizontalCenter).toBeGreaterThanOrEqual(contentHorizontalCenter - 0.5);
    expect(wrapperHorizontalCenter).toBeLessThanOrEqual(contentHorizontalCenter + 0.5);

    });

  test('Popup should be centered regarding the container even if popup dimension option is changed during animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
  }, undefined, false);

    await showPopup(page);
    await page.waitForTimeout(400);
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');
    await page.waitForTimeout(400);

    const rects = await getPopupRects(page);

    const wrapperVerticalCenter = (rects.wrapper!.bottom + rects.wrapper!.top) / 2;
    const wrapperHorizontalCenter = (rects.wrapper!.left + rects.wrapper!.right) / 2;
    const contentVerticalCenter = (rects.content!.bottom + rects.content!.top) / 2;
    const contentHorizontalCenter = (rects.content!.left + rects.content!.right) / 2;

    expect(wrapperVerticalCenter).toBeGreaterThanOrEqual(contentVerticalCenter - 0.5);
    expect(wrapperVerticalCenter).toBeLessThanOrEqual(contentVerticalCenter + 0.5);

    expect(wrapperHorizontalCenter).toBeGreaterThanOrEqual(contentHorizontalCenter - 0.5);
    expect(wrapperHorizontalCenter).toBeLessThanOrEqual(contentHorizontalCenter + 0.5);

    });

  test('Popup should be centered regarding the container even if content dimension is changed', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
    animation: null,
  }, undefined, false);

    await showPopup(page);
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');
    await page.waitForTimeout(100);

    const rects = await getPopupRects(page);

    const wrapperVerticalCenter = (rects.wrapper!.bottom + rects.wrapper!.top) / 2;
    const wrapperHorizontalCenter = (rects.wrapper!.left + rects.wrapper!.right) / 2;
    const contentVerticalCenter = (rects.content!.bottom + rects.content!.top) / 2;
    const contentHorizontalCenter = (rects.content!.left + rects.content!.right) / 2;

    expect(wrapperVerticalCenter).toBeGreaterThanOrEqual(contentVerticalCenter - 0.5);
    expect(wrapperVerticalCenter).toBeLessThanOrEqual(contentVerticalCenter + 0.5);

    expect(wrapperHorizontalCenter).toBeGreaterThanOrEqual(contentHorizontalCenter - 0.5);
    expect(wrapperHorizontalCenter).toBeLessThanOrEqual(contentHorizontalCenter + 0.5);

    });

  test('popup should be repositioned after window resize', async ({ page }) => {
    await page.setViewportSize({ width: 200, height: 200 });
    await createWidget(page, 'dxPopup', {
    animation: null,
    visible: true,
    width: 100,
    height: 100,
  }, undefined, false);

    const rects = await getPopupRects(page);

    const wrapperVerticalCenter = (rects.wrapper!.bottom + rects.wrapper!.top) / 2;
    const wrapperHorizontalCenter = (rects.wrapper!.left + rects.wrapper!.right) / 2;
    const contentVerticalCenter = (rects.content!.bottom + rects.content!.top) / 2;
    const contentHorizontalCenter = (rects.content!.left + rects.content!.right) / 2;

    expect(wrapperVerticalCenter).toBeGreaterThanOrEqual(contentVerticalCenter - 0.5);
    expect(wrapperVerticalCenter).toBeLessThanOrEqual(contentVerticalCenter + 0.5);

    expect(wrapperHorizontalCenter).toBeGreaterThanOrEqual(contentHorizontalCenter - 0.5);
    expect(wrapperHorizontalCenter).toBeLessThanOrEqual(contentHorizontalCenter + 0.5);

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
  }, undefined, false);

    await page.waitForTimeout(500);

    const rects = await getPopupRects(page);

    expect(rects.content!.width).toBe(300);

    expect(rects.content!.height).toBe(300);

    });

  test('Showing and shown events should be raised only once even after resize during animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
  }, undefined, false);

    await page.evaluate(() => {
      (window as any).shownCallCount = 0;
      (window as any).showingCallCount = 0;
    });

    await page.evaluate(() => {
      const instance = (window as any).DevExpress.ui.dxPopup.getInstance($('#container').get(0));
      if (instance) {
        instance.option({
          onShown() { ((window as any).shownCallCount as number) += 1; },
          onShowing() { ((window as any).showingCallCount as number) += 1; },
        });
      }
    });

    await showPopup(page);
    await page.waitForTimeout(500);

    expect(await page.evaluate(() => (window as any).shownCallCount)).toBe(1);
    expect(await page.evaluate(() => (window as any).showingCallCount)).toBe(1);

    await page.evaluate(() => {
      delete (window as any).shownCallCount;
      delete (window as any).showingCallCount;
    });
    });
});
