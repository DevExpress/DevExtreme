/* eslint-disable no-multi-str */
import { ClientFunction } from 'testcafe';
import Popup from 'devextreme-testcafe-models/popup';
import { isMaterialBased } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  getComputedPropertyValue,
  getDocumentScrollTop,
  insertStylesheetRulesToPage,
  removeAttribute,
} from '../../../helpers/domUtils';

const POPUP_CONTENT_CLASS = 'dx-popup-content';

fixture`Popup scrolling`
  .page(url(__dirname, '../../container.html'));

if (!isMaterialBased()) {
  [false, true].forEach((shading) => {
    [false, true].forEach((enableBodyScroll) => {
      [false, true].forEach((fullScreen) => {
        test(`Popup native scrolling, shading: ${shading}, enableBodyScroll: ${enableBodyScroll}, fullScreen: ${fullScreen}`, async (t) => {
          const popup = new Popup('#popup');

          const checkBodyStyles = async ({ paddingRight, overflow }) => {
            await t
              .expect(getComputedPropertyValue('body', 'padding-right'))
              .eql(paddingRight)
              .expect(getComputedPropertyValue('body', 'overflow'))
              .eql(overflow)
              .expect(getComputedPropertyValue('body', 'position'))
              .eql('static')
              .expect(getComputedPropertyValue('body', 'top'))
              .eql('auto')
              .expect(getComputedPropertyValue('body', 'left'))
              .eql('auto');
          };

          const checkPopupStyles = async ({ overflow, overScrollBehavior }) => {
            await t
              .expect(getComputedPropertyValue(`.${POPUP_CONTENT_CLASS}`, 'overflow'))
              .eql(overflow)
              .expect(getComputedPropertyValue(`.${POPUP_CONTENT_CLASS}`, 'overscroll-behavior'))
              .eql(overScrollBehavior);
          };

          await checkBodyStyles({ paddingRight: '0px', overflow: 'visible' });

          await insertStylesheetRulesToPage('body { padding-right: 10px; overflow: auto; }');

          await ClientFunction(() => {
            window.scrollTo(0, 300);
          })();

          await t
            .expect(getDocumentScrollTop())
            .eql(300);

          await checkBodyStyles({ paddingRight: '10px', overflow: 'auto' });
          await t
            .expect(getDocumentScrollTop())
            .eql(300);

          await popup.show();

          await checkPopupStyles({ overflow: 'auto', overScrollBehavior: 'contain' });
          await checkBodyStyles({ paddingRight: enableBodyScroll ? '10px' : '25px', overflow: enableBodyScroll ? 'auto' : 'hidden' });
          await t
            .expect(getDocumentScrollTop())
            .eql(300);

          await popup.hide();

          await checkBodyStyles({ paddingRight: '10px', overflow: 'auto' });
          await t
            .expect(getDocumentScrollTop())
            .eql(300);
        }).before(async () => {
          await appendElementTo('#container', 'div', 'scrollable-container', { height: '2000px', overflowY: 'auto' });
          await appendElementTo('#scrollable-container', 'div', 'scrollable-content', { height: '3000px' });

          await appendElementTo('#scrollable-content', 'div', 'inner-container', {
            width: '500px', height: '500px', border: '1px solid black', overflow: 'auto',
          });

          await ClientFunction(() => {
            const $content = $('<div>');

            for (let i = 0; i < 100; i += 1) {
              $content.append(`<div>${i}</div>`);
            }

            $('#scrollable-content').append($content);
          })();

          await appendElementTo('#inner-container', 'div', 'inner-content', { width: '2000px', height: '2000px' });
          await appendElementTo('#scrollable-container', 'div', 'popup', {});

          await createWidget('dxPopup', {
            width: 400,
            height: 400,
            shading,
            enableBodyScroll,
            fullScreen,
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
          }, '#popup');
        }).after(async () => {
          await removeAttribute('body', 'style');
        });
      });
    });
  });
}
