import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from '@devextreme-generator/declarations';

import {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  SCROLLABLE_SCROLLBAR_CLASS,
  DIRECTION_BOTH,
  TopPocketState,
  HOVER_ENABLED_STATE,
  ShowScrollbarMode,
} from '../../common/consts';

import devices from '../../../../../core/devices';

import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../../test_utils/events_mock';
import {
  getElementPadding,
} from '../../utils/get_element_style';
import { getDevicePixelRatio } from '../../utils/get_device_pixel_ratio';
import {
  ScrollableSimulated as Scrollable,
} from '../simulated';

import {
  ScrollableSimulatedProps,
} from '../../common/simulated_strategy_props';

import {
  optionValues,
  getPermutations,
} from '../../__tests__/utils';

import { ScrollableTestHelper } from './simulated_test_helper';
import {
  DxKeyboardEvent, DxMouseEvent, DxMouseWheelEvent, ScrollEventArgs,
} from '../../common/types';
import { AnimatedScrollbar } from '../../scrollbar/animated_scrollbar';
import { getElementOffset } from '../../../../utils/get_element_offset';

import { subscribeToResize } from '../../utils/subscribe_to_resize';
import * as allowedDirectionModule from '../../utils/get_allowed_direction';
import * as isElementVisibleModule from '../../utils/is_element_visible';
import * as permissibleWheelDirectionModule from '../../utils/get_permissible_wheel_direction';
import { DisposeEffectReturn } from '../../../../utils/effect_return';

jest.mock('../../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

jest.mock('../../utils/get_element_style', () => ({
  ...jest.requireActual('../../utils/get_element_style'),
  getElementPadding: jest.fn(() => 8),
}));

jest.mock('../../../../utils/get_element_offset', () => ({
  ...jest.requireActual('../../../../utils/get_element_offset'),
  getElementOffset: jest.fn(() => ({ top: 0, left: 0 })),
}));

jest.mock('../../utils/get_device_pixel_ratio', () => ({
  ...jest.requireActual('../../utils/get_device_pixel_ratio'),
  getDevicePixelRatio: jest.fn(() => 10),
}));

jest.mock('../../utils/subscribe_to_resize', () => ({
  ...jest.requireActual('../../utils/subscribe_to_resize'),
  subscribeToResize: jest.fn(),
}));

describe('Simulated > View', () => {
  it('render with defaults', () => {
    const props = new ScrollableSimulatedProps();
    const scrollable = mount<Scrollable>(<Scrollable {...props} />);

    expect(scrollable.props()).toEqual({
      addWidgetClass: false,
      aria: {},
      bounceEnabled: true,
      classes: '',
      direction: DIRECTION_VERTICAL,
      disabled: false,
      forceGeneratePockets: false,
      inertiaEnabled: true,
      needScrollViewContentWrapper: false,
      needRenderScrollbars: true,
      pullDownEnabled: false,
      pulledDownText: 'Release to refresh...',
      pullingDownText: 'Pull down to refresh...',
      reachBottomEnabled: false,
      reachBottomText: 'Loading...',
      refreshStrategy: 'simulated',
      refreshingText: 'Refreshing...',
      scrollByContent: true,
      scrollByThumb: false,
      showScrollbar: 'onScroll',
      useKeyboard: true,
      visible: true,
    });
  });
});

describe('Simulated > Render', () => {
  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
    each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
      each([0, -400]).describe('maxOffset: %o', (maxOffset) => {
        each([
          { location: -500.25, expected: (isTranslate) => (isTranslate ? -100.25 : 0) },
          { location: -401.35, expected: (isTranslate) => (isTranslate ? -1.3500000000000227 : 0) },
          { location: -400, expected: () => 0 },
          { location: -100.25, expected: () => 0 },
          { location: -55.75, expected: () => 0 },
          { location: -0.13, expected: () => 0 },
          { location: 0.25, expected: (isTranslate) => (isTranslate ? 0.25 : 0) },
          { location: 100.66, expected: (isTranslate) => (isTranslate ? 100.66 : 0) },
          { location: 500.357, expected: (isTranslate) => (isTranslate ? 500.357 : 0) },
        ]).describe('Location: %o', ({ location, expected }) => {
          each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
            each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
              it('contentTranslateY()', () => {
                const topPocketSize = 85;

                const viewModel = new Scrollable({
                  direction,
                  bounceEnabled,
                  forceGeneratePockets,
                  pullDownEnabled,
                });

                viewModel.containerClientHeight = 100;
                viewModel.contentClientHeight = 500;
                viewModel.topPocketHeight = topPocketSize;
                viewModel.vScrollLocation = location;

                Object.defineProperties(viewModel, {
                  vScrollOffsetMax: { get() { return maxOffset; } },
                });

                if (maxOffset >= 0) {
                  expect(viewModel.contentTranslateY)
                    .toEqual(0);
                } else if (!bounceEnabled) {
                  expect(viewModel.contentTranslateY)
                    .toEqual(-topPocketSize);
                } else {
                  expect(viewModel.contentTranslateY)
                    .toEqual(expected(maxOffset < 0) - topPocketSize);
                }
              });

              it('contentTranslateX()', () => {
                const viewModel = new Scrollable({
                  direction,
                  bounceEnabled,
                  forceGeneratePockets,
                  pullDownEnabled,
                });

                viewModel.containerClientWidth = 100;
                viewModel.contentClientWidth = 500;
                viewModel.hScrollLocation = location;

                Object.defineProperties(viewModel, {
                  hScrollOffsetMax: { get() { return maxOffset; } },
                });

                expect(viewModel.contentTranslateX)
                  .toEqual(expected(bounceEnabled && maxOffset < 0));
              });
            });
          });
        });
      });
    });

    each([0, 100]).describe('containerClientWidth: %o', (containerClientWidth) => {
      each([0, 100]).describe('containerClientHeight: %o', (containerClientHeight) => {
        test('containerHasSizes()', () => {
          const viewModel = new Scrollable({ direction });

          viewModel.containerClientHeight = containerClientHeight;
          viewModel.containerClientWidth = containerClientWidth;

          expect(viewModel.containerHasSizes)
            .toEqual(containerClientWidth > 0 && containerClientHeight > 0);
        });
      });
    });

    each([{ top: 120, left: -200 }, { top: -60, left: 40 }]).describe('contentTranslateOffset: %o', (contentTranslateOffset) => {
      it('contentStyles()', () => {
        const helper = new ScrollableTestHelper({ direction });

        Object.defineProperties(helper.viewModel, {
          contentTranslateX: { get() { return contentTranslateOffset.left; } },
          contentTranslateY: { get() { return contentTranslateOffset.top; } },
        });

        expect(helper.viewModel.contentStyles)
          .toEqual({ transform: `translate(${contentTranslateOffset.left}px, ${contentTranslateOffset.top}px)` });
      });
    });

    it(`containerStyles(), permissibleDirection: ${DIRECTION_VERTICAL}`, () => {
      const helper = new ScrollableTestHelper({ direction });

      Object.defineProperties(helper.viewModel, {
        permissibleDirection: {
          get() { return DIRECTION_VERTICAL; },
        },
      });

      expect(helper.viewModel.containerStyles).toEqual({ touchAction: 'pan-x' });
    });

    it(`containerStyles(), permissibleDirection: ${DIRECTION_HORIZONTAL}`, () => {
      const helper = new ScrollableTestHelper({ direction });

      Object.defineProperties(helper.viewModel, {
        permissibleDirection: {
          get() { return DIRECTION_HORIZONTAL; },
        },
      });

      expect(helper.viewModel.containerStyles).toEqual({ touchAction: 'pan-y' });
    });

    it(`containerStyles(), permissibleDirection: ${DIRECTION_BOTH}`, () => {
      const helper = new ScrollableTestHelper({ direction });

      Object.defineProperties(helper.viewModel, {
        permissibleDirection: {
          get() { return DIRECTION_BOTH; },
        },
      });

      expect(helper.viewModel.containerStyles).toEqual({ touchAction: 'none' });
    });

    it(`containerStyles(), permissibleDirection: ${undefined}`, () => {
      const helper = new ScrollableTestHelper({ direction });

      Object.defineProperties(helper.viewModel, {
        permissibleDirection: {
          get() { return undefined; },
        },
      });

      expect(helper.viewModel.containerStyles).toEqual({ touchAction: '' });
    });

    each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
      it('should render scrollbars', () => {
        const helper = new ScrollableTestHelper({
          direction,
          showScrollbar,
          scrollByThumb: true,
          forceGeneratePockets: true,
          bounceEnabled: true,
        });

        const animatedScrollbars = helper.getAnimatedScrollbars();
        const scrollbars = helper.getScrollbars();
        const commonOptions = {
          scrollByThumb: true,
          visible: false,
          bounceEnabled: true,
          showScrollbar,
        };

        const isHoverable = showScrollbar === 'onHover' || showScrollbar === 'always';
        const vScrollbarClasses = `dx-scrollable-scrollbar dx-scrollbar-vertical ${isHoverable ? `${HOVER_ENABLED_STATE} ` : ''}dx-state-invisible`;
        const hScrollbarClasses = `dx-scrollable-scrollbar dx-scrollbar-horizontal ${isHoverable ? `${HOVER_ENABLED_STATE} ` : ''}dx-state-invisible`;

        if (helper.isBoth) {
          expect(scrollbars.length).toEqual(2);
          expect(animatedScrollbars.at(0).props())
            .toMatchObject({ ...commonOptions, direction: DIRECTION_HORIZONTAL });
          expect(animatedScrollbars.at(1).props())
            .toMatchObject({
              ...commonOptions,
              direction: DIRECTION_VERTICAL,
              forceGeneratePockets: true,
            });
          expect(scrollbars.at(0).props())
            .toMatchObject({ ...commonOptions, direction: DIRECTION_HORIZONTAL });
          expect(scrollbars.at(1).props())
            .toMatchObject({
              ...commonOptions,
              direction: DIRECTION_VERTICAL,
            });
          expect(scrollbars.at(0).getDOMNode().className).toBe(hScrollbarClasses);
          expect(scrollbars.at(1).getDOMNode().className).toBe(vScrollbarClasses);
          expect(animatedScrollbars.at(0).getDOMNode().className).toBe(hScrollbarClasses);
          expect(animatedScrollbars.at(1).getDOMNode().className).toBe(vScrollbarClasses);
        } else if (helper.isVertical) {
          expect(animatedScrollbars.length).toEqual(1);
          expect(animatedScrollbars.at(0).props())
            .toMatchObject({
              ...commonOptions,
              direction: DIRECTION_VERTICAL,
              forceGeneratePockets: true,
            });
          expect(scrollbars.length).toEqual(1);
          expect(scrollbars.at(0).props())
            .toMatchObject({
              ...commonOptions,
              direction: DIRECTION_VERTICAL,
            });
          expect(scrollbars.at(0).getDOMNode().className).toBe(vScrollbarClasses);
        } else if (helper.isHorizontal) {
          expect(animatedScrollbars.length).toEqual(1);
          expect(animatedScrollbars.at(0).props())
            .toMatchObject({ ...commonOptions, direction: DIRECTION_HORIZONTAL });
          expect(scrollbars.at(0).getDOMNode().className).toBe(hScrollbarClasses);
          expect(scrollbars.length).toEqual(1);
          expect(scrollbars.at(0).props())
            .toMatchObject({ ...commonOptions, direction: DIRECTION_HORIZONTAL });
          expect(scrollbars.at(0).getDOMNode().className).toBe(hScrollbarClasses);
        }
      });
    });
  });

  each([true, false]).describe('tabIndex on container. useKeyboard: %o', (useKeyboard) => {
    it('tabIndex on scrollable, useKeyboard', () => {
      const helper = new ScrollableTestHelper({ useKeyboard });

      const scrollableTabIndex = helper.getScrollable().getDOMNode().attributes.getNamedItem('tabindex');

      if (useKeyboard) {
        expect(scrollableTabIndex?.value).toEqual('0');
      } else {
        expect(scrollableTabIndex).toEqual(null);
      }
    });
  });
});

