import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';
import {
  RefObject,
} from '@devextreme-generator/declarations';

import devices from '../../../../../core/devices';
import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../../test_utils/events_mock';
import {
  ScrollableNative as Scrollable,
  viewFunction,
} from '../native';

import {
  ScrollDirection,
} from '../../utils/scroll_direction';

import {
  SCROLLABLE_SCROLLBAR_SIMULATED,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
  TopPocketState,
} from '../../common/consts';

import {
  getPermutations,
  optionValues,
} from '../../__tests__/utils';
import { Scrollbar } from '../../scrollbar/scrollbar';
import { ScrollableTestHelper } from './native_test_helper';
import { ScrollableNativeProps } from '../../common/native_strategy_props';
import {
  allowedDirection,
} from '../../utils/get_allowed_direction';
import { subscribeToResize } from '../../utils/subscribe_to_resize';

interface Mock extends jest.Mock {}

jest.mock('../../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../../core/devices').default;
  const platform = actualDevices.real.bind(actualDevices);

  actualDevices.real = jest.fn(() => ({ platform: 'ios' }));
  actualDevices.current = jest.fn(platform);
  return actualDevices;
});

jest.mock('../../utils/get_allowed_direction', () => ({
  ...jest.requireActual('../../utils/get_allowed_direction'),
  allowedDirection: jest.fn(() => 'vertical'),
}));

jest.mock('../../utils/subscribe_to_resize', () => ({
  ...jest.requireActual('../../utils/subscribe_to_resize'),
  subscribeToResize: jest.fn(),
}));

