/* eslint-disable no-multi-str */
import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  getDocumentScrollTop,
  insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';
import Popup from '../../../models/popup';

const POPUP_CONTENT_CLASS = 'dx-popup-content';

const checkBodyStyles = async (
  page: Page,
  { paddingRight, overflow }: { paddingRight: string; overflow: string },
): Promise<void> => {
  const body = page.locator('body');

  await expect(body).toHaveCSS('padding-right', paddingRight);
  await expect(body).toHaveCSS('overflow', overflow);
  await expect(body).toHaveCSS('position', 'static');
  await expect(body).toHaveCSS('top', 'auto');
  await expect(body).toHaveCSS('left', 'auto');
};

const checkPopupStyles = async (
  page: Page,
  { overflow, overScrollBehavior }: { overflow: string; overScrollBehavior: string },
): Promise<void> => {
  const content = page.locator(`.${POPUP_CONTENT_CLASS}`);

  await expect(content).toHaveCSS('overflow', overflow);
  await expect(content).toHaveCSS('overscroll-behavior', overScrollBehavior);
};

test.describe('Popup scrolling', () => {
  test.use({ theme: 'generic.light' });

  [false, true].forEach((shading) => {
    [false, true].forEach((enableBodyScroll) => {
      [false, true].forEach((fullScreen) => {
        test(`Popup native scrolling, shading: ${shading}, enableBodyScroll: ${enableBodyScroll}, fullScreen: ${fullScreen}`, async ({ page }) => {
          await appendElementTo(page, '#container', 'div', 'scrollable-container', { height: '2000px', overflowY: 'auto' });
          await appendElementTo(page, '#scrollable-container', 'div', 'scrollable-content', { height: '3000px' });
          await appendElementTo(page, '#scrollable-content', 'div', 'inner-container', {
            width: '500px', height: '500px', border: '1px solid black', overflow: 'auto',
          });

          await page.evaluate(() => {
            const $content = $('<div>');

            for (let i = 0; i < 100; i += 1) {
              $content.append(`<div>${i}</div>`);
            }

            $('#scrollable-content').append($content);
          });

          await appendElementTo(page, '#inner-container', 'div', 'inner-content', { width: '2000px', height: '2000px' });
          await appendElementTo(page, '#scrollable-container', 'div', 'popup');

          await createWidget(page, 'dxPopup', (options) => ({
            ...options,
            width: 400,
            height: 400,
            contentTemplate: ($content) => {
              const popupContent = '\
                <div class="caption">Description</div>\
                <div class="text" style="width: 450px">In the heart of LA\'s business district, the Downtown Inn has a welcoming staff and award winning restaurants that remain open 24 hours a day. Use our conference room facilities to conduct meetings and have a drink at our beautiful rooftop bar.</div> \
                <br>\
                <div class="hotel-features content">\
                <div class="feature">\
                  <div class="caption">Features</div>\
                  <div class="features">\
                    <div>Concierge</div>\
                    <div>Restaurant</div>\
                    <div>Valet Parking</div>\
                    <div>Fitness Center</div>\
                    <div>Sauna</div>\
                    <div>Airport Shuttle</div>\
                  </div>\
                </div>\
                <br>\
                <div class="room">\
                  <div class="caption">Rooms</div>\
                  <div class="features">\
                    <div>Climate control</div>\
                    <div>Air conditioning</div>\
                    <div>Coffee/tea maker</div>\
                    <div>Iron/ironing</div>\
                  </div>\
                </div>\
                <br>\
                </div>\
                <div class="text" style="width: 450px">In the heart of LA\'s business district, the Downtown Inn has a welcoming staff and award winning restaurants that remain open 24 hours a day. Use our conference room facilities to conduct meetings and have a drink at our beautiful rooftop bar.</div> \
                ';

              $content.html(popupContent);
            },
          }), '#popup', { arg: { shading, enableBodyScroll, fullScreen } });

          const popup = new Popup(page, '#popup');

          await checkBodyStyles(page, { paddingRight: '0px', overflow: 'visible' });

          await insertStylesheetRulesToPage(page, 'body { padding-right: 10px; overflow: auto; }');

          await page.evaluate(() => {
            window.scrollTo(0, 300);
          });

          await expect.poll(() => getDocumentScrollTop(page)).toBe(300);

          await checkBodyStyles(page, { paddingRight: '10px', overflow: 'auto' });
          await expect.poll(() => getDocumentScrollTop(page)).toBe(300);

          await popup.show();

          await checkPopupStyles(page, { overflow: 'auto', overScrollBehavior: 'contain' });
          await checkBodyStyles(page, { paddingRight: enableBodyScroll ? '10px' : '25px', overflow: enableBodyScroll ? 'auto' : 'hidden' });
          await expect.poll(() => getDocumentScrollTop(page)).toBe(300);

          await popup.hide();

          await checkBodyStyles(page, { paddingRight: '10px', overflow: 'auto' });
          await expect.poll(() => getDocumentScrollTop(page)).toBe(300);
        });
      });
    });
  });
});
