import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';

import {
  Scrollable,
  viewFunction,
} from '../scrollable';

import { ScrollableNative } from '../strategy/native';
import { ScrollableSimulated } from '../strategy/simulated';

import { Widget } from '../../common/widget';
import { ScrollableDirection, ScrollOffset } from '../common/types';

import { getWindow, setWindow } from '../../../../core/utils/window';
import * as ElementLocationModule from '../utils/get_element_location_internal';
import { DIRECTION_BOTH, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../common/consts';
import { ScrollableProps } from '../common/scrollable_props';
import config from '../../../../core/config';
import { ConfigContextValue } from '../../../common/config_context';

jest.mock('../utils/get_element_location_internal', () => ({
  ...jest.requireActual('../utils/get_element_location_internal'),
  getElementLocationInternal: jest.fn(),
}));

jest.mock('../../../../ui/themes', () => ({
  isMaterial: jest.fn(() => false),
  isGeneric: jest.fn(() => true),
  current: jest.fn(() => 'generic'),
}));

describe('Scrollable', () => {
  it('render with defaults', () => {
    const props = new ScrollableProps();
    const viewModel = mount<Scrollable>(<Scrollable {...props} />);

    expect(viewModel.props()).toEqual({
      addWidgetClass: false,
      aria: {},
      bounceEnabled: false,
      classes: '',
      direction: 'vertical',
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
      refreshStrategy: 'pullDown',
      refreshingText: 'Refreshing...',
      scrollByContent: false,
      scrollByThumb: true,
      showScrollbar: 'onHover',
      useKeyboard: true,
      useNative: false,
      useSimulatedScrollbar: false,
      visible: true,
    });
  });

  each([false, true]).describe('useNative: %o', (useNativeScrolling) => {
    it('should pass all necessary properties to the Widget', () => {
      const options = {
        useNative: useNativeScrolling,
        direction: 'vertical' as ScrollableDirection,
        width: '120px',
        height: '300px',
        activeStateEnabled: false,
        addWidgetClass: false,
        rtlEnabled: true,
        disabled: true,
        focusStateEnabled: false,
        hoverStateEnabled: false,
        tabIndex: 0,
        visible: true,
      };

      const scrollable = mount<Scrollable>(<Scrollable {...options} />);

      const { direction, useNative, ...restProps } = options;
      expect(scrollable.find(Widget).at(0).props()).toMatchObject({
        classes: useNative
          ? 'dx-scrollable dx-scrollable-native dx-scrollable-native-generic dx-scrollable-vertical dx-scrollable-disabled'
          : 'dx-scrollable dx-scrollable-simulated dx-scrollable-vertical dx-scrollable-disabled',
        ...restProps,
        disabled: !!useNative,
      });
    });
  });

  describe('Public methods', () => {
    each([
      { name: 'clientWidth', calledWith: [] },
      { name: 'clientHeight', calledWith: [] },
      { name: 'scrollLeft', calledWith: [] },
      { name: 'scrollTop', calledWith: [] },
      { name: 'scrollOffset', calledWith: [], hasSSRMode: true },
      { name: 'scrollWidth', calledWith: [] },
      { name: 'scrollHeight', calledWith: [] },
      { name: 'content', calledWith: [] },
      { name: 'container', calledWith: [] },
      { name: 'updateHandler', calledWith: [] },
      { name: 'release', calledWith: [], hasSSRMode: true },
      { name: 'refresh', calledWith: [], hasSSRMode: true },
      { name: 'startLoading', calledWith: [] },
      { name: 'finishLoading', calledWith: [], hasSSRMode: true },
      { name: 'validate', calledWith: ['arg1'] },
    ]).describe('Method: %o', (methodInfo) => {
      each([false, true]).describe('useNative: %o', (useNative) => {
        each([false, true]).describe('isServeSide: %o', (isServerSide) => {
          it(`${methodInfo.name}() method should call according strategy method`, () => {
            const originalWindow = getWindow();

            try {
              setWindow({}, !isServerSide);

              const viewModel = new Scrollable({ useNative });
              const scrollable = mount(viewFunction(viewModel));

              const handlerMock = jest.fn();

              if (useNative) {
                Object.defineProperties(viewModel, {
                  scrollableNativeRef: {
                    get() {
                      return { current: scrollable.find(ScrollableNative).instance() };
                    },
                  },
                  scrollableSimulatedRef: { get() { return { current: null }; } },
                });

                expect(viewModel.scrollableNativeRef.current![`${methodInfo.aliasName || methodInfo.name}`]).not.toEqual(undefined);

                viewModel.scrollableNativeRef.current![`${methodInfo.aliasName || methodInfo.name}`] = handlerMock;
              } else {
                Object.defineProperties(viewModel, {
                  scrollableNativeRef: { get() { return { current: null }; } },
                  scrollableSimulatedRef: {
                    get() {
                      return { current: scrollable.find(ScrollableSimulated).instance() };
                    },
                  },
                });

                expect(viewModel.scrollableSimulatedRef.current![`${methodInfo.aliasName || methodInfo.name}`]).not.toEqual(undefined);

                viewModel.scrollableSimulatedRef.current![`${methodInfo.aliasName || methodInfo.name}`] = handlerMock;
              }

              viewModel[methodInfo.name](...methodInfo.calledWith);

              if (methodInfo.hasSSRMode && isServerSide) {
                expect(handlerMock).toBeCalledTimes(0);
              } else {
                expect(handlerMock).toBeCalledTimes(1);
                expect(handlerMock).toHaveBeenCalledWith(...methodInfo.calledWith);
              }
            } finally {
              setWindow(originalWindow, true);
            }
          });
        });
      });
    });

    each([false, true]).describe('elementIsInsiceContent: %o', (contentContainsElement) => {
      each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('direction: %o', (direction) => {
        it('scrollToElement() method should call getScrollElementLocation() method', () => {
          const viewModel = new Scrollable({ direction });
          const contentElement = {
            contains: () => contentContainsElement as boolean,
          };
          const element = {} as HTMLElement;
          const additionalOffset = { top: 10 };

          viewModel.content = () => contentElement as unknown as HTMLDivElement;
          viewModel.scrollTo = jest.fn();
          viewModel.getScrollElementPosition = jest.fn(
            () => (direction !== DIRECTION_VERTICAL ? 70 : 105),
          );

          viewModel.scrollToElement(
            element,
            additionalOffset,
          );

          const expectedTargetLocation = { top: 0, left: 0 };

          if (!contentContainsElement) {
            expect(viewModel.scrollTo).not.toBeCalled();
            expect(viewModel.getScrollElementPosition).not.toBeCalled();
          } else {
            const isBoth = direction === DIRECTION_BOTH;

            if (direction !== DIRECTION_VERTICAL) {
              expect(viewModel.getScrollElementPosition)
                .toBeCalledTimes(isBoth ? 2 : 1);
              expect(viewModel.getScrollElementPosition)
                .nthCalledWith(1, element, DIRECTION_HORIZONTAL, additionalOffset);
              expectedTargetLocation.left = 70;
            }

            if (direction !== DIRECTION_HORIZONTAL) {
              expect(viewModel.getScrollElementPosition)
                .toBeCalledTimes(isBoth ? 2 : 1);
              expect(viewModel.getScrollElementPosition)
                .lastCalledWith(element, DIRECTION_VERTICAL, additionalOffset);
              expectedTargetLocation.top = isBoth ? 70 : 105;
            }

            expect(viewModel.scrollTo).toBeCalled();
            expect(viewModel.scrollTo).toBeCalledWith(expectedTargetLocation);
          }
        });
      });
    });

    it('getScrollElementLocation() method should call getScrollElementLocationInternal utility method', () => {
      const handlerMock = jest.spyOn(ElementLocationModule, 'getElementLocationInternal');
      const viewModel = new Scrollable({});

      const containerElement = { scrollLeft: 20 } as HTMLDivElement;
      const scrollOffset = { top: 10, left: 5 } as ScrollOffset;
      const additionalOffset = {
        top: 1, right: 2, bottom: 3, left: 4,
      };

      viewModel.container = () => containerElement;
      viewModel.scrollOffset = jest.fn(() => scrollOffset);

      const targetElement = { scrollLeft: 20 } as HTMLDivElement;
      viewModel.getScrollElementPosition(
        targetElement,
        DIRECTION_VERTICAL,
        additionalOffset,
      );

      expect(handlerMock).toBeCalled();
      expect(handlerMock).toBeCalledWith(
        targetElement,
        DIRECTION_VERTICAL,
        containerElement,
        scrollOffset,
        additionalOffset,
      );
    });

    each([false, true]).describe('useNative: %o', (useNative) => {
      each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH]).describe('direction: %o', (direction) => {
        test.each([0, undefined, null, {},
          { top: 0 }, { left: 0 }, { top: 0, left: 0 },
          { x: 0 }, { y: 0 }, { x: 0, y: 0 },
        ])('scrollBy(%o), not pass info to strategy handler if location not changed', (distance: any) => {
          const viewModel = new Scrollable({ useNative, direction });

          const scrollByLocationHandler = jest.fn();
          Object.defineProperties(viewModel, {
            scrollableRef: {
              get() { return { current: { scrollByLocation: scrollByLocationHandler } }; },
            },
          });

          viewModel.scrollBy(distance);

          expect(scrollByLocationHandler).not.toBeCalled();
        });

        test.each([20, -20])('scrollBy(%o), distance as number, pass info to strategy handler', (distance) => {
          const viewModel = new Scrollable({ useNative, direction });

          const scrollByLocationHandler = jest.fn();
          Object.defineProperties(viewModel, {
            scrollableRef: {
              get() { return { scrollByLocation: scrollByLocationHandler }; },
            },
          });

          viewModel.scrollBy(distance);

          const expectedDistance = { top: distance, left: distance };
          if (direction === DIRECTION_VERTICAL) {
            expectedDistance.left = 0;
          }
          if (direction === DIRECTION_HORIZONTAL) {
            expectedDistance.top = 0;
          }
          expect(scrollByLocationHandler).toBeCalledTimes(1);
          expect(scrollByLocationHandler).toBeCalledWith(expectedDistance);
        });

        test.each([
          { top: 20, left: 15 }, { top: -20, left: -15 },
          { y: 20, x: 15 }, { y: -20, x: -15 },
        ])('scrollBy(%o), distance as full object, pass info to strategy handler', (distance) => {
          const viewModel = new Scrollable({ useNative, direction });

          const scrollByLocationHandler = jest.fn();
          Object.defineProperties(viewModel, {
            scrollableRef: {
              get() { return { scrollByLocation: scrollByLocationHandler }; },
            },
          });

          viewModel.scrollBy(distance);

          const expectedDistance = {
            top: distance.top ?? distance.y,
            left: distance.left ?? distance.x,
          };

          expect(scrollByLocationHandler).toBeCalledTimes(1);
          expect(scrollByLocationHandler).toBeCalledWith(expectedDistance);
        });

        test.each([
          { top: 20 }, { left: 15 }, { top: -20 }, { left: -15 },
          { y: 20 }, { x: 15 }, { y: -20 }, { x: -15 },
        ])('scrollBy(%o), distance as partial object, pass info to strategy handler', (distance) => {
          const viewModel = new Scrollable({ useNative, direction });

          const scrollByLocationHandler = jest.fn();
          Object.defineProperties(viewModel, {
            scrollableRef: {
              get() { return { scrollByLocation: scrollByLocationHandler }; },
            },
          });

          viewModel.scrollBy(distance);

          const expectedDistance = {
            top: distance.top ?? distance.y ?? 0,
            left: distance.left ?? distance.x ?? 0,
          };

          expect(scrollByLocationHandler).toBeCalledTimes(1);
          expect(scrollByLocationHandler).toBeCalledWith(expectedDistance);
        });

        const vertical = direction === DIRECTION_VERTICAL || direction === DIRECTION_BOTH;
        const horizontal = direction === DIRECTION_HORIZONTAL || direction === DIRECTION_BOTH;

        each([
          [{ top: 30, left: 20 }, undefined, { top: 0, left: 0 }],
          [{ top: 30, left: 20 }, null, { top: 0, left: 0 }],
          [{ top: 30, left: 20 }, {}, { top: 0, left: 0 }],
          [{ top: 30, left: 20 }, 0, { top: vertical ? -30 : 0, left: horizontal ? -20 : 0 }],
          [{ top: 30, left: 20 }, 20, { top: vertical ? -10 : 0, left: 0 }],
          [{ top: 30, left: 20 }, 50, { top: vertical ? 20 : 0, left: horizontal ? 30 : 0 }],
          [{ top: 50, left: 50 }, -100, { top: vertical ? -150 : 0, left: horizontal ? -150 : 0 }],
          [{ top: 30, left: 20 }, { top: 10 }, { top: -20, left: 0 }],
          [{ top: 30, left: 20 }, { left: 10 }, { top: 0, left: -10 }],
          [{ top: 30, left: 20 }, { y: 40 }, { top: 10, left: 0 }],
          [{ top: 30, left: 20 }, { x: 40 }, { top: 0, left: 20 }],
          [{ top: 30, left: 20 }, { top: 10, left: 15 }, { top: -20, left: -5 }],
          [{ top: 30, left: 20 }, { y: 10, x: 15 }, { top: -20, left: -5 }],
          [{ top: 15, left: 5 }, { top: 40, left: 40 }, { top: 25, left: 35 }],

        ]).describe('initialOffset: %o,', (initialOffset, scrollToValue, expectedScrollByArg) => {
          it(`scrollTo(${scrollToValue}), calculate correct offset to targetElement and pass it to scrollBy() method`, () => {
            const viewModel = new Scrollable({ useNative, direction });

            viewModel.scrollBy = jest.fn();

            const currentContentOffset = {
              scrollTop: initialOffset.top,
              scrollLeft: initialOffset.left,
            };
            viewModel.scrollOffset = () => ({
              top: currentContentOffset.scrollTop,
              left: currentContentOffset.scrollLeft,
            });
            viewModel.container = () => ({ ...currentContentOffset } as any);
            viewModel.updateHandler = jest.fn();

            viewModel.scrollTo(scrollToValue);

            expect(viewModel.updateHandler).toBeCalledTimes(useNative ? 0 : 1);
            expect(viewModel.scrollBy).toBeCalledTimes(1);
            expect(viewModel.scrollBy).toBeCalledWith(expectedScrollByArg);
          });
        });
      });
    });
  });

  describe('Logic', () => {
    describe('cssClasses', () => {
      each([false, true]).describe('useNative: %o', (useNative) => {
        it('Check strategy branch', () => {
          const scrollable = mount(viewFunction({ props: { useNative } } as any));

          if (useNative) {
            expect(scrollable.find('.dx-scrollable-native').exists()).toBe(true);
            expect(scrollable.find('.dx-scrollable-simulated').exists()).toBe(false);
          } else {
            expect(scrollable.find('.dx-scrollable-native').exists()).toBe(false);
            expect(scrollable.find('.dx-scrollable-simulated').exists()).toBe(true);
          }
        });
      });
    });

    describe('Integration with form', () => {
      each([false, true]).describe('useNative: %o', (useNative) => {
        it('aria property', () => {
          const scrollable = mount(viewFunction({ props: { useNative, aria: { role: 'form' } } } as any));

          expect(scrollable.find('.dx-scrollable').prop('role')).toEqual('form');
        });
      });
    });

    describe('Getters', () => {
      describe('rtlEnabled', () => {
        each`
        global       | rtlEnabled   | contextConfig      | expected
        ${true}      | ${true}      | ${true}            | ${true}
        ${undefined} | ${undefined} | ${undefined}       | ${false}
        ${true}      | ${true}      | ${undefined}       | ${true}
        ${true}      | ${false}     | ${undefined}       | ${false}
        ${true}      | ${true}      | ${false}           | ${true}
        ${true}      | ${false}     | ${true}            | ${false}
        ${true}      | ${undefined} | ${undefined}       | ${true}
        ${true}      | ${undefined} | ${true}            | ${true}
        ${true}      | ${undefined} | ${false}           | ${false}
          `
          .describe('pass the prepared rtl value to the strategy', ({
            global, rtlEnabled, contextConfig, expected,
          }) => {
            const name = `${JSON.stringify({
              global, rtlEnabled, contextConfig, expected,
            })}`;

            it(name, () => {
              const viewModel = new Scrollable({ rtlEnabled });
              config().rtlEnabled = global;
              viewModel.config = { rtlEnabled: contextConfig } as ConfigContextValue;

              expect(viewModel.rtlEnabled).toEqual(expected);
            });
          });
      });

      each([false, true]).describe('useNative: %o', (useNative) => {
        it('scrollableRef', () => {
          const viewModel = new Scrollable({ useNative });

          Object.defineProperties(viewModel, {
            scrollableNativeRef: { get() { return { current: 'native' }; } },
            scrollableSimulatedRef: { get() { return { current: 'simulated' }; } },
          });

          expect(viewModel.scrollableRef)
            .toEqual(useNative ? 'native' : 'simulated');
        });
      });
    });
  });
});
