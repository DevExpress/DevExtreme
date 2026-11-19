import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { dragToOffset } from '../../../helpers/dragUtils';
import Popup from '../../../models/popup';
import { getRect } from './utils';

test.describe('Popup', () => {
  test.describe(() => {
    test.use({ browserSize: [700, 700] });

    test('Popup can not be dragged outside of the container (window)', async ({ page }) => {
      await createWidget(page, 'dxPopup', {
        width: 100,
        height: 100,
        visible: true,
        dragEnabled: true,
        animation: undefined,
      });

      const popup = new Popup(page, '#container');
      const content = popup.getContent();
      const toolbar = popup.getToolbar();

      await dragToOffset(page, toolbar, -10000, -10000);

      await expect.poll(async () => (await getRect(content)).top).toBe(0);
      await expect.poll(async () => (await getRect(content)).left).toBe(0);

      await dragToOffset(page, toolbar, 10000, 10000);

      await expect.poll(async () => (await getRect(content)).bottom).toBe(700);
      await expect.poll(async () => (await getRect(content)).right).toBe(700);
    });
  });

  test('Popup can not be dragged if content bigger than container', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'popup');
    await appendElementTo(page, '#container', 'div', 'popupContainer', { width: '99px', height: '99px' });
    await createWidget(page, 'dxPopup', {
      position: { of: '#popupContainer' },
      container: '#popupContainer',
      visible: true,
      width: 100,
      height: 100,
      animation: undefined,
    }, '#popup');

    const popup = new Popup(page, '#popup');
    const content = popup.getContent();
    const { top, left } = await getRect(content);

    await dragToOffset(page, popup.getToolbar(), 50, 50);

    await expect.poll(async () => (await getRect(content)).top).toBe(top);
    await expect.poll(async () => (await getRect(content)).left).toBe(left);
  });

  test('Popup can be dragged outside of the container if dragOutsideBoundary is enabled', async ({ page }) => {
    await createWidget(page, 'dxPopup', {
      width: 100,
      height: 100,
      visible: true,
      dragEnabled: true,
      dragOutsideBoundary: true,
      animation: undefined,
    });

    const popup = new Popup(page, '#container');
    const content = popup.getContent();

    await dragToOffset(page, popup.getToolbar(), -10000, -10000);

    await expect.poll(async () => (await getRect(content)).top).toBeLessThan(0);
    await expect.poll(async () => (await getRect(content)).left).toBeLessThan(0);
  });
});
