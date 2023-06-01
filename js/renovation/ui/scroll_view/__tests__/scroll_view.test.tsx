import React from 'react';
import { mount } from 'enzyme';
import each from 'jest-each';

import { RefObject } from '@devextreme-generator/declarations';
import {
  ScrollView,
  viewFunction,
} from '../scroll_view';

import devices from '../../../../core/devices';
import * as support from '../../../../core/utils/support';
import browser from '../../../../core/utils/browser';

import { current } from '../../../../ui/themes';
import { SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE } from '../common/consts';

import { getWindow, setWindow } from '../../../../core/utils/window';
import { Widget } from '../../common/widget';
import { ScrollableDirection } from '../common/types';
import { ScrollViewProps } from '../common/scrollview_props';

interface Mock extends jest.Mock {}

jest.mock('../../../../ui/themes', () => ({
  ...jest.requireActual('../../../../ui/themes'),
  current: jest.fn(() => 'generic'),
}));

jest.mock('../../../../core/utils/support');

jest.mock('../../../../core/utils/browser', () => ({
  ...jest.requireActual('../../../../core/utils/browser'),
  mozilla: false,
}));

describe('ScrollView', () => {
  it('render with defaults', () => {
    const props = new ScrollViewProps();

    const scrollView = mount<ScrollView>(<ScrollView {...props} />);

    expect(scrollView.props()).toEqual({
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
      const config = {
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

      const scrollView = mount<ScrollView>(<ScrollView {...config} />);

      const { direction, useNative, ...restProps } = config;
      expect(scrollView.find(Widget).at(0).props()).toMatchObject({
        classes: useNative
          ? 'dx-scrollable dx-scrollable-native dx-scrollable-native-generic dx-scrollable-vertical dx-scrollable-disabled dx-scrollview'
          : 'dx-scrollable dx-scrollable-simulated dx-scrollable-vertical dx-scrollable-disabled dx-scrollview',
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
      { name: 'scrollOffset', calledWith: [] },
      { name: 'scrollWidth', calledWith: [] },
      { name: 'scrollHeight', calledWith: [] },
      { name: 'scrollToElement', calledWith: ['arg1-element', 'arg2-offset'] },
      { name: 'scrollTo', calledWith: ['arg1'] },
      { name: 'scrollBy', calledWith: ['arg1'] },
      { name: 'content', calledWith: [] },
      { name: 'container', calledWith: [] },
      { name: 'updateHandler', calledWith: [] },
      { name: 'release', calledWith: [] },
      { name: 'startLoading', calledWith: [] },
      { name: 'finishLoading', calledWith: [] },
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
        const funcHandler = jest.fn();
        const viewModel = new ScrollView({ pullDownEnabled });
        viewModel.scrollableRef = {
          current: { refresh: funcHandler },
        } as RefObject;

        viewModel.refresh();
        if (pullDownEnabled) {
          expect(funcHandler).toHaveBeenCalledTimes(1);
        } else {
          expect(funcHandler).not.toBeCalled();
        }
      });
    });

    each([true, false, undefined]).describe('preventScrollBottom: %o', (preventScrollBottom) => {
      it('release(preventScrollBottom)', () => {
        const funcHandler = jest.fn();
        const viewModel = new ScrollView({ });
        viewModel.scrollableRef = {
          current: { release: funcHandler },
        } as RefObject;

        viewModel.toggleLoading = jest.fn();

        viewModel.release(preventScrollBottom);

        if (preventScrollBottom !== undefined) {
          expect(viewModel.toggleLoading).toHaveBeenCalledTimes(1);
          expect(viewModel.toggleLoading).toHaveBeenCalledWith(!preventScrollBottom);
          expect(funcHandler).toHaveBeenCalledTimes(1);
        } else {
          expect(viewModel.toggleLoading).toHaveBeenCalledTimes(0);
          expect(funcHandler).toHaveBeenCalledTimes(1);
        }
      });
    });

    each([true, false]).describe('showOrHide: %o', (showOrHide) => {
      it('toggleLoading()', () => {
        const viewModel = new ScrollView({ });

        viewModel.toggleLoading(showOrHide);

        expect(viewModel.forceReachBottom).toEqual(showOrHide);
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      each([undefined, null, true, false]).describe('forceReachBottom: %o', (forceReachBottom) => {
        each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
          it('reachBottomEnabled()', () => {
            const viewModel = new ScrollView({ reachBottomEnabled });

            viewModel.forceReachBottom = forceReachBottom;

            if (forceReachBottom !== undefined && forceReachBottom !== null) {
              expect(viewModel.reachBottomEnabled).toEqual(forceReachBottom);
            } else {
              expect(viewModel.reachBottomEnabled).toEqual(reachBottomEnabled);
            }
          });
        });
      });

      describe('cssClasses', () => {
        each([false, true]).describe('useNative: %o', (useNative) => {
          each(['onScroll', 'onHover', 'always', 'never']).describe('showScrollbar: %o', (showScrollbar) => {
            it('strategy classes', () => {
              const viewModel = mount(viewFunction({ props: { useNative, direction: 'vertical', showScrollbar } } as any));

              const rootClasses = viewModel.getDOMNode().className;

              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollview'));
              expect(rootClasses).toEqual(expect.not.stringMatching('dx-widget'));
              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable'));
              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-vertical'));

              if (useNative) {
                expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
                expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-simulated'));

                if (showScrollbar === 'never') {
                  expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-scrollbars-hidden'));
                } else {
                  expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbars-hidden'));
                }
              } else {
                expect(rootClasses).toEqual(showScrollbar === 'always'
                  ? expect.stringMatching(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE)
                  : expect.not.stringMatching(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE));

                expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbars-hidden'));
                expect(rootClasses).toEqual(expect.not.stringMatching('dx-scrollable-native'));
                expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
              }
            });
          });
        });
      });

      each([false, true]).describe('useNative: %o', (useNative) => {
        each([false, true]).describe('isServerSide: %o', (isServerSide) => {
          it('render scrollView content', () => {
            const originalWindow = getWindow();

            try {
              setWindow({}, !isServerSide);
              const scrollView = mount(viewFunction({ props: { useNative } } as any));

              const scrollViewContent = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
              expect(scrollViewContent.exists()).toBe(true);
            } finally {
              setWindow(originalWindow, true);
            }
          });

          each([false, true]).describe('useSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
            it('render scrollbars', () => {
              const originalWindow = getWindow();

              try {
                setWindow({}, !isServerSide);
                const scrollView = mount(viewFunction(
                  { props: { useNative, useSimulatedScrollbar } } as any,
                ));

                const shouldRenderScrollbars = (!isServerSide && !useNative)
                  || (!isServerSide && useNative && useSimulatedScrollbar);

                const scrollViewContent = scrollView.find('.dx-scrollable-scrollbar');
                expect(scrollViewContent.exists()).toBe(
                  shouldRenderScrollbars,
                );
              } finally {
                setWindow(originalWindow, true);
              }
            });
          });

          it('render top & bottom pockets', () => {
            const originalWindow = getWindow();

            try {
              setWindow({}, !isServerSide);
              const scrollView = mount(viewFunction({ props: { useNative } } as any));

              const topPocket = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
              expect(topPocket.exists()).toBe(!isServerSide);
              const bottomPocket = scrollView.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
              expect(bottomPocket.exists()).toBe(!isServerSide);
            } finally {
              setWindow(originalWindow, true);
            }
          });

          it('render loadpanel', () => {
            const originalWindow = getWindow();

            try {
              setWindow({}, !isServerSide);
              const scrollView = mount(viewFunction({ props: { useNative } } as any));

              const loadPanel = scrollView.find('.dx-scrollview-loadpanel');
              expect(loadPanel.exists()).toBe(!isServerSide);
            } finally {
              setWindow(originalWindow, true);
            }
          });
        });
      });
    });
  });

  describe('Default options', () => {
    beforeEach(() => {
      (current as Mock).mockImplementation(() => 'generic');
    });

    afterEach(() => jest.resetAllMocks());

    describe('Texts', () => {
      it('theme: material, texts options: "value"', () => {
        (current as Mock).mockImplementation(() => 'material');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: 'value_1',
          pulledDownText: 'value_2',
          refreshingText: 'value_3',
          reachBottomText: 'value_4',
        })));
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
        })));
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('value_1');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('value_2');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('value_3');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('value_4');
      });

      it('theme: generic, texts options: empty string', () => {
        (current as Mock).mockImplementation(() => 'generic');

        const scrollView = mount(viewFunction(new ScrollView({
          pullingDownText: '',
          pulledDownText: '',
          refreshingText: '',
          reachBottomText: '',
        })));
        const scrollViewTopPocketTexts = scrollView.find('.dx-scrollview-pull-down-text > div');
        expect(scrollViewTopPocketTexts.length).toBe(3);

        expect(scrollViewTopPocketTexts.at(0).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(1).text()).toBe('');
        expect(scrollViewTopPocketTexts.at(2).text()).toBe('');

        const scrollViewBottomPocketTexts = scrollView.find('.dx-scrollview-scrollbottom-text > div');
        expect(scrollViewBottomPocketTexts.length).toBe(1);

        expect(scrollViewBottomPocketTexts.at(0).text()).toBe('');
      });

      each(['generic', 'material']).describe('currentTheme: %o', (currentTheme) => {
        const getDefaultOptions = (): ScrollViewProps => new ScrollViewProps();

        it(`theme: ${currentTheme}, check default values for text options`, () => {
          (current as Mock).mockImplementation(() => currentTheme);

          const isMaterial = currentTheme === 'material';

          if (isMaterial) {
            expect(getDefaultOptions().pullingDownText).toBe('');
            expect(getDefaultOptions().pulledDownText).toBe('');
            expect(getDefaultOptions().refreshingText).toBe('');
            expect(getDefaultOptions().reachBottomText).toBe('');
          } else {
            expect(getDefaultOptions().pullingDownText).toBe('Pull down to refresh...');
            expect(getDefaultOptions().pulledDownText).toBe('Release to refresh...');
            expect(getDefaultOptions().refreshingText).toBe('Refreshing...');
            expect(getDefaultOptions().reachBottomText).toBe('Loading...');
          }
        });
      });

      each([false, true]).describe('isSimulator: %o', (isSimulator) => {
        each(['desktop', 'phone', 'tablet']).describe('deviceType: %o', (deviceType) => {
          each(['desktop', 'generic', 'ios', 'android']).describe('realPlatform: %o', (realPlatform) => {
            each(['desktop', 'generic', 'android', 'ios']).describe('currentPlatform: %o', (currentPlatform) => {
              const getDefaultOptions = (): ScrollViewProps => new ScrollViewProps();

              it('scrollByThumb, showScrollbar, bounceEnabled, scrollByContent', () => {
                const originalIsSimulator = devices.isSimulator;
                const originalRealDevice = devices.real();
                const originalCurrentDevice = devices.current();

                try {
                  devices.isSimulator = jest.fn(() => isSimulator);
                  (devices as any).real({ platform: realPlatform, deviceType });
                  (devices as any).current({ platform: currentPlatform });

                  if (!isSimulator && deviceType === 'desktop' && currentPlatform === 'generic') {
                    expect(getDefaultOptions().scrollByThumb).toBe(true);
                    expect(getDefaultOptions().showScrollbar).toBe('onHover');
                    expect(getDefaultOptions().bounceEnabled).toBe(false);
                    expect(getDefaultOptions().scrollByContent).toBe(support.touch);
                  } else {
                    expect(getDefaultOptions().scrollByThumb).toBe(false);
                    expect(getDefaultOptions().showScrollbar).toBe('onScroll');
                    expect(getDefaultOptions().bounceEnabled).toBe(true);
                    expect(getDefaultOptions().scrollByContent).toBe(true);
                  }
                } finally {
                  devices.isSimulator = originalIsSimulator;
                  (devices as any).real(originalRealDevice);
                  (devices as any).current(originalCurrentDevice);
                }
              });

              each([true, false]).describe('nativeScrolling: %o', (nativeScrolling) => {
                each([true, false]).describe('browser.mozilla: %o', (mozilla) => {
                  it('useNative, useSimulatedScrollbar', () => {
                    const originalIsSimulator = devices.isSimulator;
                    const originalRealDevice = devices.real();
                    const originalCurrentDevice = devices.current();

                    try {
                      devices.isSimulator = jest.fn(() => isSimulator);
                      (browser as any).mozilla = mozilla;
                      (support as any).nativeScrolling = nativeScrolling;
                      (devices as any).real({ platform: realPlatform, deviceType });
                      (devices as any).current({ platform: currentPlatform });

                      let expectedDefaultUseSimulatedScrollbar = false;
                      let expectedDefaultUseNative = false;
                      if (nativeScrolling && realPlatform === 'android' && !mozilla) {
                        expectedDefaultUseSimulatedScrollbar = true;
                      }

                      if (nativeScrolling) {
                        expectedDefaultUseNative = true;
                      }

                      expect(getDefaultOptions().useNative).toBe(expectedDefaultUseNative);
                      expect(getDefaultOptions().useSimulatedScrollbar)
                        .toBe(expectedDefaultUseSimulatedScrollbar);
                    } finally {
                      devices.isSimulator = originalIsSimulator;
                      (devices as any).real(originalRealDevice);
                      (devices as any).current(originalCurrentDevice);
                      browser.mozilla = false;
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
