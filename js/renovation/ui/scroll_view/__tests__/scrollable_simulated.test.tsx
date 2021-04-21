/* eslint-disable max-len */
/* eslint-disable jest/expect-expect */
import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from '@devextreme-generator/declarations';
import { setWindow } from '../../../../core/utils/window';
import {
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
  SCROLLABLE_SCROLLBARS_HIDDEN,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  SCROLLABLE_SCROLLBAR_CLASS,
  DIRECTION_BOTH,
  TopPocketState,
} from '../common/consts';

import devices from '../../../../core/devices';

import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  ScrollableSimulated as Scrollable,
  viewFunction as ScrollableComponent,
} from '../scrollable_simulated';

import {
  ScrollableSimulatedProps,
} from '../scrollable_simulated_props';

import {
  optionValues,
  getPermutations,
} from './utils';

import { ScrollableTestHelper } from './scrollable_simulated_test_helper';

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

describe('Simulated > View', () => {
  it('render scrollable with defaults', () => {
    const props = new ScrollableSimulatedProps();
    const scrollable = mount<Scrollable>(<Scrollable {...props} />);

    expect(scrollable.props()).toEqual({
      bounceEnabled: true,
      direction: 'vertical',
      forceGeneratePockets: false,
      inertiaEnabled: true,
      needScrollViewContentWrapper: false,
      needScrollViewLoadPanel: false,
      pullDownEnabled: false,
      reachBottomEnabled: false,
      scrollByContent: true,
      scrollByThumb: false,
      showScrollbar: 'onScroll',
      updateManually: false,
      useKeyboard: true,
      useNative: true,
    });
  });
});

describe('Simulated > Render', () => {
  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
    each([true, false]).describe('AllowVertical: %o', (allowVertical) => {
      each([true, false]).describe('AllowHorizontal: %o', (allowHorizontal) => {
        it('containerStyles()', () => {
          const helper = new ScrollableTestHelper({ direction });

          Object.defineProperties(helper.viewModel, {
            allowedDirections: {
              get() { return ({ vertical: allowVertical, horizontal: allowHorizontal }); },
            },
          });

          let touchAction = '';
          if (allowVertical) {
            touchAction = 'pan-x';
          }
          if (allowHorizontal) {
            touchAction = 'pan-y';
          }
          if (allowVertical && allowHorizontal) {
            touchAction = 'none';
          }

          expect(helper.viewModel.containerStyles).toEqual({ touchAction });
        });
      });
    });
  });

  each([true, false]).describe('tabIndex on container. useKeyboard: %o', (useKeyboard) => {
    it('tabIndex on scrollable, useKeyboard', () => {
      const helper = new ScrollableTestHelper({ useKeyboard });

      const scrollableTabIndex = helper.getScrollable().getDOMNode().attributes.getNamedItem('tabindex');

      if (useKeyboard) {
        expect(scrollableTabIndex.value).toEqual('0');
      } else {
        expect(scrollableTabIndex).toEqual(null);
      }
    });
  });
});

