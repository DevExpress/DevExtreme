import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import devices from '../../../../core/devices';

import {
  ScrollableNative as Scrollable,
  ScrollableNativeProps,
  viewFunction,
} from '../scrollable_native';

import {
  SCROLLABLE_SCROLLBAR_SIMULATED,
  SCROLLABLE_CONTENT_CLASS,
} from '../scrollable_utils';

import {
  createTargetElement, normalizeRtl, calculateRtlScrollLeft, createContainerRef, createElement,
} from './utils';

import {
  ScrollableProps,
} from '../scrollable_props';

import {
  ScrollOffset,
  ScrollableDirection,
} from '../types.d';

const testBehavior = { positive: false };
jest.mock('../../../../core/utils/scroll_rtl_behavior', () => () => testBehavior);
jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

describe('Native', () => {
  describe('Behavior', () => {
    describe('Methods', () => {
      describe('Content', () => {
        it('should get the content of the widget', () => {
          const scrollable = new Scrollable({});
          const content = { };
          scrollable.contentRef = content as RefObject<HTMLDivElement>;
          expect(scrollable.content()).toEqual(content);
        });
      });

      describe('ScrollBy', () => {
        each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
          it('should scroll by positive distance as number in the vertical direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy(100);
            const expected = normalizeRtl(rtlEnabled, 0);

            expect(containerRefMock.scrollTop).toEqual(250);
            expect(containerRefMock.scrollLeft).toEqual(expected);
          });

          it(`should scroll by positive distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy(normalizeRtl(rtlEnabled, 100));
            const expectedLeft = normalizeRtl(rtlEnabled, 250);

            expect(containerRefMock.scrollTop).toEqual(0);
            expect(containerRefMock.scrollLeft).toEqual(expectedLeft);
          });

          it(`should scroll by positive distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 100, left: normalizeRtl(rtlEnabled, 100) });

            expect(containerRefMock.scrollTop).toEqual(250);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
          });

          it(`should scroll by positive distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 100 });

            expect(containerRefMock.scrollTop).toEqual(250);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by positive distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 100) });

            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it(`should scroll by positive distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 70) });

            expect(containerRefMock.scrollTop).toEqual(220);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 220));
          });

          it(`should scroll by negative distance as number in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy(-50);

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by negative distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it(`should scroll by negative distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
          });

          it(`should scroll by negative distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -50, left: 70 });

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by negative distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it(`should scroll by negative distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -70, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollTop).toEqual(80);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
          });
        });
      });

      describe('ScrollTo', () => {
        each([false, true]).describe('rtlEnabled: %o', (rtlEnabled) => {
          it('should scroll to position as number in the vertical direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo(200);

            expect(containerRefMock.scrollTop).toEqual(200);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it('should scroll position as number in the horizontal direction', () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            const expected = 200;
            scrollable.scrollTo(expected);

            expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock, expected)
              : expected);
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it('should scroll position as number in the both direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo(200);
            const expected = 200;

            expect(containerRefMock.scrollTop).toEqual(200);
            expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock, expected)
              : expected);
          });

          it('should scroll position as object in the vertical direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo({ top: 100, left: 70 });

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it('should scroll position as object in the horizontal direction', () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo({ top: 70, left: 100 });
            const expectedLeft = 100;

            expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock, expectedLeft)
              : expectedLeft);
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it('should scroll position as object in the both direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo({ top: 70, left: 70 });

            expect(containerRefMock.scrollTop).toEqual(70);
            expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock, 70)
              : 70);
          });
        });
      });

      describe('ScrollToElement', () => {
        const getOffsetValue = (
          name: keyof ScrollOffset,
          offset?,
        ): number => (offset ? offset[name] : 0);

        const offsets = [undefined, {
          left: 10,
          right: 20,
          top: 10,
          bottom: 20,
        }];

        const directions = [
          'horizontal' as ScrollableDirection,
          'vertical' as ScrollableDirection,
          'both' as ScrollableDirection,
        ];

        each([undefined, null]).describe('scrollbarSize: %o', (fakeElement) => {
          it('should not be exepted when element is not exist', () => {
            const containerRef = createContainerRef({ top: 200, left: 0 }, 'both', 10);
            const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
            scrollable.containerRef = containerRef;

            scrollable.scrollToElement(fakeElement, {});

            expect(true).toEqual(true);
          });
        });

        each([5, 10, 20]).describe('scrollbarSize: %o', (scrollBarSize) => {
          each(directions).describe('Direction: %o', (direction) => {
            each(offsets).describe('Element is smaller than container. Offset: %o', (offset) => {
              it('should scroll to element from top side by vertical direction', () => {
                const element = createTargetElement({ location: { top: 20, left: 0 } });
                const containerRef = createContainerRef({ top: 200, left: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                expect(containerRef.scrollLeft).toEqual(0);
              });

              it('should scroll to element from bottom side by vertical direction.', () => {
                const element = createTargetElement({ location: { top: 500, left: 0 } });
                const containerRef = createContainerRef({ top: 100, left: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                const scrollOffset = direction === 'vertical' || direction === 'both'
                  ? scrollBarSize
                  : 0;

                expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollOffset);
                expect(containerRef.scrollLeft).toEqual(0);
              });

              it('should scroll to element from left side by horizontal direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 0 } });
                const containerRef = createContainerRef({ left: 200, top: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                const expectedLeft = element.offsetLeft - getOffsetValue('left', offset);
                expect(containerRef.scrollLeft).toEqual(expectedLeft);
                expect(containerRef.scrollTop).toEqual(0);
              });

              it('should scroll to element from right side by horizontal direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 0 } });
                const containerRef = createContainerRef({ left: 100, top: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                const scrollOffset = direction === 'horizontal' || direction === 'both'
                  ? scrollBarSize
                  : 0;
                expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollOffset);
                expect(containerRef.scrollTop).toEqual(0);
              });

              it('should scroll to element from left side and top side by both direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 20 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from right side and top side by both direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 20 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from left side and bottom side by both direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 500 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should scroll to element from right side and bottom side by both direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 500 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should do not scroll to an element when it in the visible area', () => {
                const element = createTargetElement({ location: { top: 200, left: 200 } });
                const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollTop).toEqual(100);
                expect(containerRef.scrollLeft).toEqual(100);
              });
            });

            /* eslint-disable jest/no-identical-title */
            each(offsets).describe(`Element larger than container. Offset: %o, scrollbarSize: ${scrollBarSize}, direction: ${direction}`, (offset) => {
              it('should scroll to element from top side by vertical direction', () => {
                const element = createTargetElement({
                  location: { top: 20, left: 0 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ top: 200, left: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                const scrollOffset = direction === 'vertical' || direction === 'both'
                  ? scrollBarSize
                  : 0;
                expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollOffset);
                expect(containerRef.scrollLeft).toEqual(0);
              });

              it('should scroll to element from bottom side by vertical direction', () => {
                const element = createTargetElement({
                  location: { top: 500, left: 0 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ top: 100, left: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                expect(containerRef.scrollLeft).toEqual(0);
              });

              it('should scroll to element from left side by horizontal direction', () => {
                const element = createTargetElement({
                  location: { left: 20, top: 0 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ left: 200, top: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                const scrollOffset = direction === 'horizontal' || direction === 'both'
                  ? scrollBarSize
                  : 0;
                expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollOffset);
                expect(containerRef.scrollTop).toEqual(0);
              });

              it('should scroll to element from right side by horizontal direction', () => {
                const element = createTargetElement({
                  location: { left: 500, top: 0 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ left: 100, top: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(0);
              });

              it('should scroll to element from left side and top side by both direction', () => {
                const element = createTargetElement({
                  location: { left: 20, top: 20 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should scroll to element from right side and top side by both direction', () => {
                const element = createTargetElement({
                  location: { left: 500, top: 20 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should scroll to element from left side and bottom side by both direction', () => {
                const element = createTargetElement({
                  location: { left: 20, top: 500 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from right side and bottom side by both direction', () => {
                const element = createTargetElement({
                  location: { left: 500, top: 500 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should do not scroll to an element when it in the visible area', () => {
                const element = createTargetElement({
                  location: { left: 200, top: 200 },
                  width: 400,
                  height: 400,
                });
                const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });
            });
          });

          describe('Other scenarios', () => {
            it('it should scroll to element when it is located inside the positioned element', () => {
              const content = createElement({
                location: {},
                className: SCROLLABLE_CONTENT_CLASS,
              });
              const parent = createElement({
                location: { top: 250, left: 250 },
                offsetParent: content,
              });
              const element = createElement({
                location: { top: 200, left: 200 },
                offsetParent: parent,
                isInScrollableContent: true,
              });
              const containerRef = createContainerRef({ top: 100, left: 100 }, 'both');
              const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);

              expect(containerRef.scrollTop).toEqual(217);
              expect(containerRef.scrollLeft).toEqual(217);
            });

            it('it should not scroll to element when it is not located inside the scrollable content', () => {
              const element = createElement({ location: { top: 200, left: 200 } });
              const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', undefined);
              const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);

              expect(containerRef.scrollTop).toEqual(100);
              expect(containerRef.scrollLeft).toEqual(100);
            });
          });
        });

        describe('rtlEnabled', () => {
          describe('Element is smaller than container. rtlEnabled: true', () => {
            it('should scroll to element from right side by horizontal direction', () => {
              const element = createTargetElement({ location: { top: 0, left: -320 } });
              const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from left side by horizontal direction', () => {
              const element = createTargetElement({ location: { top: 0, left: 0 } });
              const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from right side by horizontal direction for IE', () => {
              testBehavior.positive = true;
              const element = createTargetElement({ location: { top: 0, left: -320 } });
              const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft * -1);
              testBehavior.positive = false;
            });
          });

          describe('Element is larger than container. rtlEnabled: true', () => {
            it('should scroll to element from right side by horizontal direction', () => {
              const element = createTargetElement({
                location: {
                  top: 0, left: -320, width: 400, height: 400,
                },
              });
              const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from left side by horizontal direction', () => {
              const element = createTargetElement({
                location: {
                  top: 0, left: 0, width: 400, height: 400,
                },
              });
              const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            });
          });
        });
      });

      describe('ScrollHeight', () => {
        it('should get height of the scroll content', () => {
          const scrollable = new Scrollable({});
          scrollable.contentRef = { offsetHeight: 300 } as RefObject<HTMLDivElement>;

          expect(scrollable.scrollHeight()).toEqual(300);
        });
      });

      describe('ScrollWidth', () => {
        it('should get width of the scroll content', () => {
          const scrollable = new Scrollable({});
          scrollable.contentRef = { offsetWidth: 400 } as RefObject<HTMLDivElement>;

          expect(scrollable.scrollWidth()).toEqual(400);
        });
      });

      describe('ScrollOffset', () => {
        it('should get scroll offset', () => {
          const scrollable = new Scrollable({});
          const location = { left: 130, top: 560 };
          scrollable.containerRef = createContainerRef(location);

          expect(scrollable.scrollOffset()).toEqual(location);
        });

        it('should get scroll top', () => {
          const scrollable = new Scrollable({});
          scrollable.containerRef = createContainerRef({ left: 130, top: 560 });

          expect(scrollable.scrollTop()).toEqual(560);
        });

        it('should get scroll left', () => {
          const scrollable = new Scrollable({});
          scrollable.containerRef = createContainerRef({ left: 130, top: 560 });

          expect(scrollable.scrollLeft()).toEqual(130);
        });
      });

      describe('ClientHeight', () => {
        it('should get client height of the scroll container', () => {
          const scrollable = new Scrollable({});
          scrollable.containerRef = { clientHeight: 120 } as RefObject<HTMLDivElement>;

          expect(scrollable.clientHeight()).toEqual(120);
        });
      });

      describe('ClientWidth', () => {
        it('should get client width of the scroll container', () => {
          const scrollable = new Scrollable({});
          scrollable.containerRef = { clientWidth: 120 } as RefObject<HTMLDivElement>;

          expect(scrollable.clientWidth()).toEqual(120);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        each(['android', 'ios', 'generic']).describe('Platform: %o', (platform) => {
          it('should add scrolling classes by default', () => {
            devices.real = () => ({ platform });
            const instance = new Scrollable({});
            expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable'));

            expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
            expect(instance.cssClasses).toEqual(expect.stringMatching(`dx-scrollable-native-${platform}`));
          });

          it('should assign custom pushBackValue = 5', () => {
            devices.real = () => ({ platform });

            const scrollable = new Scrollable({ pushBackValue: 5 });
            expect((scrollable as any).pushBackValue).toEqual(5);
            expect((scrollable as any).styles).toEqual({ paddingTop: 5, paddingBottom: 5 });
          });

          it('should assign custom pushBackValue = 0', () => {
            devices.real = () => ({ platform });

            const scrollable = new Scrollable({ pushBackValue: 0 });
            expect((scrollable as any).pushBackValue).toEqual(0);
            expect((scrollable as any).styles).toEqual({
              paddingTop: undefined,
              paddingBottom: undefined,
            });
          });

          it('should assign default pushBackValue', () => {
            devices.real = () => ({ platform });

            const scrollable = new Scrollable({ });
            expect((scrollable as any).pushBackValue).toEqual(platform === 'ios' ? 1 : 0);
            expect((scrollable as any).styles).toEqual({
              paddingTop: platform === 'ios' ? 1 : undefined,
              paddingBottom: platform === 'ios' ? 1 : undefined,
            });
          });
        });
        each(['horizontal', 'vertical', 'both', null, undefined]).describe('Direction: %o', (direction) => {
          each([true, false, undefined, null]).describe('UseSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
            each(['never', 'always', 'onScroll', 'onHover', true, false, undefined, null]).describe('ShowScrollbar: %o', (showScrollbar) => {
              it('Should have correct css classes if useSimulatedScrollbar is set to true and nativeStrategy is used', () => {
                const instance = new Scrollable({
                  showScrollbar,
                  useSimulatedScrollbar,
                  direction,
                });

                const hasSimulatedCssClasses = showScrollbar && useSimulatedScrollbar;

                expect(instance.cssClasses).toEqual(hasSimulatedCssClasses
                  ? expect.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED)
                  : expect.not.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED));
              });
            });
          });
        });
      });
    });
  });

  describe('Styles', () => {
    each(['android', 'ios', 'generic']).describe('Platform: %o', (platform) => {
      each([5, 0, undefined]).describe('PushBackValue: %o', (pushBackValue) => {
        it('should add paddings for scrollable content', () => {
          devices.real = () => ({ platform });

          const viewModel = new Scrollable({ pushBackValue } as ScrollableNativeProps);
          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
          const scrollableContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content');
          const scrollableContentStyles = window.getComputedStyle(scrollableContent.getDOMNode());

          let expectedPadding = platform === 'ios' ? '1px' : '';
          if (pushBackValue !== undefined) {
            expectedPadding = pushBackValue ? `${pushBackValue}px` : '';
          }

          expect(scrollableContentStyles.paddingTop).toEqual(expectedPadding);
          expect(scrollableContentStyles.paddingBottom).toEqual(expectedPadding);
        });
      });
    });
  });
});
