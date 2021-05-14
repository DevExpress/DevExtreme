import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';

import {
  ScrollView,
  viewFunction,
  ScrollViewProps,
} from '../scroll_view';

import {
  defaultOptionRules,
} from '../scrollable';

import devices from '../../../../core/devices';
import { touch } from '../../../../core/utils/support';
import { convertRulesToOptions } from '../../../../core/options/utils';
import { current } from '../../../../ui/themes';

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
  it('render with defaults', () => {
    const props = new ScrollViewProps();
    const scrollable = mount<ScrollView>(<ScrollView {...props} />);

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
      updateManually: false,
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
      { name: 'scrollTo', calledWith: ['arg1'] },
      { name: 'scrollBy', calledWith: ['arg1'] },
      { name: 'content', calledWith: [] },
      { name: 'update', calledWith: [] },
      { name: 'release', calledWith: [] },
    ]).describe('Method: %o', (methodInfo) => {
      it(`${methodInfo.name}() method should call according scrollable method`, () => {
        const viewModel = new ScrollView({ });
        const handlerMock = jest.fn();

        (viewModel as any).scrollableRef = { current: { [`${methodInfo.name}`]: handlerMock } };

        viewModel[methodInfo.name](...methodInfo.calledWith);

        expect(handlerMock).toBeCalledTimes(1);
        expect(handlerMock).toHaveBeenCalledWith(...methodInfo.calledWith);
      });
    });

    each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
      it('refresh() method should call according method from scrollbar', () => {
        const viewModel = new ScrollView({ pullDownEnabled });
        const funcHandler = jest.fn();
        Object.defineProperties(viewModel, {
          scrollable: {
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
        each([false, true]).describe('useNative: %o', (useNative) => {
          each(['onScroll', 'onHover', 'always', 'never']).describe('showScrollbar: %o', (showScrollbar) => {
            it('strategy classes', () => {
              const viewModel = mount(viewFunction({ props: { useNative, direction: 'vertical', showScrollbar } } as any) as JSX.Element);

              const rootClasses = viewModel.getDOMNode().className;

              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollview'));
              expect(rootClasses).toEqual(expect.not.stringMatching('dx-widget'));
              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable'));
              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-renovated'));
              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-vertical'));

              if (showScrollbar === 'never') {
                expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-scrollbars-hidden'));
              } else {
                expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbars-hidden'));
              }

              if (useNative) {
                expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
                expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-simulated'));
              } else {
                expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-native'));
                expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
                expect(rootClasses).toEqual(expect.stringMatching('dx-visibility-change-handler'));
              }
            });
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
            scrollableRef: { get() { return { current: 'scrollableRef' }; } },
          });

          expect(viewModel.scrollable).toEqual('scrollableRef');
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
