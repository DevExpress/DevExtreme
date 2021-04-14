import { mount } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from '@devextreme-generator/declarations';
import { isDefined } from '../../../../core/utils/type';

// eslint-disable-next-line import/first
import {
  Scrollable,
  viewFunction,
} from '../scrollable';

import {
  ScrollViewLoadPanel,
} from '../load_panel';

jest.mock('../../../../ui/themes', () => ({
  isMaterial: jest.fn(() => false),
  isGeneric: jest.fn(() => true),
  current: jest.fn(() => 'generic'),
}));

describe('Public methods', () => {
  each([
    { name: 'clientWidth', argsCount: 0 },
    { name: 'clientHeight', argsCount: 0 },
    { name: 'scrollLeft', argsCount: 0 },
    { name: 'scrollTop', argsCount: 0 },
    { name: 'scrollOffset', argsCount: 0 },
    { name: 'scrollWidth', argsCount: 0 },
    { name: 'scrollHeight', argsCount: 0 },
    { name: 'scrollToElement', argsCount: 2 },
    { name: 'scrollTo', argsCount: 1 },
    { name: 'scrollBy', argsCount: 1 },
    { name: 'content', argsCount: 0 },
    { name: 'update', argsCount: 0 },
    { name: 'release', argsCount: 0 },
    { name: 'refresh', argsCount: 0 },
    { name: 'validate', argsCount: 1 },
    { name: 'getScrollElementPosition', aliasName: 'getElementLocation', argsCount: 2 },
  ]).describe('Method: %o', (methodInfo) => {
    each([false, true]).describe('useNative: %o', (useNative) => {
      it(`${methodInfo.name}() method should call according method from scrollbar`, () => {
        const viewModel = new Scrollable({ useNative });
        const funcHandler = jest.fn();

        Object.defineProperties(viewModel, {
          scrollableRef: {
            get() { return ({ [`${methodInfo.aliasName || methodInfo.name}`]: funcHandler }); },
          },
        });

        if (isDefined(viewModel.scrollableRef)) {
          if (methodInfo.argsCount === 2) {
            viewModel[methodInfo.name || methodInfo.name]('arg1', 'arg2');
            expect(funcHandler).toHaveBeenCalledWith('arg1', 'arg2');
          } else if (methodInfo.argsCount === 1) {
            viewModel[methodInfo.name]('arg1');
            expect(funcHandler).toHaveBeenCalledWith('arg1');
          } else {
            viewModel[methodInfo.name]();
            expect(funcHandler).toHaveBeenCalledTimes(1);
          }
        }
      });
    });
  });
});

describe('Logic', () => {
  describe('cssClasses', () => {
    each([false, true]).describe('useNative: %o', (useNative) => {
      it('Check strategy branch', () => {
        const scrollable = mount(viewFunction({ props: { useNative } } as any) as JSX.Element);

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
