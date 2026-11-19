import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import Popup from '../../../models/popup';
import { expectCentered, getRect } from './utils';

const waitForShownPopups = (page: Page, count: number): Promise<unknown> => page.waitForFunction(
  (expected) => (window as any).shownPopups === expected,
  count,
);

const createPopupInAnimatedContainer = async (page: Page): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'content');
  await setStyleAttribute(page, '#content', 'width: 100%; height: 100%;');
  await createWidget(page, 'dxPopup', () => ({
    width: 600,
    height: 400,
    visible: true,
    onShown: () => {
      (window as any).shownPopups = ((window as any).shownPopups ?? 0) + 1;
    },
  }), undefined, { disableFxAnimation: false });

  await appendElementTo(page, '#container', 'div', 'innerContainer');
  await waitForShownPopups(page, 1);

  await createWidget(page, 'dxPopup', () => ({
    position: { of: '#content' },
    container: '#content',
    visible: true,
    width: 100,
    height: 100,
    onShown: () => {
      (window as any).shownPopups = ((window as any).shownPopups ?? 0) + 1;
    },
  }), '#innerContainer', { disableFxAnimation: false });
};

test.describe('Popup', () => {
  test('Popup should be centered regarding the container even if container is animated (T920408)', async ({ page }) => {
    await createPopupInAnimatedContainer(page);
    await waitForShownPopups(page, 2);

    const wrapper = page.locator('#content .dx-overlay-wrapper');
    const content = wrapper.locator('.dx-overlay-content');

    await expectCentered(wrapper, content);
  });

  test('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async ({ page }) => {
    await createPopupInAnimatedContainer(page);
    await waitForShownPopups(page, 2);

    const wrapper = page.locator('#content .dx-overlay-wrapper');
    const container = wrapper.locator('..');

    const getCornerOffset = async (): Promise<{ top: number; left: number }> => {
      const wrapperRect = await getRect(wrapper);
      const containerRect = await getRect(container);

      return {
        top: Math.abs(wrapperRect.top - containerRect.top),
        left: Math.abs(wrapperRect.left - containerRect.left),
      };
    };

    await expect.poll(async () => (await getCornerOffset()).top).toBeLessThanOrEqual(0.5);
    await expect.poll(async () => (await getCornerOffset()).left).toBeLessThanOrEqual(0.5);
  });

  test('There should not be any errors when position.of is html (T946851)', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      position: { of: 'html' },
      visible: true,
    });
  });

  test('Popup should be centered regarding the window after position.boundary is set to window', async ({ page }) => {
    await createWidget(page, 'dxPopup', () => ({
      width: 300,
      height: 200,
      visible: true,
      animation: undefined,
      position: {
        boundary: '#otherContainer',
      },
      onShown: (e) => {
        e.component.option('position.boundary', window);
      },
    }), undefined, { disableFxAnimation: false });

    const popup = new Popup(page, '#container');

    await expectCentered(popup.getWrapper(), popup.getContent());
  });
});
