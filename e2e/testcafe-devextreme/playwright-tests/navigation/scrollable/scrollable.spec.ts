import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, Scrollable } from '../../../playwright-helpers';
import path from 'path';

let _guidCounter = 0;
class Guid { toString() { return `guid${Date.now()}${++_guidCounter}`; } }

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Scrollable_ScrollToElement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  type ScrollableDirection = 'both' | 'horizontal' | 'vertical';

  (['both'] as ScrollableDirection[]).forEach((direction) => {
    test(`ScrollToElement, element less container,direction=${direction}`, async ({ page }) => {

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

      for (const useNative of [true, false]) {
        for (const rtlEnabled of [true, false]) {
          for (const { initialScrollOffset } of positions) {
            const id = `${`dx${new Guid()}`}`;

            await appendElementTo(page, '#container', 'div', id, {
              border: '1px solid black',
              display: 'inline-block',
            });

            await appendElementTo(page, `#${id}`, 'div', `${id}scrollableContent`, {
              width: '250px',
              height: '250px',
              border: '1px solid #0b837a',
              backgroundColor: 'lightskyblue',
            });

            await appendElementTo(page, `#${id}scrollableContent`, 'div', `${id}element`, {
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

            await createWidget(page, 'dxScrollable', {
              width: 100,
              height: 100,
              useNative,
              direction,
              rtlEnabled,
              showScrollbar: 'always',
            }, `#${id}`);

            const scrollable = new Scrollable(page, `#${id}`, { useNative, direction });

            await scrollable.scrollTo(initialScrollOffset);
            await scrollable.scrollToElement(`#${id}element`);
          }
        }
      }


      await testScreenshot(page, `ScrollToElement, element less container direction=${direction}.png`);

    });

    test(`ScrollToElement, element more container,direction=${direction}`, async ({ page }) => {
      test.setTimeout(120000);

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

      for (const useNative of [true, false]) {
        for (const rtlEnabled of [true, false]) {
          for (const { initialScrollOffset } of positions) {
            const id = `${`dx${new Guid()}`}`;

            await appendElementTo(page, '#container', 'div', id, {
              border: '1px solid black',
              display: 'inline-block',
            });

            await appendElementTo(page, `#${id}`, 'div', `${id}scrollableContent`, {
              width: '250px',
              height: '250px',
              border: '1px solid #0b837a',
              backgroundColor: 'lightskyblue',
            });

            await appendElementTo(page, `#${id}scrollableContent`, 'div', `${id}element`, {
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

            await createWidget(page, 'dxScrollable', {
              width: 100,
              height: 100,
              useNative,
              direction,
              showScrollbar: 'always',
              rtlEnabled,
            }, `#${id}`);

            const scrollable = new Scrollable(page, `#${id}`, { useNative, direction });

            await scrollable.scrollTo(initialScrollOffset);
            await scrollable.scrollToElement(`#${id}element`);
          }
        }
      }


      await testScreenshot(page, `ScrollToElement, element more container direction=${direction}.png`);

    });

    test(`ScrollToElement with scaling scale(1.5),direction=${direction}`, async ({ page }) => {

      const positions = [
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
      ];

      for (const useNative of [true, false]) {
        for (const rtlEnabled of [true, false]) {
          for (const { initialScrollOffset } of positions) {
            const id = `${`dx${new Guid()}`}`;

            await appendElementTo(page, '#container', 'div', id, {
              border: '1px solid black',
              display: 'inline-block',
            });

            await appendElementTo(page, `#${id}`, 'div', `${id}scrollableContent`, {
              width: '250px',
              height: '250px',
              border: '1px solid #0b837a',
              backgroundColor: 'lightskyblue',
              transform: 'scale(1.5)',
              transformOrigin: '0 0',
            });

            await appendElementTo(page, `#${id}scrollableContent`, 'div', `${id}element`, {
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

            await createWidget(page, 'dxScrollable', {
              width: 100,
              height: 100,
              useNative,
              direction,
              showScrollbar: 'always',
              rtlEnabled,
            }, `#${id}`);

            const scrollable = new Scrollable(page, `#${id}`, { useNative, direction });

            await scrollable.scrollTo(initialScrollOffset);
            await scrollable.scrollToElement(`#${id}element`);
          }
        }
      }


      await testScreenshot(page, `ScrollToElement with scaling scale(1.5),direction=${direction}.png`);

    });
  });

  (['horizontal'] as ScrollableDirection[]).forEach((direction) => {
    [false, true].forEach((useNative) => {
      [false, true].forEach((useSimulatedScrollbar) => {
        test(`Scroll offset after resize, rtlEnabled: true, useNative: '${useNative}', useSimulatedScrollbar: '${useSimulatedScrollbar}, container.width = 75 -> 50 -> 75 -> 100 -> 75`, async ({ page }) => {

          await appendElementTo(page, '#container', 'div', 'scrollable');
          await appendElementTo(page, '#scrollable', 'div', 'content', {
            width: '100px', height: '100px', backgroundColor: 'skyblue',
          });

          await createWidget(page, 'dxScrollable', {
            width: 50,
            height: 50,
            useNative,
            rtlEnabled: true,
            useSimulatedScrollbar,
            direction: 'horizontal',
            showScrollbar: 'always',
          }, '#scrollable');


          const scrollable = new Scrollable(page, '#scrollable', { direction, useNative, useSimulatedScrollbar });

          await scrollable.setContainerCssWidth(75);

          await expect(await scrollable.scrollOffset()).eql({ left: 25, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            expect(top).toBe(0);
            await expect(left).within(18, 20);
          }

          await scrollable.setContainerCssWidth(50);

          await expect(await scrollable.scrollOffset()).eql({ left: 50, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            expect(top).toBe(0);
            await expect(left).within(24, 26);
          }

          await scrollable.setContainerCssWidth(75);

          await expect(await scrollable.scrollOffset()).eql({ left: 25, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            expect(top).toBe(0);
            await expect(left).within(18, 20);
          }

          await scrollable.setContainerCssWidth(100);

          await expect(await scrollable.scrollOffset()).eql({ left: 0, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            expect(top).toBe(0);
            expect(left).toBe(0);
          }

          await scrollable.setContainerCssWidth(75);

          await expect(await scrollable.scrollOffset()).eql({ left: 25, top: 0 });
          if (scrollable.hScrollbar) {
            const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
            expect(top).toBe(0);
            await expect(left).within(18, 20);
          }

    });

        [1, 10, 20].forEach((scrollOffset) => {
          test(`Scroll offset after resize, rtlEnabled: true, useNative: '${useNative}', useSimulatedScrollbar: '${useSimulatedScrollbar}, scrollTo(Right - ${scrollOffset}), container.width = 75 -> 50 -> 100 -> 75 -> 50`, async ({ page }) => {

            await appendElementTo(page, '#container', 'div', 'scrollable');
            await appendElementTo(page, '#scrollable', 'div', 'content', {
              width: '100px', height: '100px', backgroundColor: 'skyblue',
            });

            await createWidget(page, 'dxScrollable', {
              width: 50,
              height: 50,
              useNative,
              rtlEnabled: true,
              useSimulatedScrollbar,
              direction: 'horizontal',
              showScrollbar: 'always',
            }, '#scrollable');


            const scrollable = new Scrollable(page, '#scrollable', { direction, useNative, useSimulatedScrollbar });

            await scrollable.scrollTo({ left: 50 - scrollOffset });
            await scrollable.update();

            await scrollable.setContainerCssWidth(75);

                      let expectedScrollOffset = (await scrollable.getMaxScrollOffset()).horizontal - scrollOffset;
            await page.expect((await scrollable.scrollOffset()).left)
              .within(expectedScrollOffset - 1, expectedScrollOffset + 1);
            await expect((await scrollable.scrollOffset()).top).eql(0);
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              const expectedTranslateValue = expectedScrollOffset * 0.75;
              await expect(left).within(expectedTranslateValue - 1, expectedTranslateValue + 1);
            }

            await scrollable.setContainerCssWidth(50);

            expectedScrollOffset = (await scrollable.getMaxScrollOffset()).horizontal - scrollOffset;
            await page.expect((await scrollable.scrollOffset()).left)
              .within(expectedScrollOffset - 1, expectedScrollOffset + 1);
            await expect((await scrollable.scrollOffset()).top).eql(0);
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              const expectedTranslateValue = expectedScrollOffset * 0.5;
              await expect(left).within(expectedTranslateValue - 1, expectedTranslateValue + 1);
            }

            await scrollable.setContainerCssWidth(100);

            await expect(await scrollable.scrollOffset()).eql({ left: 0, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              expect(left).toBe(0);
            }

            await scrollable.setContainerCssWidth(75);

            await expect(await scrollable.scrollOffset()).eql({ left: 25, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              await expect(left).within(18, 20);
            }

            await scrollable.setContainerCssWidth(50);

            await expect(await scrollable.scrollOffset()).eql({ left: 50, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              await expect(left).within(24, 26);
            }

    });
        });

        [30, 40, 50].forEach((scrollOffset) => {
          test(`Scroll offset after resize, rtlEnabled: true, useNative: '${useNative}', useSimulatedScrollbar: '${useSimulatedScrollbar}, scrollTo(${scrollOffset}), container.width = 75 -> 50 -> 100 -> 75 -> 50`, async ({ page }) => {

            await appendElementTo(page, '#container', 'div', 'scrollable');
            await appendElementTo(page, '#scrollable', 'div', 'content', {
              width: '100px', height: '100px', backgroundColor: 'skyblue',
            });

            await createWidget(page, 'dxScrollable', {
              width: 50,
              height: 50,
              useNative,
              rtlEnabled: true,
              useSimulatedScrollbar,
              direction: 'horizontal',
              showScrollbar: 'always',
            }, '#scrollable');


            const scrollable = new Scrollable(page, '#scrollable', { direction, useNative, useSimulatedScrollbar });

            await scrollable.scrollTo({ left: scrollOffset });
            await scrollable.update();

            await scrollable.setContainerCssWidth(75);

            const expectedScrollOffset = scrollOffset - 25;
            await page.expect((await scrollable.scrollOffset()).left)
              .within(expectedScrollOffset - 0.5, expectedScrollOffset + 0.5);
            await expect((await scrollable.scrollOffset()).top).eql(0);
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              const expectedTranslateValue = expectedScrollOffset * 0.75;
              await expect(left).within(expectedTranslateValue - 0.5, expectedTranslateValue + 0.5);
            }

            await scrollable.setContainerCssWidth(50);

            await expect(await scrollable.scrollOffset()).eql({ left: scrollOffset, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              const expectedTranslateValue = scrollOffset * 0.5;
              await expect(left).within(expectedTranslateValue - 0.5, expectedTranslateValue + 0.5);
            }

            await scrollable.setContainerCssWidth(100);

            await expect(await scrollable.scrollOffset()).eql({ left: 0, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              expect(left).toBe(0);
            }

            await scrollable.setContainerCssWidth(75);

            await expect(await scrollable.scrollOffset()).eql({ left: 25, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              await expect(left).within(18, 20);
            }

            await scrollable.setContainerCssWidth(50);

            await expect(await scrollable.scrollOffset()).eql({ left: 50, top: 0 });
            if (scrollable.hScrollbar) {
              const { top, left } = await scrollable.hScrollbar?.getScrollTranslate();
              expect(top).toBe(0);
              await expect(left).within(24, 26);
            }

    });
        });
      });
    });
  });
});