describe('Simulated > Behavior', () => {
  it('windowResizeHandler()', () => {
    const helper = new ScrollableTestHelper({});

    helper.viewModel.update = jest.fn();

    helper.viewModel.windowResizeHandler();

    expect(helper.viewModel.update).toBeCalledTimes(1);
  });

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

    test.each(getPermutations([
      optionValues.forceGeneratePockets,
      optionValues.pullDownEnabled,
      optionValues.reachBottomEnabled,
      [true, false],
    ]))('Should assign swipeDown, pullDown strategy, forceGeneratePockets: %o, pullDownEnabled: %o, reachBottomEnabled: %o, elementRefExist: %o',
      (forceGeneratePockets, pullDownEnabled, reachBottomEnabled, elementRefExist) => {
        const viewModel = new Scrollable({
          forceGeneratePockets,
          pullDownEnabled,
          reachBottomEnabled,
        });

        viewModel.scrollableOffsetLeft = 5;
        viewModel.scrollableOffsetLeft = 7;

        viewModel.containerClientWidth = 1;
        viewModel.containerClientHeight = 2;
        viewModel.containerOffsetWidth = 3;
        viewModel.containerOffsetHeight = 4;

        viewModel.contentClientWidth = 5;
        viewModel.contentClientHeight = 6;
        viewModel.contentScrollWidth = 7;
        viewModel.contentScrollHeight = 8;

        viewModel.contentOffsetWidth = 9;
        viewModel.contentOffsetHeight = 10;

        viewModel.topPocketClientHeight = 11;
        viewModel.bottomPocketClientHeight = 12;

        const containerRef = {
          current: elementRefExist ? {
            clientWidth: 10,
            clientHeight: 20,
            offsetWidth: 30,
            offsetHeight: 40,
          } : null,
        } as RefObject;

        const contentRef = {
          current: elementRefExist ? {
            clientWidth: 50,
            clientHeight: 60,
            scrollWidth: 70,
            scrollHeight: 80,
            offsetWidth: 90,
            offsetHeight: 100,
          } : null,
        } as RefObject;

        const topPocketRef = {
          current: elementRefExist ? {
            clientHeight: 80,
          } : null,
        } as RefObject;

        const bottomPocketRef = {
          current: elementRefExist ? {
            clientHeight: 55,
          } : null,
        } as RefObject;

        viewModel.containerRef = containerRef;
        viewModel.contentRef = contentRef;
        viewModel.topPocketRef = topPocketRef;
        viewModel.bottomPocketRef = bottomPocketRef;

        Object.defineProperties(viewModel, {
          scrollableOffset: { get() { return { left: 10, top: 20 }; } },
        });
        viewModel.updateScrollbarSize();

        expect(viewModel.scrollableOffsetLeft).toEqual(10);
        expect(viewModel.scrollableOffsetTop).toEqual(20);

        if (elementRefExist) {
          expect(viewModel.containerClientWidth).toEqual(10);
          expect(viewModel.containerClientHeight).toEqual(20);
          expect(viewModel.containerOffsetWidth).toEqual(30);
          expect(viewModel.containerOffsetHeight).toEqual(40);

          expect(viewModel.contentClientWidth).toEqual(50);
          expect(viewModel.contentClientHeight).toEqual(60);
          expect(viewModel.contentScrollWidth).toEqual(70);
          expect(viewModel.contentScrollHeight).toEqual(80);
          expect(viewModel.contentOffsetWidth).toEqual(90);
          expect(viewModel.contentOffsetHeight).toEqual(100);

          if (forceGeneratePockets && pullDownEnabled) {
            expect(viewModel.topPocketClientHeight).toEqual(80);
          }

          if (forceGeneratePockets && reachBottomEnabled) {
            expect(viewModel.bottomPocketClientHeight).toEqual(55);
          }
        }
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

      test.each(getPermutations([
        optionValues.showScrollbar,
        optionValues.bounceEnabled,
        optionValues.inertiaEnabled,
      ]))('emit "dxscrollinit" event, showScrollbar: %o, bounceEnabled: %o, inertiaEnabled: %o,',
        (showScrollbar, bounceEnabled, inertiaEnabled) => {
          const propertySettings = {
            showScrollbar,
            bounceEnabled,
            inertiaEnabled,
            scrollByThumb: true,
          };

          const helper = new ScrollableTestHelper({ direction, ...propertySettings });
          helper.initScrollbarSettings();

          helper.checkScrollbarProps(propertySettings);
        });

      it('should call releaseHandler when relese() method was called', () => {
        const helper = new ScrollableTestHelper({
          direction,
        });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.release();

        helper.checkScrollbarEventHandlerCalls(expect, ['release'], [[]]);
      });

      it('emit "dxscrollstop" event', () => {
        const helper = new ScrollableTestHelper({
          direction,
        });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.stopEffect();
        emit('dxscrollstop');

        helper.checkScrollbarEventHandlerCalls(expect, ['stop'], [[]]);
      });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
      ]))('emit "dxscrollinit" event, isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o, targetClass: %o',
        (isDxWheelEvent, scrollByThumb, scrollByContent, targetClass) => {
          const e = { ...defaultEvent, originalEvent: {} };
          if (isDxWheelEvent) {
            (e as any).originalEvent.type = 'dxmousewheel';
          }

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          (e.originalEvent as any).target = target;

          let expectedValidDirections = {};

          let expectedVerticalThumbScrolling;
          let expectedHorizontalThumbScrolling;

          if (direction === DIRECTION_VERTICAL) {
            expectedVerticalThumbScrolling = scrollByThumb
                      && helper.viewModel.verticalScrollbarRef.current!.isThumb(
                        target,
                      );
          } else if (direction === DIRECTION_HORIZONTAL) {
            expectedHorizontalThumbScrolling = scrollByThumb
                      && helper.viewModel.horizontalScrollbarRef.current!.isThumb(
                        target,
                      );
          } else {
            expectedHorizontalThumbScrolling = scrollByThumb
                      && helper.viewModel.horizontalScrollbarRef.current!.isThumb(
                        target,
                      );
            expectedVerticalThumbScrolling = false;
          }

          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.initEffect();
          emit('dxscrollinit', e);

          if (isDxWheelEvent) {
            expectedValidDirections = { vertical: true, horizontal: true };
          } else {
            const isDirectionValid = scrollByContent
                      || (scrollByThumb && targetClass !== 'dx-scrollable-container');

            expectedValidDirections = {
              vertical: direction !== DIRECTION_HORIZONTAL && isDirectionValid
                      && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
              horizontal: direction !== DIRECTION_VERTICAL && isDirectionValid,
            };
          }

          const expectedCrossThumbScrolling = expectedVerticalThumbScrolling
            || expectedHorizontalThumbScrolling;

          expect(helper.viewModel.validDirections).toEqual(expectedValidDirections);
          helper.checkActionHandlerCalls(expect, ['onStop'], [[{ fakeEventArg: { value: 5 } }]]);
          helper.checkScrollbarEventHandlerCalls(expect, ['init'], [[e, expectedCrossThumbScrolling]]);
        });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
        [1, 0.5, 2, undefined],
      ]))('emit "dxscrollinit" -> "dxscrollend" events, isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o, targetClass: %, pixelRatio: %o',
        (isDxWheelEvent, scrollByThumb, scrollByContent, targetClass, pixelRatio) => {
          const initialVelocityX = 2.25;
          const initialVelocityY = 5.24;

          const e = {
            ...defaultEvent,
            velocity: { x: initialVelocityX, y: initialVelocityY },
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
          };

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          (e.originalEvent as any).target = target;

          helper.checkValidDirection(expect, {}, {});

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          helper.viewModel.isCrossThumbScrolling = () => true;

          helper.viewModel.initEffect();
          emit('dxscrollinit', e);

          helper.viewModel.tryGetDevicePixelRatio = () => pixelRatio;
          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.endEffect();
          emit('dxscrollend', e);

          helper.checkValidDirection(expect, undefined, {
            scrollByContent, scrollByThumb, targetClass, isDxWheelEvent,
          });
          helper.checkScrollbarEventHandlerCalls(expect, ['init', 'end'], [[e, true], [e.velocity]]);

          const expectedValidDirections = helper.getValidDirection({
            scrollByContent, scrollByThumb, targetClass, isDxWheelEvent,
          });
          const expectedDeltaX = initialVelocityX
                      * (expectedValidDirections.horizontal ? 1 : 0);
          const expectedDeltaY = initialVelocityY
                      * (expectedValidDirections.vertical ? 1 : 0);

          if (isDxWheelEvent && pixelRatio) {
            expect(e.velocity.x)
              .toEqual(Math.round((expectedDeltaX / pixelRatio) * 100) / 100);
            expect(e.velocity.y)
              .toEqual(Math.round((expectedDeltaY / pixelRatio) * 100) / 100);
          } else {
            expect(e.velocity.x).toEqual(expectedDeltaX);
            expect(e.velocity.y).toEqual(expectedDeltaY);
          }
        });

      it('emit "dxscrollcancel" event', () => {
        const initialVelocityX = 2.25;
        const initialVelocityY = 5.24;

        const e = {
          ...defaultEvent,
          velocity: { x: initialVelocityX, y: initialVelocityY },
          originalEvent: {
            type: 'dxmousewheel',
          },
        };

        const helper = new ScrollableTestHelper({
          direction,
        });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.cancelEffect();
        emit('dxscrollcancel', e);

        expect(helper.viewModel.eventForUserAction).toEqual(e);

        helper.checkActionHandlerCalls(expect, [], []);
        helper.checkScrollbarEventHandlerCalls(expect, ['end'], [[{ x: 0, y: 0 }]]);
      });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
      ]))('emit "dxscrollstart" event, isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o, targetClass: %',
        (isDxWheelEvent, scrollByThumb, scrollByContent, targetClass) => {
          const initialVelocityX = 2.25;
          const initialVelocityY = 5.24;

          const e = {
            ...defaultEvent,
            velocity: { x: initialVelocityX, y: initialVelocityY },
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
          };

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          (e.originalEvent as any).target = target;

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          helper.checkValidDirection(expect, {}, {});
          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.startEffect();
          emit('dxscrollstart', e);

          helper.checkActionHandlerCalls(expect, ['onStart'], [[{ fakeEventArg: { value: 5 } }]]);
          helper.checkScrollbarEventHandlerCalls(expect, ['start'], [[]]);
        });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
      ]))('emit "dxscrollend" event, isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o,',
        (isDxWheelEvent, scrollByThumb, scrollByContent) => {
          const e = {
            ...defaultEvent,
            velocity: { x: 5.56, y: 4.5986 },
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
          };

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          helper.viewModel.adjustDistance = jest.fn();
          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.endEffect();
          emit('dxscrollend', e);

          helper.checkActionHandlerCalls(expect, ['onEnd'], [[{ fakeEventArg: { value: 5 } }]]);
          helper.checkScrollbarEventHandlerCalls(expect, ['end'], [[e.velocity]]);
        });

      test.each(getPermutations([
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        [
          { actual: { top: -20, left: 15 }, expected: { y: 20, x: -15 } },
          { actual: -100, expected: { x: direction !== 'vertical' ? 50 : 0, y: direction !== 'horizontal' ? 50 : 0 } },
          { actual: 200, expected: { x: direction !== 'vertical' ? -50 : 0, y: direction !== 'horizontal' ? -50 : 0 } },
        ],
      ]))('call scrollBy() method, scrollByThumb: %o, scrollByContent: %o, scrollBy values: %o',
        (scrollByThumb, scrollByContent, scrollByValues) => {
          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          helper.initContainerPosition({ top: 50, left: 50 });

          helper.viewModel.adjustDistance = jest.fn();
          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.scrollBy(scrollByValues.actual);
          helper.callScrollbarMethod('updateContent');

          helper.checkValidDirection(expect, {
            horizontal: true,
            vertical: true,
          }, {});

          helper.checkActionHandlerCalls(expect,
            ['onStart', 'onUpdated', 'onEnd'],
            [[{ fakeEventArg: { value: 5 } }], [{ fakeEventArg: { value: 5 } }], [{ fakeEventArg: { value: 5 } }]]);
          helper.checkScrollbarEventHandlerCalls(expect, ['scrollBy'], [[scrollByValues.expected]]);
        });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
        [1, 0.5, 2, undefined],
        [true, false],
        [true, false],
      ]))('emit "dxscrollinit" -> "dxscroll" events, isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o, targetClass: %o, pixelRatio: %o, hasWindow: %o, locked: %o,',
        (isDxWheelEvent, scrollByThumb, scrollByContent, targetClass, pixelRatio, hasWindow, locked) => {
          const initialDeltaX = 50;
          const initialDeltaY = 40;

          const e = {
            ...defaultEvent,
            delta: { x: initialDeltaX, y: initialDeltaY },
            preventDefault: jest.fn(),
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
          };

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          helper.viewModel.isCrossThumbScrolling = () => true;
          helper.viewModel.locked = locked;

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          (e.originalEvent as any).target = target;

          expect(helper.viewModel.validDirections).toEqual({});

          helper.viewModel.initEffect();
          emit('dxscrollinit', e);

          setWindow({ devicePixelRatio: pixelRatio }, hasWindow);

          helper.viewModel.moveEffect();
          emit('dxscroll', e);

          if (locked) {
            expect((e as any).cancel).toBe(true);
            helper.checkScrollbarEventHandlerCalls(expect, ['init'], [[e, true]]);
            return;
          }

          const isDirectionValid = scrollByContent || (scrollByThumb && targetClass !== 'dx-scrollable-container');

          const expectedValidDirections = {
            vertical: isDxWheelEvent
              ? true
              : direction !== DIRECTION_HORIZONTAL && isDirectionValid && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
            horizontal: isDxWheelEvent
              ? true
              : direction !== DIRECTION_VERTICAL && isDirectionValid,
          };

          expect(e.preventDefault).toBeCalled();

          const expectedDeltaX = initialDeltaX * (expectedValidDirections.horizontal ? 1 : 0);
          const expectedDeltaY = initialDeltaY * (expectedValidDirections.vertical ? 1 : 0);

          helper.checkScrollbarEventHandlerCalls(expect, ['init', 'move'], [[e, true], [e.delta]]);

          if (isDxWheelEvent && pixelRatio && hasWindow) {
            expect(e.delta.x).toEqual(expectedDeltaX / pixelRatio);
            expect(e.delta.y).toEqual(expectedDeltaY / pixelRatio);
          } else {
            expect(e.delta.x).toEqual(expectedDeltaX);
            expect(e.delta.y).toEqual(expectedDeltaY);
          }
        });

      each(optionValues.scrollByContent).describe('ScrollByContent: %o', (scrollByContent) => {
        each([true, false]).describe('isScrollbarTarget: %o', (isScrollbarTarget) => {
          it('validateMove(e)', () => {
            const helper = new ScrollableTestHelper({
              direction, scrollByContent,
            });

            helper.initScrollbarSettings();

            const target = isScrollbarTarget && helper.viewModel.containerRef.current
              ? helper.viewModel.containerRef.current.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`)
              : helper.viewModel.containerRef.current;

            const e = { ...defaultEvent, target };

            const validateMoveResult = helper.viewModel.validateMove(e);

            if (!scrollByContent && !isScrollbarTarget) {
              expect(validateMoveResult).toBe(false);
            } else {
              expect(validateMoveResult).toBe(helper.viewModel.allowedDirection() !== undefined);
            }
          });
        });
      });

      test.each(getPermutations([
        [100, 200],
        [0, 100, 200],
        ['hidden', 'visible'],
      ]))('UpdateScrollbarSize(), thumbSize default, ContainerSize: %o, ContentSize: %o, OverflowStyle: %o',
        (containerSize, contentSize, overflow) => {
          const helper = new ScrollableTestHelper({
            direction, overflow, contentSize, containerSize,
          });
          helper.initScrollbarSettings();

          if (helper.isVertical) {
            const styles = helper.getVerticalScrollElement().props.style;

            expect(styles).toEqual({ height: '15px', transform: 'translate(0px, 0px)' });
          }
          if (helper.isHorizontal) {
            const styles = helper.getHorizontalScrollElement().props.style;

            expect(styles).toEqual({ width: '15px', transform: 'translate(0px, 0px)' });
          }

          Object.defineProperties(helper.viewModel, {
            scrollableOffset: { get() { return { left: 10, top: 10 }; } },
          });

          helper.viewModel.updateScrollbarSize();

          if (helper.isVertical) {
            expect(helper.viewModel.scrollableOffsetLeft).toEqual(10);
            expect(helper.viewModel.containerClientWidth).toEqual(containerSize);
            expect(helper.viewModel.contentWidth).toEqual(contentSize);
            expect(helper.viewModel.baseContainerWidth).toEqual(containerSize);
            expect(helper.viewModel.baseContentWidth).toEqual(contentSize);
          }
          if (helper.isHorizontal) {
            expect(helper.viewModel.scrollableOffsetTop).toEqual(10);
            expect(helper.viewModel.containerClientHeight).toEqual(containerSize);
            expect(helper.viewModel.contentHeight).toEqual(contentSize);
            expect(helper.viewModel.baseContainerHeight).toEqual(containerSize);
            expect(helper.viewModel.baseContentHeight).toEqual(contentSize);
          }
        });

      test.each(getPermutations([
        [100, 200],
        [0, 100, 200],
        ['hidden', 'visible'],
        optionValues.bounceEnabled,
        optionValues.isDxWheelEvent,
        [true, false],
      ]))('UpdateScrollbarSize(), thumbSize default, ContainerSize: %o, ContentSize: %o, OverflowStyle: %o, BounceEnabled: %o, IsDxWheelEvent: %o, IsShiftKeyPressed: %o',
        (containerSize, contentSize, overflow, bounceEnabled, isDxWheelEvent, shiftKey) => {
          const helper = new ScrollableTestHelper({
            direction, overflow, bounceEnabled, contentSize, containerSize,
          });

          Object.defineProperties(helper.viewModel, {
            contentHeight: { get() { return contentSize; } },
            contentWidth: { get() { return contentSize; } },
          });
          helper.viewModel.containerClientHeight = containerSize;
          helper.viewModel.containerClientWidth = containerSize;

          let expectedDirectionResult = (containerSize < contentSize || bounceEnabled)
            ? direction
            : undefined;

          const e = { ...defaultEvent, shiftKey };
          if (isDxWheelEvent) {
            (e as any).type = 'dxmousewheel';
          }

          if (isDxWheelEvent) {
            expectedDirectionResult = direction;
            if (direction === 'both') {
              expectedDirectionResult = shiftKey ? 'horizontal' : 'vertical';
            }
          }

          expect(helper.viewModel.getDirection(e)).toBe(expectedDirectionResult);
        });

      each([-1, 1]).describe('Wheel delta: %o', (delta) => {
        each([-100, -50, 0]).describe('Scrollbar position: %o', (scrollbarPosition) => {
          it('validateWheel(e)', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.initContainerPosition({ top: -scrollbarPosition, left: -scrollbarPosition });

            const e = { ...defaultEvent, delta };

            const expectedValidationResult = (scrollbarPosition < 0 && delta > 0)
                || (scrollbarPosition >= 0 && delta < 0) || scrollbarPosition === -50;

            expect(helper.viewModel.validateWheelTimer).toBe(undefined);

            const actualResult = helper.viewModel.validateWheel(e);
            expect(actualResult).toBe(expectedValidationResult);

            if (!expectedValidationResult) {
              expect(helper.viewModel.validateWheelTimer).toBe(undefined);
            } else {
              expect(helper.viewModel.validateWheelTimer).not.toBe(undefined);
            }

            helper.viewModel.disposeWheelTimer()();

            expect(helper.viewModel.validateWheelTimer).toBe(undefined);
          });
        });
      });

      describe('Validate(e)', () => {
        it('locked: true, disabled: false, bounceEnabled: true, ', () => {
          const e = { ...defaultEvent } as any;
          const viewModel = new Scrollable({ direction, disabled: false, bounceEnabled: true });
          viewModel.locked = false;
          viewModel.update = jest.fn();

          expect(viewModel.validate(e)).toEqual(true);
          expect(viewModel.update).toHaveBeenCalledTimes(1);
        });

        each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
          it('validate(e), locked: false, disabled: false, bounceEnabled: false', () => {
            const helper = new ScrollableTestHelper({
              direction,
              bounceEnabled: false,
              disabled: false,
            });

            const e = { ...defaultEvent, type: isDxWheelEvent ? 'dxmousewheel' : undefined };

            helper.viewModel.locked = false;
            helper.viewModel.validateWheel = jest.fn();
            helper.viewModel.validateMove = jest.fn();

            helper.viewModel.validate(e);

            if (isDxWheelEvent) {
              expect(helper.viewModel.validateWheel).toHaveBeenCalledTimes(1);
              expect(helper.viewModel.validateMove).toHaveBeenCalledTimes(0);
              expect(helper.viewModel.validateWheel).toHaveBeenCalledWith(e);
            } else {
              expect(helper.viewModel.validateWheel).toHaveBeenCalledTimes(0);
              expect(helper.viewModel.validateMove).toHaveBeenCalledTimes(1);
              expect(helper.viewModel.validateMove).toHaveBeenCalledWith(e);
            }
          });
        });
      });
    });

    each(['always', 'onHover', 'never', 'onScroll']).describe('HoverEffect params. showScrollbar: %o', (showScrollbar) => {
      it('hoverStart, hoverEnd handlers should update isHovered state only for onHover mode', () => {
        const viewModel = new Scrollable({ direction: 'horizontal', showScrollbar }) as any;

        expect(viewModel.isHovered).toBe(false);

        viewModel.cursorEnterHandler();
        expect(viewModel.isHovered).toBe(showScrollbar === 'onHover');

        viewModel.cursorLeaveHandler();
        expect(viewModel.isHovered).toBe(false);
      });
    });
  });

  describe('Key down', () => {
    it('should call onKeyDown callback by Widget key down', () => {
      const onKeyDown = jest.fn(() => ({ cancel: true }));
      const options = {};
      const scrollable = new Scrollable({ onKeyDown });
      scrollable.onWidgetKeyDown(options);
      expect(onKeyDown).toHaveBeenCalledTimes(1);
      expect(onKeyDown).toHaveBeenCalledWith(options);
    });

    it('should prevent key down event processing if onKeyDown event handler returns event.cancel="true"', () => {
      const onKeyDown = jest.fn(() => ({ cancel: true }));
      const options = { keyName: 'down' };
      const scrollable = new Scrollable({ onKeyDown });
      scrollable.onWidgetKeyDown(options);
      expect(onKeyDown).toBeCalled();
    });

    each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
      each(['leftArrow', 'upArrow', 'rightArrow', 'downArrow']).describe('Key: %o', (keyName) => {
        it(`should prevent default key down event by key - ${keyName}`, () => {
          const options = {
            originalEvent: {
              key: keyName,
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const helper = new ScrollableTestHelper({ direction });

          helper.viewModel.scrollByLine = jest.fn();
          helper.viewModel.onWidgetKeyDown(options);

          expect(options.originalEvent.preventDefault).toBeCalled();
          expect(options.originalEvent.stopPropagation).toBeCalled();
          expect(helper.viewModel.scrollByLine).toBeCalledTimes(1);
          expect(helper.viewModel.scrollByLine).toBeCalledWith({ [`${(keyName === 'upArrow' || keyName === 'downArrow') ? 'y' : 'x'}`]: (keyName === 'upArrow' || keyName === 'leftArrow') ? -1 : 1 });
        });

        each([1, 2, undefined]).describe('devicePixelRatio: %o', (pixelRatio) => {
          it(`should call scrollBy by ${keyName} key`, () => {
            const options = {
              originalEvent: {
                key: keyName,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
              },
            };
            const helper = new ScrollableTestHelper({ direction });

            helper.viewModel.tryGetDevicePixelRatio = () => pixelRatio;
            helper.viewModel.scrollBy = jest.fn();
            helper.viewModel.onWidgetKeyDown(options);

            const expectedParams = { top: 0, left: 0 };
            if (keyName === 'leftArrow') {
              expectedParams.left = -40 / (pixelRatio || 1);
            }
            if (keyName === 'rightArrow') {
              expectedParams.left = 40 / (pixelRatio || 1);
            }
            if (keyName === 'upArrow') {
              expectedParams.top = -40 / (pixelRatio || 1);
            }
            if (keyName === 'downArrow') {
              expectedParams.top = 40 / (pixelRatio || 1);
            }
            expect(helper.viewModel.scrollBy).toBeCalledTimes(1);
            expect(helper.viewModel.scrollBy).toBeCalledWith(expectedParams);
          });
        });
      });

      each(['pageUp', 'pageDown']).describe('Key: %o', (keyName) => {
        it(`should prevent default key down event by key - ${keyName}`, () => {
          const scrollByPageHandler = jest.fn();
          const options = {
            originalEvent: {
              key: keyName,
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.scrollByPage = scrollByPageHandler;
          helper.viewModel.onWidgetKeyDown(options);
          expect(options.originalEvent.preventDefault).toBeCalled();
          expect(options.originalEvent.stopPropagation).toBeCalled();
          expect(scrollByPageHandler).toBeCalledTimes(1);
          expect(scrollByPageHandler).toBeCalledWith(keyName === 'pageUp' ? -1 : 1);
        });

        it(`should call scrollBy by ${keyName} key`, () => {
          const scrollByHandler = jest.fn();
          const options = {
            originalEvent: {
              key: keyName,
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.scrollBy = scrollByHandler;
          helper.viewModel.onWidgetKeyDown(options);
          expect(scrollByHandler).toBeCalledTimes(1);
        });
      });

      it('should prevent default key down event by "home" key', () => {
        const options = {
          originalEvent: {
            key: 'home',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollToHome = jest.fn();
        helper.viewModel.onWidgetKeyDown(options);

        expect(options.originalEvent.preventDefault).toBeCalled();
        expect(options.originalEvent.stopPropagation).toBeCalled();
        expect(helper.viewModel.scrollToHome).toBeCalledTimes(1);
      });

      it('should scroll to start by "home" key', () => {
        const options = {
          originalEvent: {
            key: 'home',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollTo = jest.fn();
        helper.viewModel.onWidgetKeyDown(options);

        expect(helper.viewModel.scrollTo).toBeCalledTimes(1);
        expect(helper.viewModel.scrollTo).toBeCalledWith({ [`${direction === 'horizontal' ? 'left' : 'top'}`]: 0 });
      });

      it('should prevent default key down event by "end" key', () => {
        const options = {
          originalEvent: {
            key: 'end',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollToEnd = jest.fn();
        helper.viewModel.onWidgetKeyDown(options);
        expect(options.originalEvent.preventDefault).toBeCalled();
        expect(options.originalEvent.stopPropagation).toBeCalled();
        expect(helper.viewModel.scrollToEnd).toBeCalledTimes(1);
      });

      it('should scroll to end by "end" key', () => {
        const options = {
          originalEvent: {
            key: 'end',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollTo = jest.fn();
        helper.viewModel.onWidgetKeyDown(options);
        expect(helper.viewModel.scrollTo).toBeCalledTimes(1);
      });
    });

    it('should prevent default key down event by common keys down', () => {
      const scrollFunc = jest.fn();
      const options = {
        originalEvent: {
          key: 'A',
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        },
      };
      const helper = new ScrollableTestHelper({ });
      helper.viewModel.scrollToHome = scrollFunc;
      helper.viewModel.scrollToEnd = scrollFunc;
      helper.viewModel.scrollByLine = scrollFunc;
      helper.viewModel.scrollByPage = scrollFunc;
      helper.viewModel.onWidgetKeyDown(options);

      expect(options.originalEvent.preventDefault).not.toBeCalled();
      expect(options.originalEvent.stopPropagation).not.toBeCalled();
      expect(scrollFunc).toBeCalledTimes(0);
    });
  });

  describe('Action handlers', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    each([undefined, jest.fn()]).describe('handler: %o', (actionHandler) => {
      test.each([true, false])('refresh(), loadingIndicatorEnabled: %o', (loadingIndicatorEnabled) => {
        const helper = new ScrollableTestHelper({
          onPullDown: actionHandler,
        });

        helper.viewModel.loadingIndicatorEnabled = loadingIndicatorEnabled;

        helper.viewModel.refresh();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, ['onPullDown'], [[{}]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }
        expect(helper.viewModel.topPocketState).toEqual(TopPocketState.STATE_READY);
        expect(helper.viewModel.loadingIndicatorEnabled).toEqual(loadingIndicatorEnabled);
        expect(helper.viewModel.isLoadPanelVisible).toEqual(loadingIndicatorEnabled);
        expect(helper.viewModel.locked).toEqual(true);
      });

      test.each([true, false])('update(), updateManually: %o', (updateManually) => {
        const helper = new ScrollableTestHelper({
          onUpdated: actionHandler,
          updateManually,
        });

        helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));
        helper.viewModel.updateSizes = jest.fn();
        helper.viewModel.update();

        if (!updateManually) {
          expect(helper.viewModel.updateSizes).toBeCalledTimes(1);
          if (actionHandler) {
            helper.checkActionHandlerCalls(expect, ['onUpdated'], [[{ fakeEventArg: { value: 5 } }]]);
          } else {
            helper.checkActionHandlerCalls(expect, [], []);
          }
        } else {
          expect(helper.viewModel.updateSizes).toBeCalledTimes(0);
        }
      });

      test.each(['onBounce', 'onStart', 'onStop', 'onEnd', 'onUpdated'])('actionName: %o', (action) => {
        const helper = new ScrollableTestHelper({
          [`${action}`]: actionHandler,
        });

        helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

        helper.viewModel[action]();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, [action], [[{ fakeEventArg: { value: 5 } }]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }
      });

      it('onPullDown()', () => {
        const helper = new ScrollableTestHelper({
          onPullDown: actionHandler,
        });

        helper.viewModel.onPullDown();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, ['onPullDown'], [[{}]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }

        expect(helper.viewModel.loadingIndicatorEnabled).toEqual(false);
        expect(helper.viewModel.isLoadPanelVisible).toEqual(false);
        expect(helper.viewModel.locked).toEqual(true);
      });

      it('onReachBottom()', () => {
        const helper = new ScrollableTestHelper({
          onReachBottom: actionHandler,
        });

        helper.viewModel.onReachBottom();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, ['onReachBottom'], [[{}]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }

        expect(helper.viewModel.loadingIndicatorEnabled).toEqual(false);
        expect(helper.viewModel.isLoadPanelVisible).toEqual(false);
        expect(helper.viewModel.locked).toEqual(true);
      });

      it('onRelease()', () => {
        const helper = new ScrollableTestHelper({
          onUpdated: actionHandler,
        });

        helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

        helper.viewModel.onRelease();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, ['onUpdated'], [[{ fakeEventArg: { value: 5 } }]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }
        expect(helper.viewModel.loadingIndicatorEnabled).toEqual(true);
        expect(helper.viewModel.isLoadPanelVisible).toEqual(false);
        expect(helper.viewModel.locked).toEqual(false);
      });
    });
  });

  describe('Public methods', () => {
    each([true, false]).describe('Disabled: %o', (disabled) => {
      it('unlock()', () => {
        const viewModel = new Scrollable({ disabled });
        viewModel.locked = true;

        viewModel.unlock();

        expect(viewModel.locked).toEqual(!!disabled);
      });
    });

    describe('ScrollTo', () => {
      each(optionValues.direction).describe('Direction: %o', (direction) => {
        each([false]).describe('rtlEnabled: %o', (rtlEnabled) => { // TODO: rtl = true
          each([
            [{ top: 50, left: 50 }, 20, {
              top: 20, left: 20, translateTop: 10, translateLeft: 10,
            }],
            [{ top: 50, left: 50 }, { top: 20, left: 15 }, {
              top: 20, left: 15, translateTop: 10, translateLeft: 7.5,
            }],
            [{ top: 50, left: 50 }, -50, {
              top: -0, left: -0, translateTop: 0, translateLeft: 0,
            }],
            [{ top: 50, left: 50 }, { top: 20, left: -15 }, {
              top: 20, left: -0, translateTop: 10, translateLeft: 0,
            }],
            [{ top: 50, left: 50 }, 1000, {
              top: 100, left: 100, translateTop: 50, translateLeft: 50,
            }],
            [{ top: 50, left: 50 }, { top: 30 }, {
              top: 30, left: 50, translateTop: 15, translateLeft: 25,
            }],
            [{ top: 50, left: 50 }, { left: 30 }, {
              top: 50, left: 30, translateTop: 25, translateLeft: 15,
            }],
            [{ top: 50, left: 50 }, undefined, {
              top: 50, left: 50, translateTop: 25, translateLeft: 25,
            }],
            [{ top: 50, left: 50 }, {}, {
              top: 50, left: 50, translateTop: 25, translateLeft: 25,
            }],
          ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollToValue, expected) => {
            it(`ScrollTo(${JSON.stringify(scrollToValue)})`, () => {
              const helper = new ScrollableTestHelper({
                direction,
                rtlEnabled,
                contentSize: 100,
                containerSize: 200,
              });
              helper.viewModel.triggerScrollEvent = jest.fn();

              helper.initScrollbarSettings();
              helper.initContainerPosition(initialScrollPosition);

              helper.viewModel.scrollTo(scrollToValue);
              helper.callScrollbarMethod('updateContent');

              const { translateLeft, translateTop, ...expectedScrollOffset } = expected;
              expectedScrollOffset.top = helper.isVertical ? expected.top : initialScrollPosition.top;
              expectedScrollOffset.left = helper.isHorizontal ? expected.left : initialScrollPosition.left;

              expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
              helper.checkContainerPosition(expect, expectedScrollOffset);
              helper.checkScrollTransform(expect, { vertical: `translate(0px, ${translateTop}px)`, horizontal: `translate(${translateLeft}px, 0px)` });
            });
          });

          each([
            [{ top: 50, left: 40 }, 20, {
              top: 70, left: 60, translateTop: 35, translateLeft: 30,
            }],
            [{ top: 50, left: 40 }, { top: 20, left: 15 }, {
              top: 70, left: 55, translateTop: 35, translateLeft: 27.5,
            }],
            [{ top: 50, left: 40 }, -15, {
              top: 35, left: 25, translateTop: 17.5, translateLeft: 12.5,
            }],
            [{ top: 50, left: 40 }, { top: -20, left: 15 }, {
              top: 30, left: 55, translateTop: 15, translateLeft: 27.5,
            }],
            [{ top: 50, left: 40 }, -1000, {
              top: -0, left: -0, translateTop: 0, translateLeft: 0,
            }],
            [{ top: 50, left: 40 }, 1000, {
              top: 100, left: 100, translateTop: 50, translateLeft: 50,
            }],
            [{ top: 50, left: 40 }, undefined, {
              top: 50, left: 40, translateTop: 25, translateLeft: 20,
            }],
            [{ top: 40, left: 50 }, {}, {
              top: 40, left: 50, translateTop: 20, translateLeft: 25,
            }],
          ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollByValue, expected) => {
            it(`scrollBy(${JSON.stringify(scrollByValue)})`, () => {
              const helper = new ScrollableTestHelper({
                direction,
                rtlEnabled,
                contentSize: 100,
                containerSize: 200,
              });
              helper.viewModel.triggerScrollEvent = jest.fn();

              helper.initScrollbarSettings();
              helper.initContainerPosition(initialScrollPosition);

              helper.viewModel.scrollBy(scrollByValue);
              helper.callScrollbarMethod('updateContent');

              const { translateLeft, translateTop, ...expectedScrollOffset } = expected;
              expectedScrollOffset.top = helper.isVertical ? expected.top : initialScrollPosition.top;
              expectedScrollOffset.left = helper.isHorizontal ? expected.left : initialScrollPosition.left;

              expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
              helper.checkContainerPosition(expect, expectedScrollOffset);
              helper.checkScrollTransform(expect, { vertical: `translate(0px, ${translateTop}px)`, horizontal: `translate(${translateLeft}px, 0px)` });
            });
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

    describe('pocketStateChange(state)', () => {
      it('should set correct topPocketState', () => {
        const viewModel = new Scrollable({});

        viewModel.pocketStateChange(TopPocketState.STATE_REFRESHING);
        expect(viewModel.topPocketState).toEqual(2);

        viewModel.pocketStateChange(TopPocketState.STATE_READY);
        expect(viewModel.topPocketState).toEqual(1);

        viewModel.pocketStateChange(TopPocketState.STATE_RELEASED);
        expect(viewModel.topPocketState).toEqual(0);

        viewModel.pocketStateChange(TopPocketState.STATE_LOADING);
        expect(viewModel.topPocketState).toEqual(3);
      });
    });

    describe('isContent', () => {
      it('element is scrollable container', () => {
        const viewModel = new Scrollable({ direction: 'vertical' });
        (viewModel as any).contentRef = React.createRef();
        (viewModel as any).containerRef = React.createRef();
        (viewModel as any).scrollableRef = React.createRef();
        (viewModel as any).horizontalScrollbarRef = React.createRef();
        (viewModel as any).verticalScrollbarRef = React.createRef();

        const scrollable = mount(ScrollableComponent(viewModel as any) as JSX.Element);
        viewModel.scrollableRef.current = scrollable.getDOMNode() as HTMLDivElement;

        expect(viewModel.isContent(scrollable.find('.dx-scrollable-container').getDOMNode())).toBe(true);
      });

      it('element is scrollbar', () => {
        const viewModel = new Scrollable({ direction: 'vertical' });
        (viewModel as any).contentRef = React.createRef();
        (viewModel as any).containerRef = React.createRef();
        (viewModel as any).scrollableRef = React.createRef();
        (viewModel as any).horizontalScrollbarRef = React.createRef();
        (viewModel as any).verticalScrollbarRef = React.createRef();

        const scrollable = mount(ScrollableComponent(viewModel as any) as JSX.Element);
        viewModel.scrollableRef.current = scrollable.getDOMNode() as HTMLDivElement;

        expect(viewModel.isContent(scrollable.find('.dx-scrollable-scrollbar').getDOMNode())).toBe(true);
      });

      it('element is not inside scrollable', () => {
        const viewModel = new Scrollable({ direction: 'vertical' });
        (viewModel as any).contentRef = React.createRef();
        (viewModel as any).containerRef = React.createRef();
        (viewModel as any).scrollableRef = React.createRef();
        (viewModel as any).horizontalScrollbarRef = React.createRef();
        (viewModel as any).verticalScrollbarRef = React.createRef();

        mount(ScrollableComponent(viewModel as any) as JSX.Element);
        expect(viewModel.isContent(mount(<div />).getDOMNode())).toBe(false);
      });
    });
  });
});

describe('Simulated > Logic', () => {
  describe('Getters', () => {
    describe('cssClasses', () => {
      each(['android', 'ios', 'generic']).describe('Platform: %o', (platform) => {
        it('scrollable css classes by default', () => {
          devices.real = () => ({ platform });
          const instance = new Scrollable({});
          expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable'));
          expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
        });
      });

      each(optionValues.direction).describe('Direction: %o', (direction) => {
        each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
          it('scrollable css classes', () => {
            const instance = new Scrollable({
              showScrollbar,
              direction,
            });

            const hasScrollbarsAlwaysVisibleClass = showScrollbar === 'always';
            const hasScrollbarsHiddenClass = !showScrollbar;

            expect(instance.cssClasses).toEqual(hasScrollbarsAlwaysVisibleClass
              ? expect.stringMatching(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE)
              : expect.not.stringMatching(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE));

            expect(instance.cssClasses).toEqual(hasScrollbarsHiddenClass
              ? expect.stringMatching(SCROLLABLE_SCROLLBARS_HIDDEN)
              : expect.not.stringMatching(SCROLLABLE_SCROLLBARS_HIDDEN));

            expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
          });
        });
      });

      each([true, false]).describe('hasWindow: %o', (hasWindow) => {
        it('scaleRatioHeight()', () => {
          const viewModel = new Scrollable({});

          setWindow({ devicePixelRatio: 1 }, hasWindow);

          viewModel.containerRef = {
            current: {
              clientHeight: 100,
              offsetHeight: 100,
            },
          } as RefObject<HTMLDivElement>;

          expect(viewModel.scaleRatioHeight).toEqual(1);
        });

        it('scaleRatioWidth()', () => {
          const viewModel = new Scrollable({});

          setWindow({ devicePixelRatio: 1 }, hasWindow);

          viewModel.containerRef = {
            current: {
              clientWidth: 100,
              offsetWidth: 100,
            },
          } as RefObject<HTMLDivElement>;

          expect(viewModel.scaleRatioWidth).toEqual(1);
        });
      });
    });
  });
});
