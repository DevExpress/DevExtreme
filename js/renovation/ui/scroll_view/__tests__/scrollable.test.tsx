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
      pullDownEnabled: false,
      reachBottomEnabled: false,
      scrollByContent: true,
      scrollByThumb: false,
      showScrollbar: 'onScroll',
      useNative: true,
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
      { name: 'scrollToElement', calledWith: ['arg1'] },
      { name: 'scrollToElementTopLeft', aliasName: 'scrollToElement', calledWith: ['arg1', { block: 'start', inline: 'start' }] },
      { name: 'scrollTo', calledWith: ['arg1'] },
      { name: 'scrollBy', calledWith: ['arg1'] },
      { name: 'content', calledWith: [] },
      { name: 'container', calledWith: [] },
      { name: 'update', calledWith: [] },
      { name: 'release', calledWith: [] },
      { name: 'refresh', calledWith: [] },
      { name: 'startLoading', calledWith: [] },
      { name: 'finishLoading', calledWith: [] },
      { name: 'validate', calledWith: ['arg1'] },
      { name: 'getScrollElementPosition', aliasName: 'getElementLocation', calledWith: ['arg1', 'arg2'] },
    ]).describe('Method: %o', (methodInfo) => {
      each([false, true]).describe('useNative: %o', (useNative) => {
        it(`${methodInfo.name}() method should call according strategy method`, () => {
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

          expect(handlerMock).toBeCalledTimes(1);
          expect(handlerMock).toHaveBeenCalledWith(...methodInfo.calledWith);
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
