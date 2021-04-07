import { mount } from 'enzyme';
import each from 'jest-each';

import {
  ScrollView,
  viewFunction,
} from '../scroll_view';

import {
  defaultOptionRules,
} from '../scrollable';

import devices from '../../../../core/devices';
import { touch } from '../../../../core/utils/support';
import { convertRulesToOptions } from '../../../../core/options/utils';
import { current } from '../../../../ui/themes';
import { ScrollViewProps } from '../scroll_view_props';

import { isDefined } from '../../../../core/utils/type';

interface Mock extends jest.Mock {}

jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  const real = actualDevices.real.bind(actualDevices);
  const platform = actualDevices.real.bind(actualDevices);
  const isSimulator = actualDevices.isSimulator.bind(actualDevices);

  actualDevices.isSimulator = jest.fn(isSimulator);
  actualDevices.real = jest.fn(real);
  actualDevices.current = jest.fn(platform);

  return actualDevices;
});

jest.mock('../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

describe('ScrollView', () => {
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
    ]).describe('Method: %o', (methodInfo) => {
      it(`${methodInfo.name}() method should call according method from scrollbar`, () => {
        const viewModel = new ScrollView({ });
        const funcHandler = jest.fn();
        Object.defineProperties(viewModel, {
          scrollableRef: {
            get() { return ({ [`${methodInfo.name}`]: funcHandler }); },
          },
        });

        if (isDefined(viewModel.scrollableRef)) {
          if (methodInfo.argsCount === 2) {
            viewModel[methodInfo.name]('arg1', 'arg2');
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

    each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
      it('refresh() method should call according method from scrollbar', () => {
        const viewModel = new ScrollView({ pullDownEnabled });
        const funcHandler = jest.fn();
        Object.defineProperties(viewModel, {
          scrollableRef: {
            get() { return ({ refresh: funcHandler }); },
          },
        });

        viewModel.refresh();
        if (pullDownEnabled) {
          expect(funcHandler).toHaveBeenCalledTimes(1);
        } else {
          expect(funcHandler).not.toBeCalled();
        }
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('cssClasses', () => {
        it('Check default property values', () => {
          const { cssClasses } = new ScrollView({});
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollview'));
        });

        each([false, true]).describe('useNative: %o', (useNative) => {
          it('Check strategy branch', () => {
            const scrollView = mount(viewFunction({ props: { useNative } } as any) as JSX.Element);

            if (useNative) {
              expect(scrollView.find('.dx-scrollable-native').exists()).toBe(true);
              expect(scrollView.find('.dx-scrollable-simulated').exists()).toBe(false);
            } else {
              expect(scrollView.find('.dx-scrollable-native').exists()).toBe(false);
              expect(scrollView.find('.dx-scrollable-simulated').exists()).toBe(true);
            }
          });
        });

        it('should render scrollView content', () => {
          const scrollView = mount(viewFunction({ props: {} } as any) as JSX.Element);

          const scrollViewContent = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(true);
        });

        it('should not render top & bottom pockets', () => {
          const scrollView = mount(viewFunction({ props: { } } as any) as JSX.Element);
          const topPocket = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
          expect(topPocket.exists()).toBe(true);
          const bottomPocket = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
          expect(bottomPocket.exists()).toBe(true);
        });
      });

      each([false, true]).describe('useNative: %o', (useNative) => {
        it('scrollableRef', () => {
          const viewModel = new ScrollView({ useNative });

          Object.defineProperties(viewModel, {
            scrollableNativeRef: { get() { return { current: 'native' }; } },
            scrollViewSimulatedRef: { get() { return { current: 'simulated' }; } },
          });

          expect(viewModel.scrollableRef)
            .toEqual(useNative ? 'native' : 'simulated');
        });
      });
    });
  });

  describe('Default options', () => {
    beforeEach(() => {
      (devices.real as Mock).mockImplementation(() => ({ platform: 'generic' }));
      (devices as any).isSimulator.mockImplementation(() => false);
      (current as Mock).mockImplementation(() => 'generic');
    });

    afterEach(() => jest.resetAllMocks());

    describe('Texts', () => {
      it('theme: material, texts options: undefined', () => {
        (current as Mock).mockImplementation(() => 'material');

        const scrollView = mount(viewFunction(new ScrollView({})) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('');
      });

      it('theme: material, texts options: "value"', () => {
        (current as Mock).mockImplementation(() => 'material');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: 'value_1',
          pulledDownText: 'value_2',
          refreshingText: 'value_3',
          reachBottomText: 'value_4',
        })) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('value_1');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('value_2');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('value_3');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('value_4');
      });

      it('theme: generic, texts options: "value"', () => {
        (current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: 'value_1',
          pulledDownText: 'value_2',
          refreshingText: 'value_3',
          reachBottomText: 'value_4',
        })) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('value_1');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('value_2');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('value_3');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('value_4');
      });

      it('theme: generic, texts options: undefined', () => {
        (current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({})) as JSX.Element);

        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('Pull down to refresh...');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('Release to refresh...');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('Refreshing...');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('Loading...');
      });

      it('theme: generic, texts options: empty string', () => {
        (current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: '',
          pulledDownText: '',
          refreshingText: '',
          reachBottomText: '',
        })) as JSX.Element);
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('');
      });
    });

    describe('Options', () => {
      const getDefaultOptions = (): ScrollViewProps => Object.assign(new ScrollViewProps(),
        convertRulesToOptions(defaultOptionRules));

      each([false, true]).describe('isSimulator: %o', (isSimulator) => {
        each(['desktop', 'phone', 'tablet']).describe('deviceType: %o', (deviceType) => {
          each(['generic', 'android', 'ios']).describe('platform: %o', (platform) => {
            it('scrollByThumb, showScrollbar', () => {
              (devices as any).isSimulator.mockImplementation(() => isSimulator);
              (devices.real as Mock).mockImplementation(() => ({ deviceType }));
              (devices.current as Mock).mockImplementation(() => ({ platform }));

              if (!isSimulator && deviceType === 'desktop' && platform === 'generic') {
                expect(getDefaultOptions().scrollByThumb).toBe(true);
                expect(getDefaultOptions().showScrollbar).toBe('onHover');
                expect(getDefaultOptions().bounceEnabled).toBe(false);
                expect(getDefaultOptions().scrollByContent).toBe(touch);
              } else {
                expect(getDefaultOptions().scrollByThumb).toBe(false);
                expect(getDefaultOptions().showScrollbar).toBe('onScroll');
                expect(getDefaultOptions().bounceEnabled).toBe(true);
                expect(getDefaultOptions().scrollByContent).toBe(true);
              }
            });
          });
        });
      });
    });
  });
});
