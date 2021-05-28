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
  ScrollableNativeProps,
  viewFunction,
} from '../scrollable_native';

import {
  ScrollDirection,
} from '../utils/scroll_direction';

import {
  SCROLLABLE_SCROLLBAR_SIMULATED,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
  TopPocketState,
} from '../common/consts';

import {
  getPermutations,
  optionValues,
} from './utils';

import getScrollRtlBehavior from '../../../../core/utils/scroll_rtl_behavior';
import { Scrollbar } from '../scrollbar';
import { ScrollableTestHelper } from './scrollable_native_test_helper';

interface Mock extends jest.Mock {}

jest.mock('../../../../core/utils/scroll_rtl_behavior');
jest.mock('../../../../core/utils/browser', () => ({ mozilla: false }));

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  const platform = actualDevices.real.bind(actualDevices);

  actualDevices.real = jest.fn(() => ({ platform: 'ios' }));
  actualDevices.current = jest.fn(platform);
  return actualDevices;
});

describe('Native > View', () => {
  it('render with defaults', () => {
    const props = new ScrollableNativeProps();
    const scrollable = mount<Scrollable>(<Scrollable {...props} />);

    expect(scrollable.props()).toEqual({
      bounceEnabled: true,
      direction: 'vertical',
      forceGeneratePockets: false,
      needScrollViewContentWrapper: false,
      needScrollViewLoadPanel: false,
      pullDownEnabled: false,
      reachBottomEnabled: false,
      scrollByContent: true,
      scrollByThumb: false,
      showScrollbar: 'onScroll',
      useNative: true,
    });
  });
});

