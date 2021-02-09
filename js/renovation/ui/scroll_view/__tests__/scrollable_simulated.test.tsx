/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jest/expect-expect */
import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import {
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
  SCROLLABLE_SCROLLBARS_HIDDEN,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  SCROLLABLE_SCROLLBAR_CLASS,
} from '../scrollable_utils';
import devices from '../../../../core/devices';
import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  ScrollableSimulated as Scrollable,
  ScrollableSimulated,
  viewFunction,
} from '../scrollable_simulated';

import {
  createContainerRef, initRefs, initStyles, setScrollbarPosition,
} from './utils';

import {
  ScrollableProps,
} from '../scrollable_props';

import { Scrollbar } from '../scrollbar';
import { ScrollableTestHelper } from './scollable_simulated_test_helper';

const testBehavior = { positive: false };
jest.mock('../../../../core/utils/scroll_rtl_behavior', () => () => testBehavior);
jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

describe('Simulated', () => {
  describe('Behavior', () => {
    describe('Effects', () => {
      beforeEach(clearEventHandlers);

      each(['vertical', 'horizontal', 'both']).describe('ScrollEffect params. Direction: %o', (direction) => {
        each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
          each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
            each(['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container']).describe('Event target: %o', (targetClass) => {
              each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
                each([0, undefined]).describe('TranslateOffset: %o', (translateOffset) => {
                  each([{ pageX: 50, pageY: 50 }, { pageX: 100, pageY: 100 }]).describe('mouseClickPosition: %o', (mouseClickPosition) => {
                    it('should change scroll and content position on init', () => {
                      const e = { ...defaultEvent, originalEvent: {} };
                      if (isDxWheelEvent) {
                        (e as any).originalEvent.type = 'dxmousewheel';
                      }

                      Object.assign(e, mouseClickPosition);

                      const onStopActionHandler = jest.fn();

                      const helper = new ScrollableTestHelper({
                        direction,
                        scrollByThumb,
                        bounceEnabled,
                        showScrollbar: 'always',
                        onStop: onStopActionHandler,
                      });

                      (e.originalEvent as any).target = helper.scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                      helper.initScrollbarSettings({
                        scrollableOffset: 0,
                        translateOffset,
                        props: {
                          contentSize: 500,
                          containerSize: 100,
                          needScrollbar: true,
                        },
                      });

                      (helper.viewModel as any).suppressDirections = () => {};
                      (helper.viewModel as any).getEventArgs = () => {};

                      helper.viewModel.initEffect();
                      emit('dxscrollinit', e);

                      expect(onStopActionHandler).toBeCalledTimes(1);
                      expect(onStopActionHandler)
                        .toBeCalledWith((helper.viewModel as any).getEventArgs());

                      // eslint-disable-next-line no-nested-ternary
                      const expectedScrollPosition = mouseClickPosition.pageX === 50
                        ? 200 : (bounceEnabled ? 450 : 400);

                      if (isDxWheelEvent || !scrollByThumb || targetClass !== 'dx-scrollable-scrollbar') {
                        helper.checkContainerPosition(expect, { top: 0, left: 0 });
                        helper.checkScrollbarScrollPositions(expect, { vertical: '', horizontal: '' });
                      } else if (direction === 'vertical') {
                        helper.checkContainerPosition(expect,
                          { top: expectedScrollPosition, left: 0 });
                        helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${expectedScrollPosition * 0.2}px)`, horizontal: '' });
                      } else {
                        helper.checkContainerPosition(expect,
                          { top: 0, left: expectedScrollPosition });

                        helper.checkScrollbarScrollPositions(expect, { vertical: '', horizontal: `translate(${expectedScrollPosition * 0.2}px, 0px)` });
                      }

                      expect(helper.viewModel.getScrollableOffset()).toEqual({ top: 0, left: 0 });
                    });
                  });
                });
              });

              each([true, false]).describe('ScrollByContent: %o', (scrollByContent) => {
                it('should prepare directions on init', () => {
                  const e = { ...defaultEvent, originalEvent: {} };
                  if (isDxWheelEvent) {
                    (e as any).originalEvent.type = 'dxmousewheel';
                  }

                  const viewModel = new Scrollable({
                    direction, scrollByThumb, scrollByContent,
                  });
                  viewModel.wrapperRef = React.createRef();
                  viewModel.containerRef = React.createRef();
                  viewModel.verticalScrollbarRef = React.createRef();
                  viewModel.horizontalScrollbarRef = React.createRef();
                  viewModel.scrollableRef = React.createRef();

                  const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                  viewModel.scrollableRef.current = scrollable.getDOMNode() as HTMLDivElement;

                  const scrollbars = scrollable.find(Scrollbar);

                  (e.originalEvent as any).target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                  const initSettings = (scrollbarRef, index) => {
                    const scrollbar = scrollbarRef.at(index).instance();
                    scrollbar.scrollbarRef = React.createRef();
                    scrollbar.scrollbarRef.current = scrollbarRef.at(index).getDOMNode();
                    scrollbar.initHandler = jest.fn();

                    return scrollbar;
                  };

                  expect(viewModel.validDirections).toEqual({});

                  if (direction === DIRECTION_VERTICAL) {
                    viewModel.verticalScrollbarRef.current = initSettings(scrollbars, 0);
                  } else if (direction === DIRECTION_HORIZONTAL) {
                    viewModel.horizontalScrollbarRef.current = initSettings(scrollbars, 0);
                  } else {
                    viewModel.horizontalScrollbarRef.current = initSettings(scrollbars, 0);
                    viewModel.verticalScrollbarRef.current = initSettings(scrollbars, 1);
                  }

                  viewModel.initEffect();
                  emit('dxscrollinit', e);

                  if (isDxWheelEvent) {
                    expect(viewModel.validDirections).toEqual({
                      vertical: true,
                      horizontal: true,
                    });
                  } else {
                    const isDirectionValid = scrollByContent
                                    || (scrollByThumb && targetClass !== 'dx-scrollable-container');

                    expect(viewModel.validDirections).toEqual({
                      vertical: direction !== DIRECTION_HORIZONTAL && isDirectionValid && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
                      horizontal: direction !== DIRECTION_VERTICAL && isDirectionValid,
                    });
                  }
                });

                it('should pass correct event, action & crossThumbScrolling params to initHandler', () => {
                  const e = { ...defaultEvent, originalEvent: {} };
                  if (isDxWheelEvent) {
                    (e as any).originalEvent.type = 'dxmousewheel';
                  }

                  const jestInitHandler = jest.fn();
                  const onStopAction = jest.fn();

                  const viewModel = new Scrollable({
                    direction,
                    scrollByThumb,
                    scrollByContent,
                    onStop: onStopAction,
                  });
                  viewModel.wrapperRef = React.createRef();
                  viewModel.containerRef = React.createRef();
                  viewModel.verticalScrollbarRef = React.createRef();
                  viewModel.horizontalScrollbarRef = React.createRef();
                  viewModel.scrollableRef = React.createRef();

                  const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                  viewModel.scrollableRef.current = scrollable.getDOMNode() as HTMLDivElement;

                  const scrollbars = scrollable.find(Scrollbar);

                  const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                  (e.originalEvent as any).target = target;

                  const initSettings = (scrollbarRef, index) => {
                    const scrollbar = scrollbarRef.at(index).instance();
                    scrollbar.scrollbarRef = React.createRef();
                    scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                    scrollbar.initHandler = jestInitHandler;

                    return scrollbar;
                  };

                  expect(viewModel.validDirections).toEqual({});

                  let expectedVerticalThumbScrolling;
                  let expectedHorizontalThumbScrolling;

                  if (direction === DIRECTION_VERTICAL) {
                    viewModel.verticalScrollbarRef.current = initSettings(scrollbars, 0);
                    expectedVerticalThumbScrolling = (scrollByThumb
                                    && viewModel.verticalScrollbarRef.current.isThumb(target));
                  } else if (direction === DIRECTION_HORIZONTAL) {
                    viewModel.horizontalScrollbarRef.current = initSettings(scrollbars, 0);
                    expectedHorizontalThumbScrolling = (scrollByThumb
                                    && viewModel.horizontalScrollbarRef.current.isThumb(target));
                  } else {
                    viewModel.horizontalScrollbarRef.current = initSettings(scrollbars, 0);
                    viewModel.verticalScrollbarRef.current = initSettings(scrollbars, 1);
                    expectedHorizontalThumbScrolling = (scrollByThumb
                                    && viewModel.horizontalScrollbarRef.current.isThumb(target));
                    expectedVerticalThumbScrolling = false;
                  }

                  viewModel.getEventArgs = jest.fn();

                  viewModel.initEffect();
                  emit('dxscrollinit', e);

                  expect(viewModel.needShowScrollbars).toEqual(true);

                  const expectedCrossThumbScrolling = expectedVerticalThumbScrolling
                                || expectedHorizontalThumbScrolling;

                  expect(onStopAction).toHaveBeenCalledTimes(1);
                  expect(onStopAction).toHaveBeenCalledWith(viewModel.getEventArgs());

                  if (direction === 'both') {
                    expect(jestInitHandler).toBeCalledTimes(2);
                    expect(jestInitHandler)
                      .toHaveBeenNthCalledWith(1, e, expectedCrossThumbScrolling);
                    expect(jestInitHandler)
                      .toHaveBeenNthCalledWith(2, e, expectedCrossThumbScrolling);
                  } else {
                    expect(jestInitHandler).toBeCalledTimes(1);
                    expect(jestInitHandler).toBeCalledWith(e, expectedCrossThumbScrolling);
                  }
                });

                each([1, 0.5, 2, undefined]).describe('DevicePixelRatio: %o', (devicePixelRatio) => {
                  it('should pass correct event param to moveHandler', () => {
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

                    const jestMoveHandler = jest.fn();

                    const viewModel = new Scrollable({
                      direction,
                      scrollByThumb,
                      scrollByContent,
                    });
                    viewModel.verticalScrollbarRef = React.createRef();
                    viewModel.horizontalScrollbarRef = React.createRef();
                    viewModel.wrapperRef = React.createRef();
                    viewModel.containerRef = React.createRef();
                    viewModel.scrollableRef = React.createRef();

                    const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                    viewModel.scrollableRef.current = scrollable.getDOMNode() as HTMLDivElement;

                    const scrollbars = scrollable.find(Scrollbar);
                    const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                    (e.originalEvent as any).target = target;

                    const initSettings = (scrollbarRef, index) => {
                      const scrollbar = scrollbarRef.at(index).instance();
                      scrollbar.scrollbarRef = React.createRef();
                      scrollbar.scrollbarRef.current = scrollbarRef.at(index).getDOMNode();
                      scrollbar.initHandler = jest.fn();
                      scrollbar.moveHandler = jestMoveHandler;

                      return scrollbar;
                    };

                    expect(viewModel.validDirections).toEqual({});

                    if (direction === DIRECTION_VERTICAL) {
                      viewModel.verticalScrollbarRef.current = initSettings(scrollbars, 0);
                    } else if (direction === DIRECTION_HORIZONTAL) {
                      viewModel.horizontalScrollbarRef.current = initSettings(scrollbars, 0);
                    } else {
                      viewModel.horizontalScrollbarRef.current = initSettings(scrollbars, 0);
                      viewModel.verticalScrollbarRef.current = initSettings(scrollbars, 1);
                    }

                    viewModel.initEffect();
                    emit('dxscrollinit', e);

                    viewModel.tryGetDevicePixelRatio = () => devicePixelRatio;

                    viewModel.moveEffect();
                    emit('dxscroll', e);

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

                    const expectedDeltaX = initialDeltaX * expectedValidDirections.horizontal;
                    const expectedDeltaY = initialDeltaY * expectedValidDirections.vertical;

                    if (direction === 'both') {
                      expect(jestMoveHandler).toBeCalledTimes(2);
                      expect(jestMoveHandler)
                        .toHaveBeenNthCalledWith(1, e.delta);
                      expect(jestMoveHandler)
                        .toHaveBeenNthCalledWith(2, e.delta);
                    } else {
                      expect(jestMoveHandler).toBeCalledTimes(1);
                      expect(jestMoveHandler).toBeCalledWith(e.delta);
                    }

                    if (isDxWheelEvent && devicePixelRatio) {
                      expect(e.delta.x).toEqual(expectedDeltaX / devicePixelRatio);
                      expect(e.delta.y).toEqual(expectedDeltaY / devicePixelRatio);
                    } else {
                      expect(e.delta.x).toEqual(expectedDeltaX);
                      expect(e.delta.y).toEqual(expectedDeltaY);
                    }
                  });

                  it('should pass correct event param to endHandler on handleEnd', () => {
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

                    const target = helper.scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                    (e.originalEvent as any).target = target;

                    helper.checkValidDirection(expect, {});

                    helper.initScrollbarSettings();
                    helper.initScrollbarHandlerMocks();

                    helper.viewModel.isThumbScrolling = () => true;

                    helper.viewModel.initEffect();
                    emit('dxscrollinit', e);

                    helper.viewModel.tryGetDevicePixelRatio = () => devicePixelRatio;
                    helper.viewModel.getEventArgs = jest.fn();

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

                    if (isDxWheelEvent && devicePixelRatio) {
                      expect(e.velocity.x)
                        .toEqual(Math.round((expectedDeltaX / devicePixelRatio) * 100) / 100);
                      expect(e.velocity.y)
                        .toEqual(Math.round((expectedDeltaY / devicePixelRatio) * 100) / 100);
                    } else {
                      expect(e.velocity.x).toEqual(expectedDeltaX);
                      expect(e.velocity.y).toEqual(expectedDeltaY);
                    }
                  });

                  it('should pass correct event param to endHandler on handleCancel', () => {
                    const initialVelocityX = 2.25;
                    const initialVelocityY = 5.24;

                    const e = {
                      ...defaultEvent,
                      velocity: { x: initialVelocityX, y: initialVelocityY },
                      originalEvent: {
                        type: isDxWheelEvent ? 'dxmousewheel' : undefined,
                      },
                    };

                    const onEndActionHandler = jest.fn();

                    const helper = new ScrollableTestHelper({
                      direction,
                      scrollByThumb,
                      scrollByContent,
                      onEnd: onEndActionHandler,
                    });

                    const target = helper.scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                    (e.originalEvent as any).target = target;

                    helper.initScrollbarSettings();
                    helper.initScrollbarHandlerMocks();

                    helper.viewModel.cancelEffect();
                    emit('dxscrollcancel', e);

                    expect(onEndActionHandler).toHaveBeenCalledTimes(0);

                    helper.checkScrollbarEventHandlerCalls(expect, ['end'], [[{ x: 0, y: 0 }]]);
                  });

                  each([undefined, jest.fn()]).describe('onStartActionHandler: %o', (onStartActionHandler) => {
                    it('should pass correct event param to startHandler on handleStart', () => {
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
                        onStart: onStartActionHandler,
                      });

                      const target = helper.scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                      (e.originalEvent as any).target = target;

                      helper.initScrollbarSettings();
                      helper.initScrollbarHandlerMocks();

                      helper.checkValidDirection(expect, {});
                      helper.viewModel.getEventArgs = jest.fn();

                      helper.viewModel.startEffect();
                      emit('dxscrollstart', e);

                      expect(helper.viewModel.needShowScrollbars).toEqual(true);

                      if (onStartActionHandler) {
                        expect(onStartActionHandler).toHaveBeenCalledTimes(1);
                        expect(onStartActionHandler)
                          .toBeCalledWith(helper.viewModel.getEventArgs());
                      }

                      helper.checkScrollbarEventHandlerCalls(expect, ['start'], [[e]]);
                    });
                  });
                });

                each([undefined, jest.fn()]).describe('onEndActionHandler: %o', (onEndActionHandler) => {
                  afterEach(() => {
                    jest.clearAllMocks();
                  });

                  it('should call endAction on dxscrollend event', () => {
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
                      onEnd: onEndActionHandler,
                    });

                    helper.initScrollbarSettings();
                    helper.initScrollbarHandlerMocks();

                    helper.viewModel.adjustDistance = jest.fn();
                    helper.viewModel.getEventArgs = jest.fn();

                    helper.viewModel.endEffect();
                    emit('dxscrollend', e);

                    if (onEndActionHandler) {
                      expect(onEndActionHandler).toBeCalledTimes(1);
                      expect(onEndActionHandler)
                        .toHaveBeenCalledWith(helper.viewModel.getEventArgs());
                    }

                    helper.checkScrollbarEventHandlerCalls(expect, ['end'], [[e.velocity]]);
                  });

                  each([undefined, jest.fn()]).describe('onStartActionHandler: %o', (onStartActionHandler) => {
                    each([
                      { actual: { top: -20, left: 15 }, expected: { y: 20, x: -15 } },
                      { actual: -100, expected: { x: direction !== 'vertical' ? 50 : 0, y: direction !== 'horizontal' ? 50 : 0 } },
                      { actual: 200, expected: { x: direction !== 'vertical' ? -50 : 0, y: direction !== 'horizontal' ? -50 : 0 } },
                    ]).describe('ScrollBy values: %o', (scrollByValues) => {
                      it('should call scrollByHandler, and onStart, onEnd customer actions when scrollBy() was called', () => {
                        const helper = new ScrollableTestHelper({
                          direction,
                          scrollByThumb,
                          scrollByContent,
                          onStart: onStartActionHandler,
                          onEnd: onEndActionHandler,
                        });

                        helper.initScrollbarSettings();
                        helper.initScrollbarHandlerMocks();

                        helper.initContainerPosition({ top: 50, left: 50 });
                        helper.initScrollbarLocation({ top: -50, left: -50 });

                        helper.changeScrollbarHandlerMock('scrollBy', (args) => {
                          if (onStartActionHandler) {
                            expect(onStartActionHandler).toBeCalledTimes(1);
                            expect(onStartActionHandler)
                              .toHaveBeenCalledWith(helper.viewModel.getEventArgs());
                            if (onEndActionHandler) {
                              expect(onEndActionHandler).toBeCalledTimes(0);
                            }
                          }
                          return helper.scrollByHandlerMock?.(args);
                        });

                        helper.viewModel.adjustDistance = jest.fn();
                        helper.viewModel.getEventArgs = jest.fn();

                        helper.viewModel.scrollBy(scrollByValues.actual);

                        helper.checkValidDirection(expect, {
                          horizontal: true,
                          vertical: true,
                        });
                        helper.checkScrollbarEventHandlerCalls(expect, ['scrollBy'], [[scrollByValues.expected]]);

                        if (onEndActionHandler) {
                          expect(onEndActionHandler).toBeCalledTimes(1);
                          expect(onEndActionHandler)
                            .toHaveBeenCalledWith(helper.viewModel.getEventArgs());
                        }
                      });
                    });
                  });
                });

                it('should call stopHandler', () => {
                  const e = {
                    ...defaultEvent,
                    originalEvent: {
                      type: isDxWheelEvent ? 'dxmousewheel' : undefined,
                    },
                  };

                  const jestStopHandler = jest.fn();

                  const viewModel = new Scrollable({
                    direction,
                    scrollByThumb,
                    scrollByContent,
                  }) as any;

                  const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                  viewModel.wrapperRef = React.createRef();
                  viewModel.scrollableRef = React.createRef();
                  viewModel.scrollableRef.current = scrollable.getDOMNode();

                  const scrollbars = scrollable.find(Scrollbar);

                  const initSettings = (scrollbarRef, index) => {
                    const scrollbar = scrollbarRef.at(index).instance();
                    scrollbar.stopHandler = jestStopHandler;

                    return { current: scrollbar };
                  };

                  if (direction === DIRECTION_VERTICAL) {
                    viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                  } else if (direction === DIRECTION_HORIZONTAL) {
                    viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                  } else {
                    viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                  }

                  viewModel.stopEffect();
                  emit('dxscrollstop', e);

                  if (direction === 'both') {
                    expect(jestStopHandler).toBeCalledTimes(2);
                  } else {
                    expect(jestStopHandler).toBeCalledTimes(1);
                  }
                });
              });
            });
          });
        });

        each([100, 200]).describe('ContainerSize: %o', (containerSize) => {
          each([0, 100, 200]).describe('ContentSize: %o', (contentSize) => {
            each(['hidden', 'visible']).describe('OverflowStyle: %o', (overflow) => {
              each([undefined, { left: 10, top: 10 }]).describe('Scrollable offset: %o', (scrollableOffset) => {
                it('UpdateScrollbarSize(), thumbSize default', () => {
                  const helper = new ScrollableTestHelper({
                    direction, overflow, contentSize, containerSize,
                  });

                  if (direction !== 'horizontal') {
                    const styles = helper.getVerticalScrollElement().props.style;

                    expect(styles).toEqual({ height: 15 });
                  }
                  if (direction !== 'vertical') {
                    const styles = helper.getHorizontalScrollElement().props.style;

                    expect(styles).toEqual({ width: 15 });
                  }

                  helper.viewModel.getScrollableOffset = () => scrollableOffset;
                  // TODO: mockwindow
                  helper.viewModel.effectUpdateScrollbarSize();

                  // TODO: check other params on update size
                  if (direction !== 'horizontal') {
                    expect(helper.viewModel.scrollableOffsetLeft)
                      .toEqual(scrollableOffset?.left || 0);
                    expect(helper.viewModel.containerWidth).toEqual(containerSize);
                    expect(helper.viewModel.contentWidth).toEqual(contentSize);
                  }
                  if (direction !== 'vertical') {
                    expect(helper.viewModel.scrollableOffsetTop)
                      .toEqual(scrollableOffset?.left || 0);
                    expect(helper.viewModel.containerHeight).toEqual(containerSize);
                    expect(helper.viewModel.contentHeight).toEqual(contentSize);
                  }
                });
              });

              // TODO: improve performance
              each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
                each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
                  each([true, false]).describe('Disabled: %o', (disabled) => {
                    each([true, false]).describe('IsLocked: %o', (locked) => {
                      each([true, false]).describe('ScrollByContent: %o', (scrollByContent) => {
                        each([true, false]).describe('IsScrollbarClicked: %o', (isScrollbarClicked) => {
                          each([-1, 1]).describe('Wheel delta: %o', (delta) => {
                            each([-100, 0]).describe('Scrollbar position: %o', (scrollbarPosition) => {
                              it('validate method in simulated strategy', () => {
                                const viewModel = new Scrollable({
                                  direction, bounceEnabled, disabled, scrollByContent,
                                }) as any;

                                initRefs(viewModel, viewFunction, {
                                  strategy: 'simulated', direction, contentSize, containerSize,
                                });

                                initStyles({
                                  element: (viewModel).containerRef.current,
                                  size: containerSize,
                                  overflow,
                                });
                                initStyles({
                                  element: (viewModel).contentRef.current,
                                  size: contentSize,
                                  overflow,
                                });

                                setScrollbarPosition(viewModel.horizontalScrollbarRef.current,
                                  { position: scrollbarPosition, contentSize, containerSize });
                                setScrollbarPosition(viewModel.verticalScrollbarRef.current,
                                  { position: scrollbarPosition, contentSize, containerSize });

                                viewModel.locked = locked;

                                let expectedValidationResult;
                                if (disabled || locked) {
                                  expectedValidationResult = false;
                                } else if (bounceEnabled) {
                                  expectedValidationResult = true;
                                } else if (isDxWheelEvent) {
                                  expectedValidationResult = (contentSize > containerSize)
                                                  && (
                                                    (scrollbarPosition < 0 && delta > 0)
                                                    || (scrollbarPosition >= 0 && delta < 0)
                                                  );
                                } else if (!scrollByContent && !isScrollbarClicked) {
                                  expectedValidationResult = false;
                                } else {
                                  expectedValidationResult = containerSize < contentSize
                                                  || bounceEnabled;
                                }

                                const target = isScrollbarClicked
                                  ? viewModel.containerRef.current.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`)
                                  : viewModel.containerRef.current;
                                const e = { ...defaultEvent, target, delta };
                                if (isDxWheelEvent) {
                                  (e as any).type = 'dxmousewheel';
                                }

                                expect(viewModel.validateWheelTimer)
                                  .toBe(undefined);

                                const actualResult = (viewModel).validate(e);
                                expect(actualResult).toBe(expectedValidationResult);

                                const isCheckedByTimeout = isDxWheelEvent
                                                && expectedValidationResult && !bounceEnabled;

                                if (isCheckedByTimeout) {
                                  expect(viewModel.validateWheelTimer)
                                    .not.toBe(undefined);

                                  e.delta = 0;
                                  expect((viewModel).validate(e)).toBe(true);
                                }

                                viewModel.disposeWheelTimer()();
                                expect(viewModel.validateWheelTimer)
                                  .toBe(undefined);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      each(['always', 'onHover', 'never', 'onScroll']).describe('HoverEffect params. showScrollbar: %o', (showScrollbarMode) => {
        it('hoverEffect should update invisible class only for onHover mode', () => {
          const viewModel = new Scrollable({
            direction: 'horizontal',
            showScrollbar: showScrollbarMode,
          }) as ScrollableSimulated;

          const isScrollbarHasInvisibleClass = (model) => {
            const scrollable = mount(viewFunction(model) as JSX.Element);

            const scrollbar = scrollable.find('.dx-scrollable-scroll');
            return scrollbar.hasClass('dx-state-invisible');
          };

          expect(isScrollbarHasInvisibleClass(viewModel)).toBe(showScrollbarMode !== 'always');

          viewModel.cursorEnterHandler();
          expect(isScrollbarHasInvisibleClass(viewModel)).toBe(
            (showScrollbarMode !== 'always' && showScrollbarMode !== 'onHover'),
          );

          viewModel.cursorLeaveHandler();
          expect(isScrollbarHasInvisibleClass(viewModel)).toBe(showScrollbarMode !== 'always');
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

          each([1, 2, undefined]).describe('devicePixelRatio: %o', (devicePixelRatio) => {
            it(`should call scrollBy by ${keyName} key`, () => {
              const options = {
                originalEvent: {
                  key: keyName,
                  preventDefault: jest.fn(),
                  stopPropagation: jest.fn(),
                },
              };
              const helper = new ScrollableTestHelper({ direction });

              helper.viewModel.tryGetDevicePixelRatio = () => devicePixelRatio;
              helper.viewModel.scrollBy = jest.fn();
              helper.viewModel.onWidgetKeyDown(options);

              const expectedParams = { top: 0, left: 0 };
              if (keyName === 'leftArrow') {
                expectedParams.left = -40 / (devicePixelRatio || 1);
              }
              if (keyName === 'rightArrow') {
                expectedParams.left = 40 / (devicePixelRatio || 1);
              }
              if (keyName === 'upArrow') {
                expectedParams.top = -40 / (devicePixelRatio || 1);
              }
              if (keyName === 'downArrow') {
                expectedParams.top = 40 / (devicePixelRatio || 1);
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
            const scrollable = new Scrollable({ direction });
            scrollable.contentRef = { } as RefObject<HTMLDivElement>;
            scrollable.containerRef = { } as RefObject<HTMLDivElement>;
            scrollable.scrollByPage = scrollByPageHandler;
            scrollable.onWidgetKeyDown(options);
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
            const scrollable = new Scrollable({ direction });
            scrollable.contentRef = { } as RefObject<HTMLDivElement>;
            scrollable.containerRef = { } as RefObject<HTMLDivElement>;
            scrollable.scrollBy = scrollByHandler;
            scrollable.onWidgetKeyDown(options);
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
          const scrollable = new Scrollable({ direction });
          scrollable.scrollToHome = jest.fn();
          scrollable.onWidgetKeyDown(options);
          expect(options.originalEvent.preventDefault).toBeCalled();
          expect(options.originalEvent.stopPropagation).toBeCalled();
          expect(scrollable.scrollToHome).toBeCalledTimes(1);
        });

        it('should scroll to start by "home" key', () => {
          const options = {
            originalEvent: {
              key: 'home',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.scrollTo = jest.fn();
          scrollable.onWidgetKeyDown(options);
          expect(scrollable.scrollTo).toBeCalledTimes(1);
          expect(scrollable.scrollTo).toBeCalledWith({ [`${direction === 'horizontal' ? 'left' : 'top'}`]: 0 });
        });

        it('should prevent default key down event by "end" key', () => {
          const options = {
            originalEvent: {
              key: 'end',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.scrollToEnd = jest.fn();
          scrollable.onWidgetKeyDown(options);
          expect(options.originalEvent.preventDefault).toBeCalled();
          expect(options.originalEvent.stopPropagation).toBeCalled();
          expect(scrollable.scrollToEnd).toBeCalledTimes(1);
        });

        it('should scroll to end by "end" key', () => {
          const options = {
            originalEvent: {
              key: 'end',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.contentRef = React.createRef();
          scrollable.containerRef = React.createRef();
          scrollable.scrollTo = jest.fn();
          scrollable.onWidgetKeyDown(options);
          expect(scrollable.scrollTo).toBeCalledTimes(1);
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
        const scrollable = new Scrollable({ });
        scrollable.scrollToHome = scrollFunc;
        scrollable.scrollToEnd = scrollFunc;
        scrollable.scrollByLine = scrollFunc;
        scrollable.scrollByPage = scrollFunc;
        scrollable.onWidgetKeyDown(options);

        expect(options.originalEvent.preventDefault).not.toBeCalled();
        expect(options.originalEvent.stopPropagation).not.toBeCalled();
        expect(scrollFunc).toBeCalledTimes(0);
      });
    });

    describe('Methods', () => {
      describe('Content', () => {
        it('should get the content of the widget', () => {
          const scrollable = new Scrollable({});
          const content = { };
          scrollable.contentRef = { current: content } as RefObject<HTMLDivElement>;
          expect(scrollable.content()).toEqual(content);
        });
      });

      describe('ScrollBy', () => {
        each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
          it('should scroll by positive distance as number', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 40 });
            helper.initScrollbarLocation({ top: -50, left: -40 });

            helper.viewModel.scrollBy(20);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 70 : 50,
              left: helper.isHorizontal ? 60 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${35}px)`, horizontal: `translate(${60 / 2}px, 0px)` });
          });

          it('should scroll by positive distance as object', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 40 });
            helper.initScrollbarLocation({ top: -50, left: -40 });

            helper.viewModel.scrollBy({ top: 20, left: 15 });

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 70 : 50,
              left: helper.isHorizontal ? 55 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${70 / 2}px)`, horizontal: `translate(${55 / 2}px, 0px)` });
          });

          it('should scroll by negative distance as number', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 40 });
            helper.initScrollbarLocation({ top: -50, left: -40 });

            helper.viewModel.scrollBy(-15);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 35 : 50,
              left: helper.isHorizontal ? 25 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${35 / 2}px)`, horizontal: `translate(${25 / 2}px, 0px)` });
          });

          it('should scroll by mix distance as object', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 40 });
            helper.initScrollbarLocation({ top: -50, left: -40 });

            helper.viewModel.scrollBy({ top: -20, left: 15 });

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 30 : 50,
              left: helper.isHorizontal ? 55 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${30 / 2}px)`, horizontal: `translate(${55 / 2}px, 0px)` });
          });

          it('should scroll by mix distance as object to behind min boundary', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 40 });
            helper.initScrollbarLocation({ top: -50, left: -40 });

            helper.viewModel.scrollBy(-1000);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? -0 : 50,
              left: helper.isHorizontal ? -0 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${0}px)`, horizontal: `translate(${0}px, 0px)` });
          });

          it('should scroll by mix distance as object to upper max boundary', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 40 });
            helper.initScrollbarLocation({ top: -50, left: -40 });

            helper.viewModel.scrollBy(1000);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 100 : 50,
              left: helper.isHorizontal ? 100 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${100 / 2}px)`, horizontal: `translate(${100 / 2}px, 0px)` });
          });
        });
      });

      describe('ScrollTo', () => {
        each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
          it('should scroll by positive distance as number', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 50 });
            helper.initScrollbarLocation({ top: -50, left: -50 });

            helper.viewModel.scrollTo(20);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 20 : 50,
              left: helper.isHorizontal ? 20 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${20 / 2}px)`, horizontal: `translate(${20 / 2}px, 0px)` });
          });

          it('should scroll by positive distance as object', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 50 });
            helper.initScrollbarLocation({ top: -50, left: -50 });

            helper.viewModel.scrollTo({ top: 20, left: 15 });

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 20 : 50,
              left: helper.isHorizontal ? 15 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${20 / 2}px)`, horizontal: `translate(${15 / 2}px, 0px)` });
          });

          it('should scroll by negative distance as number', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 50 });
            helper.initScrollbarLocation({ top: -50, left: -50 });

            helper.viewModel.scrollTo(-15);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? -0 : 50,
              left: helper.isHorizontal ? -0 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${0 / 2}px)`, horizontal: `translate(${0 / 2}px, 0px)` });
          });

          it('should scroll by mix distance as object', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 50 });
            helper.initScrollbarLocation({ top: -50, left: -50 });

            helper.viewModel.scrollTo({ top: 20, left: -15 });

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 20 : 50,
              left: helper.isHorizontal ? -0 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${20 / 2}px)`, horizontal: `translate(${0}px, 0px)` });
          });

          it('should scroll by mix distance as object to behind min boundary', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 50 });
            helper.initScrollbarLocation({ top: -50, left: -50 });

            helper.viewModel.scrollTo(-1000);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? -0 : 50,
              left: helper.isHorizontal ? -0 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${0}px)`, horizontal: `translate(${0}px, 0px)` });
          });

          it('should scroll by mix distance as object to upper max boundary', () => {
            const helper = new ScrollableTestHelper({ direction });

            helper.initScrollbarSettings();
            helper.changeScrollbarProp('containerRef', { current: helper.getContainerRefMock({}) });
            helper.initContainerPosition({ top: 50, left: 50 });
            helper.initScrollbarLocation({ top: -50, left: -50 });

            helper.viewModel.scrollTo(1000);

            helper.checkContainerPosition(expect, {
              top: helper.isVertical ? 100 : 50,
              left: helper.isHorizontal ? 100 : 50,
            });

            helper.checkScrollbarScrollPositions(expect, { vertical: `translate(0px, ${100 / 2}px)`, horizontal: `translate(${100 / 2}px, 0px)` });
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
          left: 0,
          // });
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

      describe('isContent', () => {
        it('element is scrollable container', () => {
          const viewModel = new Scrollable({ direction: 'vertical' });

          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
          viewModel.scrollableRef = {
            current: scrollable.getDOMNode(),
          } as RefObject<HTMLDivElement>;

          expect(viewModel.isContent(scrollable.find('.dx-scrollable-container').getDOMNode())).toBe(true);
        });

        it('element is scrollbar', () => {
          const viewModel = new Scrollable({ direction: 'vertical' });

          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
          viewModel.scrollableRef = {
            current: scrollable.getDOMNode(),
          } as RefObject<HTMLDivElement>;

          expect(viewModel.isContent(scrollable.find('.dx-scrollable-scrollbar').getDOMNode())).toBe(true);
        });

        it('element is not inside scrollable', () => {
          const viewModel = new Scrollable({ direction: 'vertical' });

          mount(viewFunction(viewModel as any) as JSX.Element);
          expect(viewModel.isContent(mount(<div />).getDOMNode())).toBe(false);
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
            expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
          });
        });

        each(['horizontal', 'vertical', 'both', null, undefined]).describe('Direction: %o', (direction) => {
          each([true, false, undefined, null]).describe('UseSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
            each(['never', 'always', 'onScroll', 'onHover', true, false, undefined, null]).describe('ShowScrollbar: %o', (showScrollbar) => {
              it('Should have correct css classes if simulatedStrategy is used', () => {
                const instance = new Scrollable({
                  showScrollbar,
                  useSimulatedScrollbar,
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
  });
});
