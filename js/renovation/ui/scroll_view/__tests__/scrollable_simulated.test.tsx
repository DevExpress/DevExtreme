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
  it('render with defaults', () => {
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
    each([{ top: 120, left: -200 }, { top: -60, left: 40 }]).describe('contentTranslateOffset: %o', (contentTranslateOffset) => {
      it('contentStyles()', () => {
        const helper = new ScrollableTestHelper({ direction });

        let expectedContentTransformStyle = 'translate(0px, 0px)';

        if (direction === 'horizontal') {
          helper.viewModel.hContentTranslateOffset = contentTranslateOffset.left;
          expectedContentTransformStyle = `translate(${contentTranslateOffset.left}px, 0px)`;
        }
        if (direction === 'vertical') {
          helper.viewModel.vContentTranslateOffset = contentTranslateOffset.top;
          expectedContentTransformStyle = `translate(0px, ${contentTranslateOffset.top}px)`;
        }
        if (direction === 'both') {
          helper.viewModel.vContentTranslateOffset = contentTranslateOffset.top;
          helper.viewModel.hContentTranslateOffset = contentTranslateOffset.left;
          expectedContentTransformStyle = `translate(${contentTranslateOffset.left}px, ${contentTranslateOffset.top}px)`;
        }

        expect(helper.viewModel.contentStyles)
          .toEqual({ transform: expectedContentTransformStyle });
      });

      each([30, 40, -20]).describe('contentTranslateOffset: %o', (translateOffsetValue) => {
        it('contentStyles() after contentTranslateOffsetChange()', () => {
          const helper = new ScrollableTestHelper({ direction });

          helper.viewModel.vContentTranslateOffset = contentTranslateOffset.top;
          helper.viewModel.hContentTranslateOffset = contentTranslateOffset.left;

          const expectedTranslateOffset = contentTranslateOffset;
          if (helper.isVertical) {
            helper.viewModel.contentTranslateOffsetChange('top', translateOffsetValue);
            expectedTranslateOffset.top = translateOffsetValue;
          }

          if (helper.isHorizontal) {
            helper.viewModel.contentTranslateOffsetChange('left', translateOffsetValue);
            expectedTranslateOffset.left = translateOffsetValue;
          }

          expect(helper.viewModel.contentStyles).toEqual({ transform: `translate(${expectedTranslateOffset.left}px, ${expectedTranslateOffset.top}px)` });
        });
      });
    });

    each([true, false]).describe('AllowVertical: %o', (allowVertical) => {
      each([true, false]).describe('AllowHorizontal: %o', (allowHorizontal) => {
        it('containerStyles()', () => {
          const helper = new ScrollableTestHelper({ direction });

          Object.defineProperties(helper.viewModel, {
            allowedDirections: {
              get() { return ({ vertical: allowVertical, horizontal: allowHorizontal }); },
            },
          });

          let expectedTouchAction = '';
          if (allowVertical) {
            expectedTouchAction = 'pan-x';
          }
          if (allowHorizontal) {
            expectedTouchAction = 'pan-y';
          }
          if (allowVertical && allowHorizontal) {
            expectedTouchAction = 'none';
          }

          expect(helper.viewModel.containerStyles).toEqual({ touchAction: expectedTouchAction });
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
  it('updateHandler()', () => {
    const helper = new ScrollableTestHelper({});

    helper.viewModel.update = jest.fn();

    helper.viewModel.updateHandler();

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
    ]))('Should assign swipeDown, pullDown strategy, forceGeneratePockets: %o, pullDownEnabled: %o, reachBottomEnabled: %o',
      (forceGeneratePockets, pullDownEnabled, reachBottomEnabled) => {
        const viewModel = new Scrollable({
          forceGeneratePockets,
          pullDownEnabled,
          reachBottomEnabled,
        });

        viewModel.scrollableOffsetLeft = 5;
        viewModel.scrollableOffsetLeft = 7;

        viewModel.containerClientWidth = 1;
        viewModel.containerClientHeight = 2;

        viewModel.contentClientWidth = 5;
        viewModel.contentClientHeight = 6;
        viewModel.contentScrollWidth = 7;
        viewModel.contentScrollHeight = 8;

        viewModel.topPocketClientHeight = 11;
        viewModel.bottomPocketClientHeight = 12;

        viewModel.prevContainerClientWidth = 13;
        viewModel.prevContainerClientHeight = 14;
        viewModel.prevContentClientWidth = 15;
        viewModel.prevContentClientHeight = 16;

        Object.defineProperties(viewModel, {
          scrollableOffset: { get() { return { left: 10, top: 20 }; } },
        });

        [-50, 0, 50].forEach((vScrollLocation) => {
          [true, false].forEach((elementRefExist) => {
            viewModel.vScrollLocation = vScrollLocation;

            const containerRef = {
              current: elementRefExist ? {
                clientWidth: 10,
                clientHeight: 20,
                scrollLeft: 150,
                scrollTop: 200,
              } : null,
            } as RefObject;

            const contentRef = {
              current: elementRefExist ? {
                clientWidth: 50,
                clientHeight: 60,
                scrollWidth: 70,
                scrollHeight: 80,
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

            viewModel.updateScrollbarSize();

            expect(viewModel.scrollableOffsetLeft).toEqual(10);
            expect(viewModel.scrollableOffsetTop).toEqual(20);

            if (elementRefExist) {
              expect(viewModel.containerClientWidth).toEqual(10);
              expect(viewModel.containerClientHeight).toEqual(20);

              expect(viewModel.contentClientWidth).toEqual(50);
              expect(viewModel.contentClientHeight).toEqual(60);
              expect(viewModel.contentScrollWidth).toEqual(70);
              expect(viewModel.contentScrollHeight).toEqual(80);

              if (forceGeneratePockets && pullDownEnabled) {
                expect(viewModel.topPocketClientHeight).toEqual(80);
              }

              if (forceGeneratePockets && reachBottomEnabled) {
                expect(viewModel.bottomPocketClientHeight).toEqual(55);
              }

              if (viewModel.prevContentClientWidth !== viewModel.contentClientWidth
              || viewModel.prevContainerClientWidth !== viewModel.containerClientWidth) {
                expect(viewModel.forceUpdateHScrollbarLocation).toEqual(true);
                expect(viewModel.hScrollLocation).toEqual(-150);
                expect(viewModel.prevContentClientWidth).toEqual(elementRefExist ? 50 : 5);
                expect(viewModel.prevContainerClientWidth).toEqual(10);
              }

              if (viewModel.prevContentClientHeight !== viewModel.contentClientHeight
              || viewModel.prevContainerClientHeight !== viewModel.containerClientHeight) {
                expect(viewModel.forceUpdateVScrollbarLocation).toEqual(true);
                expect(viewModel.prevContentClientHeight).toEqual(50);
                expect(viewModel.prevContainerClientHeight).toEqual(10);

                if (vScrollLocation <= 0) {
                  expect(viewModel.vScrollLocation).toEqual(-200);
                }
              }
            }
          });
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
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
      ]))('emit "dxscrollinit" event, isDxWheelEvent: %o, scrollByThumb: %o, targetClass: %o',
        (isDxWheelEvent, scrollByThumb, targetClass) => {
          const e = { ...defaultEvent, originalEvent: {} };
          if (isDxWheelEvent) {
            (e as any).originalEvent.type = 'dxmousewheel';
          }

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          (e.originalEvent as any).target = target;

          let expectedVThumbScrolling;
          let expectedHThumbScrolling;

          if (helper.isVertical) {
            expectedVThumbScrolling = scrollByThumb
              && helper.viewModel.vScrollbarRef.current.isThumb(target);
          }

          if (helper.isHorizontal) {
            expectedHThumbScrolling = scrollByThumb
              && helper.viewModel.hScrollbarRef.current.isThumb(target);
          }

          helper.viewModel.suppressDirections = jest.fn();
          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.initEffect();
          emit('dxscrollinit', e);

          const expectedCrossThumbScrolling = expectedVThumbScrolling || expectedHThumbScrolling;

          expect(helper.viewModel.suppressDirections).toHaveBeenCalledTimes(1);
          expect(helper.viewModel.suppressDirections).toHaveBeenCalledWith(e);
          expect(helper.viewModel.eventForUserAction).toEqual(e);
          helper.checkActionHandlerCalls(expect, [], [[]]);
          helper.checkScrollbarEventHandlerCalls(expect, ['init'], [[e, expectedCrossThumbScrolling]]);
        });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
      ]))('suppressDirections(e), isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o, targetClass: %o',
        (isDxWheelEvent, scrollByThumb, scrollByContent, targetClass) => {
          const e = { ...defaultEvent, originalEvent: {} };
          if (isDxWheelEvent) {
            (e.originalEvent as any).type = 'dxmousewheel';
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

          helper.viewModel.suppressDirections(e);

          const isDirectionValid = scrollByContent || (scrollByThumb && targetClass !== 'dx-scrollable-container');

          expect(helper.viewModel.validDirections).toEqual({
            vertical: isDxWheelEvent
              ? true
              : helper.isVertical && isDirectionValid && !(helper.isBoth && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
            horizontal: isDxWheelEvent
              ? true
              : helper.isHorizontal && isDirectionValid,
          });
        });

      it('emit "dxscrollcancel" event', () => {
        const initialVelocityX = 2.25;
        const initialVelocityY = 5.24;

        const e = {
          ...defaultEvent,
          velocity: { x: initialVelocityX, y: initialVelocityY },
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

      test('emit "dxscrollstart" event', () => {
        const e = {
          ...defaultEvent,
        };

        const helper = new ScrollableTestHelper({ direction });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();
        helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

        helper.viewModel.startEffect();
        emit('dxscrollstart', e);

        expect(helper.viewModel.eventForUserAction).toEqual(e);
        helper.checkActionHandlerCalls(expect, ['onStart'], [[{ fakeEventArg: { value: 5 } }]]);
        helper.checkScrollbarEventHandlerCalls(expect, ['start'], [[]]);
      });

      test('emit "dxscrollend" event', () => {
        const e = {
          ...defaultEvent,
          velocity: { x: 5.56, y: 4.5986 },
        };

        const helper = new ScrollableTestHelper({ direction });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.adjustDistance = jest.fn();
        helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

        helper.viewModel.endEffect();
        emit('dxscrollend', e);

        expect(helper.viewModel.adjustDistance).toHaveBeenCalledTimes(1);
        expect(helper.viewModel.adjustDistance).toHaveBeenCalledWith(e, 'velocity');
        expect(helper.viewModel.eventForUserAction).toEqual(e);
        helper.checkActionHandlerCalls(expect, [], [[]]);
        helper.checkScrollbarEventHandlerCalls(expect, ['end'], [[e.velocity]]);
      });

      test.each([true, false])('emit "dxscroll" event, locked: %o', (locked) => {
        const e = {
          ...defaultEvent,
          delta: { x: 10.5633, y: 25.5986 },
          preventDefault: jest.fn(),
          cancel: false,
        };

        const helper = new ScrollableTestHelper({ direction });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.adjustDistance = jest.fn();
        helper.viewModel.locked = locked;

        helper.viewModel.moveEffect();
        emit('dxscroll', e);

        if (locked) {
          expect(e.cancel).toEqual(true);
          expect(e.preventDefault).not.toBeCalled();
          expect(helper.viewModel.adjustDistance).toHaveBeenCalledTimes(0);
          expect(helper.viewModel.eventForUserAction).toEqual(undefined);
          helper.checkActionHandlerCalls(expect, [], [[]]);
          helper.checkScrollbarEventHandlerCalls(expect, [], [[]]);
        } else {
          expect(e.cancel).toEqual(false);
          expect(e.preventDefault).toBeCalled();
          expect(helper.viewModel.adjustDistance).toHaveBeenCalledTimes(1);
          expect(helper.viewModel.adjustDistance).toHaveBeenCalledWith(e, 'delta');
          expect(helper.viewModel.eventForUserAction).toEqual(e);
          helper.checkActionHandlerCalls(expect, [], [[]]);
          helper.checkScrollbarEventHandlerCalls(expect, ['move'], [[e.delta]]);
        }
      });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        [
          { name: 'delta', value: { x: 10.7987, y: 20.8569 } },
          { name: 'velocity', value: { x: 2.2568, y: 5.2446 } },
        ],
        [0.375, 1, 3],
        [
          { horizontal: true, vertical: true }, { horizontal: true, vertical: false },
          { horizontal: false, vertical: true }, { horizontal: false, vertical: false },
        ],
        [true, false],
      ]))('adjustDistance(e, property), isDxWheelEvent: %o, property: %o, pixelRatio: %o, validDirections: %o, hasWindow: %o',
        (isDxWheelEvent, property, pixelRatio, validDirections, hasWindow) => {
          const e = {
            ...defaultEvent,
            [property.name]: { ...property.value },
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
          };

          const viewModel = new Scrollable({ direction });

          viewModel.validDirections = validDirections;
          setWindow({ devicePixelRatio: pixelRatio }, hasWindow);

          viewModel.adjustDistance(e, property.name);

          let expectedCoordinateX = property.value.x * (validDirections.horizontal ? 1 : 0);
          let expectedCoordinateY = property.value.y * (validDirections.vertical ? 1 : 0);

          if (isDxWheelEvent && hasWindow) {
            expectedCoordinateX = Math.round((expectedCoordinateX / pixelRatio) * 100) / 100;
            expectedCoordinateY = Math.round((expectedCoordinateY / pixelRatio) * 100) / 100;
          }

          expect(e[property.name].x).toEqual(expectedCoordinateX);
          expect(e[property.name].y).toEqual(expectedCoordinateY);
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

          helper.viewModel.getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 5 } }));

          helper.viewModel.scrollBy(scrollByValues.actual);

          expect(helper.viewModel.validDirections).toEqual({ horizontal: true, vertical: true });
          helper.checkActionHandlerCalls(expect,
            ['onStart', 'onUpdated', 'onEnd'],
            [
              [{ fakeEventArg: { value: 5 } }],
              [{ fakeEventArg: { value: 5 } }],
              [{ fakeEventArg: { value: 5 } }],
            ]);
          helper.checkScrollbarEventHandlerCalls(expect, ['scrollBy'], [[scrollByValues.expected]]);
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
        optionValues.bounceEnabled,
        optionValues.isDxWheelEvent,
        [true, false],
      ]))('getDirection(e), scrollSize default, ContainerSize: %o, ContentSize: %o, OverflowStyle: %o, BounceEnabled: %o, IsDxWheelEvent: %o, IsShiftKeyPressed: %o',
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
        each([-100, -50, 0]).describe('scrollLocation: %o', (scrollLocation) => {
          it('validateWheel(e)', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings({
              props: {
                vScrollLocation: scrollLocation,
                hScrollLocation: scrollLocation,
              },
            });
            helper.initContainerPosition({ top: -scrollLocation, left: -scrollLocation });

            const e = { ...defaultEvent, delta };

            const expectedValidationResult = (scrollLocation < 0 && delta > 0)
                || (scrollLocation >= 0 && delta < 0) || scrollLocation === -50;

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
    each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
      each(['leftArrow', 'upArrow', 'rightArrow', 'downArrow']).describe('Key: %o', (keyName) => {
        it(`should prevent default key down event by key - ${keyName}`, () => {
          const e = {
            originalEvent: {
              key: keyName,
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const helper = new ScrollableTestHelper({ direction });

          helper.viewModel.scrollByLine = jest.fn();
          helper.viewModel.handleKeyDown(e);

          expect(e.originalEvent.preventDefault).toBeCalled();
          expect(e.originalEvent.stopPropagation).toBeCalled();
          expect(helper.viewModel.scrollByLine).toBeCalledTimes(1);
          expect(helper.viewModel.scrollByLine).toBeCalledWith({ [`${(keyName === 'upArrow' || keyName === 'downArrow') ? 'y' : 'x'}`]: (keyName === 'upArrow' || keyName === 'leftArrow') ? -1 : 1 });
        });

        each([1, 2, undefined]).describe('devicePixelRatio: %o', (pixelRatio) => {
          it(`should call scrollBy by ${keyName} key`, () => {
            const e = {
              originalEvent: {
                key: keyName,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
              },
            };
            const helper = new ScrollableTestHelper({ direction });

            helper.viewModel.tryGetDevicePixelRatio = () => pixelRatio;
            helper.viewModel.scrollBy = jest.fn();
            helper.viewModel.handleKeyDown(e);

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
          const e = {
            originalEvent: {
              key: keyName,
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.scrollByPage = scrollByPageHandler;
          helper.viewModel.handleKeyDown(e);
          expect(e.originalEvent.preventDefault).toBeCalled();
          expect(e.originalEvent.stopPropagation).toBeCalled();
          expect(scrollByPageHandler).toBeCalledTimes(1);
          expect(scrollByPageHandler).toBeCalledWith(keyName === 'pageUp' ? -1 : 1);
        });

        it(`should call scrollBy by ${keyName} key`, () => {
          const scrollByHandler = jest.fn();
          const e = {
            originalEvent: {
              key: keyName,
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.scrollBy = scrollByHandler;
          helper.viewModel.handleKeyDown(e);
          expect(scrollByHandler).toBeCalledTimes(1);
        });
      });

      it('should prevent default key down event by "home" key', () => {
        const e = {
          originalEvent: {
            key: 'home',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollToHome = jest.fn();
        helper.viewModel.handleKeyDown(e);

        expect(e.originalEvent.preventDefault).toBeCalled();
        expect(e.originalEvent.stopPropagation).toBeCalled();
        expect(helper.viewModel.scrollToHome).toBeCalledTimes(1);
      });

      it('should scroll to start by "home" key', () => {
        const e = {
          originalEvent: {
            key: 'home',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollTo = jest.fn();
        helper.viewModel.handleKeyDown(e);

        expect(helper.viewModel.scrollTo).toBeCalledTimes(1);
        expect(helper.viewModel.scrollTo).toBeCalledWith({ [`${direction === 'horizontal' ? 'left' : 'top'}`]: 0 });
      });

      it('should prevent default key down event by "end" key', () => {
        const e = {
          originalEvent: {
            key: 'end',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollToEnd = jest.fn();
        helper.viewModel.handleKeyDown(e);
        expect(e.originalEvent.preventDefault).toBeCalled();
        expect(e.originalEvent.stopPropagation).toBeCalled();
        expect(helper.viewModel.scrollToEnd).toBeCalledTimes(1);
      });

      it('should scroll to end by "end" key', () => {
        const e = {
          originalEvent: {
            key: 'end',
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        };
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollTo = jest.fn();
        helper.viewModel.handleKeyDown(e);
        expect(helper.viewModel.scrollTo).toBeCalledTimes(1);
      });
    });

    it('should not prevent default key down event by common keys down', () => {
      const scrollFunc = jest.fn();
      const e = {
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
      helper.viewModel.handleKeyDown(e);

      expect(e.originalEvent.preventDefault).not.toBeCalled();
      expect(e.originalEvent.stopPropagation).not.toBeCalled();
      expect(scrollFunc).toBeCalledTimes(0);
    });

    it('should not prevent default key down event by tab key down', () => {
      const e = {
        originalEvent: {
          key: 'tab',
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        },
      };
      const helper = new ScrollableTestHelper({ });
      helper.viewModel.tabWasPressed = false;

      helper.viewModel.handleKeyDown(e);

      expect(e.originalEvent.preventDefault).not.toBeCalled();
      expect(e.originalEvent.stopPropagation).not.toBeCalled();
      expect(helper.viewModel.tabWasPressed).toEqual(true);
    });

    it('keyboardEffect(), should subscribe container to keyboard event', () => {
      const helper = new ScrollableTestHelper({ });
      helper.viewModel.tabWasPressed = false;

      helper.viewModel.keyboardEffect();

      emit('keydown', { key: 'pageUp' } as any);
      expect(helper.viewModel.tabWasPressed).toEqual(false);
      emit('keydown', { key: 'tab' } as any);
      expect(helper.viewModel.tabWasPressed).toEqual(true);
    });

    it('keyboardEffect(), should return unsubscribe callback', () => {
      const helper = new ScrollableTestHelper({ });
      const detach = helper.viewModel.keyboardEffect();
      helper.viewModel.tabWasPressed = false;

      emit('keydown', { key: 'tab' } as any);
      expect(helper.viewModel.tabWasPressed).toEqual(true);

      helper.viewModel.tabWasPressed = false;
      detach();

      emit('keydown', { key: 'tab' } as any);
      expect(helper.viewModel.tabWasPressed).toEqual(false);
    });

    it('should not syncronize scrollbar location & container on "scroll" if tab key was not pressed', () => {
      const helper = new ScrollableTestHelper({});

      helper.viewModel.tabWasPressed = false;
      helper.viewModel.vScrollLocation = -100;
      helper.viewModel.hScrollLocation = -100;
      helper.viewModel.scrollOffset = jest.fn(() => ({ top: 50, left: 50 }));

      helper.viewModel.handleScroll();

      expect(helper.viewModel.vScrollLocation).toEqual(-100);
      expect(helper.viewModel.hScrollLocation).toEqual(-100);
      expect(helper.viewModel.tabWasPressed).toEqual(false);
    });

    it('should syncronize scrollbar location & container on "scroll" if tab key was pressed', () => {
      const helper = new ScrollableTestHelper({});

      expect.extend({
        toBeValid(received, expected) {
          if (received === expected) {
            return {
              message: () => 'passed',
              pass: true,
            };
          }
          return {
            message: () => `scrollLocation - actual: ${received}, expected: ${expected}`,
            pass: false,
          };
        },
      });

      [100, 0, -50, -70, -100, -200].forEach((hScrollLocation) => {
        [100, 0, -50, -70, -100, -200].forEach((vScrollLocation) => {
          helper.viewModel.tabWasPressed = true;
          helper.viewModel.vScrollLocation = vScrollLocation;
          helper.viewModel.hScrollLocation = hScrollLocation;
          helper.viewModel.scrollOffset = jest.fn(() => ({ top: 50, left: 50 }));

          helper.viewModel.handleScroll();

          let expectedVScrollLocation = vScrollLocation;
          let expectedHScrollLocation = hScrollLocation;

          if ((vScrollLocation <= 0 && vScrollLocation >= -100)
          && (hScrollLocation <= 0 && hScrollLocation >= -100)) {
            expectedVScrollLocation = -50;
            expectedHScrollLocation = -50;
          }

          (expect(helper.viewModel.vScrollLocation) as any).toBeValid(expectedVScrollLocation);
          (expect(helper.viewModel.hScrollLocation) as any).toBeValid(expectedHScrollLocation);
          expect(helper.viewModel.tabWasPressed).toEqual(false);
        });
      });
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

      test.each(['onBounce', 'onStart', 'onEnd', 'onUpdated'])('actionName: %o', (action) => {
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
            [{ top: 50, left: 50 }, 20, { top: 20, left: 20 }],
            [{ top: 50, left: 50 }, { top: 20, left: 15 }, { top: 20, left: 15 }],
            [{ top: 50, left: 50 }, -50, { top: -0, left: -0 }],
            [{ top: 50, left: 50 }, { top: 20, left: -15 }, { top: 20, left: -0 }],
            [{ top: 50, left: 50 }, 1000, { top: 100, left: 100 }],
            [{ top: 50, left: 50 }, { top: 30 }, { top: 30, left: 50 }],
            [{ top: 50, left: 50 }, { left: 30 }, { top: 50, left: 30 }],
            [{ top: 50, left: 50 }, undefined, { top: 50, left: 50 }],
            [{ top: 50, left: 50 }, {}, { top: 50, left: 50 }],
          ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollToValue, expected) => {
            it(`ScrollTo(${JSON.stringify(scrollToValue)})`, () => {
              const helper = new ScrollableTestHelper({
                direction,
                rtlEnabled,
                contentSize: 100,
                containerSize: 200,
              });
              helper.viewModel.triggerScrollEvent = jest.fn();

              helper.initScrollbarSettings({
                props: {
                  vScrollLocation: -initialScrollPosition.top,
                  hScrollLocation: -initialScrollPosition.left,
                },
              });
              helper.changeScrollbarMethod('scrollComplete', jest.fn());
              helper.initContainerPosition(initialScrollPosition);

              helper.viewModel.scrollTo(scrollToValue);

              const { ...expectedScrollOffset } = expected;
              expectedScrollOffset.top = helper.isVertical
                ? expected.top : initialScrollPosition.top;
              expectedScrollOffset.left = helper.isHorizontal
                ? expected.left : initialScrollPosition.left;

              expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
              expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
              expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
              helper.checkContainerPosition(expect, expectedScrollOffset);
            });
          });

          each([
            [{ top: 50, left: 40 }, 20, { top: 70, left: 60 }],
            [{ top: 50, left: 40 }, { top: 20, left: 15 }, { top: 70, left: 55 }],
            [{ top: 50, left: 40 }, -15, { top: 35, left: 25 }],
            [{ top: 50, left: 40 }, { top: -20, left: 15 }, { top: 30, left: 55 }],
            [{ top: 50, left: 40 }, -1000, { top: -0, left: -0 }],
            [{ top: 50, left: 40 }, 1000, { top: 100, left: 100 }],
            [{ top: 50, left: 40 }, undefined, { top: 50, left: 40 }],
            [{ top: 40, left: 50 }, {}, { top: 40, left: 50 }],
          ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollByValue, expected) => {
            it(`scrollBy(${JSON.stringify(scrollByValue)})`, () => {
              const helper = new ScrollableTestHelper({
                direction,
                rtlEnabled,
                contentSize: 100,
                containerSize: 200,
              });
              helper.viewModel.triggerScrollEvent = jest.fn();

              helper.initScrollbarSettings({
                props: {
                  vScrollLocation: -initialScrollPosition.top,
                  hScrollLocation: -initialScrollPosition.left,
                },
              });
              helper.changeScrollbarMethod('scrollComplete', jest.fn());

              helper.initContainerPosition(initialScrollPosition);
              helper.viewModel.scrollBy(scrollByValue);

              const { ...expectedScrollOffset } = expected;
              expectedScrollOffset.top = helper.isVertical
                ? expected.top : initialScrollPosition.top;
              expectedScrollOffset.left = helper.isHorizontal
                ? expected.left : initialScrollPosition.left;

              expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
              expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
              expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
              helper.checkContainerPosition(expect, expectedScrollOffset);
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
        const helper = new ScrollableTestHelper({ direction: 'vertical' });

        expect(helper.viewModel.isContent(helper.getScrollable().find('.dx-scrollable-container').getDOMNode())).toBe(true);
      });

      it('element is scrollbar', () => {
        const helper = new ScrollableTestHelper({ direction: 'vertical' });

        expect(helper.viewModel.isContent(helper.getScrollable().find('.dx-scrollable-scrollbar').getDOMNode())).toBe(true);
      });

      it('element is not inside scrollable', () => {
        const helper = new ScrollableTestHelper({ direction: 'vertical' });
        expect(helper.viewModel.isContent(mount(<div />).getDOMNode())).toBe(false);
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
    });
  });
});