describe('Native > Effects', () => {
  beforeEach(clearEventHandlers);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [true, true],
    [false, false],
  ])('change locked state when effectDisabledState was called, disabled: %s', (disabled, expected) => {
    const viewModel = new Scrollable({ disabled });

    viewModel.effectDisabledState();

    expect(viewModel.locked).toEqual(expected);
  });

  test.each(getPermutations([
    optionValues.allowedDirection,
    [true, false],
  ]))('emit "dxscroll" event, allowedDirection: %s, locked: %s', (allowedDirection, locked) => {
    const event = { ...defaultEvent, cancel: undefined, originalEvent: {} } as any;
    const viewModel = new Scrollable({ });
    (viewModel as any).wrapperRef = React.createRef();
    viewModel.locked = locked;
    viewModel.tryGetAllowedDirection = jest.fn(() => allowedDirection);

    viewModel.moveEffect();
    emit('dxscroll', event);

    if (allowedDirection && !locked) {
      expect(event.originalEvent.isScrollingEvent).toEqual(true);
    } else {
      expect(event.originalEvent.isScrollingEvent).toEqual(undefined);
    }
    expect(event.cancel).toEqual(locked ? true : undefined);
  });

  test.each(getPermutations([
    optionValues.forceGeneratePockets,
    optionValues.nativeRefreshStrategy,
    optionValues.pullDownEnabled,
    optionValues.pocketState,
    optionValues.useSimulatedScrollbar,
    optionValues.isReachBottom,
    [{ top: 2, left: 2 }, { top: -81, left: -81 }],
    [-1, -2, -3],
  ]))('Emit "scroll" event, forceGeneratePockets: %o, refreshStrategy: %o, pullDownEnabled: %o, pocketState: %o, useSimulatedScrollbar: %s, isReachBottom: %s, scrollLocation: %o,  prevLocationTop: %s,',
    (forceGeneratePockets, refreshStrategy, pullDownEnabled, pocketState,
      useSimulatedScrollbar, isReachBottom, scrollLocation, prevLocationTop) => {
      const event = {
        ...defaultEvent,
        stopImmediatePropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any;
      const viewModel = new Scrollable({
        useSimulatedScrollbar,
        forceGeneratePockets,
        pullDownEnabled,
      });
      Object.defineProperties(viewModel, {
        refreshStrategy: { get() { return refreshStrategy; } },
      });
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.topPocketRef = { current: { clientHeight: 80 } } as RefObject;
      viewModel.scrollLocation = jest.fn(() => scrollLocation);
      viewModel.moveScrollbars = jest.fn();
      viewModel.onReachBottom = jest.fn();
      viewModel.isReachBottom = jest.fn(() => isReachBottom);
      viewModel.topPocketState = pocketState;
      viewModel.pullDownOpacity = 0.5;
      viewModel.pullDownTranslateTop = 0;
      viewModel.pullDownIconAngle = 0;
      viewModel.locationTop = prevLocationTop;

      viewModel.scrollEffect();
      emit('scroll', event);

      expect(event.stopImmediatePropagation).not.toBeCalled();
      expect(viewModel.eventForUserAction).toEqual(event);

      if (useSimulatedScrollbar) {
        expect(viewModel.moveScrollbars).toHaveBeenCalledTimes(1);
      } else {
        expect(viewModel.moveScrollbars).not.toBeCalled();
      }

      let expectedTopPocketState = pocketState;
      let expectedPullDownOpacity = 0.5;
      const expectedPullDownTranslateTop = 0;
      const expectedPullDownIconAngle = 0;
      let onReachBottomCalled = false;

      const scrollDelta = prevLocationTop + scrollLocation.top;

      if (forceGeneratePockets) {
        if (pocketState !== TopPocketState.STATE_REFRESHING) {
          if (refreshStrategy === 'swipeDown') {
            if (scrollDelta > 0 && isReachBottom) {
              onReachBottomCalled = true;
            } else if (pocketState !== TopPocketState.STATE_RELEASED) {
              expectedTopPocketState = TopPocketState.STATE_RELEASED;
              expectedPullDownOpacity = 0;
            }
          }

          if (refreshStrategy === 'pullDown') {
            if (pullDownEnabled && scrollLocation.top <= -80) {
              if (pocketState !== TopPocketState.STATE_READY) {
                expectedTopPocketState = TopPocketState.STATE_READY;
              }
            } else if (scrollDelta > 0 && isReachBottom) {
              if (pocketState !== TopPocketState.STATE_LOADING) {
                expectedTopPocketState = TopPocketState.STATE_LOADING;
                onReachBottomCalled = true;
              }
            } else if (pocketState !== TopPocketState.STATE_RELEASED) {
              expectedTopPocketState = TopPocketState.STATE_RELEASED;
              expectedPullDownOpacity = 0;
            }
          }
        }
      }

      expect(viewModel.onReachBottom).toHaveBeenCalledTimes(onReachBottomCalled ? 1 : 0);
      expect(viewModel.topPocketState).toEqual(expectedTopPocketState);
      expect(viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(viewModel.pullDownTranslateTop).toEqual(expectedPullDownTranslateTop);
      expect(viewModel.pullDownIconAngle).toEqual(expectedPullDownIconAngle);
      expect(event.preventDefault).toHaveBeenCalledTimes(0);
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(0);
    });

  test.each(getPermutations([
    optionValues.forceGeneratePockets,
    optionValues.nativeRefreshStrategy,
    optionValues.pullDownEnabled,
    optionValues.pocketState,
    [1, 0, -1],
  ]))('Emit "dxscrollinit" event, forceGeneratePockets: %o, refreshStrategy: %o, pullDownEnabled: %o, pocketState: %o, containerScrollTop: %o',
    (forceGeneratePockets, refreshStrategy, pullDownEnabled, pocketState, containerScrollTop) => {
      const event = { ...defaultEvent, originalEvent: { pageY: 50 } } as any;
      const viewModel = new Scrollable({
        forceGeneratePockets,
        pullDownEnabled,
      });

      Object.defineProperties(viewModel, {
        refreshStrategy: { get() { return refreshStrategy; } },
      });

      viewModel.containerRef = {
        current: {
          scrollTop: containerScrollTop,
        },
      } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.topPocketState = pocketState;
      viewModel.initPageY = 0;

      viewModel.initEffect();
      emit('dxscrollinit', event);

      if (forceGeneratePockets && refreshStrategy === 'swipeDown'
          && pocketState === TopPocketState.STATE_RELEASED && containerScrollTop === 0) {
        expect(viewModel.initPageY).toEqual(50);
        expect(viewModel.topPocketState).toEqual(TopPocketState.STATE_TOUCHED);
      } else {
        expect(viewModel.initPageY).toEqual(0);
        expect(viewModel.topPocketState).toEqual(pocketState);
      }
    });

  test.each(getPermutations([
    optionValues.forceGeneratePockets,
    optionValues.nativeRefreshStrategy,
    optionValues.pullDownEnabled,
    optionValues.pocketState,
    [50, 100],
    [25, 75, 175, 200],
  ]))('Emit "dxscroll" event, locked: false, tryGetAllowedDirection: vertical, forceGeneratePockets: %o, refreshStrategy: %o, pullDownEnabled: %o, pocketState: %o, initPageY: %d, pageY: %d',
    (forceGeneratePockets, refreshStrategy, pullDownEnabled, pocketState, initPageY, pageY) => {
      const topPocketClientHeight = 40;
      const scrollableOffsetHeight = 200;
      const event = {
        ...defaultEvent,
        preventDefault: jest.fn(),
        stopImmediatePropagation: jest.fn(),
        originalEvent: { pageY },
      } as any;
      const viewModel = new Scrollable({
        forceGeneratePockets,
        pullDownEnabled,
      });

      Object.defineProperties(viewModel, {
        refreshStrategy: { get() { return refreshStrategy; } },
      });

      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.scrollableRef = {
        current: {
          offsetHeight: scrollableOffsetHeight,
        },
      } as RefObject;
      viewModel.topPocketRef = {
        current: {
          clientHeight: topPocketClientHeight,
        },
      } as RefObject;
      viewModel.tryGetAllowedDirection = jest.fn(() => 'vertical');
      viewModel.topPocketState = pocketState;
      viewModel.locked = false;
      viewModel.initPageY = initPageY;
      viewModel.pullDownOpacity = 0.5;
      viewModel.pullDownTranslateTop = 0;
      viewModel.pullDownIconAngle = 0;

      viewModel.moveEffect();
      emit('dxscroll', event);

      let expectedDeltaY = 0;
      let expectedTopPocketState = pocketState;
      let preventDefaultCalled = false;
      let expectedPullDownOpacity = 0.5;
      let expectedPullDownTranslateTop = 0;
      let expectedPullDownIconAngle = 0;

      if (forceGeneratePockets && refreshStrategy === 'swipeDown') {
        expectedDeltaY = pageY - initPageY;

        if (pocketState === TopPocketState.STATE_TOUCHED) {
          if (pullDownEnabled && (pageY - initPageY > 0)) {
            expectedTopPocketState = TopPocketState.STATE_PULLED;
          } else if (expectedTopPocketState === TopPocketState.STATE_PULLED
                          || expectedTopPocketState === TopPocketState.STATE_TOUCHED) {
            expectedTopPocketState = TopPocketState.STATE_RELEASED;
            expectedPullDownOpacity = 0;
          }
        }

        if (expectedTopPocketState === TopPocketState.STATE_PULLED
                      || pocketState === TopPocketState.STATE_PULLED) {
          preventDefaultCalled = true;
          expectedPullDownOpacity = 1;

          const height = Math.round(scrollableOffsetHeight * 0.05);
          const startPosition = -Math.round(topPocketClientHeight * 1.5);

          const top = Math.min(height * 3, expectedDeltaY + startPosition);
          const angle = (180 * top) / height / 3;

          expectedPullDownTranslateTop = top;
          expectedPullDownIconAngle = angle;
        }
      }

      expect(viewModel.deltaY).toEqual(expectedDeltaY);
      expect(viewModel.topPocketState).toEqual(expectedTopPocketState);
      expect(viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(viewModel.pullDownTranslateTop)
        .toEqual(expectedPullDownTranslateTop);
      expect(viewModel.pullDownIconAngle)
        .toEqual(expectedPullDownIconAngle);
      expect(event.preventDefault).toHaveBeenCalledTimes(preventDefaultCalled ? 1 : 0);
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(0);
    });

  test.each(getPermutations([
    optionValues.forceGeneratePockets,
    optionValues.nativeRefreshStrategy,
    optionValues.pullDownEnabled,
    optionValues.pocketState,
    optionValues.isSwipeDown,
  ]))('emit "dxscrollend" event, forceGeneratePockets: %o, refreshStrategy: %o, pullDownEnabled: %o, pocketState: %o, isSwipeDown: %o',
    (forceGeneratePockets, refreshStrategy, pullDownEnabled, pocketState, isSwipeDown) => {
      const topPocketClientHeight = 40;
      const scrollableOffsetHeight = 200;
      const event = {
        ...defaultEvent,
        preventDefault: jest.fn(),
        stopImmediatePropagation: jest.fn(),
      } as any;
      const viewModel = new Scrollable({
        forceGeneratePockets,
        pullDownEnabled,
      });

      Object.defineProperties(viewModel, {
        refreshStrategy: { get() { return refreshStrategy; } },
      });

      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.scrollableRef = {
        current: {
          offsetHeight: scrollableOffsetHeight,
        },
      } as RefObject;
      viewModel.topPocketRef = {
        current: {
          clientHeight: topPocketClientHeight,
        },
      } as RefObject;
      viewModel.isSwipeDown = jest.fn(() => isSwipeDown);
      viewModel.onPullDown = jest.fn();
      viewModel.pullDownComplete = jest.fn();
      viewModel.topPocketState = pocketState;
      viewModel.pullDownOpacity = 0.5;
      viewModel.pullDownTranslateTop = 0;
      viewModel.pullDownIconAngle = 0;

      viewModel.endEffect();
      emit('dxscrollend', event);

      const expectedDeltaY = 0;
      let expectedTopPocketState = pocketState;
      const preventDefaultCalled = false;
      let expectedPullDownOpacity = 0.5;
      let expectedPullDownTranslateTop = 0;
      const expectedPullDownIconAngle = 0;
      let onPullDownCalled = false;

      if (forceGeneratePockets && refreshStrategy === 'swipeDown') {
        if (isSwipeDown && pocketState !== TopPocketState.STATE_REFRESHING) {
          expectedTopPocketState = TopPocketState.STATE_REFRESHING;
          expectedPullDownTranslateTop = 10;
          onPullDownCalled = true;
        }

        if (expectedTopPocketState === TopPocketState.STATE_PULLED
            || expectedTopPocketState === TopPocketState.STATE_TOUCHED) {
          expectedTopPocketState = TopPocketState.STATE_RELEASED;
          expectedPullDownOpacity = 0;
        }

        if (refreshStrategy === 'pullDown') {
          expect(viewModel.pullDownComplete).toHaveBeenCalledTimes(1);
        }
      }

      expect(viewModel.deltaY).toEqual(expectedDeltaY);
      expect(viewModel.topPocketState).toEqual(expectedTopPocketState);
      expect(viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(viewModel.pullDownTranslateTop).toEqual(expectedPullDownTranslateTop);
      expect(viewModel.pullDownIconAngle).toEqual(expectedPullDownIconAngle);
      expect(viewModel.onPullDown).toHaveBeenCalledTimes(onPullDownCalled ? 1 : 0);
      expect(event.preventDefault).toHaveBeenCalledTimes(preventDefaultCalled ? 1 : 0);
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(0);
    });

  test.each(getPermutations([
    optionValues.forceGeneratePockets,
    optionValues.nativeRefreshStrategy,
    optionValues.pullDownEnabled,
    optionValues.pocketState,
  ]))('Emit "dxscrollstop" event, forceGeneratePockets: %o, refreshStrategy: %o, pullDownEnabled: %o, pocketState: %o',
    (forceGeneratePockets, refreshStrategy, pullDownEnabled, pocketState) => {
      jest.clearAllTimers();
      jest.useFakeTimers();

      const event = {
        ...defaultEvent,
        preventDefault: jest.fn(),
        stopImmediatePropagation: jest.fn(),
      } as any;
      const viewModel = new Scrollable({
        forceGeneratePockets,
        pullDownEnabled,
      });

      Object.defineProperties(viewModel, {
        refreshStrategy: { get() { return refreshStrategy; } },
      });

      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.topPocketRef = { current: { clientHeight: 80 } } as RefObject;
      viewModel.topPocketState = pocketState;
      viewModel.onPullDown = jest.fn();
      viewModel.pullDownOpacity = 0.5;
      viewModel.pullDownTranslateTop = 0;
      viewModel.pullDownIconAngle = 0;
      viewModel.contentTranslateTop = 0;

      viewModel.stopEffect();
      emit('dxscrollstop', event);

      const expectedDeltaY = 0;
      let expectedTopPocketState = pocketState;
      const preventDefaultCalled = false;
      let expectedPullDownOpacity = 0.5;
      const expectedPullDownTranslateTop = 0;
      const expectedPullDownIconAngle = 0;
      let expectedContentTranslateTop = 0;
      let onPullDownCalled = false;

      if (forceGeneratePockets && refreshStrategy === 'swipeDown') {
        if (expectedTopPocketState === TopPocketState.STATE_PULLED
            || expectedTopPocketState === TopPocketState.STATE_TOUCHED) {
          expectedTopPocketState = TopPocketState.STATE_RELEASED;
          expectedPullDownOpacity = 0;
        }
      }

      if (forceGeneratePockets && refreshStrategy === 'pullDown') {
        if (expectedTopPocketState === TopPocketState.STATE_READY) {
          expectedContentTranslateTop = 80;

          expect(setTimeout).toHaveBeenCalledTimes(1);
          expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 400);

          jest.runOnlyPendingTimers();

          if (pocketState !== TopPocketState.STATE_REFRESHING) {
            expectedTopPocketState = TopPocketState.STATE_REFRESHING;
            onPullDownCalled = true;
          }

          expect(viewModel.refreshTimer).not.toBe(undefined);

          viewModel.disposeRefreshTimer()();
          expect(viewModel.refreshTimer).toBe(undefined);
        }
      }

      expect(viewModel.onPullDown).toHaveBeenCalledTimes(onPullDownCalled ? 1 : 0);
      expect(viewModel.deltaY).toEqual(expectedDeltaY);
      expect(viewModel.topPocketState).toEqual(expectedTopPocketState);
      expect(viewModel.contentTranslateTop).toEqual(expectedContentTranslateTop);
      expect(viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(viewModel.pullDownTranslateTop).toEqual(expectedPullDownTranslateTop);
      expect(viewModel.pullDownIconAngle).toEqual(expectedPullDownIconAngle);
      expect(event.preventDefault).toHaveBeenCalledTimes(preventDefaultCalled ? 1 : 0);
      expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(0);
    });

  each([undefined, jest.fn()]).describe('handler: %o', (actionHandler) => {
    it('Update() should call onUpdated action', () => {
      const viewModel = new Scrollable({
        onUpdated: actionHandler,
      });

      viewModel.updateSizes = jest.fn();
      (viewModel as any).getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 3 } }));

      viewModel.update();

      if (actionHandler) {
        expect(actionHandler).toHaveBeenCalledTimes(1);
        expect(actionHandler).toHaveBeenLastCalledWith({ fakeEventArg: { value: 3 } });
      }
      expect(viewModel.updateSizes).toBeCalledTimes(1);
    });

    it('onReachBottom()', () => {
      const viewModel = new Scrollable({
        onReachBottom: actionHandler,
      });

      viewModel.onReachBottom();

      if (actionHandler) {
        expect(actionHandler).toHaveBeenCalledTimes(1);
        expect(actionHandler).toHaveBeenLastCalledWith({});
      }
    });

    test.each([true, false])('refresh(), loadingIndicatorEnabled: %o', (loadingIndicatorEnabled) => {
      const helper = new ScrollableTestHelper({
        onPullDown: actionHandler,
      });

      helper.viewModel.loadingIndicatorEnabled = loadingIndicatorEnabled;

      helper.viewModel.refresh();

      if (actionHandler) {
        expect(actionHandler).toHaveBeenCalledTimes(1);
        expect(actionHandler).toHaveBeenCalledWith({});
      }

      expect(helper.viewModel.topPocketState).toEqual(TopPocketState.STATE_READY);
      expect(helper.viewModel.loadingIndicatorEnabled).toEqual(loadingIndicatorEnabled);
      expect(helper.viewModel.isLoadPanelVisible).toEqual(loadingIndicatorEnabled);
      expect(helper.viewModel.locked).toEqual(true);
    });

    test.each(getPermutations([
      optionValues.pocketState,
      optionValues.nativeRefreshStrategy,
    ]))('refresh(), pocketState: %o, refreshStrategy: %o', (pocketState, refreshStrategy) => {
      jest.clearAllTimers();
      jest.useFakeTimers();

      const viewModel = new Scrollable({});

      (viewModel.releaseTimer as unknown as number) = 10;
      viewModel.topPocketState = pocketState;
      Object.defineProperties(viewModel, {
        refreshStrategy: { get() { return refreshStrategy; } },
      });
      viewModel.contentTranslateTop = 50;
      viewModel.pullDownOpacity = 0.5;
      viewModel.loadingIndicatorEnabled = false;

      viewModel.release();

      let expectedTopPocketState = pocketState;
      const expectedTimeout = refreshStrategy === 'swipeDown' ? 800 : 400;
      let expectedContentTranslateTop = 50;
      let expectedPullDownOpacity = 0.5;

      if (refreshStrategy === 'pullDown') {
        if (pocketState === TopPocketState.STATE_LOADING) {
          expectedTopPocketState = TopPocketState.STATE_RELEASED;
        }
      }

      expect(viewModel.releaseTimer).not.toBe(undefined);
      expect(viewModel.contentTranslateTop).toEqual(expectedContentTranslateTop);
      expect(viewModel.topPocketState).toEqual(expectedTopPocketState);

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), expectedTimeout);

      jest.runOnlyPendingTimers();

      if (refreshStrategy === 'pullDown') {
        expectedContentTranslateTop = 0;
      }

      if (expectedTopPocketState !== TopPocketState.STATE_RELEASED) {
        expectedTopPocketState = TopPocketState.STATE_RELEASED;
        expectedPullDownOpacity = 0;
      }

      expect(viewModel.contentTranslateTop).toEqual(expectedContentTranslateTop);
      expect(viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(viewModel.loadingIndicatorEnabled).toEqual(true);
      expect(viewModel.isLoadPanelVisible).toEqual(false);
      expect(viewModel.locked).toEqual(false);

      viewModel.disposeReleaseTimer()();
      expect(viewModel.releaseTimer).toBe(undefined);
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
    it('Direction()', () => {
      const viewModel = new Scrollable({ direction });

      expect(viewModel.direction.isVertical)
        .toEqual(direction === DIRECTION_VERTICAL || direction === DIRECTION_BOTH);
      expect(viewModel.direction.isHorizontal)
        .toEqual(direction === DIRECTION_HORIZONTAL || direction === DIRECTION_BOTH);
    });
  });

  test.each([{ clientHeight: 80 }, null])('topPocketHeight(), topPocketEl: %o', (topPocketEl) => {
    const viewModel = new Scrollable({ direction: 'vertical' });

    viewModel.topPocketRef = { current: topPocketEl } as RefObject<HTMLDivElement>;

    expect(viewModel.topPocketHeight).toEqual(topPocketEl ? 80 : 0);
  });

  test.each(getPermutations([
    optionValues.reachBottomEnabled,
    [{ top: 500, left: 500 }, { top: 499.5, left: 499.5 }, { top: 499.4, left: 499.4 },
      { top: 499.6, left: 499.6 }, { top: 550, left: 550 },
      { top: 549.4, left: 549.4 }, { top: 549.5, left: 549.5 }, { top: 549.6, left: 549.6 }],
    [{ clientHeight: 50 }, null],
  ]))('isReachBottom(), direction: vertical, reachBottomEnabled: %o, scrollLocation: %o, bottomPocketEl: %o',
    (reachBottomEnabled, scrollLocation, bottomPocketEl) => {
      const viewModel = new Scrollable({
        direction: 'vertical',
        reachBottomEnabled,
      });

      viewModel.bottomPocketRef = { current: bottomPocketEl } as RefObject;
      viewModel.containerRef = { current: { scrollHeight: 750, clientHeight: 200 } } as RefObject;
      viewModel.scrollLocation = jest.fn(() => scrollLocation);

      let expectedIsReachBottom = false;

      if (bottomPocketEl) {
        if (reachBottomEnabled && scrollLocation.top >= 499.5) {
          expectedIsReachBottom = true;
        }
      } else if (reachBottomEnabled && scrollLocation.top >= 549.5) {
        expectedIsReachBottom = true;
      }

      expect(viewModel.isReachBottom()).toEqual(expectedIsReachBottom);
    });

  test.each(getPermutations([
    optionValues.direction,
    optionValues.pocketState,
    optionValues.pullDownEnabled,
    [-10, 30, 69, 70, 100],
  ]))('isSwipeDown(), direction: %o, pocketState: %o, pullDownEnabled: %o, deltaY: %o', (direction, pocketState, pullDownEnabled, deltaY) => {
    const scrollableRef = {
      current: { offsetHeight: 200 },
    };
    const topPocketRef = {
      current: {
        clientHeight: 40,
      },
    };

    const viewModel = new Scrollable({
      direction,
      pullDownEnabled,
    });

    viewModel.topPocketState = pocketState;
    viewModel.deltaY = deltaY;
    (viewModel as any).scrollableRef = scrollableRef;
    (viewModel as any).topPocketRef = topPocketRef;

    if (pullDownEnabled && pocketState === TopPocketState.STATE_PULLED && deltaY >= 70) {
      expect(viewModel.isSwipeDown()).toBe(true);
    } else {
      expect(viewModel.isSwipeDown()).toBe(false);
    }
  });

  test.each(getPermutations([
    optionValues.direction,
    optionValues.nativeRefreshStrategy,
  ]))('isSwipeDownStrategy(), direction: %o, pocketState: %o', (direction, refreshStrategy) => {
    const viewModel = new Scrollable({ direction });

    Object.defineProperties(viewModel, {
      refreshStrategy: { get() { return refreshStrategy; } },
    });

    expect(viewModel.isSwipeDownStrategy).toEqual(refreshStrategy === 'swipeDown');
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

  describe('Public methods', () => {
    each(optionValues.rtlEnabled).describe('rtlEnabled: %o', (rtlEnabled) => {
      each(optionValues.useSimulatedScrollbar).describe('useSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
        each(optionValues.direction).describe('Direction: %o', (direction) => {
        // chrome 86 - true {decreasing: true, positive: false} - [-max, 0]
        // chrome 84 - false {decreasing: true, positive: true} - [0 -> max]
        // ie11 - true [max -> 0] - {decreasing: false, positive: true}
          each([{ decreasing: true, positive: false }, { decreasing: true, positive: true }, { decreasing: false, positive: true }]).describe('rtlBehavior: %o', (rtlBehavior) => {
            const isNativeINChrome86 = rtlEnabled
              && rtlBehavior.decreasing && !rtlBehavior.positive;
            const isNativeINIE11 = rtlEnabled && !rtlBehavior.decreasing && rtlBehavior.positive;

            const getInitialOffsetLeft = (value) => {
              const maxLeftOffset = 300;

              if (isNativeINChrome86) {
                return value - maxLeftOffset;
              }

              if (isNativeINIE11) {
                return -value + maxLeftOffset;
              }

              return value;
            };

            each([
              [{ top: 150, left: 50 }, 0, { top: 0, left: 0 }],
              [{ top: 150, left: 0 }, 200, { top: 200, left: 200 }],
              [{ top: 150, left: 0 }, { top: 100, left: 70 }, { top: 100, left: 70 }],
              [{ top: 150, left: 0 }, { top: 70, left: 100 }, { top: 70, left: 100 }],
              [{ top: 150, left: 50 }, { top: 100 }, { top: 100, left: 50 }],
              [{ top: 100, left: 50 }, { left: 100 }, { top: 100, left: 100 }],
              [{ top: 150, left: 150 }, undefined, { top: 150, left: 150 }],
              [{ top: 150, left: 150 }, {}, { top: 150, left: 150 }],
            ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollToValue, expected) => {
              it(`ScrollTo(${JSON.stringify(scrollToValue)})`, () => {
                (getScrollRtlBehavior as jest.Mock).mockReturnValue(rtlBehavior);

                const helper = new ScrollableTestHelper({
                  direction,
                  rtlEnabled,
                  useSimulatedScrollbar,
                  showScrollbar: 'always',
                  contentSize: 600,
                  containerSize: 300,
                });

                const initialPosition = {
                  top: initialScrollPosition.top,
                  left: getInitialOffsetLeft(initialScrollPosition.left),
                };
                if (useSimulatedScrollbar) {
                  helper.initScrollbarSettings();
                }
                helper.initContainerPosition(initialPosition);
                helper.viewModel.handlePocketState = jest.fn();

                helper.viewModel.scrollTo(scrollToValue);
                if (useSimulatedScrollbar) {
                  helper.viewModel.scrollEffect();
                  emit('scroll');
                }

                const { ...expectedScrollOffset } = expected;

                expectedScrollOffset.top = helper.isVertical
                  ? expected.top : initialScrollPosition.top;
                expectedScrollOffset.left = helper.isHorizontal
                  ? expected.left : initialScrollPosition.left;

                expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
                if (useSimulatedScrollbar) {
                  expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
                  expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
                }
              });
            });

            each([
              [{ top: 150, left: 0 }, 100, { top: 250, left: 100 }],
              [{ top: 150, left: 0 }, { top: 100 }, { top: 250, left: 0 }],
              [{ top: 150, left: 0 }, { left: 100 }, { top: 150, left: 100 }],
              [{ top: 0, left: 0 }, -50, { top: -50, left: -50 }],
              [{ top: 100, left: 150 }, -50, { top: 50, left: 100 }],
              [{ top: 150, left: 0 }, { top: -50, left: 70 }, { top: 100, left: 70 }],
              [{ top: 150, left: 150 }, 300, { top: 450, left: 450 }],
              [{ top: 150, left: 150 }, undefined, { top: 150, left: 150 }],
              [{ top: 150, left: 150 }, {}, { top: 150, left: 150 }],
            ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollByValue, expected) => {
              it(`ScrollBy(${JSON.stringify(scrollByValue)})`, () => {
                (getScrollRtlBehavior as jest.Mock).mockReturnValue(rtlBehavior);

                const helper = new ScrollableTestHelper({
                  direction,
                  rtlEnabled,
                  useSimulatedScrollbar,
                  showScrollbar: 'always',
                  contentSize: 600,
                  containerSize: 300,
                });

                const initialPosition = {
                  top: initialScrollPosition.top,
                  left: getInitialOffsetLeft(initialScrollPosition.left),
                };
                if (useSimulatedScrollbar) {
                  helper.initScrollbarSettings();
                }
                helper.initContainerPosition(initialPosition);
                helper.viewModel.handlePocketState = jest.fn();

                helper.viewModel.scrollBy(scrollByValue);
                if (useSimulatedScrollbar) {
                  helper.viewModel.scrollEffect();
                  emit('scroll');
                }

                const { ...expectedScrollOffset } = expected;

                expectedScrollOffset.top = helper.isVertical
                  ? expected.top : initialScrollPosition.top;
                expectedScrollOffset.left = helper.isHorizontal
                  ? expected.left : initialScrollPosition.left;

                expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
                if (useSimulatedScrollbar) {
                  expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
                  expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
                }
              });
            });
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
      const viewModel = new Scrollable({});
      viewModel.containerRef = { current: { clientWidth: 120 } } as RefObject<HTMLDivElement>;

      expect(viewModel.clientWidth()).toEqual(120);
    });
  });

  describe('Validate(event)', () => {
    each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH, undefined]).describe('allowedDirection: %o', (allowedDirection) => {
      each([true, false]).describe('isScrollingOutOfBound: %o', (isScrollingOutOfBound) => {
        it('isWheelEvent: true, disabled: false, locked: false', () => {
          const event = { ...defaultEvent, type: 'dxmousewheel' } as any;

          const scrollable = new Scrollable({ disabled: false });
          scrollable.locked = false;
          scrollable.isScrollingOutOfBound = jest.fn(() => isScrollingOutOfBound);
          scrollable.tryGetAllowedDirection = jest.fn(() => allowedDirection);
          scrollable.update = jest.fn();

          let expectedValidateResult = false;

          if (!isScrollingOutOfBound) {
            expectedValidateResult = !!allowedDirection;
          }

          const actualValidateResult = scrollable.validate(event);

          expect(scrollable.isScrollingOutOfBound).toHaveBeenCalledTimes(1);
          expect(actualValidateResult).toEqual(expectedValidateResult);
        });
      });

      each([true, false]).describe('isWheelEvent: %o', (isWheelEvent) => {
        it(`isScrollingOutOfBound: true, isWheelEvent: ${isWheelEvent}, disabled: false, locked: false`, () => {
          const event = { ...defaultEvent } as any;
          if (isWheelEvent) {
            event.type = 'dxmousewheel';
          }

          const scrollable = new Scrollable({ disabled: false });
          scrollable.locked = false;
          scrollable.isScrollingOutOfBound = jest.fn(() => true);
          scrollable.tryGetAllowedDirection = jest.fn(() => allowedDirection);
          scrollable.update = jest.fn();

          let expectedValidateResult = false;

          if (!isWheelEvent) {
            expectedValidateResult = !!allowedDirection;
          }

          expect(scrollable.validate(event)).toEqual(expectedValidateResult);
        });
      });
    });
  });

  describe('isScrollingOutOfBound(event)', () => {
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
          const event = { delta, shiftKey } as any;
          const scrollable = new Scrollable({});
          (scrollable as any).containerRef = containerRef;

          if (delta > 0) {
            expect(scrollable.isScrollingOutOfBound(event)).toEqual(true);
          } else {
            expect(scrollable.isScrollingOutOfBound(event)).toEqual(false);
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
          const event = { delta, shiftKey } as any;
          const scrollable = new Scrollable({});
          (scrollable as any).containerRef = containerRef;

          if (delta > 0) {
            expect(scrollable.isScrollingOutOfBound(event)).toEqual(false);
          } else {
            expect(scrollable.isScrollingOutOfBound(event)).toEqual(false);
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
          const event = { delta, shiftKey } as any;
          const scrollable = new Scrollable({});
          (scrollable as any).containerRef = containerRef;

          if (delta > 0) {
            expect(scrollable.isScrollingOutOfBound(event)).toEqual(false);
          } else {
            expect(scrollable.isScrollingOutOfBound(event)).toEqual(true);
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
      it('should move scrollbar', () => {
        jest.clearAllTimers();
        jest.useFakeTimers();

        const viewModel = new Scrollable({
          direction,
        });

        viewModel.scrollOffset = () => ({ top: 2, left: 4 });
        viewModel.moveScrollbars();

        const { isVertical, isHorizontal } = new ScrollDirection(direction);

        if (isVertical) {
          expect(viewModel.vScrollLocation).toEqual(-2);
        }
        if (isHorizontal) {
          expect(viewModel.hScrollLocation).toEqual(-4);
        }

        expect(viewModel.needForceScrollbarsVisibility).toEqual(true);

        expect(viewModel.hideScrollbarTimer === undefined).toBe(false);

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);

        expect(viewModel.needForceScrollbarsVisibility).toEqual(true);

        jest.runOnlyPendingTimers();

        expect(viewModel.needForceScrollbarsVisibility).toEqual(false);

        viewModel.disposeHideScrollbarTimer()();
        expect(viewModel.hideScrollbarTimer).toBe(undefined);
      });
    });
  });
});

describe('Scrollbar integration', () => {
  test.each(getPermutations([
    optionValues.direction,
    [...optionValues.useSimulatedScrollbar, undefined],
    optionValues.platforms,
  ]))('cssClasses, direction: %o, useSimulatedScrollbar: %o, platform: %o',
    (direction, useSimulatedScrollbar, platform) => {
      (devices.real as Mock).mockImplementation(() => ({ platform }));

      const viewModel = new Scrollable({
        direction,
        useSimulatedScrollbar,
        showScrollbar: 'onScroll',
      });
      (viewModel as any).contentRef = React.createRef();
      (viewModel as any).containerRef = React.createRef();

      const scrollable = mount(viewFunction(viewModel));
      const scrollBar = scrollable.find(Scrollbar);

      expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollable'));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching(`dx-scrollable-native-${platform}`));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollable-renovated'));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching(`dx-scrollable-${direction}`));

      let expectedScrollbarsCount = 0;
      if (useSimulatedScrollbar || (useSimulatedScrollbar === undefined && platform === 'android')) {
        expectedScrollbarsCount = direction === 'both' ? 2 : 1;
        expect(viewModel.cssClasses).toEqual(
          expect.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED),
        );
      } else {
        expect(viewModel.cssClasses).toEqual(
          expect.not.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED),
        );
      }

      expect(scrollBar.length).toBe(expectedScrollbarsCount);
    });

  test.each(getPermutations([
    optionValues.direction,
    optionValues.useSimulatedScrollbar,
    optionValues.platforms,
    ['desktop', 'phone', 'tablet'],
  ]))('Should assign swipeDown, pullDown strategy, direction: %o, useSimulatedScrollbar: %o, platform: %o, deviceType: %o',
    (direction, useSimulatedScrollbar, platform, deviceType) => {
      (devices.real as Mock).mockImplementation(() => ({ platform, deviceType }));
      (devices.current as Mock).mockImplementation(() => ({ platform }));

      const viewModel = new Scrollable({
        useSimulatedScrollbar,
        showScrollbar: 'onScroll',
        direction,
      });

      expect(viewModel.refreshStrategy).toEqual(platform === 'android' ? 'swipeDown' : 'pullDown');
    });
});
