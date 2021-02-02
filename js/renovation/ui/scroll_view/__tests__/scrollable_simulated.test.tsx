import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import {
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
  SCROLLABLE_SCROLLBARS_HIDDEN,
  DIRECTION_BOTH,
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
  createTargetElement, normalizeRtl, calculateRtlScrollLeft, createContainerRef, createElement,
  initRefs, initStyles, setScrollbarPosition,
} from './utils';

import {
  ScrollableProps,
} from '../scrollable_props';

import {
  ScrollOffset,
  ScrollableDirection,
} from '../types.d';

import { Scrollbar } from '../scrollbar';

const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
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
                    const extendProperties = (ref, additionalProps: any) => {
                      const extendedProps = { ...ref.props, ...additionalProps };

                      Object.assign(ref, { props: extendedProps });
                    };

                    it('should change scroll and content position on init', () => {
                      const e = { ...defaultEvent, originalEvent: {} };
                      if (isDxWheelEvent) {
                        (e as any).originalEvent.type = 'dxmousewheel';
                      }

                      Object.assign(e, mouseClickPosition);

                      const onStopActionHandler = jest.fn();

                      const viewModel = new Scrollable({
                        direction,
                        scrollByThumb,
                        bounceEnabled,
                        showScrollbar: 'always',
                        onStop: onStopActionHandler,
                      });
                      const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
                      const scrollbars = scrollable.find(Scrollbar);

                      (e.originalEvent as any).target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                      const scrollableContainerElement = scrollable.find('.dx-scrollable-container').getDOMNode();
                      const scrollableContentElement = scrollable.find('.dx-scrollable-content').getDOMNode();
                      const scrollElements = scrollable.find('.dx-scrollable-scroll');

                      const initSettings = (scrollbarRef, index) => {
                        const scrollbar = scrollbarRef.at(index).instance();
                        scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                        scrollbar.scrollRef = scrollElements.at(index).getDOMNode();
                        (scrollbar as any)
                          .getContainerRef = () => ({ current: scrollableContainerElement });
                        (scrollbar as any)
                          .getContentRef = () => ({ current: scrollableContentElement });
                        scrollbar.scrollableOffset = 0;
                        scrollbar.cachedVariables.translateOffset = translateOffset;
                        extendProperties(scrollbar, {
                          contentSize: 500,
                          containerSize: 100,
                          scaleRatio: 1,
                          needScrollbar: true,
                        });
                        return scrollbar;
                      };

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      } else {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                      }

                      (viewModel as any).suppressDirections = () => {};
                      (viewModel as any).getEventArgs = () => {};

                      viewModel.initEffect();
                      emit('dxscrollinit', e);

                      expect(onStopActionHandler).toBeCalledTimes(1);
                      expect(onStopActionHandler).toBeCalledWith((viewModel as any).getEventArgs());

                      // eslint-disable-next-line no-nested-ternary
                      const expectedScrollPosition = mouseClickPosition.pageX === 50
                        ? 250 : (bounceEnabled ? 500 : 400);

                      const containerElement = scrollable.find('.dx-scrollable-container').getDOMNode();

                      if (isDxWheelEvent || !scrollByThumb || targetClass !== 'dx-scrollable-scrollbar') {
                        expect(containerElement.scrollTop).toEqual(0);
                        expect(containerElement.scrollLeft).toEqual(0);
                        scrollbars.forEach((scrollbar) => {
                          expect(window.getComputedStyle(scrollbar.getDOMNode()).transform).toEqual('');
                        });
                      } else if (direction === DIRECTION_VERTICAL) {
                        expect(containerElement.scrollTop).toEqual(expectedScrollPosition);
                        scrollbars.forEach((scrollbar) => {
                          expect(window.getComputedStyle(scrollbar.find('.dx-scrollable-scroll').getDOMNode()).transform).toEqual(`translate(0px, ${expectedScrollPosition * 0.2}px)`);
                        });
                      } else {
                        expect(containerElement.scrollLeft).toEqual(expectedScrollPosition);
                        expect(window.getComputedStyle(scrollbars.at(0).find('.dx-scrollable-scroll').getDOMNode()).transform).toEqual(`translate(${expectedScrollPosition * 0.2}px, 0px)`);

                        if (direction === DIRECTION_BOTH) {
                          expect(window.getComputedStyle(scrollbars.at(1).find('.dx-scrollable-scroll').getDOMNode()).transform).toEqual('');
                        }
                      }
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
                  }) as any;
                  const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                  viewModel.scrollableRef = scrollable.getDOMNode();

                  const scrollbars = scrollable.find(Scrollbar);

                  (e.originalEvent as any).target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                  const initSettings = (scrollbarRef, index) => {
                    const scrollbar = scrollbarRef.at(index).instance();
                    scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                    scrollbar.initHandler = jest.fn();

                    return scrollbar;
                  };

                  expect(viewModel.validDirections).toEqual({});

                  if (direction === DIRECTION_VERTICAL) {
                    viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                  } else if (direction === DIRECTION_HORIZONTAL) {
                    viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                  } else {
                    viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
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
                  }) as any;
                  const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                  viewModel.scrollableRef = scrollable.getDOMNode();

                  const scrollbars = scrollable.find(Scrollbar);

                  const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                  (e.originalEvent as any).target = target;

                  const initSettings = (scrollbarRef, index) => {
                    const scrollbar = scrollbarRef.at(index).instance();
                    scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                    scrollbar.initHandler = jestInitHandler;

                    return scrollbar;
                  };

                  expect(viewModel.validDirections).toEqual({});

                  let expectedVerticalThumbScrolling;
                  let expectedHorizontalThumbScrolling;

                  if (direction === DIRECTION_VERTICAL) {
                    viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                    expectedVerticalThumbScrolling = (scrollByThumb
                                    && viewModel.verticalScrollbarRef.isThumb(target));
                  } else if (direction === DIRECTION_HORIZONTAL) {
                    viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    expectedHorizontalThumbScrolling = (scrollByThumb
                                    && viewModel.horizontalScrollbarRef.isThumb(target));
                  } else {
                    viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                    expectedHorizontalThumbScrolling = (scrollByThumb
                                    && viewModel.horizontalScrollbarRef.isThumb(target));
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
                    }) as any;

                    const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                    viewModel.scrollableRef = scrollable.getDOMNode();

                    const scrollbars = scrollable.find(Scrollbar);
                    const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                    (e.originalEvent as any).target = target;

                    const initSettings = (scrollbarRef, index) => {
                      const scrollbar = scrollbarRef.at(index).instance();
                      scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                      scrollbar.initHandler = jest.fn();
                      scrollbar.moveHandler = jestMoveHandler;

                      return scrollbar;
                    };

                    expect(viewModel.validDirections).toEqual({});

                    if (direction === DIRECTION_VERTICAL) {
                      viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                    } else if (direction === DIRECTION_HORIZONTAL) {
                      viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    } else {
                      viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
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

                    const jestEndHandler = jest.fn();
                    const onEndActionHandler = jest.fn();

                    const viewModel = new Scrollable({
                      direction,
                      scrollByThumb,
                      scrollByContent,
                      onEnd: onEndActionHandler,
                    }) as any;

                    const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                    viewModel.scrollableRef = scrollable.getDOMNode();

                    const scrollbars = scrollable.find(Scrollbar);
                    const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                    (e.originalEvent as any).target = target;

                    const initSettings = (scrollbarRef, index) => {
                      const scrollbar = scrollbarRef.at(index).instance();
                      scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                      scrollbar.initHandler = () => {};
                      scrollbar.endHandler = jestEndHandler;

                      return scrollbar;
                    };

                    expect(viewModel.validDirections).toEqual({});

                    if (direction === DIRECTION_VERTICAL) {
                      viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                    } else if (direction === DIRECTION_HORIZONTAL) {
                      viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    } else {
                      viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                    }

                    viewModel.initEffect();
                    emit('dxscrollinit', e);

                    viewModel.tryGetDevicePixelRatio = () => devicePixelRatio;
                    viewModel.getEventArgs = jest.fn();

                    viewModel.endEffect();
                    emit('dxscrollend', e);

                    const isDirectionValid = scrollByContent || (scrollByThumb && targetClass !== 'dx-scrollable-container');

                    const expectedValidDirections = {
                      vertical: isDxWheelEvent
                        ? true
                        : direction !== DIRECTION_HORIZONTAL && isDirectionValid && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
                      horizontal: isDxWheelEvent
                        ? true
                        : direction !== DIRECTION_VERTICAL && isDirectionValid,
                    };

                    const expectedDeltaX = initialVelocityX
                                    * expectedValidDirections.horizontal;
                    const expectedDeltaY = initialVelocityY * expectedValidDirections.vertical;

                    if (direction === 'both') {
                      expect(jestEndHandler).toBeCalledTimes(2);
                      expect(jestEndHandler)
                        .toHaveBeenNthCalledWith(1, e.velocity);
                      expect(jestEndHandler)
                        .toHaveBeenNthCalledWith(2, e.velocity);
                    } else {
                      expect(jestEndHandler).toBeCalledTimes(1);
                      expect(jestEndHandler).toBeCalledWith(e.velocity);
                    }

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

                    const jestEndHandler = jest.fn();
                    const onEndActionHandler = jest.fn();

                    const viewModel = new Scrollable({
                      direction,
                      scrollByThumb,
                      scrollByContent,
                      onEnd: onEndActionHandler,
                    }) as any;

                    const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                    viewModel.scrollableRef = scrollable.getDOMNode();

                    const scrollbars = scrollable.find(Scrollbar);
                    const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                    (e.originalEvent as any).target = target;

                    const initSettings = (scrollbarRef, index) => {
                      const scrollbar = scrollbarRef.at(index).instance();
                      scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                      scrollbar.endHandler = jestEndHandler;

                      return scrollbar;
                    };

                    expect(viewModel.validDirections).toEqual({});

                    if (direction === DIRECTION_VERTICAL) {
                      viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                    } else if (direction === DIRECTION_HORIZONTAL) {
                      viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                    } else {
                      viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                    }

                    viewModel.cancelEffect();
                    emit('dxscrollcancel', e);

                    expect(onEndActionHandler).toHaveBeenCalledTimes(0);

                    if (direction === 'both') {
                      expect(jestEndHandler).toBeCalledTimes(2);
                      expect(jestEndHandler)
                        .toHaveBeenNthCalledWith(1, { x: 0, y: 0 });
                      expect(jestEndHandler)
                        .toHaveBeenNthCalledWith(2, { x: 0, y: 0 });
                    } else {
                      expect(jestEndHandler).toBeCalledTimes(1);
                      expect(jestEndHandler).toBeCalledWith({ x: 0, y: 0 });
                    }
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

                      const jestStartHandler = jest.fn();

                      const viewModel = new Scrollable({
                        direction,
                        scrollByThumb,
                        scrollByContent,
                        onStart: onStartActionHandler,
                      }) as any;

                      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                      viewModel.scrollableRef = scrollable.getDOMNode();

                      const scrollbars = scrollable.find(Scrollbar);
                      const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                      (e.originalEvent as any).target = target;

                      const initSettings = (scrollbarRef, index) => {
                        const scrollbar = scrollbarRef.at(index).instance();
                        scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                        scrollbar.startHandler = jestStartHandler;

                        return scrollbar;
                      };

                      expect(viewModel.validDirections).toEqual({});

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      } else {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                      }

                      viewModel.getEventArgs = jest.fn();

                      viewModel.startEffect();
                      emit('dxscrollstart', e);

                      expect(viewModel.needShowScrollbars).toEqual(true);

                      if (onStartActionHandler) {
                        expect(onStartActionHandler).toHaveBeenCalledTimes(1);
                        expect(onStartActionHandler).toBeCalledWith(viewModel.getEventArgs());
                      }

                      if (direction === 'both') {
                        expect(jestStartHandler).toBeCalledTimes(2);
                        expect(jestStartHandler)
                          .toHaveBeenNthCalledWith(1, e);
                        expect(jestStartHandler)
                          .toHaveBeenNthCalledWith(2, e);
                      } else {
                        expect(jestStartHandler).toBeCalledTimes(1);
                        expect(jestStartHandler).toBeCalledWith(e);
                      }
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

                    const viewModel = new Scrollable({
                      direction,
                      scrollByThumb,
                      scrollByContent,
                      onEnd: onEndActionHandler,
                    }) as any;

                    const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                    const scrollbars = scrollable.find(Scrollbar);

                    if (direction === DIRECTION_VERTICAL) {
                      viewModel.verticalScrollbarRef = scrollbars.at(0).instance();
                    } else if (direction === DIRECTION_HORIZONTAL) {
                      viewModel.horizontalScrollbarRef = scrollbars.at(0).instance();
                    } else {
                      viewModel.horizontalScrollbarRef = scrollbars.at(0).instance();
                      viewModel.verticalScrollbarRef = scrollbars.at(1).instance();
                    }

                    viewModel.adjustDistance = jest.fn();
                    viewModel.getEventArgs = jest.fn();

                    viewModel.endEffect();
                    emit('dxscrollend', e);

                    if (onEndActionHandler) {
                      expect(onEndActionHandler).toBeCalledTimes(1);
                      expect(onEndActionHandler).toHaveBeenCalledWith(viewModel.getEventArgs());
                    }
                  });

                  each([undefined, jest.fn()]).describe('onStartActionHandler: %o', (onStartActionHandler) => {
                    it('should call scrollByHandler, and onStart, onEnd customer actions when scrollBy() was called', () => {
                      const containerRefMock = createContainerRef({ top: 150, left: 0 });
                      const jestScrollByHandler = jest.fn();

                      const viewModel = new Scrollable({
                        direction,
                        scrollByThumb,
                        scrollByContent,
                        onStart: onStartActionHandler,
                        onEnd: onEndActionHandler,
                      }) as any;

                      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                      viewModel.containerRef = containerRefMock;
                      viewModel.scrollableRef = scrollable.getDOMNode();

                      const scrollbars = scrollable.find(Scrollbar);

                      const initSettings = (scrollbarRef, index) => {
                        const scrollbar = scrollbarRef.at(index).instance();
                        scrollbar.scrollByHandler = (args) => {
                          if (onStartActionHandler) {
                            expect(onStartActionHandler).toBeCalledTimes(1);
                            expect(onStartActionHandler)
                              .toHaveBeenCalledWith(viewModel.getEventArgs());
                            if (onEndActionHandler) {
                              expect(onEndActionHandler).toBeCalledTimes(0);
                            }
                          }
                          return jestScrollByHandler(args);
                        };

                        return scrollbar;
                      };

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      } else {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                      }

                      viewModel.adjustDistance = jest.fn();
                      viewModel.getEventArgs = jest.fn();

                      viewModel.scrollBy({ left: 50, top: 100 });

                      expect(viewModel.validDirections).toEqual({
                        horizontal: true,
                        vertical: true,
                      });

                      if (direction === 'both') {
                        expect(jestScrollByHandler).toBeCalledTimes(2);
                        expect(jestScrollByHandler).nthCalledWith(1, { x: 50, y: 100 });
                        expect(jestScrollByHandler).nthCalledWith(2, { x: 50, y: 100 });
                      } else {
                        expect(jestScrollByHandler).toBeCalledTimes(1);
                        expect(jestScrollByHandler).toHaveBeenCalledWith({ x: 50, y: 100 });
                      }

                      if (onEndActionHandler) {
                        expect(onEndActionHandler).toBeCalledTimes(1);
                        expect(onEndActionHandler)
                          .toHaveBeenCalledWith(viewModel.getEventArgs());
                      }
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
                  viewModel.scrollableRef = scrollable.getDOMNode();

                  const scrollbars = scrollable.find(Scrollbar);

                  const initSettings = (scrollbarRef, index) => {
                    const scrollbar = scrollbarRef.at(index).instance();
                    scrollbar.stopHandler = jestStopHandler;

                    return scrollbar;
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
              each([true, false]).describe('ScrollableRef: %o', (isScrollableRef) => {
                it('UpdateScrollbarSize(), thumbSize default', () => {
                  const containerRef = React.createRef();
                  const contentRef = React.createRef();
                  const viewModel = new Scrollable({ direction }) as any;

                  viewModel.containerRef = containerRef;
                  viewModel.contentRef = contentRef;
                  const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);

                  if (direction !== 'horizontal') {
                    const styles = scrollable.find('.dx-scrollbar-vertical .dx-scrollable-scroll').getElement().props.style;

                    expect(styles).toEqual({ height: 15 });
                  }
                  if (direction !== 'vertical') {
                    const styles = scrollable.find('.dx-scrollbar-horizontal .dx-scrollable-scroll').getElement().props.style;

                    expect(styles).toEqual({ width: 15 });
                  }

                  initStyles({
                    ref: viewModel.containerRef.current,
                    size: containerSize,
                    overflow,
                  });
                  initStyles({
                    ref: viewModel.contentRef.current,
                    size: contentSize,
                    overflow,
                  });

                  let expectedScaleRatio = 1;

                  if (isScrollableRef) {
                    viewModel.scrollableRef = scrollable.getDOMNode();
                    initStyles({
                      ref: viewModel.scrollableRef,
                      size: contentSize,
                      overflow,
                    });
                    Object.defineProperty(viewModel.scrollableRef, 'offsetWidth', { configurable: true, value: containerSize });
                    Object.defineProperty(viewModel.scrollableRef, 'offsetHeight', { configurable: true, value: containerSize });

                    expectedScaleRatio = contentSize / containerSize;
                  } else {
                    viewModel.getScaleRatio = () => 1;
                  }

                  viewModel.containerRef = viewModel.containerRef.current;
                  viewModel.contentRef = viewModel.contentRef.current;

                  // TODO: mockwindow
                  viewModel.effectUpdateScrollbarSize();

                  if (direction !== 'horizontal') {
                    expect(viewModel.scrollableOffsetLeft).toEqual(0);
                    expect(viewModel.containerWidth).toEqual(containerSize);
                    expect(viewModel.contentWidth).toEqual(contentSize);
                    expect(viewModel.scaleRatioWidth).toEqual(expectedScaleRatio);
                  }
                  if (direction !== 'vertical') {
                    expect(viewModel.scrollableOffsetTop).toEqual(0);
                    expect(viewModel.containerHeight).toEqual(containerSize);
                    expect(viewModel.contentHeight).toEqual(contentSize);
                    expect(viewModel.scaleRatioHeight).toEqual(expectedScaleRatio);
                  }
                });
              });

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
                                  ref: (viewModel).containerRef,
                                  size: containerSize,
                                  overflow,
                                });
                                initStyles({
                                  ref: (viewModel).contentRef,
                                  size: contentSize,
                                  overflow,
                                });

                                setScrollbarPosition(viewModel.horizontalScrollbarRef,
                                  { position: scrollbarPosition, contentSize, containerSize });
                                setScrollbarPosition(viewModel.verticalScrollbarRef,
                                  { position: scrollbarPosition, contentSize, containerSize });

                                viewModel.cachedVariables.locked = locked;

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
                                  ? viewModel.containerRef.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`)
                                  : viewModel.containerRef;
                                const e = { ...defaultEvent, target, delta };
                                if (isDxWheelEvent) {
                                  (e as any).type = 'dxmousewheel';
                                }

                                expect(viewModel.cachedVariables.validateWheelTimer)
                                  .toBe(undefined);

                                const actualResult = (viewModel).validate(e);
                                expect(actualResult).toBe(expectedValidationResult);

                                const isCheckedByTimeout = isDxWheelEvent
                                                && expectedValidationResult && !bounceEnabled;

                                if (isCheckedByTimeout) {
                                  expect(viewModel.cachedVariables.validateWheelTimer)
                                    .not.toBe(undefined);

                                  e.delta = 0;
                                  expect((viewModel).validate(e)).toBe(true);
                                }

                                viewModel.disposeWheelTimer()();
                                expect(viewModel.cachedVariables.validateWheelTimer)
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
        if (Scrollable === ScrollableSimulated) {
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
        }
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
            const scrollFunc = jest.fn();
            const options = {
              originalEvent: {
                key: keyName,
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
              },
            };
            const scrollable = new Scrollable({ });
            scrollable.scrollByLine = scrollFunc;
            scrollable.onWidgetKeyDown(options);
            expect(options.originalEvent.preventDefault).toBeCalled();
            expect(options.originalEvent.stopPropagation).toBeCalled();
            expect(scrollFunc).toBeCalledTimes(1);
            expect(scrollFunc).toBeCalledWith({ [`${(keyName === 'upArrow' || keyName === 'downArrow') ? 'y' : 'x'}`]: (keyName === 'upArrow' || keyName === 'leftArrow') ? -1 : 1 });
          });

          each([1, 2, undefined]).describe('devicePixelRatio: %o', (devicePixelRatio) => {
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
              scrollable.tryGetDevicePixelRatio = () => devicePixelRatio;
              scrollable.scrollBy = scrollByHandler;
              scrollable.onWidgetKeyDown(options);
              expect(scrollByHandler).toBeCalledTimes(1);
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
              expect(scrollByHandler).toBeCalledWith(expectedParams);
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
            scrollable.scrollBy = scrollByHandler;
            scrollable.onWidgetKeyDown(options);
            expect(scrollByHandler).toBeCalledTimes(1);
          });
        });

        it('should prevent default key down event by "home" key', () => {
          const scrollFunc = jest.fn();
          const options = {
            originalEvent: {
              key: 'home',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.scrollToHome = scrollFunc;
          scrollable.onWidgetKeyDown(options);
          expect(options.originalEvent.preventDefault).toBeCalled();
          expect(options.originalEvent.stopPropagation).toBeCalled();
          expect(scrollFunc).toBeCalledTimes(1);
        });

        it('should scroll to start by "home" key', () => {
          const scrollFunc = jest.fn();
          const options = {
            originalEvent: {
              key: 'home',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.scrollTo = scrollFunc;
          scrollable.onWidgetKeyDown(options);
          expect(scrollFunc).toBeCalledTimes(1);
          expect(scrollFunc).toBeCalledWith({ [`${direction === 'horizontal' ? 'left' : 'top'}`]: 0 }); // TODO: returns { top: 0 } when direction is 'both'
        });

        it('should prevent default key down event by "end" key', () => {
          const scrollFunc = jest.fn();
          const options = {
            originalEvent: {
              key: 'end',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.scrollToEnd = scrollFunc;
          scrollable.onWidgetKeyDown(options);
          expect(options.originalEvent.preventDefault).toBeCalled();
          expect(options.originalEvent.stopPropagation).toBeCalled();
          expect(scrollFunc).toBeCalledTimes(1);
        });

        it('should scroll to end by "end" key', () => {
          const scrollToFunc = jest.fn();
          const options = {
            originalEvent: {
              key: 'end',
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          };
          const scrollable = new Scrollable({ direction });
          scrollable.scrollTo = scrollToFunc;
          scrollable.onWidgetKeyDown(options);
          expect(scrollToFunc).toBeCalledTimes(1);
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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: 100, left: normalizeRtl(rtlEnabled, 100) });

            expect(containerRefMock.scrollTop).toEqual(250);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
          });

          it(`should scroll by positive distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: 100 });

            expect(containerRefMock.scrollTop).toEqual(250);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by positive distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);

            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 100) });

            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it(`should scroll by positive distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 70) });

            expect(containerRefMock.scrollTop).toEqual(220);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 220));
          });

          it(`should scroll by negative distance as number in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy(-50);

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by negative distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it(`should scroll by negative distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
          });

          it(`should scroll by negative distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 0 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: -50, left: 70 });

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it(`should scroll by negative distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, -50) });

            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            expect(containerRefMock.scrollTop).toEqual(0);
          });

          it(`should scroll by negative distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
            const containerRefMock = createContainerRef({ top: 150, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollTo(200);

            expect(containerRefMock.scrollTop).toEqual(200);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it('should scroll position as number in the horizontal direction', () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

            scrollable.scrollTo({ top: 100, left: 70 });

            expect(containerRefMock.scrollTop).toEqual(100);
            expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
          });

          it('should scroll position as object in the horizontal direction', () => {
            const containerRefMock = createContainerRef({ top: 0, left: 150 },
              undefined, undefined, rtlEnabled);
            const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
            scrollable.containerRef = containerRefMock;
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
            scrollable.eventHandler = jest.fn();
            (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };
                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from right side and top side by both direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 20 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
              });

              it('should scroll to element from left side and bottom side by both direction', () => {
                const element = createTargetElement({ location: { left: 20, top: 500 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should scroll to element from right side and bottom side by both direction', () => {
                const element = createTargetElement({ location: { left: 500, top: 500 } });
                const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

                scrollable.scrollToElement(element, offset);

                expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
              });

              it('should do not scroll to an element when it in the visible area', () => {
                const element = createTargetElement({ location: { top: 200, left: 200 } });
                const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
                scrollable.eventHandler = jest.fn();
                (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

              scrollable.scrollToElement(element);

              expect(containerRef.scrollTop).toEqual(217);
              expect(containerRef.scrollLeft).toEqual(217);
            });

            it('it should not scroll to element when it is not located inside the scrollable content', () => {
              const element = createElement({ location: { top: 200, left: 200 } });
              const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', undefined);
              const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
              scrollable.containerRef = containerRef;
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from left side by horizontal direction', () => {
              const element = createTargetElement({ location: { top: 0, left: 0 } });
              const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

              scrollable.scrollToElement(element);
              expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
            });

            it('should scroll to element from right side by horizontal direction for IE', () => {
              testBehavior.positive = true;
              const element = createTargetElement({ location: { top: 0, left: -320 } });
              const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

              const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
              scrollable.containerRef = containerRef;
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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
              scrollable.eventHandler = jest.fn();
              (scrollable as any).scrollbar = { scrollByHandler: jest.fn() };

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

      describe('isContent', () => {
        it('element is scrollable container', () => {
          const viewModel = new Scrollable({ direction: 'vertical' });

          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
          viewModel.scrollableRef = scrollable.getDOMNode();

          expect(viewModel.isContent(scrollable.find('.dx-scrollable-container').getDOMNode())).toBe(true);
        });

        it('element is scrollbar', () => {
          const viewModel = new Scrollable({ direction: 'vertical' });

          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
          viewModel.scrollableRef = scrollable.getDOMNode();

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
