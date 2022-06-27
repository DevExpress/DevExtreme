/* eslint-disable max-len */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Scrollable from '../../../model/scrollView/internal/scrollable';
import { appendElementTo } from '../helpers/domUtils';
import { ScrollableDirection } from '../../../../../js/renovation/ui/scroll_view/common/types';

fixture`Scrollable_ScrollToElement`
  .page(url(__dirname, '../../container.html'));

(['both'] as ScrollableDirection[]).forEach((direction) => {
  [true, false].forEach((useNative) => {
    test(`STE(el less cont),nat=${useNative},dir=${direction}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const scrollable = new Scrollable('#container', { useNative, direction });
      const positions = [
        { initialScrollOffset: { top: 80, left: 80 }, position: 'elementInsideContainer' },
        { initialScrollOffset: { top: 0, left: 0 }, position: 'fromTopLCorner' },
        { initialScrollOffset: { top: 0, left: 80 }, position: 'fromTop' },
        { initialScrollOffset: { top: 0, left: 160 }, position: 'fromTopRCorner' },
        { initialScrollOffset: { top: 80, left: 160 }, position: 'fromR' },
        { initialScrollOffset: { top: 160, left: 160 }, position: 'fromBRCorner' },
        { initialScrollOffset: { top: 160, left: 80 }, position: 'fromB' },
        { initialScrollOffset: { top: 160, left: 0 }, position: 'fromBLCorner' },
        { initialScrollOffset: { top: 80, left: 0 }, position: 'fromL' },
        // part
        { initialScrollOffset: { top: 125, left: 125 }, position: 'part-fromTopLCorner' },
        { initialScrollOffset: { top: 125, left: 80 }, position: 'part-fromTop' },
        { initialScrollOffset: { top: 125, left: 45 }, position: 'part-fromTopRCorner' },
        { initialScrollOffset: { top: 80, left: 45 }, position: 'part-fromR' },
        { initialScrollOffset: { top: 45, left: 45 }, position: 'part-fromBRCorner' },
        { initialScrollOffset: { top: 45, left: 80 }, position: 'part-fromB' },
        { initialScrollOffset: { top: 45, left: 125 }, position: 'part-fromBLCorner' },
        { initialScrollOffset: { top: 80, left: 125 }, position: 'part-fromL' },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const rtlEnabled of [true, false]) {
        // eslint-disable-next-line no-restricted-syntax
        for (const { initialScrollOffset, position } of positions) {
          await scrollable.option('rtlEnabled', rtlEnabled);
          await scrollable.apiScrollTo(initialScrollOffset);
          await scrollable.apiScrollToElement('#element');

          await t
            .expect(await takeScreenshot(`STE(el less cont),nat=${useNative}-dir=${direction}-rtl=${rtlEnabled}-${position}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }
      }
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

    test(`STE(el more cont),native=${useNative},dir=${direction}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const scrollable = new Scrollable('#container', { useNative, direction });
      const getInstance = scrollable.getInstance() as any;

      const positions = [
        { initialScrollOffset: { top: 0, left: 0 }, position: 'fromTLCorner' },
        { initialScrollOffset: { top: 0, left: 40 }, position: 'fromTLPart' },
        { initialScrollOffset: { top: 0, left: 120 }, position: 'fromTRPart' },
        { initialScrollOffset: { top: 0, left: 160 }, position: 'fromTRCorner' },

        { initialScrollOffset: { top: 40, left: 160 }, position: 'fromRTPart' },
        { initialScrollOffset: { top: 120, left: 160 }, position: 'fromRBPart' },

        { initialScrollOffset: { top: 160, left: 160 }, position: 'fromBRCorner' },
        { initialScrollOffset: { top: 160, left: 120 }, position: 'fromBRPart' },
        { initialScrollOffset: { top: 160, left: 40 }, position: 'fromBLPart' },
        { initialScrollOffset: { top: 160, left: 0 }, position: 'fromBLCorner' },

        { initialScrollOffset: { top: 120, left: 0 }, position: 'fromLBPart' },
        { initialScrollOffset: { top: 40, left: 0 }, position: 'fromLTPart' },

        // from inside

        { initialScrollOffset: { top: 40, left: 60 }, position: 'fromInsideTL' },
        { initialScrollOffset: { top: 40, left: 100 }, position: 'fromInsideTR' },
        { initialScrollOffset: { top: 60, left: 120 }, position: 'fromInsideRT' },
        { initialScrollOffset: { top: 100, left: 120 }, position: 'fromInsideRB' },
        { initialScrollOffset: { top: 120, left: 100 }, position: 'fromInsideBR' },
        { initialScrollOffset: { top: 120, left: 60 }, position: 'fromInsideBL' },
        { initialScrollOffset: { top: 100, left: 40 }, position: 'fromInsideLB' },
        { initialScrollOffset: { top: 60, left: 40 }, position: 'fromInsideLT' },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const rtlEnabled of [true, false]) {
        // eslint-disable-next-line no-restricted-syntax
        for (const { initialScrollOffset, position } of positions) {
          await ClientFunction(
            () => {
              getInstance().option('rtlEnabled', rtlEnabled);
              getInstance().scrollTo(initialScrollOffset);
            },
            { dependencies: { getInstance, initialScrollOffset, rtlEnabled } },
          )();

          await ClientFunction(
            () => { getInstance().scrollToElement($('#element').get(0)); },
            { dependencies: { getInstance } },
          )();

          await t
            .expect(await takeScreenshot(`STE(elem more cont),nat=${useNative}-dir=${direction}-rtl=${rtlEnabled}-${position}.png`, Selector('#container')))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }
      }
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

    [
      { initialScrollOffset: { top: 0, left: 0 }, position: 'fromTLCorner' },
      { initialScrollOffset: { top: 0, left: 290 }, position: 'fromTRCorner' },
      { initialScrollOffset: { top: 290, left: 290 }, position: 'fromBRCorner' },
      { initialScrollOffset: { top: 290, left: 0 }, position: 'fromBLCorner' },

      { initialScrollOffset: { top: 0, left: 160 }, position: 'fromT' },
      { initialScrollOffset: { top: 160, left: 290 }, position: 'fromR' },
      { initialScrollOffset: { top: 290, left: 160 }, position: 'fromB' },
      { initialScrollOffset: { top: 160, left: 0 }, position: 'fromL' },

      // from inside

      { initialScrollOffset: { top: 165, left: 175 }, position: 'fromInsideTLPart' },
      { initialScrollOffset: { top: 140, left: 140 }, position: 'fromInsideRBPart' },
    ].forEach(({ initialScrollOffset, position }) => {
      test(`STE(scale(1.5)),nat=${useNative},dir=${direction},${position}`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        const scrollable = new Scrollable('#container', { useNative, direction });
        const getInstance = scrollable.getInstance() as any;

        await ClientFunction(
          () => {
            getInstance().scrollTo(initialScrollOffset);
          },
          { dependencies: { getInstance, initialScrollOffset } },
        )();

        await ClientFunction(
          () => { getInstance().scrollToElement($('#element').get(0)); },
          { dependencies: { getInstance } },
        )();

        await t
          .expect(await takeScreenshot(`STE(),scale(1.5),nat=${useNative}-dir=${direction}-${position}.png`, Selector('#container')))
          .ok()
          .expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
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
          transform: 'scale(1.5)',
          transformOrigin: '0 0',
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

fixture`Scrollable_Resize`
  .page(url(__dirname, '../../container.html'));

(['horizontal'] as ScrollableDirection[]).forEach((direction) => {
  [false, true].forEach((useNative) => {
    [false, true].forEach((useSimulatedScrollbar) => {
      test(`Scroll offset after resize, rtlEnabled: true, useNative: '${useNative}', useSimulatedScrollbar: '${useSimulatedScrollbar}, container.width = 75 -> 50 -> 75 -> 100 -> 75`, async (t) => {
        const scrollable = new Scrollable('#container', { direction, useNative, useSimulatedScrollbar });

        await scrollable.setContainerCssWidth(75);

        await t.expect(await scrollable.apiScrollOffset()).eql({ left: 25, top: 0 });
        if (scrollable.hScrollbar) {
          const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
          await t.expect(top).eql(0);
          await t.expect(left).within(18, 20);
        }

        await scrollable.setContainerCssWidth(50);

        await t.expect(await scrollable.apiScrollOffset()).eql({ left: 50, top: 0 });
        if (scrollable.hScrollbar) {
          const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
          await t.expect(top).eql(0);
          await t.expect(left).within(24, 26);
        }

        await scrollable.setContainerCssWidth(75);

        await t.expect(await scrollable.apiScrollOffset()).eql({ left: 25, top: 0 });
        if (scrollable.hScrollbar) {
          const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
          await t.expect(top).eql(0);
          await t.expect(left).within(18, 20);
        }

        await scrollable.setContainerCssWidth(100);

        await t.expect(await scrollable.apiScrollOffset()).eql({ left: 0, top: 0 });
        if (scrollable.hScrollbar) {
          const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
          await t.expect(top).eql(0);
          await t.expect(left).eql(0);
        }

        await scrollable.setContainerCssWidth(75);

        await t.expect(await scrollable.apiScrollOffset()).eql({ left: 25, top: 0 });
        if (scrollable.hScrollbar) {
          const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
          await t.expect(top).eql(0);
          await t.expect(left).within(18, 20);
        }
      }).before(async () => {
        await appendElementTo('#container', 'div', 'content', {
          width: '100px', height: '100px', backgroundColor: 'skyblue',
        });

        return createWidget('dxScrollable', {
          width: 50,
          height: 50,
          useNative,
          rtlEnabled: true,
          useSimulatedScrollbar,
          direction: 'horizontal',
          showScrollbar: 'always',
        });
      });

      [1, 10, 20].forEach((scrollOffset) => {
        test(`Scroll offset after resize, rtlEnabled: true, useNative: '${useNative}', useSimulatedScrollbar: '${useSimulatedScrollbar}, scrollTo(Right - ${scrollOffset}), container.width = 75 -> 50 -> 100 -> 75 -> 50`, async (t) => {
          const scrollable = new Scrollable('#container', { direction, useNative, useSimulatedScrollbar });

          await scrollable.apiScrollTo({ left: 50 - scrollOffset });
          await scrollable.apiUpdate();

          await scrollable.setContainerCssWidth(75);

          let expectedScrollOffset = (await scrollable.getMaxScrollOffset()).horizontal - scrollOffset;
          await t.expect((await scrollable.apiScrollOffset()).left).within(expectedScrollOffset - 1, expectedScrollOffset + 1);
          await t.expect((await scrollable.apiScrollOffset()).top).eql(0);
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            const expectedTranslateValue = expectedScrollOffset * 0.75;
            await t.expect(left).within(expectedTranslateValue - 1, expectedTranslateValue + 1);
          }

          await scrollable.setContainerCssWidth(50);

          expectedScrollOffset = (await scrollable.getMaxScrollOffset()).horizontal - scrollOffset;
          await t.expect((await scrollable.apiScrollOffset()).left).within(expectedScrollOffset - 1, expectedScrollOffset + 1);
          await t.expect((await scrollable.apiScrollOffset()).top).eql(0);
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            const expectedTranslateValue = expectedScrollOffset * 0.5;
            await t.expect(left).within(expectedTranslateValue - 1, expectedTranslateValue + 1);
          }

          await scrollable.setContainerCssWidth(100);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 0, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            await t.expect(left).eql(0);
          }

          await scrollable.setContainerCssWidth(75);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 25, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            await t.expect(left).within(18, 20);
          }

          await scrollable.setContainerCssWidth(50);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 50, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            await t.expect(left).within(24, 26);
          }
        }).before(async () => {
          await appendElementTo('#container', 'div', 'content', {
            width: '100px', height: '100px', backgroundColor: 'skyblue',
          });

          return createWidget('dxScrollable', {
            width: 50,
            height: 50,
            useNative,
            rtlEnabled: true,
            useSimulatedScrollbar,
            direction: 'horizontal',
            showScrollbar: 'always',
          });
        });
      });

      [30, 40, 50].forEach((scrollOffset) => {
        test(`Scroll offset after resize, rtlEnabled: true, useNative: '${useNative}', useSimulatedScrollbar: '${useSimulatedScrollbar}, scrollTo(${scrollOffset}), container.width = 75 -> 50 -> 100 -> 75 -> 50`, async (t) => {
          const scrollable = new Scrollable('#container', { direction, useNative, useSimulatedScrollbar });

          await scrollable.apiScrollTo({ left: scrollOffset });
          await scrollable.apiUpdate();

          await scrollable.setContainerCssWidth(75);

          const expectedScrollOffset = scrollOffset - 25;
          await t.expect((await scrollable.apiScrollOffset()).left).within(expectedScrollOffset - 0.5, expectedScrollOffset + 0.5);
          await t.expect((await scrollable.apiScrollOffset()).top).eql(0);
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            const expectedTranslateValue = expectedScrollOffset * 0.75;
            await t.expect(left).within(expectedTranslateValue - 0.5, expectedTranslateValue + 0.5);
          }

          await scrollable.setContainerCssWidth(50);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: scrollOffset, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            const expectedTranslateValue = scrollOffset * 0.5;
            await t.expect(left).within(expectedTranslateValue - 0.5, expectedTranslateValue + 0.5);
          }

          await scrollable.setContainerCssWidth(100);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 0, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            await t.expect(left).eql(0);
          }

          await scrollable.setContainerCssWidth(75);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 25, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            await t.expect(left).within(18, 20);
          }

          await scrollable.setContainerCssWidth(50);

          await t.expect(await scrollable.apiScrollOffset()).eql({ left: 50, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            await t.expect(top).eql(0);
            await t.expect(left).within(24, 26);
          }
        }).before(async () => {
          await appendElementTo('#container', 'div', 'content', {
            width: '100px', height: '100px', backgroundColor: 'skyblue',
          });

          return createWidget('dxScrollable', {
            width: 50,
            height: 50,
            useNative,
            rtlEnabled: true,
            useSimulatedScrollbar,
            direction: 'horizontal',
            showScrollbar: 'always',
          });
        });
      });
    });
  });
});
