/* eslint-disable max-len */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Scrollable from '../../../model/scrollView/internal/scrollable';
import { appendElementTo } from '../helpers/domUtils';
import { ScrollableDirection } from '../../../../../js/renovation/ui/scroll_view/types.d';

fixture`Scrollable_ScrollToElement`
  .page(url(__dirname, '../../container.html'));

(['both'] as ScrollableDirection[]).forEach((direction) => {
  [true, false].forEach((useNative) => {
    [true, false].forEach((rtlEnabled) => {
      [
        { initialScrollOffset: { top: 80, left: 80 }, position: 'elementInsideContainer' },
        { initialScrollOffset: { top: 0, left: 0 }, position: 'scrollFromTopLeftCorner' },
        { initialScrollOffset: { top: 0, left: 80 }, position: 'scrollFromTop' },
        { initialScrollOffset: { top: 0, left: 160 }, position: 'scrollFromTopRightCorner' },
        { initialScrollOffset: { top: 80, left: 160 }, position: 'scrollFromRight' },
        { initialScrollOffset: { top: 160, left: 160 }, position: 'scrollFromBottomRightCorner' },
        { initialScrollOffset: { top: 160, left: 80 }, position: 'scrollFromBottom' },
        { initialScrollOffset: { top: 160, left: 0 }, position: 'scrollFromBottomLeftCorner' },
        { initialScrollOffset: { top: 80, left: 0 }, position: 'scrollFromLeft' },
        // part
        { initialScrollOffset: { top: 125, left: 125 }, position: 'part-scrollFromTopLeftCorner' },
        { initialScrollOffset: { top: 125, left: 80 }, position: 'part-scrollFromTop' },
        { initialScrollOffset: { top: 125, left: 45 }, position: 'part-scrollFromTopRightCorner' },
        { initialScrollOffset: { top: 80, left: 45 }, position: 'part-scrollFromRight' },
        { initialScrollOffset: { top: 45, left: 45 }, position: 'part-scrollFromBottomRightCorner' },
        { initialScrollOffset: { top: 45, left: 80 }, position: 'part-scrollFromBottom' },
        { initialScrollOffset: { top: 45, left: 125 }, position: 'part-scrollFromBottomLeftCorner' },
        { initialScrollOffset: { top: 80, left: 125 }, position: 'part-scrollFromLeft' },
      ].forEach(({ initialScrollOffset, position }) => {
        test(`scrollToElement(element, offset), useNative: '${useNative}', direction: '${direction}', `, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const scrollable = new Scrollable('#container', { useNative, direction });
          const { getInstance } = scrollable;

          // const positions = [
          //   { initialScrollOffset: { top: 80, left: 80 }, position: 'elementInsideContainer' },
          //   { initialScrollOffset: { top: 0, left: 0 }, position: 'scrollFromTopLeftCorner' },
          //   { initialScrollOffset: { top: 0, left: 80 }, position: 'scrollFromTop' },
          //   { initialScrollOffset: { top: 0, left: 160 }, position: 'scrollFromTopRightCorner' },
          //   { initialScrollOffset: { top: 80, left: 160 }, position: 'scrollFromRight' },
          //   { initialScrollOffset: { top: 160, left: 160 }, position: 'scrollFromBottomRightCorner' },
          //   { initialScrollOffset: { top: 160, left: 80 }, position: 'scrollFromBottom' },
          //   { initialScrollOffset: { top: 160, left: 0 }, position: 'scrollFromBottomLeftCorner' },
          //   { initialScrollOffset: { top: 80, left: 0 }, position: 'scrollFromLeft' },
          //   // part
          //   { initialScrollOffset: { top: 125, left: 125 }, position: 'part-scrollFromTopLeftCorner' },
          //   { initialScrollOffset: { top: 125, left: 80 }, position: 'part-scrollFromTop' },
          //   { initialScrollOffset: { top: 125, left: 45 }, position: 'part-scrollFromTopRightCorner' },
          //   { initialScrollOffset: { top: 80, left: 45 }, position: 'part-scrollFromRight' },
          //   { initialScrollOffset: { top: 45, left: 45 }, position: 'part-scrollFromBottomRightCorner' },
          //   { initialScrollOffset: { top: 45, left: 80 }, position: 'part-scrollFromBottom' },
          //   { initialScrollOffset: { top: 45, left: 125 }, position: 'part-scrollFromBottomLeftCorner' },
          //   { initialScrollOffset: { top: 80, left: 125 }, position: 'part-scrollFromLeft' },
          // ];

          // eslint-disable-next-line no-restricted-syntax
          // for (const rtlEnabled of [true, false]) {
          // eslint-disable-next-line no-restricted-syntax
          // for (const { initialScrollOffset, position } of positions) {
          await ClientFunction(
            () => {
              (getInstance() as any).option('rtlEnabled', rtlEnabled);
              (getInstance() as any).scrollTo(initialScrollOffset);
            },
            { dependencies: { getInstance, initialScrollOffset, rtlEnabled } },
          )();

          await ClientFunction(
            () => { (getInstance() as any).scrollToElement($('#element').get(0)); },
            { dependencies: { getInstance } },
          )();

          await t
            .expect(await takeScreenshot(`scrollToElement-useNative=${useNative}-direction=${direction}-rtl=${rtlEnabled}-${position}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
          // }
        // }
        }).before(async () => {
          await ClientFunction(() => {
            $('#container').css({
              border: '1px solid black',
            });
          })();

          await appendElementTo('#container', 'div', 'scrollableContent', {
            width: '250px',
            height: '250px',
            border: '1px solid #0b837a',
            backgroundColor: 'lightskyblue',
          });

          await appendElementTo('#scrollableContent', 'div', 'element', {
            position: 'absolute',
            boxSizing: 'border-box',
            left: '100px',
            top: '100px',
            height: '50px',
            width: '50px',
            backgroundColor: '#2bb97f',
            border: '5px solid red',
            margin: '5px',
          });

          return createWidget('dxScrollable', {
            width: 100,
            height: 100,
            useNative,
            direction,
            showScrollbar: 'always',
          });
        });
      });

      [
        { initialScrollOffset: { top: 0, left: 0 }, position: 'scrollFromTopLeftCorner' },
        { initialScrollOffset: { top: 0, left: 40 }, position: 'scrollFromTopLeftPart' },
        { initialScrollOffset: { top: 0, left: 120 }, position: 'scrollFromTopRightPart' },
        { initialScrollOffset: { top: 0, left: 160 }, position: 'scrollFromTopRightCorner' },

        { initialScrollOffset: { top: 40, left: 160 }, position: 'scrollFromRightTopPart' },
        { initialScrollOffset: { top: 120, left: 160 }, position: 'scrollFromRightBottomPart' },

        { initialScrollOffset: { top: 160, left: 160 }, position: 'scrollFromBottomRightCorner' },
        { initialScrollOffset: { top: 160, left: 120 }, position: 'scrollFromBottomRightPart' },
        { initialScrollOffset: { top: 160, left: 40 }, position: 'scrollFromBottomLeftPart' },
        { initialScrollOffset: { top: 160, left: 0 }, position: 'scrollFromBottomLeftCorner' },

        { initialScrollOffset: { top: 120, left: 0 }, position: 'scrollFromLeftBottomPart' },
        { initialScrollOffset: { top: 40, left: 0 }, position: 'scrollFromLeftTopPart' },

        // from inside

        { initialScrollOffset: { top: 40, left: 60 }, position: 'scrollFromInsideTopLeft' },
        { initialScrollOffset: { top: 40, left: 100 }, position: 'scrollFromInsideTopRight' },
        { initialScrollOffset: { top: 60, left: 120 }, position: 'scrollFromInsideRightTop' },
        { initialScrollOffset: { top: 100, left: 120 }, position: 'scrollFromInsideRightBottom' },
        { initialScrollOffset: { top: 120, left: 100 }, position: 'scrollFromInsideBottomRight' },
        { initialScrollOffset: { top: 120, left: 60 }, position: 'scrollFromInsideBottomLeft' },
        { initialScrollOffset: { top: 100, left: 40 }, position: 'scrollFromInsideLeftBottom' },
        { initialScrollOffset: { top: 60, left: 40 }, position: 'scrollFromInsideLeftTop' },
      ].forEach(({ initialScrollOffset, position }) => {
        test(`scrollToElement(element, offset), element more than container, useNative: '${useNative}', direction: '${direction}', `, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          const scrollable = new Scrollable('#container', { useNative, direction });
          const { getInstance } = scrollable;

          // const positions = [
          //   { initialScrollOffset: { top: 0, left: 0 }, position: 'scrollFromTopLeftCorner' },
          //   { initialScrollOffset: { top: 0, left: 40 }, position: 'scrollFromTopLeftPart' },
          //   { initialScrollOffset: { top: 0, left: 120 }, position: 'scrollFromTopRightPart' },
          //   { initialScrollOffset: { top: 0, left: 160 }, position: 'scrollFromTopRightCorner' },

          //   { initialScrollOffset: { top: 40, left: 160 }, position: 'scrollFromRightTopPart' },
          //   { initialScrollOffset: { top: 120, left: 160 }, position: 'scrollFromRightBottomPart' },

          //   { initialScrollOffset: { top: 160, left: 160 }, position: 'scrollFromBottomRightCorner' },
          //   { initialScrollOffset: { top: 160, left: 120 }, position: 'scrollFromBottomRightPart' },
          //   { initialScrollOffset: { top: 160, left: 40 }, position: 'scrollFromBottomLeftPart' },
          //   { initialScrollOffset: { top: 160, left: 0 }, position: 'scrollFromBottomLeftCorner' },

          //   { initialScrollOffset: { top: 120, left: 0 }, position: 'scrollFromLeftBottomPart' },
          //   { initialScrollOffset: { top: 40, left: 0 }, position: 'scrollFromLeftTopPart' },

          //   // from inside

          //   { initialScrollOffset: { top: 40, left: 60 }, position: 'scrollFromInsideTopLeft' },
          //   { initialScrollOffset: { top: 40, left: 100 }, position: 'scrollFromInsideTopRight' },
          //   { initialScrollOffset: { top: 60, left: 120 }, position: 'scrollFromInsideRightTop' },
          //   { initialScrollOffset: { top: 100, left: 120 }, position: 'scrollFromInsideRightBottom' },
          //   { initialScrollOffset: { top: 120, left: 100 }, position: 'scrollFromInsideBottomRight' },
          //   { initialScrollOffset: { top: 120, left: 60 }, position: 'scrollFromInsideBottomLeft' },
          //   { initialScrollOffset: { top: 100, left: 40 }, position: 'scrollFromInsideLeftBottom' },
          //   { initialScrollOffset: { top: 60, left: 40 }, position: 'scrollFromInsideLeftTop' },
          // ];

          // eslint-disable-next-line no-restricted-syntax
          //    for (const rtlEnabled of [true, false]) {
          // eslint-disable-next-line no-restricted-syntax
          // for (const { initialScrollOffset, position } of positions) {
          await ClientFunction(
            () => {
              (getInstance() as any).option('rtlEnabled', rtlEnabled);
              (getInstance() as any).scrollTo(initialScrollOffset);
            },
            { dependencies: { getInstance, initialScrollOffset, rtlEnabled } },
          )();

          await ClientFunction(
            () => { (getInstance() as any).scrollToElement($('#element').get(0)); },
            { dependencies: { getInstance } },
          )();

          await t
            .expect(await takeScreenshot(`scrollToElement(), element more than container, useNative=${useNative}-direction=${direction}-rtl=${rtlEnabled}-${position}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
          // }
        //  }
        }).before(async () => {
          await ClientFunction(() => {
            $('#container').css({
              border: '1px solid black',
            });
          })();

          await appendElementTo('#container', 'div', 'scrollableContent', {
            width: '250px',
            height: '250px',
            border: '1px solid #0b837a',
            backgroundColor: 'lightskyblue',
          });

          await appendElementTo('#scrollableContent', 'div', 'element', {
            position: 'absolute',
            boxSizing: 'border-box',
            left: '20px',
            top: '20px',
            height: '200px',
            width: '200px',
            backgroundColor: '#2bb97f',
            border: '5px solid red',
            margin: '5px',
          });

          return createWidget('dxScrollable', {
            width: 100,
            height: 100,
            useNative,
            direction,
            showScrollbar: 'always',
          });
        });
      });
    });

    [
      { initialScrollOffset: { top: 0, left: 0 }, position: 'scrollFromTopLeftCorner' },
      { initialScrollOffset: { top: 0, left: 290 }, position: 'scrollFromTopRightCorner' },
      { initialScrollOffset: { top: 290, left: 290 }, position: 'scrollFromBottomRightCorner' },
      { initialScrollOffset: { top: 290, left: 0 }, position: 'scrollFromBottomLeftCorner' },

      { initialScrollOffset: { top: 0, left: 160 }, position: 'scrollFromTop' },
      { initialScrollOffset: { top: 160, left: 290 }, position: 'scrollFromRight' },
      { initialScrollOffset: { top: 290, left: 160 }, position: 'scrollFromBottom' },
      { initialScrollOffset: { top: 160, left: 0 }, position: 'scrollFromLeft' },

      // from inside

      { initialScrollOffset: { top: 165, left: 175 }, position: 'scrollFromInsideTopLeftPart' },
      { initialScrollOffset: { top: 140, left: 140 }, position: 'scrollFromInsideRightBottomPart' },
    ].forEach(({ initialScrollOffset, position }) => {
      test(`scrollToElement(element, offset), transform: scale(1.5), useNative: '${useNative}', direction: '${direction}', `, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const scrollable = new Scrollable('#container', { useNative, direction });
        const { getInstance } = scrollable;

        // const positions = [
        //   { initialScrollOffset: { top: 0, left: 0 }, position: 'scrollFromTopLeftCorner' },
        //   { initialScrollOffset: { top: 0, left: 290 }, position: 'scrollFromTopRightCorner' },
        //   { initialScrollOffset: { top: 290, left: 290 }, position: 'scrollFromBottomRightCorner' },
        //   { initialScrollOffset: { top: 290, left: 0 }, position: 'scrollFromBottomLeftCorner' },

        //   { initialScrollOffset: { top: 0, left: 160 }, position: 'scrollFromTop' },
        //   { initialScrollOffset: { top: 160, left: 290 }, position: 'scrollFromRight' },
        //   { initialScrollOffset: { top: 290, left: 160 }, position: 'scrollFromBottom' },
        //   { initialScrollOffset: { top: 160, left: 0 }, position: 'scrollFromLeft' },

        //   // from inside

        //   { initialScrollOffset: { top: 165, left: 175 }, position: 'scrollFromInsideTopLeftPart' },
        //   { initialScrollOffset: { top: 140, left: 140 }, position: 'scrollFromInsideRightBottomPart' },
        // ];

        // eslint-disable-next-line no-restricted-syntax
        // for (const { initialScrollOffset, position } of positions) {
        await ClientFunction(
          () => {
            $((getInstance() as any).content()).css({
              transform: 'scale(1.5)',
              transformOrigin: '0 0',
            });
            (getInstance() as any).scrollTo(initialScrollOffset);
          },
          { dependencies: { getInstance, initialScrollOffset } },
        )();

        await ClientFunction(
          () => { (getInstance() as any).scrollToElement($('#element').get(0)); },
          { dependencies: { getInstance } },
        )();

        await t
          .expect(await takeScreenshot(`scrollToElement(),transform=scale(1.5),useNative=${useNative}-direction=${direction}-${position}.png`, Selector('#container')))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
        // }
      }).before(async () => {
        await ClientFunction(() => {
          $('#container').css({
            border: '1px solid black',
          });
        })();

        await appendElementTo('#container', 'div', 'scrollableContent', {
          width: '250px',
          height: '250px',
          border: '1px solid #0b837a',
          backgroundColor: 'lightskyblue',
        });

        await appendElementTo('#scrollableContent', 'div', 'element', {
          position: 'absolute',
          boxSizing: 'border-box',
          left: '20px',
          top: '20px',
          height: '200px',
          width: '200px',
          backgroundColor: '#2bb97f',
          border: '5px solid red',
          margin: '5px',
        });

        return createWidget('dxScrollable', {
          width: 100,
          height: 100,
          useNative,
          direction,
          showScrollbar: 'always',
        });
      });
    });
  });
});