describe('Simulated > Behavior', () => {
  describe('Effects', () => {
    beforeEach(clearEventHandlers);

    each([
      { current: { clientHeight: 10 } as HTMLElement } as RefObject,
      undefined,
    ]).describe('pocketRef: %o', (pocketRefMock) => {
      it('should subscribe topPocketElement to resize event', () => {
        const subscribeToResizeHandler = jest.fn();
        (subscribeToResize as jest.Mock).mockImplementation(subscribeToResizeHandler);

        const viewModel = new Scrollable({ });
        viewModel.topPocketRef = pocketRefMock;
        viewModel.setTopPocketDimensions = jest.fn();

        viewModel.subscribeTopPocketToResize();

        expect(subscribeToResizeHandler).toBeCalledTimes(1);
        expect(subscribeToResizeHandler.mock.calls[0][0]).toEqual(pocketRefMock?.current);

        subscribeToResizeHandler.mock.calls[0][1](viewModel.topPocketRef);

        expect(viewModel.setTopPocketDimensions).toBeCalledTimes(1);
        expect(viewModel.setTopPocketDimensions).toBeCalledWith(viewModel.topPocketRef);
      });

      it('should subscribe bottomPocketElement to resize event', () => {
        const subscribeToResizeHandler = jest.fn();
        (subscribeToResize as jest.Mock).mockImplementation(subscribeToResizeHandler);

        const viewModel = new Scrollable({ });
        viewModel.bottomPocketRef = pocketRefMock;
        viewModel.setBottomPocketDimensions = jest.fn();

        viewModel.subscribeBottomPocketToResize();

        expect(subscribeToResizeHandler).toBeCalledTimes(1);
        expect(subscribeToResizeHandler.mock.calls[0][0]).toEqual(pocketRefMock?.current);

        subscribeToResizeHandler.mock.calls[0][1](viewModel.bottomPocketRef);

        expect(viewModel.setBottomPocketDimensions).toBeCalledTimes(1);
        expect(viewModel.setBottomPocketDimensions).toBeCalledWith(viewModel.bottomPocketRef);
      });
    });

    each([true, false]).describe('needScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
      it('should subscribe contentElement to resize dimensions', () => {
        const subscribeToResizeHandler = jest.fn();
        (subscribeToResize as jest.Mock).mockImplementation(subscribeToResizeHandler);

        const viewModel = new Scrollable({ needScrollViewContentWrapper });
        viewModel.contentRef = { current: { clientHeight: 10 } as HTMLElement } as RefObject;
        viewModel.scrollViewContentRef = {
          current: { clientHeight: 6 } as HTMLElement,
        } as RefObject;
        viewModel.setContentHeight = jest.fn();
        viewModel.setContentWidth = jest.fn();

        const disposeResizeEffect = viewModel.subscribeToResizeContent() as DisposeEffectReturn;

        if (needScrollViewContentWrapper) {
          expect(subscribeToResizeHandler).toBeCalledTimes(2);

          expect(subscribeToResizeHandler.mock.calls[0][0]).toEqual({ clientHeight: 6 });
          expect(subscribeToResizeHandler.mock.calls[1][0]).toEqual({ clientHeight: 10 });

          subscribeToResizeHandler
            .mock.calls[0][1](viewModel.scrollViewContentRef);
          subscribeToResizeHandler
            .mock.calls[1][1](viewModel.contentRef);
        } else {
          expect(subscribeToResizeHandler).toBeCalledTimes(1);
          expect(subscribeToResizeHandler.mock.calls[0][0]).toEqual({ clientHeight: 10 });

          subscribeToResizeHandler
            .mock.calls[0][1](viewModel.contentRef);
        }

        expect(viewModel.setContentWidth).toBeCalledTimes(1);
        expect(viewModel.setContentWidth).toBeCalledWith(viewModel.contentRef);

        const expectedContentElement = needScrollViewContentWrapper
          ? viewModel.scrollViewContentRef
          : viewModel.contentRef;

        expect(viewModel.setContentHeight).toBeCalledTimes(1);
        expect(viewModel.setContentHeight).toBeCalledWith(expectedContentElement);

        // TODO: check unsubscribe from resize

        if (needScrollViewContentWrapper) {
          expect(disposeResizeEffect()).toEqual(undefined);
        }
      });
    });

    each([true, false]).describe('Disabled: %o', (disabled) => {
      it('effectDisabledState()', () => {
        const viewModel = new Scrollable({ disabled });

        viewModel.effectDisabledState();

        expect(viewModel.locked).toEqual(disabled);
      });
    });

    each([true, false]).describe('pendingScrollEvent: %o', (pendingScrollEvent) => {
      it('triggerScrollEvent()', () => {
        const helper = new ScrollableTestHelper({});
        helper.viewModel.pendingScrollEvent = pendingScrollEvent;

        helper.viewModel.triggerScrollEvent();

        expect(helper.viewModel.pendingScrollEvent).toEqual(false);
        // TODO: check call trigger handler here
      });
    });

    it('should subscribe to dxpointerdown event', () => {
      const helper = new ScrollableTestHelper({ direction: 'vertical' });

      helper.viewModel.active = false;

      helper.viewModel.pointerDownEffect();
      emit('dxpointerdown');

      expect(helper.viewModel.active).toEqual(true);
    });

    it('Down & Up effects should add & remove scroll active class', () => {
      const helper = new ScrollableTestHelper({ direction: 'vertical' });

      helper.viewModel.pointerDownEffect();
      emit('dxpointerdown');

      expect(helper.viewModel.active).toEqual(true);

      helper.viewModel.pointerUpEffect();
      emit('dxpointerup');

      expect(helper.viewModel.active).toEqual(false);
    });

    it('should subscribe to dxpointerup event', () => {
      const helper = new ScrollableTestHelper({ direction: 'vertical' });

      helper.viewModel.pointerUpEffect();
      emit('dxpointerup');

      expect(helper.viewModel.hovered).toEqual(false);
    });

    it('should subscribe to mouseenter event if showScrollbar mode is onHover', () => {
      const helper = new ScrollableTestHelper({
        direction: 'vertical',
        showScrollbar: 'onHover',
      });
      helper.viewModel.hovered = false;

      helper.viewModel.mouseEnterEffect();
      emit('mouseenter');

      expect(helper.viewModel.hovered).toEqual(true);
    });

    each([ShowScrollbarMode.SCROLL, ShowScrollbarMode.NEVER, ShowScrollbarMode.ALWAYS]).describe('ShowScrollbar: %o', (showScrollbar) => {
      it(`should not subscribe to mouseenter event if showScrollbar mode is ${showScrollbar}`, () => {
        const helper = new ScrollableTestHelper({
          direction: 'vertical',
          showScrollbar,
        });
        helper.viewModel.hovered = false;

        helper.viewModel.mouseEnterEffect();
        emit('mouseenter');

        expect(helper.viewModel.hovered).toEqual(false);
      });
    });

    it('should subscribe to mouseleave event if showScrollbar mode is onHover', () => {
      const helper = new ScrollableTestHelper({
        direction: 'vertical',
        showScrollbar: 'onHover',
      });
      helper.viewModel.hovered = true;

      helper.viewModel.mouseLeaveEffect();
      emit('mouseleave');

      expect(helper.viewModel.hovered).toEqual(false);
    });

    each([ShowScrollbarMode.SCROLL, ShowScrollbarMode.NEVER, ShowScrollbarMode.ALWAYS]).describe('ShowScrollbar: %o', (showScrollbar) => {
      it(`should not subscribe to mouseleave event if showScrollbar mode is ${showScrollbar}`, () => {
        const helper = new ScrollableTestHelper({
          direction: 'vertical',
          showScrollbar,
        });
        helper.viewModel.hovered = true;

        helper.viewModel.mouseLeaveEffect();
        emit('mouseleave');

        expect(helper.viewModel.hovered).toEqual(true);
      });
    });

    each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
      each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
        each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
          each([0, 80]).describe('topPocketHeight: %o', (topPocketHeight) => {
            each([-200, -81, -80, -79, -50, 0, 28, 79, 80, 81, 100]).describe('scrollLocation: %o', (scrollLocation) => {
              it('pulledDown()', () => {
                const viewModel = new Scrollable({
                  forceGeneratePockets,
                  direction: DIRECTION_VERTICAL,
                  bounceEnabled,
                  pullDownEnabled,
                });

                viewModel.vScrollLocation = scrollLocation;
                viewModel.topPocketHeight = topPocketHeight;

                expect(viewModel.pulledDown).toEqual(
                  pullDownEnabled && topPocketHeight !== 0
                  && bounceEnabled && scrollLocation >= topPocketHeight,
                );
              });
            });
          });
        });
      });

      each([true, false]).describe('pulledDown: %o', (pulledDown) => {
        it('updatePocketState()', () => {
          const viewModel = new Scrollable({ direction: DIRECTION_VERTICAL, forceGeneratePockets });

          viewModel.topPocketState = TopPocketState.STATE_PULLED;
          Object.defineProperties(viewModel, {
            pulledDown: { get() { return pulledDown; } },
          });

          viewModel.updatePocketState();

          let expectedTopPocketState = TopPocketState.STATE_PULLED;

          if (forceGeneratePockets) {
            expectedTopPocketState = TopPocketState[pulledDown ? 'STATE_READY' : 'STATE_RELEASED'];
          }

          expect(viewModel.topPocketState).toEqual(expectedTopPocketState);
        });
      });
    });

    each(optionValues.pocketState).describe('pocketState: %o', (pocketState) => {
      it('vScrollOffsetMin(), pulledDown: false', () => {
        const viewModel = new Scrollable({ });

        Object.defineProperties(viewModel, {
          pulledDown: { get() { return false; } },
        });

        viewModel.topPocketHeight = 80;
        viewModel.topPocketState = pocketState;

        expect(viewModel.vScrollOffsetMin).toEqual(0);
      });

      it('vScrollOffsetMin(), pulledDown: true', () => {
        const viewModel = new Scrollable({ });

        Object.defineProperties(viewModel, {
          pulledDown: { get() { return true; } },
        });

        viewModel.topPocketHeight = 80;
        viewModel.topPocketState = pocketState;

        expect(viewModel.vScrollOffsetMin)
          .toEqual(pocketState !== TopPocketState.STATE_RELEASED ? 80 : 0);
      });
    });

    each([true, false]).describe('forceGeneratePockets: %o,', (forceGeneratePockets) => {
      each([true, false]).describe('elementVisible: %o,', (elementVisibility) => {
        it('Should assign swipeDown, pullDown strategy', () => {
          (getElementPadding as jest.Mock).mockReturnValue(8);

          jest.spyOn(isElementVisibleModule, 'isElementVisible')
            .mockImplementation(jest.fn(() => elementVisibility));

          try {
            [-50, 0, 50].forEach((vScrollLocation) => {
              [true, false].forEach((pullDownEnabled) => {
                [true, false].forEach((reachBottomEnabled) => {
                  const viewModel = new Scrollable({
                    forceGeneratePockets,
                    pullDownEnabled,
                    reachBottomEnabled,
                  });

                  viewModel.scrollableRef = {
                    current: {},
                  } as RefObject;

                  viewModel.containerClientWidth = 1;
                  viewModel.containerClientHeight = 2;

                  viewModel.contentClientWidth = 5;
                  viewModel.contentClientHeight = 6;
                  viewModel.contentScrollWidth = 7;
                  viewModel.contentScrollHeight = 8;

                  viewModel.contentPaddingBottom = 13;

                  viewModel.vScrollLocation = vScrollLocation;

                  viewModel.containerRef = {
                    current: {
                      clientWidth: 10,
                      clientHeight: 20,
                      scrollLeft: 150,
                      scrollTop: 200,
                      getBoundingClientRect: () => ({
                        width: 10,
                        height: 20,
                      }),
                    },
                  } as RefObject;

                  viewModel.contentRef = {
                    current: {
                      clientWidth: 50,
                      clientHeight: 60,
                      scrollWidth: 70,
                      scrollHeight: 80,
                      getBoundingClientRect: () => ({
                        width: 10,
                        height: 20,
                      }),
                    },
                  } as RefObject;

                  if (forceGeneratePockets) {
                    viewModel.topPocketRef = {
                      current: {
                        clientHeight: pullDownEnabled ? 80 : 0,
                      },
                    } as RefObject;

                    viewModel.bottomPocketRef = {
                      current: {
                        clientHeight: reachBottomEnabled ? 55 : 0,
                      },
                    } as RefObject;
                  }

                  viewModel.updateDimensions();

                  let expectedTopPocketSize = 0;
                  let expectedBottomPocketSize = 0;

                  expect(viewModel.containerClientWidth).toEqual(elementVisibility ? 10 : 1);
                  expect(viewModel.containerClientHeight).toEqual(elementVisibility ? 20 : 2);

                  expect(viewModel.contentClientWidth).toEqual(elementVisibility ? 50 : 5);
                  expect(viewModel.contentClientHeight).toEqual(elementVisibility ? 60 : 6);
                  expect(viewModel.contentScrollWidth).toEqual(elementVisibility ? 70 : 7);
                  expect(viewModel.contentScrollHeight).toEqual(elementVisibility ? 80 : 8);

                  if (forceGeneratePockets && pullDownEnabled) {
                    expectedTopPocketSize = 80;
                  }

                  if (forceGeneratePockets && reachBottomEnabled) {
                    expectedBottomPocketSize = 55;
                  }

                  expect(viewModel.contentPaddingBottom).toEqual(elementVisibility ? 8 : 13);

                  expect(viewModel.topPocketHeight).toEqual(expectedTopPocketSize);
                  expect(viewModel.bottomPocketHeight).toEqual(expectedBottomPocketSize);
                });
              });
            });
          } finally {
            jest.restoreAllMocks();
          }
        });
      });
    });

    each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
      each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH, 'initial']).describe('prevDirection: %o', (prevDirection) => {
        each([{
          contentSize: 300,
          containerSize: 300,
        }, {
          contentSize: 200,
          containerSize: 100,
        }]).describe('rtlEnabled: %o', (dimensions) => {
          each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
            it('resetInactiveOffsetToInitial()', () => {
              const scrollTop = 20;
              const scrollLeft = 30;

              const helper = new ScrollableTestHelper({ direction, rtlEnabled, ...dimensions });
              helper.initScrollbarSettings();
              helper.initContainerPosition({ top: scrollTop, left: scrollLeft });

              helper.viewModel.prevDirection = prevDirection;

              helper.viewModel.resetInactiveOffsetToInitial();

              const isOverflowX = dimensions.contentSize > dimensions.containerSize;
              expect(helper.viewModel.prevDirection).toEqual(
                isOverflowX || direction === DIRECTION_BOTH
                  ? direction
                  : prevDirection,
              );

              const needResetScrollOffset = isOverflowX && prevDirection !== direction;
              const expectedScrollTop = !helper.isVertical && needResetScrollOffset
                ? 0
                : 20;
              // eslint-disable-next-line no-nested-ternary
              const expectedScrollLeft = !helper.isHorizontal && needResetScrollOffset
                ? rtlEnabled ? 100 : 0
                : 30;

              const containerElement = helper.viewModel.containerRef.current!;
              expect(containerElement.scrollTop).toEqual(expectedScrollTop);
              expect(containerElement.scrollLeft).toEqual(expectedScrollLeft);

              helper.viewModel.scrolling = false;
              helper.viewModel.scrollEffect();
              emit('scroll', {} as any);

              expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollLeft);
              expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollTop);
            });
          });
        });
      });

      // eslint-disable-next-line jest/expect-expect
      it('should call releaseHandler when relese() method was called', () => {
        const helper = new ScrollableTestHelper({
          direction,
        });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.release();

        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['release'], [[]]);
        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['release'], [[]]);
      });

      it('emit "dxscrollstop" event', () => {
        const helper = new ScrollableTestHelper({
          direction,
        });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.stopEffect();
        emit('dxscrollstop');

        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['stop'], [[]]);
        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['stop'], [[]]);
        expect(helper.viewModel.scrolling).toEqual(false);
      });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
      ]))('emit "dxscrollinit" event, isDxWheelEvent: %o, scrollByThumb: %o, targetClass: %o',
        (isDxWheelEvent, scrollByThumb, targetClass) => {
          (getElementOffset as jest.Mock).mockReturnValue({ left: 10, top: 20 });
          const event = { ...defaultEvent, originalEvent: {} as any };
          if (isDxWheelEvent) {
            event.originalEvent.type = 'dxmousewheel';
          }

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();
          helper.viewModel.scrolling = false;

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          event.originalEvent.target = target;

          let expectedVThumbScrolling = false;
          let expectedHThumbScrolling = false;

          if (helper.isVertical) {
            expectedVThumbScrolling = scrollByThumb
              && helper.getVScrollbar().isThumb(target);
          }

          if (helper.isHorizontal) {
            expectedHThumbScrolling = scrollByThumb
              && helper.getHScrollbar().isThumb(target);
          }

          helper.viewModel.suppressDirections = jest.fn();
          helper.viewModel.getEventArgs = jest.fn(() => ({ scrollOffset: { top: 5, left: 10 } }));

          helper.viewModel.initEffect();
          emit('dxscrollinit', event);

          const expectedCrossThumbScrolling = expectedVThumbScrolling || expectedHThumbScrolling;

          // expect(helper.viewModel.scrolling).toEqual(true);
          expect(helper.viewModel.suppressDirections).toHaveBeenCalledTimes(1);
          expect(helper.viewModel.suppressDirections).toHaveBeenCalledWith(event);
          expect(helper.viewModel.eventForUserAction).toEqual(event);
          helper.checkActionHandlerCalls(expect, [], [[]]);
          helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['init'], [[event, expectedCrossThumbScrolling, 20]]);
          helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['init'], [[event, expectedCrossThumbScrolling, 10]]);
        });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        optionValues.scrollByThumb,
        optionValues.scrollByContent,
        ['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container'],
      ]))('suppressDirections(event), isDxWheelEvent: %o, scrollByThumb: %o, scrollByContent: %o, targetClass: %o',
        (isDxWheelEvent, scrollByThumb, scrollByContent, targetClass) => {
          const event = {
            ...defaultEvent,
            originalEvent: {},
          } as unknown as DxMouseEvent;

          if (isDxWheelEvent) {
            (event.originalEvent as any).type = 'dxmousewheel';
          }

          const helper = new ScrollableTestHelper({
            direction,
            scrollByThumb,
            scrollByContent,
          });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          const target = helper.getScrollable().find(`.${targetClass}`).at(0).getDOMNode();
          (event.originalEvent as any).target = target;

          helper.viewModel.suppressDirections(event);

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

        const event = {
          ...defaultEvent,
          velocity: { x: initialVelocityX, y: initialVelocityY },
        };

        const helper = new ScrollableTestHelper({
          direction,
        });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.cancelEffect();
        emit('dxscrollcancel', event);

        expect(helper.viewModel.eventForUserAction).toEqual(event);
        helper.checkActionHandlerCalls(expect, [], []);
        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['end'], [[0, false]]);
        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['end'], [[0, false]]);
      });

      test('emit "dxscrollstart" event', () => {
        const event = {
          ...defaultEvent,
        };

        const helper = new ScrollableTestHelper({ direction });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();
        helper.viewModel.getEventArgs = jest.fn(() => ({ scrollOffset: { top: 5, left: 10 } }));

        helper.viewModel.startEffect();
        emit('dxscrollstart', event);

        expect(helper.viewModel.eventForUserAction).toEqual(event);
        expect(helper.viewModel.scrolling).toEqual(true);
        helper.checkActionHandlerCalls(expect, ['onStart'], [[{ scrollOffset: { top: 5, left: 10 } }]]);
      });

      test('emit "dxscrollend" event', () => {
        const event = {
          ...defaultEvent,
          velocity: { x: 5.56, y: 4.5986 },
        };

        const helper = new ScrollableTestHelper({ direction });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.adjustDistance = jest.fn();
        helper.viewModel.getEventArgs = jest.fn(() => ({ scrollOffset: { top: 5, left: 10 } }));

        helper.viewModel.endEffect();
        emit('dxscrollend', event);

        expect(helper.viewModel.adjustDistance).toHaveBeenCalledTimes(1);
        expect(helper.viewModel.adjustDistance).toHaveBeenCalledWith(event, 'velocity');
        expect(helper.viewModel.eventForUserAction).toEqual(event);
        helper.checkActionHandlerCalls(expect, [], [[]]);

        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['end'], [[event.velocity.y, true]]);
        helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['end'], [[event.velocity.x, true]]);
      });

      each(optionValues.isDxWheelEvent).describe('isDxWheelEvent: %o', (isDxWheelEvent) => {
        test.each([true, false])('emit "dxscroll" event, locked: %o', (locked) => {
          const event = {
            ...defaultEvent,
            delta: { x: 10.5633, y: 25.5986 },
            preventDefault: jest.fn(),
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
            cancel: false,
          };

          const helper = new ScrollableTestHelper({ direction });

          helper.initScrollbarSettings();
          helper.initScrollbarHandlerMocks();

          helper.viewModel.adjustDistance = jest.fn();
          helper.viewModel.locked = locked;

          helper.viewModel.moveEffect();
          emit('dxscroll', event);

          if (locked) {
            expect(event.cancel).toEqual(true);
            expect(event.preventDefault).not.toBeCalled();
            expect(helper.viewModel.adjustDistance).toHaveBeenCalledTimes(0);
            expect(helper.viewModel.eventForUserAction).toEqual(undefined);
            helper.checkActionHandlerCalls(expect, [], [[]]);
            helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, [], [[]]);
            helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, [], [[]]);
          } else {
            expect(event.cancel).toEqual(false);
            expect(event.preventDefault).toBeCalled();
            expect(helper.viewModel.adjustDistance).toHaveBeenCalledTimes(1);
            expect(helper.viewModel.adjustDistance).toHaveBeenCalledWith(event, 'delta');
            expect(helper.viewModel.eventForUserAction).toEqual(event);
            helper.checkActionHandlerCalls(expect, [], [[]]);
            helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['move'], [[event.delta.y, isDxWheelEvent]]);
            helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['move'], [[event.delta.x, isDxWheelEvent]]);
          }
        });
      });

      test.each([jest.fn(), undefined])('emit "dxscroll" event, e.preventDefault: %o, locked: false', (preventDefault) => {
        const event = {
          ...defaultEvent,
          delta: { x: 10.5633, y: 25.5986 },
          preventDefault,
          cancel: false,
        } as any;

        const helper = new ScrollableTestHelper({ direction });

        helper.initScrollbarSettings();
        helper.initScrollbarHandlerMocks();

        helper.viewModel.adjustDistance = jest.fn();
        helper.viewModel.locked = false;

        helper.viewModel.moveEffect();
        emit('dxscroll', event);

        if (preventDefault) {
          expect(event.preventDefault).toBeCalled();
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
      ]))('adjustDistance(event, property), isDxWheelEvent: %o, property: %o, pixelRatio: %o, validDirections: %o',
        (isDxWheelEvent, property, pixelRatio, validDirections) => {
          (getDevicePixelRatio as jest.Mock).mockReturnValue(pixelRatio);
          const event = {
            ...defaultEvent,
            [property.name]: { ...property.value },
            originalEvent: {
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            },
          } as any;

          const viewModel = new Scrollable({ direction });

          viewModel.validDirections = validDirections;

          viewModel.adjustDistance(event, property.name);

          let expectedCoordinateX = property.value.x * (validDirections.horizontal ? 1 : 0);
          let expectedCoordinateY = property.value.y * (validDirections.vertical ? 1 : 0);

          if (isDxWheelEvent) {
            expectedCoordinateX = Math.round((expectedCoordinateX / pixelRatio) * 100) / 100;
            expectedCoordinateY = Math.round((expectedCoordinateY / pixelRatio) * 100) / 100;
          }

          expect(event[property.name].x).toEqual(expectedCoordinateX);
          expect(event[property.name].y).toEqual(expectedCoordinateY);
        });

      each(optionValues.scrollByContent).describe('ScrollByContent: %o', (scrollByContent) => {
        each([true, false]).describe('isScrollbarTarget: %o', (isScrollbarTarget) => {
          it('validateMove(event)', () => {
            const helper = new ScrollableTestHelper({
              direction,
              scrollByContent,
            });

            helper.initScrollbarSettings();

            const target = isScrollbarTarget && helper.viewModel.containerRef.current
              ? helper.viewModel.containerRef.current.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`)
              : helper.viewModel.containerRef.current;

            const event = { ...defaultEvent, target } as unknown as DxMouseEvent;

            const validateMoveResult = helper.viewModel.validateMove(event);

            if (!scrollByContent && !isScrollbarTarget) {
              expect(validateMoveResult).toBe(false);
            } else {
              expect(validateMoveResult).toBe(true);
            }
          });
        });
      });

      test.each(getPermutations([
        optionValues.bounceEnabled,
        optionValues.isDxWheelEvent,
        [true, false],
      ]))('tryGetAllowedDirection(event), bounceEnabled: %o, isDxWheelEvent: %o, isShiftKeyPressed: %o',
        (bounceEnabled, isDxWheelEvent, shiftKey) => {
          const permissibleWheelDirectionHandler = jest.fn();
          const allowedWheelDirectionHandler = jest.fn();

          try {
            const helper = new ScrollableTestHelper({
              direction,
              bounceEnabled,
            });

            const event = {
              shiftKey,
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            } as DxMouseWheelEvent;

            jest.spyOn(permissibleWheelDirectionModule, 'permissibleWheelDirection')
              .mockImplementation(permissibleWheelDirectionHandler);
            jest.spyOn(allowedDirectionModule, 'allowedDirection').mockImplementation(allowedWheelDirectionHandler);

            helper.viewModel.tryGetAllowedDirection(event);

            if (isDxWheelEvent) {
              expect(allowedWheelDirectionHandler).toBeCalledTimes(0);
              expect(permissibleWheelDirectionHandler).toBeCalledTimes(1);
            } else {
              expect(allowedWheelDirectionHandler).toBeCalledTimes(1);
              expect(permissibleWheelDirectionHandler).toBeCalledTimes(0);
            }
          } finally {
            jest.restoreAllMocks();
          }
        });

      each([-1, 1]).describe('wheelDelta: %o', (delta) => {
        each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL]).describe('wheelDirection(): %o', (wheelDirection) => {
          each([true, false]).describe('animationScrollbar.reachedMin: %o', (reachedMin) => {
            each([true, false]).describe('animationScrollbar.reachedMax: %o', (reachedMax) => {
              each([undefined, 0, 54]).describe('validateWheelTimer: %o', (validateWheelTimer) => {
                it('validateWheel(event)', () => {
                  try {
                    jest.spyOn(permissibleWheelDirectionModule, 'permissibleWheelDirection').mockImplementation(() => wheelDirection);

                    const viewModel = new Scrollable({ direction });
                    const event = { ...defaultEvent, delta } as unknown as DxMouseWheelEvent;

                    viewModel.validateWheelTimer = validateWheelTimer;

                    viewModel[`${wheelDirection === DIRECTION_HORIZONTAL ? 'h' : 'v'}ScrollbarRef`] = {
                      current: {
                        reachedMin: jest.fn(() => reachedMin),
                        reachedMax: jest.fn(() => reachedMax),
                      },
                    } as unknown as RefObject<AnimatedScrollbar>;

                    const expectedValidationResult = ((!reachedMin || !reachedMax)
                    && (
                      (!reachedMin && !reachedMax)
                      || (reachedMin && delta > 0) || (reachedMax && delta < 0)
                    )) || validateWheelTimer !== undefined;

                    expect(viewModel.validateWheelTimer).toBe(validateWheelTimer);

                    expect(viewModel.validateWheel(event)).toBe(expectedValidationResult);

                    if (!expectedValidationResult) {
                      expect(viewModel.validateWheelTimer).toBe(undefined);
                    } else {
                      expect(viewModel.validateWheelTimer).not.toBe(undefined);
                    }

                    viewModel.disposeWheelTimer()();

                    expect(viewModel.validateWheelTimer).toBe(undefined);
                  } finally {
                    jest.restoreAllMocks();
                  }
                });
              });
            });
          });
        });
      });

      describe('Validate(event)', () => {
        it('locked: true, disabled: false, bounceEnabled: true', () => {
          const event = { ...defaultEvent } as any;
          const viewModel = new Scrollable({
            direction, disabled: false, bounceEnabled: true,
          });
          viewModel.locked = false;
          viewModel.updateHandler = jest.fn();

          expect(viewModel.validate(event)).toEqual(true);
          expect(viewModel.updateHandler).toHaveBeenCalledTimes(0);
        });

        each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
          it('validate(event), locked: false, disabled: false, bounceEnabled: false', () => {
            const helper = new ScrollableTestHelper({
              direction,
              bounceEnabled: false,
              disabled: false,
            });

            const event = {
              ...defaultEvent,
              type: isDxWheelEvent ? 'dxmousewheel' : undefined,
            } as unknown as DxMouseEvent;

            helper.viewModel.locked = false;
            helper.viewModel.validateWheel = jest.fn();
            helper.viewModel.validateMove = jest.fn();

            helper.viewModel.validate(event);

            if (isDxWheelEvent) {
              expect(helper.viewModel.validateWheel).toHaveBeenCalledTimes(1);
              expect(helper.viewModel.validateMove).toHaveBeenCalledTimes(0);
              expect(helper.viewModel.validateWheel).toHaveBeenCalledWith(event);
            } else {
              expect(helper.viewModel.validateWheel).toHaveBeenCalledTimes(0);
              expect(helper.viewModel.validateMove).toHaveBeenCalledTimes(1);
              expect(helper.viewModel.validateMove).toHaveBeenCalledWith(event);
            }
          });
        });
      });
    });
  });

  describe('Key down', () => {
    each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('Direction: %o', (direction) => {
      each(['leftArrow', 'upArrow', 'rightArrow', 'downArrow']).describe('Key: %o', (keyName) => {
        it(`should prevent default key down event by key - ${keyName}`, () => {
          const event = {
            key: keyName,
            originalEvent: {
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          } as unknown as DxKeyboardEvent;
          const helper = new ScrollableTestHelper({ direction });

          helper.viewModel.scrollByLine = jest.fn();

          helper.viewModel.handleKeyDown(event);

          expect(event.originalEvent.preventDefault).toBeCalled();
          expect(event.originalEvent.stopPropagation).toBeCalled();
          expect(helper.viewModel.scrollByLine).toBeCalledTimes(1);

          const prop = `${keyName === 'upArrow' || keyName === 'downArrow' ? 'top' : 'left'}`;
          const inactiveProp = prop === 'left' ? 'top' : 'left';
          expect(helper.viewModel.scrollByLine).toBeCalledWith({ [prop]: keyName === 'upArrow' || keyName === 'leftArrow' ? -1 : 1, [inactiveProp]: 0 });
        });

        it('should prevent any key handling if content is scrolling', () => {
          const event = {
            key: 'tab',
            originalEvent: {
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          } as unknown as DxKeyboardEvent;
          const helper = new ScrollableTestHelper({ direction });

          helper.viewModel.scrolling = true;
          helper.viewModel.scrollByLocation = jest.fn();

          helper.viewModel.handleKeyDown(event);

          expect(event.originalEvent.preventDefault).toBeCalled();
          expect(event.originalEvent.stopPropagation).toBeCalled();

          expect(helper.viewModel.scrollByLocation).not.toBeCalled();
        });

        each([1, 2]).describe('devicePixelRatio: %o', (pixelRatio) => {
          it(`should call scrollBy by ${keyName} key`, () => {
            (getDevicePixelRatio as jest.Mock).mockReturnValue(pixelRatio);

            const event = {
              key: keyName,
              originalEvent: {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
              },
            } as unknown as DxKeyboardEvent;
            const helper = new ScrollableTestHelper({ direction });

            helper.viewModel.scrollByLocation = jest.fn();
            helper.viewModel.handleKeyDown(event);

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
            expect(helper.viewModel.scrollByLocation).toBeCalledTimes(1);
            expect(helper.viewModel.scrollByLocation).toBeCalledWith(expectedParams);
          });
        });
      });

      each(['pageUp', 'pageDown']).describe('Key: %o', (keyName) => {
        it(`should prevent default key down event by key - ${keyName}`, () => {
          const scrollByPageHandler = jest.fn();
          const event = {
            key: keyName,
            originalEvent: {
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          } as unknown as DxKeyboardEvent;
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.scrollByPage = scrollByPageHandler;
          helper.viewModel.handleKeyDown(event);
          expect(event.originalEvent.preventDefault).toBeCalled();
          expect(event.originalEvent.stopPropagation).toBeCalled();
          expect(scrollByPageHandler).toBeCalledTimes(1);
          expect(scrollByPageHandler).toBeCalledWith(keyName === 'pageUp' ? -1 : 1);
        });

        it(`should call scrollByLocation by ${keyName} key`, () => {
          const scrollByLocationHandler = jest.fn();
          const event = {
            key: keyName,
            originalEvent: {
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          } as unknown as DxKeyboardEvent;
          const helper = new ScrollableTestHelper({ direction });
          helper.viewModel.scrollByLocation = scrollByLocationHandler;

          helper.viewModel.handleKeyDown(event);

          expect(scrollByLocationHandler).toBeCalledTimes(1);
        });
      });

      it('should prevent default key down event by "home" key', () => {
        const event = {
          key: 'home',
          originalEvent: {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        } as unknown as DxKeyboardEvent;
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollByKey = jest.fn();
        helper.viewModel.handleKeyDown(event);

        expect(event.originalEvent.preventDefault).toBeCalled();
        expect(event.originalEvent.stopPropagation).toBeCalled();
        expect(helper.viewModel.scrollByKey).toBeCalledTimes(1);
        expect(helper.viewModel.scrollByKey).toBeCalledWith('home');
      });

      it('should prevent default key down event by "end" key', () => {
        const event = {
          key: 'end',
          originalEvent: {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          },
        } as unknown as DxKeyboardEvent;
        const helper = new ScrollableTestHelper({ direction });
        helper.viewModel.scrollByKey = jest.fn();
        helper.viewModel.handleKeyDown(event);
        expect(event.originalEvent.preventDefault).toBeCalled();
        expect(event.originalEvent.stopPropagation).toBeCalled();
        expect(helper.viewModel.scrollByKey).toBeCalledTimes(1);
        expect(helper.viewModel.scrollByKey).toBeCalledWith('end');
      });

      each([undefined, jest.fn()]).describe('handler: %o', (actionHandler) => {
        afterEach(() => {
          jest.clearAllMocks();
        });

        each([{ scrollTop: 0, scrollLeft: 0 }, { scrollTop: 20, scrollLeft: 30 }]).describe('initialSavedScrollOffset: %o', (initialSavedScrollOffset) => {
          test.each([true, false])('onVisibilityChangeHandler(%o)', (visible) => {
            const helper = new ScrollableTestHelper({
              direction,
              onVisibilityChange: actionHandler,
            });
            helper.initScrollbarSettings();
            helper.initContainerPosition({ top: 10, left: 20 });

            helper.viewModel.savedScrollOffset = initialSavedScrollOffset;
            helper.viewModel.updateHandler = jest.fn();

            helper.viewModel.onVisibilityChangeHandler(visible);

            if (actionHandler) {
              expect(actionHandler).toHaveBeenCalledTimes(1);
              expect(actionHandler).toHaveBeenLastCalledWith(visible);
            }

            let expectedContainerScrollTop = 10;
            let expectedContainerScrollLeft = 20;
            const containerEl = helper.viewModel.containerRef.current!;
            if (visible) {
              expect(helper.viewModel.updateHandler).toBeCalledTimes(0);
              expect(helper.viewModel.savedScrollOffset).toEqual(initialSavedScrollOffset);

              expectedContainerScrollTop = direction !== DIRECTION_HORIZONTAL
                ? initialSavedScrollOffset.scrollTop
                : 10;
              expectedContainerScrollLeft = direction !== DIRECTION_VERTICAL
                ? initialSavedScrollOffset.scrollLeft
                : 20;
            } else {
              expect(helper.viewModel.updateHandler).toBeCalledTimes(0);
            }

            expect(containerEl.scrollTop).toEqual(expectedContainerScrollTop);
            expect(containerEl.scrollLeft).toEqual(expectedContainerScrollLeft);
          });
        });
      });

      each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
        it('should scroll to min scroll position by "home" key', () => {
          const event = {
            key: 'home',
            originalEvent: {
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          } as unknown as DxKeyboardEvent;
          const helper = new ScrollableTestHelper({ direction, rtlEnabled });
          helper.initContainerPosition({ top: 30, left: 25 });

          helper.viewModel.scrollByLocation = jest.fn();
          helper.viewModel.handleKeyDown(event);

          expect(helper.viewModel.scrollByLocation).toBeCalledTimes(1);

          const expectedDistance = {
            top: direction !== DIRECTION_HORIZONTAL ? -30 : 0,
            // eslint-disable-next-line no-nested-ternary
            left: direction === DIRECTION_HORIZONTAL ? rtlEnabled ? 75 : -25 : 0,
          };
          expect(helper.viewModel.scrollByLocation).toBeCalledWith(expectedDistance);
        });

        it('should scroll to max scroll position by "end" key', () => {
          const event = {
            key: 'end',
            originalEvent: {
              preventDefault: jest.fn(),
              stopPropagation: jest.fn(),
            },
          } as unknown as DxKeyboardEvent;
          const helper = new ScrollableTestHelper({ direction, rtlEnabled });
          helper.initContainerPosition({ top: 80, left: 55 });

          helper.viewModel.contentPaddingBottom = 8;
          helper.viewModel.bottomPocketHeight = 55;

          helper.viewModel.scrollByLocation = jest.fn();
          helper.viewModel.handleKeyDown(event);

          expect(helper.viewModel.scrollByLocation).toBeCalledTimes(1);

          const expectedDistance = {
            top: direction !== DIRECTION_HORIZONTAL ? 83 : 0,
            // eslint-disable-next-line no-nested-ternary
            left: direction === DIRECTION_HORIZONTAL ? rtlEnabled ? -55 : 45 : 0,
          };
          expect(helper.viewModel.scrollByLocation).toBeCalledWith(expectedDistance);
        });
      });
    });

    it('should not prevent default key down event by common keys down', () => {
      const scrollByLocationHandler = jest.fn();
      const event = {
        key: 'A',
        originalEvent: {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        },
      } as unknown as DxKeyboardEvent;
      const helper = new ScrollableTestHelper({ });
      helper.viewModel.scrollByLocation = scrollByLocationHandler;

      helper.viewModel.handleKeyDown(event);

      expect(event.originalEvent.preventDefault).not.toBeCalled();
      expect(event.originalEvent.stopPropagation).not.toBeCalled();
      expect(scrollByLocationHandler).toBeCalledTimes(0);
    });

    each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
      test.each([true, false])('handleScroll(), syncScrollbarsWithContent, should synchronize scrollbars with content offset after trigger scroll, scrolling: %o', (scrolling) => {
        const helper = new ScrollableTestHelper({ direction: 'both', rtlEnabled } as any);
        helper.initScrollbarSettings();

        helper.viewModel.containerRef.current!.scrollTop = 50;
        helper.viewModel.containerRef.current!.scrollLeft = 30;

        helper.viewModel.vScrollLocation = 0;
        helper.viewModel.hScrollLocation = 0;

        helper.viewModel.scrolling = scrolling;

        helper.viewModel.handleScroll();

        expect(helper.viewModel.vScrollLocation).toEqual(!scrolling ? -50 : 0);
        expect(helper.viewModel.hScrollLocation).toEqual(!scrolling && !rtlEnabled ? -30 : 0);
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

      it('UpdateHandler() should call onUpdated action', () => {
        const helper = new ScrollableTestHelper({
          onUpdated: actionHandler,
        });

        helper.viewModel.getEventArgs = jest.fn(() => ({ scrollOffset: { top: 5, left: 10 } }));
        helper.viewModel.updateElementDimensions = jest.fn();

        helper.viewModel.updateHandler();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, ['onUpdated'], [[{ scrollOffset: { top: 5, left: 10 } }]]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }
        expect(helper.viewModel.updateElementDimensions).toBeCalledTimes(1);
      });

      test.each(['onBounce', 'onStart', 'onUpdated'])('actionName: %o', (action) => {
        const helper = new ScrollableTestHelper({
          [`${action}`]: actionHandler,
        });

        helper.viewModel.getEventArgs = jest.fn(() => ({ scrollOffset: { top: 5, left: 10 } }));

        helper.viewModel[action]();

        if (actionHandler) {
          helper.checkActionHandlerCalls(expect, [action], [
            [{ scrollOffset: { top: 5, left: 10 } }],
          ]);
        } else {
          helper.checkActionHandlerCalls(expect, [], []);
        }
      });

      each([
        { vertical: true, horizontal: true },
        { vertical: true, horizontal: false },
        { vertical: false, horizontal: true },
        { vertical: false, horizontal: false },
      ]).describe('endActionDirections: %o', (endActionDirections) => {
        each(optionValues.direction).describe('Direction: %o', (direction) => {
          each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL]).describe('scrollbarDirection: %o', (scrollbarDirection) => {
            it('onEnd()', () => {
              const helper = new ScrollableTestHelper({
                direction,
                onEnd: actionHandler,
              });

              helper.viewModel.scrolling = true;
              helper.viewModel.endActionDirections = { ...endActionDirections };
              helper.viewModel.getEventArgs = jest.fn(() => (
                { scrollOffset: { top: 5, left: 10 } }));

              helper.viewModel.onEnd(scrollbarDirection);

              const expectedEndActionDirections = { ...endActionDirections };
              let expectedScrollingValue = true;
              let onEndWasCalled = false;

              if (direction === DIRECTION_BOTH) {
                expectedEndActionDirections[scrollbarDirection] = true;

                if (expectedEndActionDirections.vertical
                  && expectedEndActionDirections.horizontal) {
                  expectedEndActionDirections.vertical = false;
                  expectedEndActionDirections.horizontal = false;
                  expectedScrollingValue = false;
                  onEndWasCalled = true;
                }
              } else {
                expectedScrollingValue = false;
                onEndWasCalled = true;
              }

              if (actionHandler && onEndWasCalled) {
                helper.checkActionHandlerCalls(expect, ['onEnd'], [[{ scrollOffset: { top: 5, left: 10 } }]]);
              } else {
                helper.checkActionHandlerCalls(expect, [], []);
              }

              expect(helper.viewModel.scrolling).toEqual(expectedScrollingValue);
              expect(helper.viewModel.endActionDirections).toEqual(expectedEndActionDirections);
            });
          });
        });
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

        helper.viewModel.updateHandler = jest.fn();
        helper.viewModel.getEventArgs = jest.fn(() => ({ scrollOffset: { top: 5, left: 10 } }));
        helper.viewModel.topPocketState = TopPocketState.STATE_READY;

        helper.viewModel.onRelease();

        helper.checkActionHandlerCalls(expect, [], []);
        expect(helper.viewModel.updateHandler).toBeCalledTimes(0);
        expect(helper.viewModel.topPocketState).toEqual(TopPocketState.STATE_RELEASED);
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

    describe('ScrollOffset', () => {
      it('scrollOffset() without overflow', () => {
        const helper = new ScrollableTestHelper({
          contentSize: 300,
          containerSize: 300,
        });

        const scrollLocation = { left: 130, top: 560 };
        helper.initContainerPosition(scrollLocation);

        expect(helper.viewModel.scrollOffset()).toEqual({
          left: 0,
          top: 0,
        });
      });
    });

    describe('ScrollTo', () => {
      each(optionValues.direction).describe('Direction: %o', (direction) => {
        it('ScrollByLocation() should call updateHandler()', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.initScrollbarSettings();

          helper.viewModel.updateHandler = jest.fn();
          helper.viewModel.prepareDirections = jest.fn();
          helper.viewModel.onStart = jest.fn();

          const scrollToMock = jest.fn();
          helper.changeScrollbarMethod('scrollTo', scrollToMock);

          helper.viewModel.scrollByLocation({ left: 10, top: 10 });

          expect(scrollToMock).toHaveBeenCalledTimes(helper.getScrollbars().length);
          expect(helper.viewModel.updateHandler).toHaveBeenCalledTimes(1);
          expect(helper.viewModel.onStart).toHaveBeenCalledTimes(1);
        });

        it('ScrollByLocation(), set scrolling state', () => {
          const helper = new ScrollableTestHelper({ direction });
          helper.initScrollbarSettings();

          helper.viewModel.prepareDirections = jest.fn();

          helper.viewModel.onStart = jest.fn(() => {
            expect(helper.viewModel.scrolling).toEqual(true);
          });

          helper.viewModel.scrollByLocation({ left: 0, top: 0 });

          expect(helper.viewModel.scrolling).toEqual(false);
        });

        each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
          it('scrollBy({ top: 20, left: 15 }), scrollable is visible', () => {
            const initialScrollOffset = { top: 50, left: 50 };
            const expectedScrollOffset = { top: 70, left: 65 };
            const helper = new ScrollableTestHelper({
              direction,
              rtlEnabled,
              contentSize: 200,
              containerSize: 100,
            });

            helper.initScrollbarSettings({
              props: {
                vScrollLocation: -initialScrollOffset.top,
                hScrollLocation: -initialScrollOffset.top,
              },
            });
            helper.initScrollbarHandlerMocks();
            helper.changeScrollbarMethod('stopScrolling', jest.fn());
            helper.initContainerPosition(initialScrollOffset);

            helper.viewModel.scrollByLocation({ top: 20, left: 15 });

            expectedScrollOffset.top = helper.isVertical
              ? expectedScrollOffset.top : initialScrollOffset.top;
            expectedScrollOffset.left = helper.isHorizontal
              ? expectedScrollOffset.left : initialScrollOffset.left;

            expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
            expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
            expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
            helper.checkContainerPosition(expect, expectedScrollOffset);
          });

          it('scrollBy({ top: 20, left: 20 }), scrollable is hidden', () => {
            try {
              const initialScrollOffset = { top: 50, left: 50 };
              const expectedScrollOffset = { top: 50, left: 50 };
              const helper = new ScrollableTestHelper({
                direction,
                rtlEnabled,
                contentSize: 200,
                containerSize: 100,
              });

              helper.initScrollbarSettings({
                props: {
                  vScrollLocation: -initialScrollOffset.top,
                  hScrollLocation: -initialScrollOffset.top,
                },
              });
              helper.initScrollbarHandlerMocks();
              helper.changeScrollbarMethod('stopScrolling', jest.fn());
              helper.initContainerPosition(initialScrollOffset);

              jest.spyOn(isElementVisibleModule, 'isElementVisible')
                .mockImplementation(jest.fn(() => false));

              helper.viewModel.scrollByLocation({ top: 20, left: 15 });

              expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
              expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
              expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
              helper.checkContainerPosition(expect, expectedScrollOffset);
            } finally {
              jest.restoreAllMocks();
            }
          });

          each([
            [{ top: 50, left: 40 }, { top: 0, left: 20 }, { top: 50, left: 60 }],
            [{ top: 50, left: 40 }, { top: 20, left: 0 }, { top: 70, left: 40 }],
            [{ top: 50, left: 40 }, { top: 20, left: 20 }, { top: 70, left: 60 }],
            [{ top: 50, left: 40 }, { top: 20, left: 15 }, { top: 70, left: 55 }],
            [{ top: 50, left: 40 }, { top: -15, left: -15 }, { top: 35, left: 25 }],
            [{ top: 50, left: 40 }, { top: -20, left: 15 }, { top: 30, left: 55 }],
            [{ top: 50, left: 40 }, { top: -1000, left: -1000 }, { top: 0, left: 0 }],
            [{ top: 50, left: 40 }, { top: 1000, left: 1000 }, { top: 100, left: 100 }],
          ]).describe('initScrollPosition: %o,', (initialScrollPosition, scrollByValue, expected) => {
            it(`scrollBy(${JSON.stringify(scrollByValue)})`, () => {
              const helper = new ScrollableTestHelper({
                direction,
                rtlEnabled,
                contentSize: 200,
                containerSize: 100,
              });

              helper.initScrollbarSettings({
                props: {
                  vScrollLocation: -initialScrollPosition.top,
                  hScrollLocation: -initialScrollPosition.left,
                },
              });
              helper.initScrollbarHandlerMocks();
              helper.changeScrollbarMethod('stopScrolling', jest.fn());
              helper.initContainerPosition(initialScrollPosition);

              helper.viewModel.scrollByLocation(scrollByValue);

              const { ...expectedScrollOffset } = expected;
              expectedScrollOffset.top = helper.isVertical
                ? expected.top : initialScrollPosition.top;
              expectedScrollOffset.left = helper.isHorizontal
                ? expected.left : initialScrollPosition.left;

              expect(helper.viewModel.scrollOffset()).toEqual(expectedScrollOffset);
              expect(helper.viewModel.vScrollLocation).toEqual(-expectedScrollOffset.top);
              expect(helper.viewModel.hScrollLocation).toEqual(-expectedScrollOffset.left);
              helper.checkContainerPosition(expect, expectedScrollOffset);

              let expectedValidDirections = {};
              const expectedEventArgs = { event: undefined } as ScrollEventArgs;
              if (direction !== DIRECTION_VERTICAL) {
                expectedEventArgs.reachedLeft = false;
                expectedEventArgs.reachedRight = false;
              }

              if (direction !== DIRECTION_HORIZONTAL) {
                expectedEventArgs.reachedTop = false;
                expectedEventArgs.reachedBottom = false;
              }

              expectedValidDirections = { horizontal: true, vertical: true };
              expectedEventArgs.scrollOffset = initialScrollPosition;
              helper.checkActionHandlerCalls(expect,
                ['onStart', 'onUpdated'],
                [
                  [expectedEventArgs],
                  [expectedEventArgs],
                ]);
              helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_VERTICAL, ['scrollTo'], [[expected]]);
              helper.checkScrollbarEventHandlerCalls(expect, DIRECTION_HORIZONTAL, ['scrollTo'], [[expected]]);

              expect(helper.viewModel.validDirections).toEqual(expectedValidDirections);
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

    describe('isContent', () => {
      it('element is scrollable container', () => {
        const helper = new ScrollableTestHelper({ direction: DIRECTION_VERTICAL });

        expect(helper.viewModel.isContent(helper.getScrollable().find('.dx-scrollable-container').getDOMNode())).toBe(true);
      });

      it('element is scrollbar', () => {
        const helper = new ScrollableTestHelper({ direction: DIRECTION_VERTICAL });

        expect(helper.viewModel.isContent(helper.getScrollable().find('.dx-scrollable-scrollbar').getDOMNode())).toBe(true);
      });

      it('element is not inside scrollable', () => {
        const helper = new ScrollableTestHelper({ direction: DIRECTION_VERTICAL });
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
    });
  });
});
