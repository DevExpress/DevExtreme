/* eslint-disable no-multi-str */
import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo, getComputedPropertyValue, getDocumentScrollTop, setStylePropertyValue,
} from '../../../helpers/domUtils';
import Popup from '../../../model/overlay/index';

fixture`Popup scrolling`
  .page(url(__dirname, '../../container.html'));

if (!isMaterial()) {
  [false, true].forEach((shading) => {
    [false, true].forEach((enableBodyScroll) => {
      test(`Overlay with native scrolling, shading: ${shading}, enableBodyScroll: ${enableBodyScroll}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const overlay = new Popup('#overlay');

        const body = Selector('body');

        await t
          .scroll(body, 300, 0);

        await t
          .expect(getComputedPropertyValue('body', 'padding-right'))
          .eql('0px')
          .expect(getComputedPropertyValue('body', 'overflow'))
          .eql('visible')
          .expect(getDocumentScrollTop())
          .eql(147);

        await setStylePropertyValue('body', 'padding-right', '10px');
        await setStylePropertyValue('body', 'overflow', 'auto');

        await t
          .expect(getComputedPropertyValue('body', 'padding-right'))
          .eql('10px')
          .expect(getComputedPropertyValue('body', 'overflow'))
          .eql('auto');

        await overlay.show();

        await t
          .expect(getComputedPropertyValue('body', 'padding-right'))
          .eql(enableBodyScroll ? '10px' : '25px')
          .expect(getComputedPropertyValue('body', 'overflow'))
          .eql(enableBodyScroll ? 'auto' : 'hidden')
          .expect(getDocumentScrollTop())
          .eql(147);

        await overlay.hide();

        await t
          .expect(getComputedPropertyValue('body', 'padding-right'))
          .eql('10px')
          .expect(getComputedPropertyValue('body', 'overflow'))
          .eql('auto')
          .expect(getDocumentScrollTop())
          .eql(147);

        await testScreenshot(t, takeScreenshot, `Overlay with native scrolling,shading=${shading},enableBodyScroll=${enableBodyScroll}.png`);

        await t
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
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
        await appendElementTo('#scrollable-container', 'div', 'overlay', {});

        await createWidget('dxOverlay', {
          width: 400,
          height: 400,
          shading,
          enableBodyScroll,
          contentTemplate: ($content) => {
            const overlayContent = '\
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
                <div>Climate control    </div>\
                <div>Air conditioning</div>\
                <div>Coffee/tea maker</div>\
                <div>Iron/ironing</div>\
              </div>\
            </div>\
            <br>\
            </div>\
            <div class="text" style="width: 450px">In the heart of LA\'s business district, the Downtown Inn has a welcoming staff and award winning restaurants that remain open 24 hours a day. Use our conference room facilities to conduct meetings and have a drink at our beautiful rooftop bar.</div> \
            ';

            $content.css('overflow', 'auto');

            $content.html(overlayContent);
          },
        }, '#overlay');
      });
    });
  });
}
