import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, getRect } from '../../../helpers/domUtils';
import { dragToOffset } from '../../../helpers/dragUtils';
import Popup from '../../../models/popup';

test.describe('Popup', () => {
  test.describe(() => {
    test.use({ browserSize: [700, 700] });

    test('Popup can not be dragged outside of the container (window)', async ({ page }) => {
      await createWidget(page, 'dxPopup', () => ({
        width: 100,
        height: 100,
        visible: true,
        dragEnabled: true,
        animation: undefined,
      }));

      const popup = new Popup(page, '#container');
      const content = popup.getContent();
      const toolbar = popup.getToolbar();

      await dragToOffset(page, toolbar, -10000, -10000);

      await expect.poll(() => getRect(content)).toMatchObject({ top: 0, left: 0 });

      await dragToOffset(page, toolbar, 10000, 10000);

      await expect.poll(() => getRect(content)).toMatchObject({ bottom: 700, right: 700 });
    });
  });

  test('Popup can not be dragged if content bigger than container', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'popup');
    await appendElementTo(page, '#container', 'div', 'popupContainer', { width: '99px', height: '99px' });

    await createWidget(page, 'dxPopup', () => ({
      position: { of: '#popupContainer' },
      container: '#popupContainer',
      visible: true,
      width: 100,
      height: 100,
      animation: undefined,
    }), '#popup');

    const popup = new Popup(page, '#popup');
    const content = popup.getContent();
    const toolbar = popup.getToolbar();

    const { top, left } = await getRect(content);

    await dragToOffset(page, toolbar, 50, 50);

    await expect.poll(() => getRect(content)).toMatchObject({ top, left });
  });

  test('Popup can be dragged outside of the container if dragOutsideBoundary is enabled', async ({ page }) => {
    await createWidget(page, 'dxPopup', () => ({
      width: 100,
      height: 100,
      visible: true,
      dragEnabled: true,
      dragOutsideBoundary: true,
      animation: undefined,
    }));

    const popup = new Popup(page, '#container');
    const content = popup.getContent();
    const toolbar = popup.getToolbar();

    await dragToOffset(page, toolbar, -10000, -10000);

    await expect.poll(async () => (await getRect(content)).top).toBeLessThan(0);
    await expect.poll(async () => (await getRect(content)).left).toBeLessThan(0);
  });

  test.describe(() => {
    test.use({ browserSize: [700, 700] });

    // The page is not reused, so the swatch scope needs no cleanup afterwards.
    test('Popup inside a swatch can be dragged', async ({ page }) => {
      await page.evaluate(() => {
        const host = document.createElement('div');

        host.id = 'swatchHost';
        host.innerHTML = '<div id="swatchViewPort" class="dx-viewport" style="position: absolute; top: 0; left: 0; width: 600px; height: 600px">'
          + '<div><div class="dx-swatch-custom"><div id="swatchPopup"></div></div></div>'
          + '</div>';

        document.body.appendChild(host);

        (window as any).DevExpress.viewPort('#swatchViewPort');
      });

      await createWidget(page, 'dxPopup', () => ({
        width: 100,
        height: 100,
        visible: true,
        dragEnabled: true,
        animation: undefined,
        position: { of: '#swatchViewPort' },
        wrapperAttr: { class: 'swatch-popup' },
      }), '#swatchPopup');

      const popup = new Popup(page, '.swatch-popup');
      const { top, left } = await getRect(popup.content);

      await dragToOffset(page, popup.getToolbar(), 50, 50);

      await expect.poll(() => getRect(popup.content))
        .toMatchObject({ top: top + 50, left: left + 50 });
    });
  });
});