describe('Native > View', () => {
  it('render with defaults', () => {
    const props = new ScrollableNativeProps();
    const scrollable = mount<Scrollable>(<Scrollable {...props} />);

    expect(scrollable.props()).toEqual({
      addWidgetClass: false,
      aria: {},
      bounceEnabled: true,
      classes: '',
      direction: 'vertical',
      disabled: false,
      forceGeneratePockets: false,
      needScrollViewContentWrapper: false,
      needRenderScrollbars: true,
      pullDownEnabled: false,
      pulledDownText: 'Release to refresh...',
      pullingDownText: 'Pull down to refresh...',
      reachBottomEnabled: false,
      reachBottomText: 'Loading...',
      refreshStrategy: 'pullDown',
      refreshingText: 'Refreshing...',
      scrollByContent: true,
      showScrollbar: 'onScroll',
      useSimulatedScrollbar: false,
      visible: true,
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
    const helper = new ScrollableTestHelper({ disabled });

    helper.viewModel.effectDisabledState();

    expect(helper.viewModel.locked).toEqual(expected);
  });

  test.each(getPermutations([
    optionValues.allowedDirection,
    [true, false],
  ]))('emit "dxscroll" event, allowedDirection: %s, locked: %s', (allowedDir, locked) => {
    (allowedDirection as jest.Mock).mockReturnValue(allowedDir);

    const event = { ...defaultEvent, cancel: undefined, originalEvent: {} } as any;
    const helper = new ScrollableTestHelper({});
    helper.viewModel.locked = locked;

    helper.viewModel.moveEffect();
    emit('dxscroll', event);

    if (allowedDir && !locked) {
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
      useSimulatedScrollbar, isReachBottom, scrollLocation, prevLocationTop: number) => {
      const event = {
        ...defaultEvent,
        stopImmediatePropagation: jest.fn(),
        preventDefault: jest.fn(),
      } as any;
      const viewModel = new Scrollable({
        useSimulatedScrollbar,
        forceGeneratePockets,
        pullDownEnabled,
        refreshStrategy,
      });

      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.containerRef = {
        current: {
          scrollTop: scrollLocation.top,
          scrollLeft: scrollLocation.left,
        },
      } as RefObject;
      viewModel.topPocketHeight = 80;
      viewModel.syncScrollbarsWithContent = jest.fn();
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
        expect(viewModel.syncScrollbarsWithContent).toHaveBeenCalledTimes(1);
      } else {
        expect(viewModel.syncScrollbarsWithContent).not.toBeCalled();
      }

      let expectedTopPocketState = pocketState;
      let expectedPullDownOpacity = 0.5;
      const expectedPullDownTranslateTop = 0;
      const expectedPullDownIconAngle = 0;
      let onReachBottomCalled = false;

      const scrollDelta = prevLocationTop + (scrollLocation.top as number);

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
        refreshStrategy,
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
      const topPocketHeight = 40;
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
        refreshStrategy,
      });

      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.scrollableRef = {
        current: {
          offsetHeight: scrollableOffsetHeight,
        },
      } as RefObject;
      viewModel.topPocketHeight = topPocketHeight;
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
          const startPosition = -Math.round(topPocketHeight * 1.5);

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
      const topPocketHeight = 40;
      const scrollableOffsetHeight = 200;
      const event = {
        ...defaultEvent,
        preventDefault: jest.fn(),
        stopImmediatePropagation: jest.fn(),
      } as any;
      const viewModel = new Scrollable({
        forceGeneratePockets,
        pullDownEnabled,
        refreshStrategy,
      });

      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.scrollableRef = {
        current: {
          offsetHeight: scrollableOffsetHeight,
        },
      } as RefObject;
      viewModel.topPocketHeight = topPocketHeight;
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
        refreshStrategy,
      });

      viewModel.containerRef = { current: {} } as RefObject;
      viewModel.wrapperRef = { current: {} } as RefObject;
      viewModel.topPocketHeight = 80;
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

      viewModel.updateElementDimensions = jest.fn();
      (viewModel as any).getEventArgs = jest.fn(() => ({ fakeEventArg: { value: 3 } }));

      viewModel.updateHandler();

      if (actionHandler) {
        expect(actionHandler).toHaveBeenCalledTimes(1);
        expect(actionHandler).toHaveBeenLastCalledWith({ fakeEventArg: { value: 3 } });
      }
      expect(viewModel.updateElementDimensions).toBeCalledTimes(1);
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

      const helper = new ScrollableTestHelper({
        refreshStrategy,
      });

      (helper.viewModel.releaseTimer as number) = 10;
      helper.viewModel.topPocketState = pocketState;
      helper.viewModel.contentTranslateTop = 50;
      helper.viewModel.pullDownOpacity = 0.5;
      helper.viewModel.loadingIndicatorEnabled = false;
      helper.viewModel.getEventArgs = jest.fn();

      helper.viewModel.release();

      let expectedTopPocketState = pocketState;
      const expectedTimeout = refreshStrategy === 'swipeDown' ? 800 : 400;
      let expectedContentTranslateTop = 50;
      let expectedPullDownOpacity = 0.5;

      if (refreshStrategy === 'pullDown') {
        if (pocketState === TopPocketState.STATE_LOADING) {
          expectedTopPocketState = TopPocketState.STATE_RELEASED;
        }
      }

      expect(helper.viewModel.releaseTimer).not.toBe(undefined);
      expect(helper.viewModel.contentTranslateTop).toEqual(expectedContentTranslateTop);
      expect(helper.viewModel.topPocketState).toEqual(expectedTopPocketState);

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

      expect(helper.viewModel.contentTranslateTop).toEqual(expectedContentTranslateTop);
      expect(helper.viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(helper.viewModel.loadingIndicatorEnabled).toEqual(true);
      expect(helper.viewModel.isLoadPanelVisible).toEqual(false);
      expect(helper.viewModel.locked).toEqual(false);

      helper.viewModel.disposeReleaseTimer()();
      expect(helper.viewModel.releaseTimer).toBe(undefined);
    });
  });

  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
    it('resetInactiveOffsetToInitial()', () => {
      const containerRef = {
        current: {
          scrollTop: 20,
          scrollLeft: 30,
        },
      } as RefObject<HTMLDivElement>;

      const viewModel = new Scrollable({ direction });
      viewModel.containerRef = containerRef;

      viewModel.resetInactiveOffsetToInitial();

      expect(viewModel.containerRef.current).toEqual({
        scrollTop: direction === 'horizontal' ? 0 : 20,
        scrollLeft: direction === 'vertical' ? 0 : 30,
      });
    });
  });

  each([true, false]).describe('useSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
    it('updateDimensions()', () => {
      const viewModel = new Scrollable({ useSimulatedScrollbar });
      viewModel.containerClientWidth = 1;
      viewModel.containerClientHeight = 2;

      viewModel.contentClientWidth = 3;
      viewModel.contentClientHeight = 4;
      viewModel.contentScrollWidth = 5;
      viewModel.contentScrollHeight = 6;

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
          scrollWidth: 50,
          scrollHeight: 60,
        },
      } as RefObject;

      viewModel.containerRef = containerRef;
      viewModel.contentRef = contentRef;

      viewModel.updateDimensions();

      expect(viewModel.containerClientWidth).toEqual(10);
      expect(viewModel.containerClientHeight).toEqual(20);
      expect(viewModel.contentClientWidth).toEqual(30);
      expect(viewModel.contentClientHeight).toEqual(40);
      expect(viewModel.contentScrollWidth).toEqual(50);
      expect(viewModel.contentScrollHeight).toEqual(60);
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

  each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
    each(optionValues.nativeRefreshStrategy).describe('refreshStrategy: %o', (refreshStrategy) => {
      it('contentStyles()', () => {
        const viewModel = new Scrollable({
          direction: 'vertical',
          forceGeneratePockets,
          refreshStrategy,
        });

        const contentTranslateTopValue = 100;
        viewModel.contentTranslateTop = contentTranslateTopValue;

        if (forceGeneratePockets && refreshStrategy === 'pullDown') {
          expect(viewModel.contentStyles).toEqual({ transform: `translate(0px, ${contentTranslateTopValue}px)` });
        } else {
          expect(viewModel.contentStyles).toEqual(undefined);
        }
      });
    });
  });

  test.each([true, false])('setContentHeight(), forceGeneratePockets: %o', (forceGeneratePockets) => {
    const viewModel = new Scrollable({ direction: 'vertical', forceGeneratePockets });

    viewModel.topPocketRef = { current: { clientHeight: 80 } } as RefObject<HTMLDivElement>;
    viewModel.bottomPocketRef = { current: { clientHeight: 50 } } as RefObject<HTMLDivElement>;

    viewModel.setContentHeight({} as HTMLDivElement);

    expect(viewModel.topPocketHeight).toEqual(forceGeneratePockets ? 80 : 0);
    expect(viewModel.bottomPocketHeight).toEqual(forceGeneratePockets ? 50 : 0);
  });

  test.each([true, false])('setContentHeight(), pockets are not defined, forceGeneratePockets: %o', (forceGeneratePockets) => {
    const viewModel = new Scrollable({ direction: 'vertical', forceGeneratePockets });

    viewModel.topPocketRef = undefined as any;
    viewModel.bottomPocketRef = undefined as any;

    viewModel.setContentHeight({} as HTMLDivElement);

    expect(viewModel.topPocketHeight).toEqual(0);
    expect(viewModel.bottomPocketHeight).toEqual(0);
  });

  it('should subscribe contentElement to resize event', () => {
    const subscribeToResizeHandler = jest.fn();
    (subscribeToResize as jest.Mock).mockImplementation(subscribeToResizeHandler);

    const viewModel = new Scrollable({ });
    viewModel.contentRef = { current: { clientHeight: 10 } as HTMLElement } as RefObject;
    viewModel.setContentHeight = jest.fn();
    viewModel.setContentWidth = jest.fn();

    viewModel.subscribeContentToResize();

    expect(subscribeToResizeHandler).toBeCalledTimes(1);
    expect(subscribeToResizeHandler.mock.calls[0][0]).toEqual({ clientHeight: 10 });

    subscribeToResizeHandler.mock.calls[0][1](viewModel.contentRef);

    expect(viewModel.setContentHeight).toBeCalledTimes(1);
    expect(viewModel.setContentWidth).toBeCalledWith(viewModel.contentRef);

    expect(viewModel.setContentHeight).toBeCalledTimes(1);
    expect(viewModel.setContentWidth).toBeCalledWith(viewModel.contentRef);
  });

  test.each(getPermutations([
    optionValues.reachBottomEnabled,
    [
      550, 549.6, 549.5, 549.4, 500, 499.6, 499.5, 499.4, 499.01,
      498.99, 498.51, 498.50, 498.49,
    ],
  ]))('isReachBottom(), direction: vertical, reachBottomEnabled: %o, scrollLocation: %o',
    (reachBottomEnabled, scrollTop) => {
      const helper = new ScrollableTestHelper({
        direction: 'vertical',
        reachBottomEnabled,
      });

      helper.viewModel.bottomPocketHeight = reachBottomEnabled ? 50 : 0;

      const maxOffset = -500;
      Object.defineProperties(helper.viewModel, {
        vScrollOffsetMax: { get() { return maxOffset; } },
      });
      helper.viewModel.containerRef = { current: { scrollTop } } as RefObject;

      expect(helper.viewModel.isReachBottom())
        .toEqual(reachBottomEnabled && scrollTop > 498.50);
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

    const viewModel = new Scrollable({
      direction,
      pullDownEnabled,
    });

    viewModel.topPocketState = pocketState;
    viewModel.deltaY = deltaY;
    (viewModel as any).scrollableRef = scrollableRef;
    viewModel.topPocketHeight = 40;

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
    const viewModel = new Scrollable({
      direction,
      refreshStrategy,
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
    const getInitialOffsetLeft = (value, rtlEnabled) => {
      const maxLeftOffset = 300;

      if (rtlEnabled) {
        return value - maxLeftOffset;
      }

      return value;
    };

    each(optionValues.direction).describe('direction: %o', (direction) => {
      each(optionValues.useSimulatedScrollbar).describe('useSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
        afterEach(() => {
          jest.clearAllMocks();
        });

        each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
          each([
            [{ top: 150, left: 0 }, { top: 100, left: 100 }, { top: 250, left: 100 }],
            [{ top: 150, left: 0 }, { top: 100, left: 0 }, { top: 250, left: 0 }],
            [{ top: 150, left: 0 }, { top: 0, left: 100 }, { top: 150, left: 100 }],
            [{ top: 0, left: 0 }, { top: -50, left: -50 }, { top: -50, left: -50 }],
            [{ top: 100, left: 150 }, { top: -50, left: -50 }, { top: 50, left: 100 }],
            [{ top: 150, left: 0 }, { top: -50, left: 70 }, { top: 100, left: 70 }],
            [{ top: 150, left: 150 }, { top: 300, left: 300 }, { top: 450, left: 450 }],
          ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollByValue, expected) => {
            it(`scrollByLocation(${JSON.stringify(scrollByValue)})`, () => {
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
                left: getInitialOffsetLeft(initialScrollPosition.left, rtlEnabled),
              };
              if (useSimulatedScrollbar) {
                helper.initScrollbarSettings();
              }
              helper.initContainerPosition(initialPosition);
              helper.viewModel.handlePocketState = jest.fn();
              helper.viewModel.getEventArgs = jest.fn();

              helper.viewModel.scrollByLocation(scrollByValue);

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
    each(optionValues.allowedDirection).describe('allowedDirection: %o', (allowedDir) => {
      each([true, false]).describe('isScrollingOutOfBound: %o', (isScrollingOutOfBound) => {
        it('isWheelEvent: true, disabled: false, locked: false', () => {
          (allowedDirection as jest.Mock).mockReturnValue(allowedDir);
          const event = { ...defaultEvent, type: 'dxmousewheel' } as any;

          const helper = new ScrollableTestHelper({ disabled: false });
          helper.viewModel.locked = false;
          helper.viewModel.isScrollingOutOfBound = jest.fn(() => isScrollingOutOfBound);
          helper.viewModel.updateHandler = jest.fn();

          let expectedValidateResult = false;

          if (!isScrollingOutOfBound) {
            expectedValidateResult = !!allowedDir;
          }

          const actualValidateResult = helper.viewModel.validate(event);

          expect(helper.viewModel.isScrollingOutOfBound).toHaveBeenCalledTimes(1);
          expect(actualValidateResult).toEqual(expectedValidateResult);
        });
      });

      each([true, false]).describe('isWheelEvent: %o', (isWheelEvent) => {
        it(`isScrollingOutOfBound: true, isWheelEvent: ${isWheelEvent}, disabled: false, locked: false`, () => {
          (allowedDirection as jest.Mock).mockReturnValue(allowedDir);

          const event = { ...defaultEvent } as any;
          if (isWheelEvent) {
            event.type = 'dxmousewheel';
          }

          const helper = new ScrollableTestHelper({ disabled: false });
          helper.viewModel.locked = false;
          helper.viewModel.isScrollingOutOfBound = jest.fn(() => true);
          helper.viewModel.updateHandler = jest.fn();

          let expectedValidateResult = false;

          if (!isWheelEvent) {
            expectedValidateResult = !!allowedDir;
          }

          expect(helper.viewModel.validate(event)).toEqual(expectedValidateResult);
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

  describe('syncScrollbarsWithContent', () => {
    each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
      it('should move scrollbar', () => {
        jest.clearAllTimers();
        jest.useFakeTimers();

        const viewModel = new Scrollable({
          direction,
        });

        viewModel.scrollOffset = () => ({ top: 2, left: 4 });
        viewModel.syncScrollbarsWithContent();

        const { isVertical, isHorizontal } = new ScrollDirection(direction);

        if (isVertical) {
          expect(viewModel.vScrollLocation).toEqual(-2);
        }
        if (isHorizontal) {
          expect(viewModel.hScrollLocation).toEqual(-4);
        }
      });
    });
  });
});

describe('Scrollbar integration', () => {
  test.each(getPermutations([
    optionValues.direction,
    optionValues.useSimulatedScrollbar,
    optionValues.platforms,
  ]))('cssClasses, direction: %o, useSimulatedScrollbar: %o, platform: %o',
    (direction, useSimulatedScrollbar, platform) => {
      (devices.real as Mock).mockImplementation(() => ({ platform }));
      const viewModel = new Scrollable({
        direction,
        useSimulatedScrollbar,
        needRenderScrollbars: true,
      });
      (viewModel as any).contentRef = React.createRef();
      (viewModel as any).containerRef = React.createRef();

      const scrollable = mount(viewFunction(viewModel));
      const scrollBar = scrollable.find(Scrollbar);

      expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollable'));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching(`dx-scrollable-native-${platform}`));
      expect(viewModel.cssClasses).toEqual(expect.stringMatching(`dx-scrollable-${direction}`));

      let expectedScrollbarsCount = 0;
      if (useSimulatedScrollbar) {
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

  each(optionValues.direction).describe('direction: %o', (direction) => {
    it('should render and pass showScrollbar: "onScroll" value to scrollbars', () => {
      const helper = new ScrollableTestHelper({
        direction,
        useSimulatedScrollbar: true,
        showScrollbar: 'always', // should not affect
      });

      const scrollbars = helper.getScrollbars();

      const commonOptions = {
        containerSize: 0,
        contentSize: 0,
        maxOffset: -0,
        scrollLocation: 0,
        visible: false,
        showScrollbar: 'onScroll',
      };
      const vScrollbarClasses = 'dx-scrollable-scrollbar dx-scrollbar-vertical dx-state-invisible';
      const hScrollbarClasses = 'dx-scrollable-scrollbar dx-scrollbar-horizontal dx-state-invisible';

      if (helper.isBoth) {
        expect(scrollbars.length).toEqual(2);
        expect(scrollbars.at(0).props())
          .toEqual({ ...commonOptions, direction: DIRECTION_HORIZONTAL });
        expect(scrollbars.at(1).props())
          .toEqual({ ...commonOptions, direction: DIRECTION_VERTICAL });
        expect(scrollbars.at(0).getDOMNode().className).toBe(hScrollbarClasses);
        expect(scrollbars.at(1).getDOMNode().className).toBe(vScrollbarClasses);
      } else if (helper.isVertical) {
        expect(scrollbars.length).toEqual(1);
        expect(scrollbars.at(0).props())
          .toEqual({ ...commonOptions, direction: DIRECTION_VERTICAL });
        expect(scrollbars.at(0).getDOMNode().className).toBe(vScrollbarClasses);
      } else if (helper.isHorizontal) {
        expect(scrollbars.length).toEqual(1);
        expect(scrollbars.at(0).props())
          .toEqual({ ...commonOptions, direction: DIRECTION_HORIZONTAL });
        expect(scrollbars.at(0).getDOMNode().className).toBe(hScrollbarClasses);
      }
    });
  });
});
