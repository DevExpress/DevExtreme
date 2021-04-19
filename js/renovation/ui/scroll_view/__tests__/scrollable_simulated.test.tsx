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
  createContainerRef,
  optionValues,
  getPermutations,
} from './utils';

import {
  ScrollableProps,
} from '../scrollable_props';

import { ScrollableTestHelper } from './scrollable_simulated_test_helper';

const testBehavior = { positive: false };
jest.mock('../utils/get_translate_values');
jest.mock('../../../../core/utils/scroll_rtl_behavior', () => () => testBehavior);
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
      contentTranslateOffset: {
        left: 0,
        top: 0,
      },
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
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.adjustDistance = jest.fn();
          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.scrollBy(scrollByValues.actual);
          helper.callScrollbarMethod('updateContent');

          helper.checkValidDirection(expect, {
            horizontal: true,
            vertical: true,
          }, {});

          helper.checkActionHandlerCalls(expect, ['onStart', 'onEnd'], [[{ fakeEventArg: { value: 5 } }], [{ fakeEventArg: { value: 5 } }]]);
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
            helper.initScrollbarLocation({ top: scrollbarPosition, left: scrollbarPosition });

            const e = { ...defaultEvent, delta };

            const expectedValidationResult = (scrollbarPosition < 0 && delta > 0)
                || (scrollbarPosition >= 0 && delta < 0) || scrollbarPosition === -50;

            expect(helper.viewModel.validateWheelTimer).toBe(undefined);

            const actualResult = helper.viewModel.validateWheel(e);
            expect(actualResult).toBe(expectedValidationResult);

            if (!expectedValidationResult) {
              expect(helper.viewModel.validateWheelTimer === undefined).toBe(true);
            } else {
              expect(helper.viewModel.validateWheelTimer === undefined).toBe(false);
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

      each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
        each([true, false]).describe('PullDownEnabled: %o', (pullDownEnabled) => {
          each([true, false]).describe('ReachBottomEnabled: %o', (reachBottomEnabled) => {
            each([
              [{ top: -81, left: -81 }, {
                scrollOffset: { top: -81, left: -81 },
                reachedTop: true,
                reachedBottom: false,
                reachedLeft: true,
                reachedRight: false,
              }],
              [{ top: -1, left: -1 }, {
                scrollOffset: { top: -1, left: -1 },
                reachedTop: true,
                reachedBottom: false,
                reachedLeft: true,
                reachedRight: false,
              }],
              [{ top: 0, left: 0 }, {
                scrollOffset: { top: 0, left: 0 },
                reachedTop: true,
                reachedBottom: false,
                reachedLeft: true,
                reachedRight: false,
              }],
              [{ top: 1, left: 1 }, {
                scrollOffset: { top: 1, left: 1 },
                reachedTop: false,
                reachedBottom: false,
                reachedLeft: false,
                reachedRight: false,
              }],
              [{ top: 99, left: 99 }, {
                scrollOffset: { top: 99, left: 99 },
                reachedTop: false,
                reachedBottom: false,
                reachedLeft: false,
                reachedRight: false,
              }],
              [{ top: 100, left: 100 }, {
                scrollOffset: { top: 100, left: 100 },
                reachedTop: false,
                reachedBottom: !forceGeneratePockets || !reachBottomEnabled,
                reachedLeft: false,
                reachedRight: true,
              }],
              [{ top: 101, left: 101 }, {
                scrollOffset: { top: 101, left: 101 },
                reachedTop: false,
                reachedBottom: !forceGeneratePockets || !reachBottomEnabled,
                reachedLeft: false,
                reachedRight: true,
              }],
              [{ top: 154, left: 154 }, {
                scrollOffset: { top: 154, left: 154 },
                reachedTop: false,
                reachedBottom: !forceGeneratePockets || !reachBottomEnabled,
                reachedLeft: false,
                reachedRight: true,
              }],
              [{ top: 155, left: 155 }, {
                scrollOffset: { top: 155, left: 155 },
                reachedTop: false,
                reachedBottom: true,
                reachedLeft: false,
                reachedRight: true,
              }],
              [{ top: 156, left: 156 }, {
                scrollOffset: { top: 156, left: 156 },
                reachedTop: false,
                reachedBottom: true,
                reachedLeft: false,
                reachedRight: true,
              }],
            ]).describe('ScrollOffset: %o', (scrollOffset, expected) => {
              it('emit "dxscroll" event with correct arguments', () => {
                const e = { ...defaultEvent };
                const helper = new ScrollableTestHelper({
                  direction,
                  pullDownEnabled,
                  reachBottomEnabled,
                  forceGeneratePockets,
                });

                helper.viewModel.eventForUserAction = e;

                helper.initScrollbarSettings();
                helper.initContainerPosition(scrollOffset);

                helper.viewModel.scrollEffect();
                emit('scroll');

                const expectedArgs = expected;
                expectedArgs.event = { ...defaultEvent };

                if (helper.direction === 'vertical') {
                  delete expectedArgs.reachedLeft;
                  delete expectedArgs.reachedRight;
                } else if (helper.direction === 'horizontal') {
                  delete expectedArgs.reachedTop;
                  delete expectedArgs.reachedBottom;
                }

                helper.checkActionHandlerCalls(expect, ['onScroll'], [[expectedArgs]]);
              });
            });
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

      it('update()', () => {
        const helper = new ScrollableTestHelper({
          onUpdated: actionHandler,
        });

        helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));
        helper.viewModel.updateSizes = jest.fn();
        helper.viewModel.update();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, ['onUpdated'], [[{ fakeEventArg: { value: 5 } }]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
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

  describe('Methods', () => {
    each([true, false]).describe('Disabled: %o', (disabled) => {
      it('unlock()', () => {
        const viewModel = new Scrollable({ disabled });
        viewModel.locked = true;

        viewModel.unlock();

        expect(viewModel.locked).toEqual(!!disabled);
      });
    });

    describe('ScrollBy', () => {
      each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
        it('should scroll by positive distance as number', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 40 });
          helper.initScrollbarLocation({ top: -50, left: -40 });

          helper.viewModel.scrollBy(20);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 70 : 50,
            left: helper.isHorizontal ? 60 : 40,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${35}px)`, horizontal: `translate(${60 / 2}px, 0px)` });
        });

        it('should scroll by positive distance as object', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 40 });
          helper.initScrollbarLocation({ top: -50, left: -40 });

          helper.viewModel.scrollBy({ top: 20, left: 15 });
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 70 : 50,
            left: helper.isHorizontal ? 55 : 40,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${70 / 2}px)`, horizontal: `translate(${55 / 2}px, 0px)` });
        });

        it('should scroll by negative distance as number', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 40 });
          helper.initScrollbarLocation({ top: -50, left: -40 });

          helper.viewModel.scrollBy(-15);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 35 : 50,
            left: helper.isHorizontal ? 25 : 40,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${35 / 2}px)`, horizontal: `translate(${25 / 2}px, 0px)` });
        });

        it('should scroll by mix distance as object', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 40 });
          helper.initScrollbarLocation({ top: -50, left: -40 });

          helper.viewModel.scrollBy({ top: -20, left: 15 });
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 30 : 50,
            left: helper.isHorizontal ? 55 : 40,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${30 / 2}px)`, horizontal: `translate(${55 / 2}px, 0px)` });
        });

        it('should scroll by mix distance as object to behind min boundary', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 40 });
          helper.initScrollbarLocation({ top: -50, left: -40 });

          helper.viewModel.scrollBy(-1000);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? -0 : 50,
            left: helper.isHorizontal ? -0 : 40,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${0}px)`, horizontal: `translate(${0}px, 0px)` });
        });

        it('should scroll by mix distance as object to upper max boundary', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 40 });
          helper.initScrollbarLocation({ top: -50, left: -40 });

          helper.viewModel.scrollBy(1000);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 100 : 50,
            left: helper.isHorizontal ? 100 : 40,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${100 / 2}px)`, horizontal: `translate(${100 / 2}px, 0px)` });
        });
      });
    });

    describe('ScrollTo', () => {
      each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
        it('should scroll by positive distance as number', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 50 });
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.scrollTo(20);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 20 : 50,
            left: helper.isHorizontal ? 20 : 50,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${20 / 2}px)`, horizontal: `translate(${20 / 2}px, 0px)` });
        });

        it('should scroll by positive distance as object', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 50 });
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.scrollTo({ top: 20, left: 15 });
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 20 : 50,
            left: helper.isHorizontal ? 15 : 50,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${20 / 2}px)`, horizontal: `translate(${15 / 2}px, 0px)` });
        });

        it('should scroll by negative distance as number', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 50 });
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.scrollTo(-15);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? -0 : 50,
            left: helper.isHorizontal ? -0 : 50,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${0 / 2}px)`, horizontal: `translate(${0 / 2}px, 0px)` });
        });

        it('should scroll by mix distance as object', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 50 });
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.scrollTo({ top: 20, left: -15 });
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 20 : 50,
            left: helper.isHorizontal ? -0 : 50,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${20 / 2}px)`, horizontal: `translate(${0}px, 0px)` });
        });

        it('should scroll by mix distance as object to behind min boundary', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 50 });
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.scrollTo(-1000);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? -0 : 50,
            left: helper.isHorizontal ? -0 : 50,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${0}px)`, horizontal: `translate(${0}px, 0px)` });
        });

        it('should scroll by mix distance as object to upper max boundary', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.containerRef = helper.getContainerRefMock({});
          helper.viewModel.triggerScrollEvent = jest.fn();

          helper.initScrollbarSettings();
          helper.initContainerPosition({ top: 50, left: 50 });
          helper.initScrollbarLocation({ top: -50, left: -50 });

          helper.viewModel.scrollTo(1000);
          helper.callScrollbarMethod('updateContent');

          helper.checkContainerPosition(expect, {
            top: helper.isVertical ? 100 : 50,
            left: helper.isHorizontal ? 100 : 50,
          });

          helper.checkScrollTransform(expect, { vertical: `translate(0px, ${100 / 2}px)`, horizontal: `translate(${100 / 2}px, 0px)` });
        });
      });
    });

    // describe('ScrollToElement', () => {

    each([undefined, null]).describe('scrollbarSize: %o', (fakeElement) => {
      it('should not be exepted when element is not exist', () => {
        const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);

        scrollable.scrollToElement(fakeElement, {});

        expect(true).toEqual(true);
      });
    });

    // each([5, 10, 20]).describe('scrollbarSize: %o' , (scrollBarSize) => {
    // each('horizontal', 'vertical', 'both').describe('Direction: %o', (direction) => {
    // each([undefined, {
    //   left: 10, right: 20, top: 10, bottom: 20,
    // }]).describe('Element is smaller than container. Offset: %o', (offset) => {
    it('should not scroll if element inside container', () => {
      const helper = new ScrollableTestHelper({ direction: 'vertical' });
      const element = {
        offsetWidth: 20,
        offsetHeight: 20,
        scrollTop: 140,
        scrollLeft: 140,
        offsetTop: 140,
        offsetLeft: 140,
        offsetParent: { matches: () => true },
      } as any;

      element.closest = () => true;
      element.matches = () => false;

      helper.initScrollbarSettings({
        props: { containerSize: 100, contentSize: 300 },
      });
      helper.initContainerPosition({ top: 100, left: 100 });
      helper.initScrollbarLocation({ top: -100, left: -100 });

      helper.viewModel.scrollToElement(element);

      helper.checkContainerPosition(expect, {
        top: 100,
        left: 100,
      });
    });

    // it('should scroll to element from top side by vertical direction', () => {
    //   const element = createTargetElement({ location: { top: 20, left: 0 } });
    //   const containerRef = createContainerRef({ top: 200, left: 0 },
    //     direction, scrollBarSize);

    //   const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
    //   scrollable.containerRef = containerRef;
    //   scrollable.eventHandler = jest.fn();
    //   (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //   scrollable.scrollToElement(element, offset);

    //   expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //   expect(containerRef.scrollLeft).toEqual(0);
    // });

    //   it('should scroll to element from bottom side by vertical direction.', () => {
    //     const element = createTargetElement({ location: { top: 500, left: 0 } });
    //     const containerRef = createContainerRef({ top: 100, left: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     const scrollOffset = direction === 'vertical' || direction === 'both'
    //       ? scrollBarSize
    //       : 0;

    //     expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollOffset);
    //     expect(containerRef.scrollLeft).toEqual(0);
    //   });

    //   it('should scroll to element from left side by horizontal direction', () => {
    //     const element = createTargetElement({ location: { left: 20, top: 0 } });
    //     const containerRef = createContainerRef({ left: 200, top: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     const expectedLeft = element.offsetLeft - getOffsetValue('left', offset);
    //     expect(containerRef.scrollLeft).toEqual(expectedLeft);
    //     expect(containerRef.scrollTop).toEqual(0);
    //   });

    //   it('should scroll to element from right side by horizontal direction', () => {
    //     const element = createTargetElement({ location: { left: 500, top: 0 } });
    //     const containerRef = createContainerRef({ left: 100, top: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     const scrollOffset = direction === 'horizontal' || direction === 'both'
    //       ? scrollBarSize
    //       : 0;
    //     expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollOffset);
    //     expect(containerRef.scrollTop).toEqual(0);
    //   });

    //   it('should scroll to element from left side and top side by both direction', () => {
    //     const element = createTargetElement({ location: { left: 20, top: 20 } });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };
    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
    //     expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //   });

    //   it('should scroll to element from right side and top side by both direction', () => {
    //     const element = createTargetElement({ location: { left: 500, top: 20 } });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
    //     expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //   });

    //   it('should scroll to element from left side and bottom side by both direction', () => {
    //     const element = createTargetElement({ location: { left: 20, top: 500 } });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
    //     expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
    //   });

    //   it('should scroll to element from right side and bottom side by both direction', () => {
    //     const element = createTargetElement({ location: { left: 500, top: 500 } });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
    //     expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
    //   });

    //   it('should do not scroll to an element when it in the visible area', () => {
    //     const element = createTargetElement({ location: { top: 200, left: 200 } });
    //     const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollTop).toEqual(100);
    //     expect(containerRef.scrollLeft).toEqual(100);
    //   });
    // });

    /* eslint-disable jest/no-identical-title */
    // each(offsets).describe(`Element larger than container. Offset: %o, scrollbarSize: ${scrollBarSize}, direction: ${direction}`, (offset) => {
    //   it('should scroll to element from top side by vertical direction', () => {
    //     const element = createTargetElement({
    //       location: { top: 20, left: 0 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ top: 200, left: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     const scrollOffset = direction === 'vertical' || direction === 'both'
    //       ? scrollBarSize
    //       : 0;
    //     expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollOffset);
    //     expect(containerRef.scrollLeft).toEqual(0);
    //   });

    //   it('should scroll to element from bottom side by vertical direction', () => {
    //     const element = createTargetElement({
    //       location: { top: 500, left: 0 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ top: 100, left: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //     expect(containerRef.scrollLeft).toEqual(0);
    //   });

    //   it('should scroll to element from left side by horizontal direction', () => {
    //     const element = createTargetElement({
    //       location: { left: 20, top: 0 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ left: 200, top: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     const scrollOffset = direction === 'horizontal' || direction === 'both'
    //       ? scrollBarSize
    //       : 0;
    //     expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollOffset);
    //     expect(containerRef.scrollTop).toEqual(0);
    //   });

    //   it('should scroll to element from right side by horizontal direction', () => {
    //     const element = createTargetElement({
    //       location: { left: 500, top: 0 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ left: 100, top: 0 },
    //       direction, scrollBarSize);

    //     const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
    //     expect(containerRef.scrollTop).toEqual(0);
    //   });

    //   it('should scroll to element from left side and top side by both direction', () => {
    //     const element = createTargetElement({
    //       location: { left: 20, top: 20 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
    //     expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
    //   });

    //   it('should scroll to element from right side and top side by both direction', () => {
    //     const element = createTargetElement({
    //       location: { left: 500, top: 20 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
    //     expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
    //   });

    //   it('should scroll to element from left side and bottom side by both direction', () => {
    //     const element = createTargetElement({
    //       location: { left: 20, top: 500 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
    //     expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //   });

    //   it('should scroll to element from right side and bottom side by both direction', () => {
    //     const element = createTargetElement({
    //       location: { left: 500, top: 500 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
    //     expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //   });

    //   it('should do not scroll to an element when it in the visible area', () => {
    //     const element = createTargetElement({
    //       location: { left: 200, top: 200 },
    //       width: 400,
    //       height: 400,
    //     });
    //     const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element, offset);

    //     expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
    //     expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
    //   });
    // });
    // });

    // describe('Other scenarios', () => {
    //   it('it should scroll to element when it is located inside the positioned element', () => {
    //     const content = createElement({
    //       location: {},
    //       className: SCROLLABLE_CONTENT_CLASS,
    //     });
    //     const parent = createElement({
    //       location: { top: 250, left: 250 },
    //       offsetParent: content,
    //     });
    //     const element = createElement({
    //       location: { top: 200, left: 200 },
    //       offsetParent: parent,
    //       isInScrollableContent: true,
    //     });
    //     const containerRef = createContainerRef({ top: 100, left: 100 }, 'both');
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element);

    //     expect(containerRef.scrollTop).toEqual(217);
    //     expect(containerRef.scrollLeft).toEqual(217);
    //   });

    //   it('it should not scroll to element when it is not located inside the scrollable content', () => {
    //     const element = createElement({ location: { top: 200, left: 200 } });
    //     const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', undefined);
    //     const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
    //     scrollable.containerRef = containerRef;
    //     scrollable.eventHandler = jest.fn();
    //     (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //     scrollable.scrollToElement(element);

    //     expect(containerRef.scrollTop).toEqual(100);
    //     expect(containerRef.scrollLeft).toEqual(100);
    //   });
    // });
    // });

    // describe('rtlEnabled', () => {
    //   describe('Element is smaller than container. rtlEnabled: true', () => {
    //     it('should scroll to element from right side by horizontal direction', () => {
    //       const element = createTargetElement({ location: { top: 0, left: -320 } });
    //       const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

    //       const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
    //       scrollable.containerRef = containerRef;
    //       scrollable.eventHandler = jest.fn();
    //       (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //       scrollable.scrollToElement(element);
    //       expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
    //     });

    //     it('should scroll to element from left side by horizontal direction', () => {
    //       const element = createTargetElement({ location: { top: 0, left: 0 } });
    //       const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

    //       const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
    //       scrollable.containerRef = containerRef;
    //       scrollable.eventHandler = jest.fn();
    //       (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //       scrollable.scrollToElement(element);
    //       expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
    //     });

    //     it('should scroll to element from right side by horizontal direction for IE', () => {
    //       testBehavior.positive = true;
    //       const element = createTargetElement({ location: { top: 0, left: -320 } });
    //       const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

    //       const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
    //       scrollable.containerRef = containerRef;
    //       scrollable.eventHandler = jest.fn();
    //       (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //       scrollable.scrollToElement(element);
    //       expect(containerRef.scrollLeft).toEqual(element.offsetLeft * -1);
    //       testBehavior.positive = false;
    //     });
    //   });

    //   describe('Element is larger than container. rtlEnabled: true', () => {
    //     it('should scroll to element from right side by horizontal direction', () => {
    //       const element = createTargetElement({
    //         location: {
    //           top: 0, left: -320, width: 400, height: 400,
    //         },
    //       });
    //       const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

    //       const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
    //       scrollable.containerRef = containerRef;
    //       scrollable.eventHandler = jest.fn();
    //       (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //       scrollable.scrollToElement(element);
    //       expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
    //     });

    //     it('should scroll to element from left side by horizontal direction', () => {
    //       const element = createTargetElement({
    //         location: {
    //           top: 0, left: 0, width: 400, height: 400,
    //         },
    //       });
    //       const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

    //       const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
    //       scrollable.containerRef = containerRef;
    //       scrollable.eventHandler = jest.fn();
    //       (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

    //       scrollable.scrollToElement(element);
    //       expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
    //     });
    //   });
    //   });
    // });

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
        scrollable.contentRef = { current: { } } as RefObject<HTMLDivElement>;

        expect(scrollable.scrollOffset()).toEqual({
          left: location.left,
          top: location.top,
        });
      });

      it('should get scroll top', () => {
        const scrollable = new Scrollable({});
        scrollable.containerRef = createContainerRef({ left: 130, top: 560 });
        scrollable.contentRef = { current: { } } as RefObject<HTMLDivElement>;

        expect(scrollable.scrollTop()).toEqual(560);
      });

      it('should get scroll left', () => {
        const scrollable = new Scrollable({});

        scrollable.containerRef = createContainerRef({ left: 130, top: 560 });
        scrollable.contentRef = { current: { } } as RefObject<HTMLDivElement>;

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

      each(['horizontal', 'vertical', 'both']).describe('Direction: %o', (direction) => {
        each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (showScrollbar) => {
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
