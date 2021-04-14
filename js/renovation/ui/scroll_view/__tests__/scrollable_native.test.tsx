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
  TopPocketState,
} from '../common/consts';

import {
  getPermutations,
  createTargetElement, normalizeRtl, calculateRtlScrollLeft, createContainerRef, createElement,
  optionValues,
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
  actualDevices.real = jest.fn(() => ({ platform: 'ios' }));
  return actualDevices;
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
    const e = { ...defaultEvent, cancel: undefined, originalEvent: {} } as any;
    const viewModel = new Scrollable({ });
    (viewModel as any).wrapperRef = React.createRef();
    viewModel.locked = locked;
    viewModel.tryGetAllowedDirection = jest.fn(() => allowedDirection);

    viewModel.moveEffect();
    emit('dxscroll', e);

    if (allowedDirection && !locked) {
      expect(e.originalEvent.isScrollingEvent).toEqual(true);
    } else {
      expect(e.originalEvent.isScrollingEvent).toEqual(undefined);
    }
    expect(e.cancel).toEqual(locked ? true : undefined);
  });

  // it('handleScroll, location not changed', () => {
  //   const e = { ...defaultEvent, stopImmediatePropagation: jest.fn() } as any;
  //   const viewModel = new Scrollable({ });
  //   viewModel.containerRef = { current: {} } as RefObject;
  //   viewModel.lastLocation = { top: 1, left: 1 };
  //   viewModel.scrollLocation = () => ({ top: 1, left: 1 });

  //   viewModel.scrollEffect();
  //   emit('scroll', e);

  //   expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(1);
  // });

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
      const e = {
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
      viewModel.lastLocation = { top: -1, left: -1 };
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
      emit('scroll', e);

      expect(e.stopImmediatePropagation).not.toBeCalled();
      expect(viewModel.eventForUserAction).toEqual(e);
      expect(viewModel.lastLocation).toEqual(scrollLocation);

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
      expect(e.preventDefault).toHaveBeenCalledTimes(0);
      expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(0);
    });

  test.each(getPermutations([
    optionValues.forceGeneratePockets,
    optionValues.nativeRefreshStrategy,
    optionValues.pullDownEnabled,
    optionValues.pocketState,
    [1, 0, -1],
  ]))('Emit "dxscrollinit" event, forceGeneratePockets: %o, refreshStrategy: %o, pullDownEnabled: %o, pocketState: %o, containerScrollTop: %o',
    (forceGeneratePockets, refreshStrategy, pullDownEnabled, pocketState, containerScrollTop) => {
      const e = { ...defaultEvent, originalEvent: { pageY: 50 } } as any;
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
      emit('dxscrollinit', e);

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
      const e = {
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
      emit('dxscroll', e);

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
      expect(e.preventDefault).toHaveBeenCalledTimes(preventDefaultCalled ? 1 : 0);
      expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(0);
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
      const e = {
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
      emit('dxscrollend', e);

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
      expect(e.preventDefault).toHaveBeenCalledTimes(preventDefaultCalled ? 1 : 0);
      expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(0);
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

      const e = {
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
      emit('dxscrollstop', e);

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

          expect(viewModel.refreshTimeout).not.toBe(undefined);

          viewModel.disposeRefreshTimeout()();
          expect(viewModel.refreshTimeout).toBe(undefined);
        }
      }

      expect(viewModel.onPullDown).toHaveBeenCalledTimes(onPullDownCalled ? 1 : 0);
      expect(viewModel.deltaY).toEqual(expectedDeltaY);
      expect(viewModel.topPocketState).toEqual(expectedTopPocketState);
      expect(viewModel.contentTranslateTop).toEqual(expectedContentTranslateTop);
      expect(viewModel.pullDownOpacity).toEqual(expectedPullDownOpacity);
      expect(viewModel.pullDownTranslateTop).toEqual(expectedPullDownTranslateTop);
      expect(viewModel.pullDownIconAngle).toEqual(expectedPullDownIconAngle);
      expect(e.preventDefault).toHaveBeenCalledTimes(preventDefaultCalled ? 1 : 0);
      expect(e.stopImmediatePropagation).toHaveBeenCalledTimes(0);
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
    each([undefined, jest.fn()]).describe('handler: %o', (actionHandler) => {
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
        const viewModel = new Scrollable({
          onPullDown: actionHandler,
        });

        viewModel.loadingIndicatorEnabled = loadingIndicatorEnabled;

        viewModel.refresh();

        if (actionHandler) {
          expect(actionHandler).toHaveBeenCalledTimes(1);
          expect(actionHandler).toHaveBeenCalledWith({});
        }

        expect(viewModel.topPocketState).toEqual(TopPocketState.STATE_READY);
        expect(viewModel.loadingIndicatorEnabled).toEqual(loadingIndicatorEnabled);
        expect(viewModel.isLoadPanelVisible).toEqual(loadingIndicatorEnabled);
        expect(viewModel.locked).toEqual(true);
      });

      test.each(getPermutations([
        optionValues.pocketState,
        optionValues.nativeRefreshStrategy,
      ]))('refresh(), pocketState: %o, refreshStrategy: %o', (pocketState, refreshStrategy) => {
        jest.clearAllTimers();
        jest.useFakeTimers();

        const viewModel = new Scrollable({});

        viewModel.releaseTimeout = 10;
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

        expect(viewModel.releaseTimeout).not.toBe(undefined);
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

        viewModel.disposeReleaseTimeout()();
        expect(viewModel.releaseTimeout).toBe(undefined);
      });
    });

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
    [{ top: 550, left: 550 }, { top: 500.5, left: 500.5 }, { top: 500.4, left: 500.4 },
      { top: 500.6, left: 500.6 }, { top: 500, left: 500 },
      { top: 550.4, left: 550.4 }, { top: 550.5, left: 550.5 }, { top: 550.6, left: 550.6 }],
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
        if (reachBottomEnabled && scrollLocation.top >= 500.5) {
          expectedIsReachBottom = true;
        }
      } else if (reachBottomEnabled && scrollLocation.top >= 550.5) {
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
        viewModel.scrollLocation = () => ({ top: 2, left: 4 });

        viewModel.moveScrollbars();

        const { isVertical, isHorizontal } = new ScrollDirection(direction);

        const verticalScrollbar = viewModel.verticalScrollbarRef.current;
        const horizontalScrollbar = viewModel.horizontalScrollbarRef.current;

        if (isVertical) {
          expect(verticalScrollbar!.moveScrollbar).toHaveBeenCalledTimes(1);
          expect(verticalScrollbar!.moveScrollbar).toHaveBeenCalledWith(-2);
        }
        if (isHorizontal) {
          expect(horizontalScrollbar!.moveScrollbar).toHaveBeenCalledTimes(1);
          expect(horizontalScrollbar!.moveScrollbar).toHaveBeenCalledWith(-4);
        }

        expect(viewModel.needForceScrollbarsVisibility).toEqual(true);

        expect(viewModel.hideScrollbarTimeout === undefined).toBe(false);

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);

        expect(viewModel.needForceScrollbarsVisibility).toEqual(true);

        jest.runOnlyPendingTimers();

        expect(viewModel.needForceScrollbarsVisibility).toEqual(false);

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
        viewModel.scrollLocation = () => ({ top: 2, left: 4 });

        viewModel.moveScrollbars();
        expect(viewModel.needForceScrollbarsVisibility).toEqual(true);
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
      devices.real = () => ({ platform });

      const viewModel = new Scrollable({
        direction,
        useSimulatedScrollbar,
        showScrollbar: 'onScroll',
      });
      (viewModel as any).contentRef = React.createRef();
      (viewModel as any).containerRef = React.createRef();
      (viewModel as any).horizontalScrollbarRef = React.createRef();
      (viewModel as any).verticalScrollbarRef = React.createRef();

      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
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
  ]))('Should assign swipeDown, pullDown strategy, direction: %o, useSimulatedScrollbar: %o, platform: %o',
    (direction, useSimulatedScrollbar, platform) => {
      devices.real = () => ({ platform });

      const viewModel = new Scrollable({
        useSimulatedScrollbar,
        showScrollbar: 'onScroll',
        direction,
      });

      expect(viewModel.refreshStrategy).toEqual(platform === 'android' ? 'swipeDown' : 'pullDown');
    });
});
