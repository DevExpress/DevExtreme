import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from '@devextreme-generator/declarations';

import {
  Scrollable,
  viewFunction,
} from '../scrollable';

import {
  ScrollViewLoadPanel,
} from '../load_panel';
import { ScrollableProps } from '../scrollable_props';
import { ScrollableNative } from '../scrollable_native';
import { ScrollableSimulated } from '../scrollable_simulated';

import { Widget } from '../../common/widget';
import { ScrollableDirection, ScrollOffset } from '../types.d';

import { getWindow, setWindow } from '../../../../core/utils/window';
import * as ElementLocationModule from '../utils/get_element_location_internal';
import { DIRECTION_BOTH, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../common/consts';

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
      bounceEnabled: true,
      direction: 'vertical',
      forceGeneratePockets: false,
      needScrollViewContentWrapper: false,
      needScrollViewLoadPanel: false,
      needRenderScrollbars: true,
      pullDownEnabled: false,
      reachBottomEnabled: false,
      scrollByContent: true,
      scrollByThumb: false,
      showScrollbar: 'onScroll',
      useNative: true,
    });
  });

  each([false, true]).describe('useNative: %o', (useNativeScrolling) => {
    it('should pass all necessary properties to the Widget', () => {
      const config = {
        activeStateUnit: '.UIFeedback',
        useNative: useNativeScrolling,
        direction: 'vertical' as ScrollableDirection,
        width: '120px',
        height: '300px',
        activeStateEnabled: false,
        addWidgetClass: false,
        rtlEnabled: true,
        disabled: true,
        focusStateEnabled: false,
        hoverStateEnabled: !useNativeScrolling,
        tabIndex: 0,
        visible: true,
      };

      const scrollable = mount<Scrollable>(<Scrollable {...config} />);

      const { direction, useNative, ...restProps } = config;
      expect(scrollable.find(Widget).at(0).props()).toMatchObject({
        classes: useNative
          ? 'dx-scrollable dx-scrollable-native dx-scrollable-native-generic dx-scrollable-vertical dx-scrollable-disabled'
          : 'dx-scrollable dx-scrollable-simulated dx-scrollable-vertical dx-scrollable-disabled',
        ...restProps,
      });
    });
  });

  describe('Public methods', () => {
    each([
      { name: 'clientWidth', calledWith: [] },
      { name: 'clientHeight', calledWith: [] },
      { name: 'scrollLeft', calledWith: [] },
      { name: 'scrollTop', calledWith: [] },
      { name: 'scrollOffset', calledWith: [] },
      { name: 'scrollWidth', calledWith: [] },
      { name: 'scrollHeight', calledWith: [] },
      { name: 'scrollTo', calledWith: ['arg1'] },
      { name: 'scrollBy', calledWith: ['arg1'] },
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

  describe('LoadPanel integration', () => {
    describe('Getters', () => {
      it('position, targetElement: undefined', () => {
        const viewModel = new ScrollViewLoadPanel({ });

        expect(viewModel.position).toEqual(undefined);
      });

      it('position, targetElement is scrollableRef', () => {
        const scrollableElement = { width: '100' };
        const scrollableRef = { current: { width: '100' } } as RefObject;

        const viewModel = new ScrollViewLoadPanel({ targetElement: scrollableRef });

        expect(viewModel.position).toEqual({ of: scrollableElement });
      });
    });
  });
});
