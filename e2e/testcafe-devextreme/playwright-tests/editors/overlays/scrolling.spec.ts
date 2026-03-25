import { test, expect } from '@playwright/test';
import { createWidget, appendElementTo, insertStylesheetRulesToPage, isMaterialBased } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Popup scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const POPUP_CONTENT_CLASS = 'dx-popup-content';

  if (!isMaterialBased()) {
    [false, true].forEach((shading) => {
      [false, true].forEach((enableBodyScroll) => {
        [false, true].forEach((fullScreen) => {
          test(`Popup native scrolling, shading: ${shading}, enableBodyScroll: ${enableBodyScroll}, fullScreen: ${fullScreen}`, async ({ page }) => {
            await page.evaluate(() => {
              const scrollableContainer = document.createElement('div');
              scrollableContainer.id = 'scrollable-container';
              Object.assign(scrollableContainer.style, { height: '2000px', overflowY: 'auto' });
              document.querySelector('#container')?.appendChild(scrollableContainer);

              const scrollableContent = document.createElement('div');
              scrollableContent.id = 'scrollable-content';
              scrollableContent.style.height = '3000px';
              scrollableContainer.appendChild(scrollableContent);

              const innerContainer = document.createElement('div');
              innerContainer.id = 'inner-container';
              Object.assign(innerContainer.style, { width: '500px', height: '500px', border: '1px solid black', overflow: 'auto' });
              scrollableContent.appendChild(innerContainer);

              const $content = $('<div>');
              for (let i = 0; i < 100; i += 1) {
                $content.append(`<div>${i}</div>`);
              }
              $('#scrollable-content').append($content);

              const innerContent = document.createElement('div');
              innerContent.id = 'inner-content';
              Object.assign(innerContent.style, { width: '2000px', height: '2000px' });
              innerContainer.appendChild(innerContent);

              const popup = document.createElement('div');
              popup.id = 'popup';
              scrollableContainer.appendChild(popup);
            });

            await createWidget(page, 'dxPopup', {
              width: 400,
              height: 400,
              shading,
              enableBodyScroll,
              fullScreen,
              contentTemplate: ($content: any) => {
                const popupContent = '\
                  <div class="caption">Description</div>\
                  <div class="text" style="width: 450px">In the heart of LAs business district, the Downtown Inn has a welcoming staff and award winning restaurants that remain open 24 hours a day.</div> \
                  <br>\
                  <div class="hotel-features content">\
                  <div class="feature">\
                    <div class="caption">Features</div>\
                    <div class="features">\
                      <div>Concierge</div>\
                      <div>Restaurant</div>\
                      <div>Valet Parking</div>\
                    </div>\
                  </div>\
                  </div>\
                  ';
                $content.html(popupContent);
              },
            }, '#popup');

            const getComputedProp = (selector: string, prop: string) =>
              page.evaluate(({ sel, p }) => getComputedStyle(document.querySelector(sel)!).getPropertyValue(p), { sel: selector, p: prop });

            const checkBodyStyles = async (paddingRight: string, overflow: string) => {
              expect(await getComputedProp('body', 'padding-right')).toBe(paddingRight);
              expect(await getComputedProp('body', 'overflow')).toBe(overflow);
              expect(await getComputedProp('body', 'position')).toBe('static');
              expect(await getComputedProp('body', 'top')).toBe('auto');
              expect(await getComputedProp('body', 'left')).toBe('auto');
            };

            const checkPopupStyles = async (overflow: string, overScrollBehavior: string) => {
              expect(await getComputedProp(`.${POPUP_CONTENT_CLASS}`, 'overflow')).toBe(overflow);
              expect(await getComputedProp(`.${POPUP_CONTENT_CLASS}`, 'overscroll-behavior')).toBe(overScrollBehavior);
            };

            await checkBodyStyles('0px', 'visible');

            await insertStylesheetRulesToPage(page, 'body { padding-right: 10px; overflow: auto; }');

            await page.evaluate(() => { window.scrollTo(0, 300); });

            expect(await page.evaluate(() => document.documentElement.scrollTop || document.body.scrollTop)).toBe(300);

            await checkBodyStyles('10px', 'auto');
            expect(await page.evaluate(() => document.documentElement.scrollTop || document.body.scrollTop)).toBe(300);

            await page.evaluate(() => {
              ($('#popup') as any).dxPopup('instance').show();
            });

            await checkPopupStyles('auto', 'contain');
            await checkBodyStyles(enableBodyScroll ? '10px' : '25px', enableBodyScroll ? 'auto' : 'hidden');
            expect(await page.evaluate(() => document.documentElement.scrollTop || document.body.scrollTop)).toBe(300);

            await page.evaluate(() => {
              ($('#popup') as any).dxPopup('instance').hide();
            });

            await checkBodyStyles('10px', 'auto');
            expect(await page.evaluate(() => document.documentElement.scrollTop || document.body.scrollTop)).toBe(300);
          });
        });
      });
    });
  }
});
