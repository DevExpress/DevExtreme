import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';
import {
  RefObject,
} from '@devextreme-generator/declarations';
import devices from '../../../../core/devices';
import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../test_utils/events_mock';
import {
  ScrollableNative as Scrollable,
  viewFunction,
} from '../scrollable_native';

import {
  ScrollDirection,
} from '../utils/scroll_direction';

import {
  SCROLLABLE_SCROLLBAR_SIMULATED,
  SCROLLABLE_CONTENT_CLASS,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
} from '../common/consts';

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

import { Scrollbar } from '../scrollbar';

const testBehavior = { positive: false };
jest.mock('../../../../core/utils/scroll_rtl_behavior', () => () => testBehavior);
jest.mock('../../../../core/utils/support', () => ({ nativeScrolling: true }));
jest.mock('../../../../core/utils/browser', () => ({ mozilla: false }));

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

describe('Native', () => {
  describe('Behavior', () => {
    describe('Effects', () => {
      beforeEach(clearEventHandlers);

      each([true, false]).describe('Disabled: %o', (disabled) => {
        it('effectDisabledState()', () => {
          const viewModel = new Scrollable({ disabled });

          viewModel.effectDisabledState();

          if (disabled) {
            expect(viewModel.locked).toEqual(true);
          } else {
            expect(viewModel.locked).toEqual(false);
          }
        });
      });

      it('handleMove, locked: true', () => {
        const e = { ...defaultEvent, cancel: undefined } as any;
        const viewModel = new Scrollable({ });
        (viewModel as any).wrapperRef = React.createRef();
        viewModel.locked = true;

        viewModel.moveEffect();
        emit('dxscroll', e);

        expect(e.cancel).toEqual(true);
      });

      each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH, undefined]).describe('allowedDirection: %o', (allowedDirection) => {
        it('handleMove, locked: false', () => {
          const e = { ...defaultEvent, cancel: undefined, originalEvent: {} } as any;
          const viewModel = new Scrollable({ });
          (viewModel as any).wrapperRef = React.createRef();
          viewModel.locked = false;
          viewModel.tryGetAllowedDirection = jest.fn(() => allowedDirection);

          viewModel.moveEffect();
          emit('dxscroll', e);

          if (allowedDirection) {
            expect(e.originalEvent.isScrollingEvent).toEqual(true);
          } else {
            expect(e.originalEvent.isScrollingEvent).toEqual(undefined);
          }
          expect(e.cancel).toEqual(undefined);
        });
      });

      // it('handleScroll, location not changed', () => {
      //   const e = { ...defaultEvent, stopImmediatePropagation: jest.fn() } as any;
      //   const viewModel = new Scrollable({ });
      //   viewModel.containerRef = { current: {} } as RefObject;
      //   viewModel.lastLocation = { top: 1, left: 1 };
      //   viewModel.location = () => ({ top: 1, left: 1 });

      //   viewModel.scrollEffect();
      //   emit('scroll', e);

      //   expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(1);
      // });

      each([true, false]).describe('useSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
        it('handleScroll, location was changed', () => {
          const e = { ...defaultEvent, stopImmediatePropagation: jest.fn() } as any;
          const viewModel = new Scrollable({ useSimulatedScrollbar });
          viewModel.containerRef = { current: {} } as RefObject;
          viewModel.lastLocation = { top: 1, left: 1 };
          viewModel.location = () => ({ top: 2, left: 2 });
          viewModel.moveScrollbars = jest.fn();

          viewModel.scrollEffect();
          emit('scroll', e);

          expect(e.stopImmediatePropagation).not.toBeCalled();
          expect(viewModel.eventForUserAction).toEqual(e);
          expect(viewModel.lastLocation).toEqual({ top: 2, left: 2 });

          if (useSimulatedScrollbar) {
            expect(viewModel.moveScrollbars).toHaveBeenCalledTimes(1);
          } else {
            expect(viewModel.moveScrollbars).not.toBeCalled();
          }
        });
      });

      describe('windowResizeHandler', () => {
        it('should update sizes on window resize and trigger onUpdated', () => {
          const onUpdatedMock = jest.fn();
          const viewModel = new Scrollable({ onUpdated: onUpdatedMock });
          viewModel.contentRef = { current: {} } as RefObject<HTMLDivElement>;
          (viewModel as any).containerRef = React.createRef();
          viewModel.getEventArgs = jest.fn();

          viewModel.updateSizes = jest.fn();
          viewModel.windowResizeHandler();

          expect(viewModel.updateSizes).toBeCalledTimes(1);
          expect(onUpdatedMock).toBeCalledTimes(1);
          expect(onUpdatedMock).toHaveBeenCalledWith(viewModel.getEventArgs());
        });

        it('should update sizes on window resize, onUpdated: undefined', () => {
          const viewModel = new Scrollable({ onUpdated: undefined });
          viewModel.contentRef = { current: {} } as RefObject<HTMLDivElement>;
          (viewModel as any).containerRef = React.createRef();
          viewModel.getEventArgs = jest.fn();

          viewModel.updateSizes = jest.fn();
          viewModel.windowResizeHandler();

          expect(viewModel.updateSizes).toBeCalledTimes(1);
        });
      });

      describe('update()', () => {
        it('should update sizes on update() method call and trigger onUpdated', () => {
          const onUpdatedMock = jest.fn();
          const viewModel = new Scrollable({ onUpdated: onUpdatedMock });
          viewModel.contentRef = { current: {} } as RefObject<HTMLDivElement>;
          (viewModel as any).containerRef = React.createRef();
          viewModel.getEventArgs = jest.fn();

          viewModel.updateSizes = jest.fn();
          viewModel.update();

          expect(viewModel.updateSizes).toBeCalledTimes(1);
          expect(onUpdatedMock).toBeCalledTimes(1);
          expect(onUpdatedMock).toHaveBeenCalledWith(viewModel.getEventArgs());
        });

        it('should update sizes on update() method call, onUpdated: undefined', () => {
          const viewModel = new Scrollable({ onUpdated: undefined });
          viewModel.contentRef = { current: {} } as RefObject<HTMLDivElement>;
          (viewModel as any).containerRef = React.createRef();
          viewModel.getEventArgs = jest.fn();

          viewModel.updateSizes = jest.fn();
          viewModel.update();

          expect(viewModel.updateSizes).toBeCalledTimes(1);
        });

        it('should update sizes on update() method call, onUpdated, contentRef.current = null', () => {
          const onUpdatedMock = jest.fn();
          const viewModel = new Scrollable({ onUpdated: onUpdatedMock });
          viewModel.contentRef = { current: null } as RefObject<HTMLDivElement>;
          (viewModel as any).containerRef = React.createRef();
          viewModel.getEventArgs = jest.fn();

          viewModel.updateSizes = jest.fn();
          viewModel.update();

          expect(viewModel.updateSizes).not.toBeCalled();
          expect(onUpdatedMock).not.toBeCalled();
        });
      });

      each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
        it('effectResetInactiveState()', () => {
          const containerRef = {
            current: {
              scrollTop: 20,
              scrollLeft: 30,
            },
          } as RefObject<HTMLDivElement>;

          const viewModel = new Scrollable({ direction });
          viewModel.containerRef = containerRef;

          viewModel.effectResetInactiveState();

          expect(viewModel.containerRef.current).toEqual({
            scrollTop: direction === 'horizontal' ? 0 : 20,
            scrollLeft: direction === 'vertical' ? 0 : 30,
          });
        });
      });

      it('updateScrollbarSize()', () => {
        const viewModel = new Scrollable({});
        viewModel.containerClientWidth = 1;
        viewModel.containerClientHeight = 2;

        viewModel.contentClientWidth = 3;
        viewModel.contentClientHeight = 4;

        const containerRef = {
          current: {
            clientWidth: 10,
            clientHeight: 20,
          },
        } as RefObject;

        const contentRef = {
          current: {
            clientWidth: 30,
            clientHeight: 40,
          },
        } as RefObject;

        viewModel.containerRef = containerRef;
        viewModel.contentRef = contentRef;

        viewModel.updateScrollbarSize();

        expect(viewModel.containerClientWidth).toEqual(10);
        expect(viewModel.containerClientHeight).toEqual(20);
        expect(viewModel.contentClientWidth).toEqual(30);
        expect(viewModel.contentClientHeight).toEqual(40);
      });

      it('updateScrollbarSize(), contentRef.current: null', () => {
        const viewModel = new Scrollable({});
        viewModel.containerClientWidth = 1;
        viewModel.containerClientHeight = 2;

        viewModel.contentClientWidth = 3;
        viewModel.contentClientHeight = 4;

        const containerRef = {
          current: {
            clientWidth: 10,
            clientHeight: 20,
          },
        } as RefObject;

        const contentRef = {
          current: null,
        } as RefObject;

        viewModel.containerRef = containerRef;
        viewModel.contentRef = contentRef;

        viewModel.updateScrollbarSize();

        expect(viewModel.containerClientWidth).toEqual(10);
        expect(viewModel.containerClientHeight).toEqual(20);
        expect(viewModel.contentClientWidth).toEqual(3);
        expect(viewModel.contentClientHeight).toEqual(4);
      });

      it('updateScrollbarSize(), container.current: null', () => {
        const viewModel = new Scrollable({});
        viewModel.containerClientWidth = 1;
        viewModel.containerClientHeight = 2;

        viewModel.contentClientWidth = 3;
        viewModel.contentClientHeight = 4;

        const containerRef = {
          current: null,
        } as RefObject;

        const contentRef = {
          current: {
            clientWidth: 30,
            clientHeight: 40,
          },
        } as RefObject;

        viewModel.containerRef = containerRef;
        viewModel.contentRef = contentRef;

        viewModel.updateScrollbarSize();

        expect(viewModel.containerClientWidth).toEqual(1);
        expect(viewModel.containerClientHeight).toEqual(2);
        expect(viewModel.contentClientWidth).toEqual(30);
        expect(viewModel.contentClientHeight).toEqual(40);
      });

      it('initEventData()', () => {
        const containerRef = {
          current: {
            clientWidth: 10,
            clientHeight: 20,
          },
        } as RefObject;

        const viewModel = new Scrollable({});
        viewModel.containerRef = containerRef;

        const validateMock = jest.fn();
        const tryGetAllowedDirectionMock = jest.fn();

        viewModel.tryGetAllowedDirection = tryGetAllowedDirectionMock;
        viewModel.validate = validateMock;

        expect(viewModel.getInitEventData()).toEqual({
          getDirection: tryGetAllowedDirectionMock,
          validate: validateMock,
          isNative: true,
          scrollTarget: containerRef.current,
        });
      });
    });

    describe('Getters', () => {
      each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
        it('Direction', () => {
          const scrollable = new Scrollable({ direction });

          expect(scrollable.direction.isVertical)
            .toEqual(direction === DIRECTION_VERTICAL || direction === DIRECTION_BOTH);
          expect(scrollable.direction.isHorizontal)
            .toEqual(direction === DIRECTION_HORIZONTAL || direction === DIRECTION_BOTH);
        });
      });
    });

    describe('Methods', () => {
      each([true, false]).describe('Disabled: %o', (disabled) => {
        it('unlock()', () => {
          const viewModel = new Scrollable({ disabled });
          viewModel.locked = true;

          viewModel.unlock();

          expect(viewModel.locked).toEqual(!!disabled);
        });
      });

      describe('Content', () => {
        it('should get the content of the widget', () => {
          const scrollable = new Scrollable({});
          const content = { };
          scrollable.contentRef = { current: content } as RefObject<HTMLDivElement>;
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

            expect(containerRefMock.current?.scrollTop).toEqual(250);
            expect(containerRefMock.current?.scrollLeft).toEqual(expected);
          });

          it(`should scroll by positive distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy(normalizeRtl(rtlEnabled, 100));
            const expectedLeft = normalizeRtl(rtlEnabled, 250);

            expect(containerRefMock.current?.scrollTop).toEqual(0);
            expect(containerRefMock.current?.scrollLeft).toEqual(expectedLeft);
          });

          it(`should scroll by positive distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 100, left: normalizeRtl(rtlEnabled, 100) });

            expect(containerRefMock.current?.scrollTop).toEqual(250);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
          });

          it(`should scroll by positive distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 100 });

            expect(containerRefMock.current?.scrollTop).toEqual(250);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by positive distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 100) });

            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
            expect(containerRefMock.current?.scrollTop).toEqual(0);
          });

          it(`should scroll by positive distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 70) });

            expect(containerRefMock.current?.scrollTop).toEqual(220);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 220));
          });

          it(`should scroll by negative distance as number in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy(-50);

            expect(containerRefMock.current?.scrollTop).toEqual(100);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by negative distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            expect(containerRefMock.current?.scrollTop).toEqual(0);
          });

          it(`should scroll by negative distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.current?.scrollTop).toEqual(100);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
          });

          it(`should scroll by negative distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -50, left: 70 });

            expect(containerRefMock.current?.scrollTop).toEqual(100);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by negative distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            expect(containerRefMock.current?.scrollTop).toEqual(0);
          });

          it(`should scroll by negative distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollBy({ top: -70, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.current?.scrollTop).toEqual(80);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
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

            expect(containerRefMock.current?.scrollTop).toEqual(200);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it('should scroll position as number in the horizontal direction', () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            const expected = 200;
            scrollable.scrollTo(expected);

            expect(containerRefMock.current?.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock.current!, expected)
              : expected);
            expect(containerRefMock.current?.scrollTop).toEqual(0);
          });

          it('should scroll position as number in the both direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo(200);
            const expected = 200;

            expect(containerRefMock.current?.scrollTop).toEqual(200);
            expect(containerRefMock.current?.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock.current!, expected)
              : expected);
          });

          it('should scroll position as object in the vertical direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo({ top: 100, left: 70 });

            expect(containerRefMock.current?.scrollTop).toEqual(100);
            expect(containerRefMock.current?.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it('should scroll position as object in the horizontal direction', () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo({ top: 70, left: 100 });
            const expectedLeft = 100;

            expect(containerRefMock.current?.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock.current!, expectedLeft)
              : expectedLeft);
            expect(containerRefMock.current?.scrollTop).toEqual(0);
          });

          it('should scroll position as object in the both direction', () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;

            scrollable.scrollTo({ top: 70, left: 70 });

            expect(containerRefMock.current?.scrollTop).toEqual(70);
            expect(containerRefMock.current?.scrollLeft).toEqual(rtlEnabled
              ? calculateRtlScrollLeft(containerRefMock.current!, 70)
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

                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                expect(containerRef.current?.scrollLeft).toEqual(0);
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

                expect(containerRef.current?.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollOffset);
                expect(containerRef.current?.scrollLeft).toEqual(0);
              });

              it('should scroll to element from left side by horizontal direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 0 } });
                const containerRef = createContainerRef({ left: 200, top: 0 },
                  direction, scrollBarSize);

                const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                const expectedLeft = element.offsetLeft - getOffsetValue('left', offset);
                expect(containerRef.current?.scrollLeft).toEqual(expectedLeft);
                expect(containerRef.current?.scrollTop).toEqual(0);
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
                expect(containerRef.current?.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollOffset);
                expect(containerRef.current?.scrollTop).toEqual(0);
              });

              it('should scroll to element from left side and top side by both direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 20 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from right side and top side by both direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 20 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.current?.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from left side and bottom side by both direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 500 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.current?.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should scroll to element from right side and bottom side by both direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 500 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.current?.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.current?.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should do not scroll to an element when it in the visible area', () => {
                const element = createTargetElement({ location: { top: 200, left: 200 } });
                const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;

                scrollable.scrollToElement(element, offset);

                expect(containerRef.current?.scrollTop).toEqual(100);
                expect(containerRef.current?.scrollLeft).toEqual(100);
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
                expect(containerRef.current?.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollOffset);
                expect(containerRef.current?.scrollLeft).toEqual(0);
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

                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                expect(containerRef.current?.scrollLeft).toEqual(0);
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
                expect(containerRef.current?.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollOffset);
                expect(containerRef.current?.scrollTop).toEqual(0);
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

                expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.current?.scrollTop).toEqual(0);
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

                expect(containerRef.current?.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.current?.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
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

                expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.current?.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
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

                expect(containerRef.current?.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
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

                expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
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

                expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.current?.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
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

              expect(containerRef.current?.scrollTop).toEqual(217);
              expect(containerRef.current?.scrollLeft).toEqual(217);
            });

            it('it should not scroll to element when it is not located inside the scrollable content', () => {
              const element = createElement({ location: { top: 200, left: 200 } });
              const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', undefined);
              const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);

              expect(containerRef.current?.scrollTop).toEqual(100);
              expect(containerRef.current?.scrollLeft).toEqual(100);
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
              expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from left side by horizontal direction', () => {
              const element = createTargetElement({ location: { top: 0, left: 0 } });
              const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from right side by horizontal direction for IE', () => {
              testBehavior.positive = true;
              const element = createTargetElement({ location: { top: 0, left: -320 } });
              const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;

              scrollable.scrollToElement(element);
              expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft * -1);
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
              expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft);
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
              expect(containerRef.current?.scrollLeft).toEqual(element.offsetLeft);
            });
          });
        });
      });

      describe('ScrollHeight', () => {
        it('should get height of the scroll content', () => {
          const scrollable = new Scrollable({});
          scrollable.contentRef = { current: { offsetHeight: 300 } } as RefObject<HTMLDivElement>;

          expect(scrollable.scrollHeight()).toEqual(300);
        });
      });

      describe('ScrollWidth', () => {
        it('should get width of the scroll content', () => {
          const scrollable = new Scrollable({});
          scrollable.contentRef = { current: { offsetWidth: 400 } } as RefObject<HTMLDivElement>;

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
          scrollable.containerRef = { current: { clientHeight: 120 } } as RefObject<HTMLDivElement>;

          expect(scrollable.clientHeight()).toEqual(120);
        });
      });

      describe('ClientWidth', () => {
        it('should get client width of the scroll container', () => {
          const scrollable = new Scrollable({});
          scrollable.containerRef = { current: { clientWidth: 120 } } as RefObject<HTMLDivElement>;

          expect(scrollable.clientWidth()).toEqual(120);
        });
      });

      describe('Validate(e)', () => {
        it('disabled: true', () => {
          const e = { ...defaultEvent } as any;
          const scrollable = new Scrollable({ disabled: true });

          expect(scrollable.validate(e)).toEqual(false);
        });

        it('locked: true', () => {
          const e = { ...defaultEvent } as any;
          const scrollable = new Scrollable({});
          scrollable.locked = true;

          expect(scrollable.validate(e)).toEqual(false);
        });

        each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH, undefined]).describe('allowedDirection: %o', (allowedDirection) => {
          each([true, false]).describe('isScrollingOutOfBound: %o', (isScrollingOutOfBound) => {
            it(`isWheelEvent: true, isScrollingOutOfBound: ${isScrollingOutOfBound}, disabled: false, locked: false`, () => {
              const e = { ...defaultEvent, type: 'dxmousewheel' } as any;

              const scrollable = new Scrollable({ disabled: false });
              scrollable.locked = false;
              scrollable.isScrollingOutOfBound = jest.fn(() => isScrollingOutOfBound);
              scrollable.tryGetAllowedDirection = jest.fn(() => allowedDirection);

              if (isScrollingOutOfBound) {
                expect(scrollable.validate(e)).toEqual(false);
                expect((scrollable as any).isScrollingOutOfBound).toHaveBeenCalledTimes(1);
              } else {
                expect(scrollable.validate(e)).toEqual(!!allowedDirection);
                expect((scrollable as any).isScrollingOutOfBound).toHaveBeenCalledTimes(1);
              }
            });
          });

          each([true, false]).describe('isWheelEvent: %o', (isWheelEvent) => {
            it(`isScrollingOutOfBound: true, isWheelEvent: ${isWheelEvent}, disabled: false, locked: false`, () => {
              const e = { ...defaultEvent } as any;
              if (isWheelEvent) {
                (e as any).type = 'dxmousewheel';
              }

              const scrollable = new Scrollable({ disabled: false });
              scrollable.locked = false;
              scrollable.isScrollingOutOfBound = jest.fn(() => true);
              scrollable.tryGetAllowedDirection = jest.fn(() => allowedDirection);

              if (isWheelEvent) {
                expect(scrollable.validate(e)).toEqual(false);
              } else {
                expect(scrollable.validate(e)).toEqual(!!allowedDirection);
              }
            });
          });
        });
      });

      describe('isScrollingOutOfBound(e)', () => {
        each([-1, 0, 1]).describe('Delta', (delta) => {
          each([true, false]).describe('ShiftKey', (shiftKey) => {
            it('scrolling from min boundary position', () => {
              const containerRef = {
                current: {
                  scrollLeft: 0,
                  scrollTop: 0,
                  scrollWidth: 400,
                  clientWidth: 200,
                  scrollHeight: 600,
                  clientHeight: 300,
                },
              };
              const e = { delta, shiftKey } as any;
              const scrollable = new Scrollable({});
              (scrollable as any).containerRef = containerRef;

              if (delta > 0) {
                expect(scrollable.isScrollingOutOfBound(e)).toEqual(true);
              } else {
                expect(scrollable.isScrollingOutOfBound(e)).toEqual(false);
              }
            });

            it('scrolling from middle position', () => {
              const containerRef = {
                current: {
                  scrollLeft: 100,
                  scrollTop: 150,
                  scrollWidth: 400,
                  clientWidth: 200,
                  scrollHeight: 600,
                  clientHeight: 300,
                },
              };
              const e = { delta, shiftKey } as any;
              const scrollable = new Scrollable({});
              (scrollable as any).containerRef = containerRef;

              if (delta > 0) {
                expect(scrollable.isScrollingOutOfBound(e)).toEqual(false);
              } else {
                expect(scrollable.isScrollingOutOfBound(e)).toEqual(false);
              }
            });

            it('scrolling from max boundary position', () => {
              const containerRef = {
                current: {
                  scrollLeft: 200,
                  scrollTop: 300,
                  scrollWidth: 400,
                  clientWidth: 200,
                  scrollHeight: 600,
                  clientHeight: 300,
                },
              };
              const e = { delta, shiftKey } as any;
              const scrollable = new Scrollable({});
              (scrollable as any).containerRef = containerRef;

              if (delta > 0) {
                expect(scrollable.isScrollingOutOfBound(e)).toEqual(false);
              } else {
                expect(scrollable.isScrollingOutOfBound(e)).toEqual(true);
              }
            });
          });
        });
      });

      describe('tryGetAllowedDirection()', () => {
        each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
          it('contentClientSize > containerClientSize', () => {
            const containerRef = {
              current: {
                clientWidth: 200,
                clientHeight: 300,
              },
            };

            const contentRef = {
              current: {
                clientWidth: 400,
                clientHeight: 600,
              },
            };

            const scrollable = new Scrollable({ direction });
            (scrollable as any).containerRef = containerRef;
            (scrollable as any).contentRef = contentRef;

            expect(scrollable.tryGetAllowedDirection()).toEqual(direction);
          });

          it('contentClientSize = containerClientSize', () => {
            const containerRef = {
              current: {
                clientWidth: 200,
                clientHeight: 300,
              },
            };

            const contentRef = {
              current: {
                clientWidth: 200,
                clientHeight: 300,
              },
            };

            const scrollable = new Scrollable({ direction });
            (scrollable as any).containerRef = containerRef;
            (scrollable as any).contentRef = contentRef;

            expect(scrollable.tryGetAllowedDirection()).toEqual(undefined);
          });

          it('contentClientSize < containerClientSize', () => {
            const containerRef = {
              current: {
                clientWidth: 400,
                clientHeight: 600,
              },
            };

            const contentRef = {
              current: {
                clientWidth: 200,
                clientHeight: 300,
              },
            };

            const scrollable = new Scrollable({ direction });
            (scrollable as any).containerRef = containerRef;
            (scrollable as any).contentRef = contentRef;

            expect(scrollable.tryGetAllowedDirection()).toEqual(undefined);
          });
        });
      });

      describe('moveScrollbars', () => {
        each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
          it('should call according method in scrollbar', () => {
            jest.clearAllTimers();
            jest.useFakeTimers();

            const horizontalScrollbarRef = {
              current: { moveScrollbar: jest.fn() },
            };

            const verticalScrollbarRef = {
              current: { moveScrollbar: jest.fn() },
            };

            const viewModel = new Scrollable({ direction });

            (viewModel as any).horizontalScrollbarRef = horizontalScrollbarRef;
            (viewModel as any).verticalScrollbarRef = verticalScrollbarRef;
            viewModel.location = () => ({ top: 2, left: 4 });

            viewModel.moveScrollbars();

            const { isVertical, isHorizontal } = new ScrollDirection(direction);

            const verticalScrollbar = viewModel.verticalScrollbarRef.current;
            const horizontalScrollbar = viewModel.horizontalScrollbarRef.current;

            if (isVertical) {
              expect(verticalScrollbar!.moveScrollbar).toHaveBeenCalledTimes(1);
              expect(verticalScrollbar!.moveScrollbar).toHaveBeenCalledWith(2);
            }
            if (isHorizontal) {
              expect(horizontalScrollbar!.moveScrollbar).toHaveBeenCalledTimes(1);
              expect(horizontalScrollbar!.moveScrollbar).toHaveBeenCalledWith(4);
            }

            expect(viewModel.needForceScrollbarsVisibility).toEqual(true);

            expect(viewModel.hideScrollbarTimeout === undefined).toBe(false);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);

            expect(viewModel.needForceScrollbarsVisibility).toEqual(true);

            viewModel.disposeHideScrollbarTimeout()();
            expect(viewModel.hideScrollbarTimeout).toBe(undefined);
          });

          it('should call according method in scrollbar, scrollbarRef is undefined', () => {
            const viewModel = new Scrollable({ direction });

            (viewModel as any).horizontalScrollbarRef = {
              current: undefined,
            };

            (viewModel as any).verticalScrollbarRef = {
              current: undefined,
            };
            viewModel.location = () => ({ top: 2, left: 4 });

            viewModel.moveScrollbars();
            expect(viewModel.needForceScrollbarsVisibility).toEqual(true);
          });
        });
      });
    });
  });

  describe('Scrollbar integration', () => {
    each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
      each([true, false, undefined]).describe('UseSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
        each(['android', 'ios', 'generic']).describe('Platform: %o', (platform) => {
          it('Scrollbar should render if useSimulatedScrollbar is set to true or device is android', () => {
            devices.real = () => ({ platform });

            const viewModel = new Scrollable({
              useSimulatedScrollbar,
              showScrollbar: 'onScroll',
              direction,
            });
            (viewModel as any).contentRef = React.createRef();
            (viewModel as any).containerRef = React.createRef();
            (viewModel as any).horizontalScrollbarRef = React.createRef();
            (viewModel as any).verticalScrollbarRef = React.createRef();

            const scrollable = mount(viewFunction(viewModel) as JSX.Element);

            const scrollBar = scrollable.find(Scrollbar);

            let expectedScrollbarsCount = 0;
            if (useSimulatedScrollbar || (useSimulatedScrollbar === undefined && platform === 'android')) {
              expectedScrollbarsCount = direction === 'both' ? 2 : 1;
            }
            expect(scrollBar.length).toBe(expectedScrollbarsCount);
          });

          it('Should have correct css classes if useSimulatedScrollbar is set to true and nativeStrategy is used', () => {
            devices.real = () => ({ platform });
            const instance = new Scrollable({
              useSimulatedScrollbar,
              showScrollbar: 'onScroll',
              direction,
            });

            if (useSimulatedScrollbar || (useSimulatedScrollbar === undefined && platform === 'android')) {
              expect(instance.cssClasses).toEqual(
                expect.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED),
              );
            } else {
              expect(instance.cssClasses).toEqual(
                expect.not.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED),
              );
            }
          });
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
        });
      });
    });
  });
});
