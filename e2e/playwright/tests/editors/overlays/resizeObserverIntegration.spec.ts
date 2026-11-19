import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { setStyleAttribute } from '../../../helpers/domUtils';
import Popup from '../../../models/popup';
import { expectCentered, getRect } from './utils';

const createAutoSizedPopup = (
  page: Page,
  extraOptions: Record<string, unknown> = {},
): Promise<void> => createWidget(
  page,
  'dxPopup',
  (options) => ({
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: '100px', height: '100px' }),
    ...options,
  }),
  undefined,
  { disableFxAnimation: false, arg: extraOptions },
);

test.describe('Popup', () => {
  test('Popup should be centered regarding the container even if content dimension is changed during animation', async ({ page }) => {
    await createAutoSizedPopup(page);

    const popup = new Popup(page, '#container');

    await popup.show();
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');

    await expectCentered(popup.getWrapper(), popup.getContent());
  });

  test('Popup should be centered regarding the container even if popup dimension option is changed during animation', async ({ page }) => {
    await createAutoSizedPopup(page);

    const popup = new Popup(page, '#container');

    await popup.show();
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');

    await expectCentered(popup.getWrapper(), popup.getContent());
  });

  test('Popup should be centered regarding the container even if content dimension is changed', async ({ page }) => {
    await createAutoSizedPopup(page, { animation: null });

    const popup = new Popup(page, '#container');

    await popup.show();
    await setStyleAttribute(page, '#content', 'width: 300px; height: 300px;');

    await expectCentered(popup.getWrapper(), popup.getContent());
  });

  test.describe(() => {
    test.use({ browserSize: [200, 200] });

    test('popup should be repositioned after window resize', async ({ page }) => {
      await createWidget(page, 'dxPopup', {
        animation: null,
        visible: true,
        width: 100,
        height: 100,
      }, undefined, { disableFxAnimation: false });

      const popup = new Popup(page, '#container');

      await expectCentered(popup.getWrapper(), popup.getContent());
    });
  });

  test('Popup dimensions should be correct after width or height animation', async ({ page }) => {
    await createWidget(page, 'dxPopup', () => ({
      visible: true,
      animation: {
        show: {
          from: { width: '10px', height: '10px' },
          to: { width: '300px', height: '300px' },
        },
      },
      onShown: () => {
        (window as any).popupShown = true;
      },
    }), undefined, { disableFxAnimation: false });

    const popup = new Popup(page, '#container');
    const content = popup.getContent();

    await page.waitForFunction(() => (window as any).popupShown === true);

    await expect.poll(async () => (await getRect(content)).width).toBe(300);
    await expect.poll(async () => (await getRect(content)).height).toBe(300);
  });

  test('Showing and shown events should be raised only once even after resize during animation', async ({ page }) => {
    await createAutoSizedPopup(page);

    const popup = new Popup(page, '#container');

    await page.evaluate(() => {
      (window as any).shownCallCount = 0;
      (window as any).showingCallCount = 0;
    });

    await popup.element.evaluate((element) => {
      ($(element) as any).dxPopup('instance').option({
        onShown: () => { (window as any).shownCallCount += 1; },
        onShowing: () => { (window as any).showingCallCount += 1; },
      });
    });

    await popup.show();

    await expect.poll(() => page.evaluate(() => (window as any).shownCallCount)).toBe(1);
    await expect.poll(() => page.evaluate(() => (window as any).showingCallCount)).toBe(1);
  });
});
