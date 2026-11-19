import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { waitForOverlayAnimations } from '../../../helpers/animation';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, getRect, setStyleAttribute,
} from '../../../helpers/domUtils';
import Popup from '../../../models/popup';

const getCenter = async (locator: Locator): Promise<{ vertical: number; horizontal: number }> => {
  const {
    top, right, bottom, left,
  } = await getRect(locator);

  return { vertical: (bottom + top) / 2, horizontal: (left + right) / 2 };
};

const createPopupInAnimatedContainer = async (page: Page): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'content');
  await setStyleAttribute(page, '#content', 'width: 100%; height: 100%;');
  await createWidget(page, 'dxPopup', {
    width: 600,
    height: 400,
    visible: true,
  }, undefined, { disableFxAnimation: false });

  await appendElementTo(page, '#container', 'div', 'innerContainer');
  await waitForOverlayAnimations(page);

  await createWidget(page, 'dxPopup', {
    position: { of: '#content' },
    container: '#content',
    visible: true,
    width: 100,
    height: 100,
  }, '#innerContainer', { disableFxAnimation: false });

  await waitForOverlayAnimations(page);
};

const expectWithin = async (
  getValue: () => Promise<number>,
  getExpected: () => Promise<number>,
): Promise<void> => {
  await expect.poll(async () => Math.abs(await getValue() - await getExpected()))
    .toBeLessThanOrEqual(0.5);
};

test.describe('Popup', () => {
  test('Popup should be centered regarding the container even if container is animated (T920408)', async ({ page }) => {
    await createPopupInAnimatedContainer(page);

    const wrapper = page.locator('#content .dx-overlay-wrapper');
    const content = wrapper.locator('.dx-overlay-content');

    await expectWithin(
      async () => (await getCenter(wrapper)).vertical,
      async () => (await getCenter(content)).vertical,
    );
    await expectWithin(
      async () => (await getCenter(wrapper)).horizontal,
      async () => (await getCenter(content)).horizontal,
    );
  });

  test('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async ({ page }) => {
    await createPopupInAnimatedContainer(page);

    const wrapper = page.locator('#content .dx-overlay-wrapper');
    const container = wrapper.locator('..');

    await expectWithin(
      async () => (await getRect(wrapper)).top,
      async () => (await getRect(container)).top,
    );
    await expectWithin(
      async () => (await getRect(wrapper)).left,
      async () => (await getRect(container)).left,
    );
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
      onShown(e) {
        e.component.option('position.boundary', window);
      },
    }), undefined, { disableFxAnimation: false });

    const popup = new Popup(page, '#container');
    const wrapper = popup.getWrapper();
    const content = popup.getContent();

    await expectWithin(
      async () => (await getCenter(wrapper)).vertical,
      async () => (await getCenter(content)).vertical,
    );
    await expectWithin(
      async () => (await getCenter(wrapper)).horizontal,
      async () => (await getCenter(content)).horizontal,
    );
  });
});
