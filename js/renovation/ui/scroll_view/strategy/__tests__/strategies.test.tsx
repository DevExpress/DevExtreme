import React from 'react';
import each from 'jest-each';
import {
  RefObject,
} from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../../../utils/effect_return';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../../test_utils/events_mock';

import {
  optionValues,
} from '../../__tests__/utils';

import {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  SCROLLABLE_DISABLED_CLASS, SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
} from '../../common/consts';

import { titleize } from '../../../../../core/utils/inflector';

import {
  ScrollableNative,
} from '../native';

import {
  ScrollableSimulated,
} from '../simulated';

import { ScrollableTestHelper as ScrollableSimulatedTestHelper } from './simulated_test_helper';
import { ScrollableTestHelper as ScrollableNativeTestHelper } from './native_test_helper';

import { getTranslateValues } from '../../utils/get_translate_values';
import { subscribeToResize } from '../../utils/subscribe_to_resize';
import {
  getElementOverflowX,
  getElementOverflowY,
} from '../../utils/get_element_style';
import { DxMouseEvent, ScrollableDirection } from '../../common/types';

jest.mock('../../utils/get_element_style', () => ({
  ...jest.requireActual('../../utils/get_element_style'),
  getElementOverflowX: jest.fn(() => 'visible'),
  getElementOverflowY: jest.fn(() => 'visible'),
}));

jest.mock('../../utils/get_translate_values', () => ({
  ...jest.requireActual('../../utils/get_translate_values'),
  getTranslateValues: jest.fn(() => ({ top: 0, left: 0 })),
}));

jest.mock('../../utils/subscribe_to_resize', () => ({
  ...jest.requireActual('../../utils/subscribe_to_resize'),
  subscribeToResize: jest.fn(),
}));

jest.mock('../../../../../ui/themes', () => ({
  isMaterial: jest.fn(() => false),
  isGeneric: jest.fn(() => true),
  current: jest.fn(() => 'generic'),
}));

interface NativeStrategy {
  Scrollable: typeof ScrollableNative;
  ScrollableTestHelper: typeof ScrollableNativeTestHelper;
}

interface SimulatedStrategy {
  Scrollable: typeof ScrollableSimulated;
  ScrollableTestHelper: typeof ScrollableSimulatedTestHelper;
}

const strategies: (NativeStrategy | SimulatedStrategy)[] = [{
  Scrollable: ScrollableNative,
  ScrollableTestHelper: ScrollableNativeTestHelper,
}, {
  Scrollable: ScrollableSimulated,
  ScrollableTestHelper: ScrollableSimulatedTestHelper,
}];

each(strategies).describe('Scrollable ', (strategy: SimulatedStrategy | NativeStrategy) => {
  const { Scrollable, ScrollableTestHelper } = strategy;

  describe(`${Scrollable === ScrollableNative ? 'Native' : 'Simulated'}`, () => {
    describe('Render', () => {
      it('should render scrollable content', () => {
        const helper = new ScrollableTestHelper({ });

        const scrollableContent = helper.scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content');
        expect(scrollableContent.exists()).toBe(true);
      });

      each([true, false]).describe('NeedScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
        it('should render scrollView content only if needScrollViewContentWrapper option is enabled', () => {
          const helper = new ScrollableTestHelper({ needScrollViewContentWrapper });

          const scrollViewContent = helper.getScrollable().find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(needScrollViewContentWrapper);
        });
      });

      it('should not render top & bottom pockets', () => {
        const helper = new ScrollableTestHelper({ });

        const topPocket = helper.scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
        expect(topPocket.exists()).toBe(false);
        const bottomPocket = helper.scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
        expect(bottomPocket.exists()).toBe(false);
      });

      it('should render top & bottom pockets', () => {
        const helper = new ScrollableTestHelper({ forceGeneratePockets: true });

        const topPocket = helper.scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
        expect(topPocket.exists()).toBe(true);
        const bottomPocket = helper.scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
        expect(bottomPocket.exists()).toBe(true);
      });

      it('should render top pockets with classes', () => {
        const helper = new ScrollableTestHelper({ forceGeneratePockets: true });

        const pullDown = helper.scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down');
        expect(pullDown.exists()).toBe(true);
        const pullDownImage = helper.scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down > .dx-scrollview-pull-down-image');
        expect(pullDownImage.exists()).toBe(true);
        const pullDownIndicator = helper.scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down > .dx-scrollview-pull-down-indicator');
        expect(pullDownIndicator.exists()).toBe(true);
        const pullDownText = helper.scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down > .dx-scrollview-pull-down-image');
        expect(pullDownText.exists()).toBe(true);
      });

      it('should render bottom pockets with classes', () => {
        const helper = new ScrollableTestHelper({ forceGeneratePockets: true });

        const reachBottom = helper.scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom');
        expect(reachBottom.exists()).toBe(true);
        const reachBottomIndicator = helper.scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom > .dx-scrollview-scrollbottom-indicator');
        expect(reachBottomIndicator.exists()).toBe(true);
        const reachBottomText = helper.scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom > .dx-scrollview-scrollbottom-text');
        expect(reachBottomText.exists()).toBe(true);
      });

      it('should render slot', () => {
        const helper = new ScrollableTestHelper({ children: <div className="content" /> });

        expect(helper.scrollable.find('.dx-scrollable-content .content').exists()).toBe(true);
      });

      it('should have ref to scrollable content', () => {
        const helper = new ScrollableTestHelper({});

        expect(helper.scrollable.find('.dx-scrollable-content').instance()).toBe(helper.viewModel.contentRef.current);
      });

      it('should have ref to scrollable container', () => {
        const helper = new ScrollableTestHelper({});

        expect(helper.scrollable.find('.dx-scrollable-container').instance()).toBe(helper.viewModel.containerRef.current);
      });

      if (Scrollable === ScrollableNative) {
        each([true, false]).describe('tabIndex on container. useKeyboard: %o', (useKeyboard) => {
          it('tabIndex on scrollable, useKeyboard', () => {
            const helper = new ScrollableTestHelper({ useKeyboard });

            const scrollableTabIndex = helper.scrollable.getDOMNode().attributes.getNamedItem('tabindex');

            expect(scrollableTabIndex).toEqual(null);
          });
        });
      }
    });

    describe('Behavior', () => {
      describe('Effects', () => {
        beforeEach(clearEventHandlers);

        it('should subscribe containerElement to resize event', () => {
          const subscribeToResizeHandler = jest.fn();
          (subscribeToResize as jest.Mock).mockImplementation(subscribeToResizeHandler);

          const viewModel = new Scrollable({ });
          viewModel.containerRef = { current: { clientHeight: 10 } as HTMLElement } as RefObject;
          viewModel.setContainerDimensions = jest.fn();

          viewModel.subscribeContainerToResize();

          expect(subscribeToResizeHandler).toBeCalledTimes(1);
          expect(subscribeToResizeHandler.mock.calls[0][0]).toEqual({ clientHeight: 10 });

          subscribeToResizeHandler.mock.calls[0][1](viewModel.containerRef);

          expect(viewModel.setContainerDimensions).toBeCalledTimes(1);
          expect(viewModel.setContainerDimensions).toBeCalledWith(viewModel.containerRef);
        });

        each(optionValues.direction).describe('Direction: %o', (direction) => {
          it('handleScroll(), should not raise any errors when onScroll is not defined', () => {
            const viewModel = new Scrollable({
              direction,
              onScroll: undefined,
            });

            viewModel.syncScrollbarsWithContent = jest.fn();

            expect(() => { (viewModel as any).handleScroll(); }).not.toThrow();
          });

          each([
            { eventName: 'dxscrollinit', effectName: 'init', passEvent: true },
            { eventName: 'dxscroll', effectName: 'move', passEvent: true },
            { eventName: 'dxscrollstop', effectName: 'stop' },
            { eventName: 'dxscrollend', effectName: 'end' },
          ]).describe('Event: %o', (eventInfo) => {
            it(`should subscribe to ${eventInfo.eventName} event`, () => {
              const event = { ...defaultEvent };
              const viewModel = new Scrollable({ direction });

              const { eventName, effectName, passEvent } = eventInfo;
              const eventHandlerName = `handle${titleize(effectName)}`;
              viewModel[eventHandlerName] = jest.fn();
              viewModel.wrapperRef = { current: {} as HTMLElement } as RefObject;
              viewModel.containerRef = { current: {} as HTMLElement } as RefObject;

              viewModel[`${effectName}Effect`]();
              emit(eventName, event);

              expect(viewModel[eventHandlerName]).toHaveBeenCalledTimes(1);

              if (passEvent) {
                expect(viewModel[eventHandlerName]).toHaveBeenCalledWith(event);
              }
            });
          });

          each([
            { eventName: 'scroll', effectName: 'scroll' },
            { eventName: 'dxscrollinit', effectName: 'init' },
            { eventName: 'dxscrollstop', effectName: 'stop' },
            { eventName: 'dxscrollend', effectName: 'end' },
            { eventName: 'dxscroll', effectName: 'move' },
          ]).describe('Event: %o', (eventInfo) => {
            it(`${eventInfo.effectName}Effect should return unsubscribe callback`, () => {
              const viewModel = new Scrollable({ direction });
              viewModel.wrapperRef = { current: {} as HTMLElement } as RefObject;
              viewModel.containerRef = { current: {} as HTMLElement } as RefObject;

              const { eventName, effectName } = eventInfo;
              viewModel[`handle${titleize(effectName)}`] = jest.fn();

              const detach = viewModel[`${effectName}Effect`]() as DisposeEffectReturn;

              expect(getEventHandlers(eventName).length).toBe(1);
              detach();
              expect(getEventHandlers(eventName).length).toBe(0);
            });
          });

          if (Scrollable === ScrollableSimulated) {
            each([
              { eventName: 'dxscrollstart', effectName: 'start', passEvent: true },
              { eventName: 'dxscrollcancel', effectName: 'cancel', passEvent: true },
            ]).describe('Event: %o', (eventInfo) => {
              it(`should subscribe to ${eventInfo.eventName} event`, () => {
                const event = { ...defaultEvent };
                const viewModel = new Scrollable({ direction });

                const { eventName, effectName, passEvent } = eventInfo;
                const eventHandlerName = `handle${titleize(effectName)}`;
                viewModel[eventHandlerName] = jest.fn();
                viewModel.wrapperRef = { current: {} as HTMLElement } as RefObject;

                viewModel[`${effectName}Effect`]();
                emit(eventName, event);

                expect(viewModel[eventHandlerName]).toHaveBeenCalledTimes(1);

                if (passEvent) {
                  expect(viewModel[eventHandlerName]).toHaveBeenCalledWith(event);
                }
              });
            });

            each([
              { eventName: 'dxscrollstart', effectName: 'start' },
              { eventName: 'dxscrollcancel', effectName: 'cancel' },
            ]).describe('Event: %o', (eventInfo) => {
              it(`${eventInfo.effectName}Effect should return unsubscribe callback`, () => {
                const viewModel = new Scrollable({ direction });
                viewModel.wrapperRef = { current: {} as HTMLElement } as RefObject;
                viewModel.containerRef = { current: {} as HTMLElement } as RefObject;

                const { eventName, effectName } = eventInfo;
                viewModel[`handle${titleize(effectName)}`] = jest.fn();

                const detach = viewModel[`${effectName}Effect`]() as DisposeEffectReturn;

                expect(getEventHandlers(eventName).length).toBe(1);
                detach();
                expect(getEventHandlers(eventName).length).toBe(0);
              });
            });
          }

          each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
            each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
              each([true, false]).describe('PullDownEnabled: %o', (pullDownEnabled) => {
                each([true, false]).describe('ReachBottomEnabled: %o', (reachBottomEnabled) => {
                  const getRequiredOffsetLeft = (value) => {
                    const maxLeftOffset = 100;

                    if (Scrollable === ScrollableNative && rtlEnabled) {
                      return value - maxLeftOffset;
                    }

                    return value;
                  };

                  const pulledDown = Scrollable === ScrollableSimulated
                      && pullDownEnabled && forceGeneratePockets;
                  each([
                    [{ top: -81, left: getRequiredOffsetLeft(-81) }, {
                      scrollOffset: { top: -81, left: -81 },
                      reachedTop: true,
                      reachedBottom: false,
                      reachedLeft: true,
                      reachedRight: false,
                    }],
                    [{ top: -1, left: getRequiredOffsetLeft(-1) }, {
                      scrollOffset: { top: -1, left: -1 },
                      reachedTop: true,
                      reachedBottom: false,
                      reachedLeft: true,
                      reachedRight: false,
                    }],
                    [{ top: 0, left: getRequiredOffsetLeft(0) }, {
                      scrollOffset: { top: 0, left: 0 },
                      reachedTop: true,
                      reachedBottom: false,
                      reachedLeft: true,
                      reachedRight: false,
                    }],
                    [{ top: 1, left: getRequiredOffsetLeft(1) }, {
                      scrollOffset: { top: 1, left: 1 },
                      reachedTop: false,
                      reachedBottom: false,
                      reachedLeft: false,
                      reachedRight: false,
                    }],
                    [{ top: 99, left: getRequiredOffsetLeft(99) }, {
                      scrollOffset: { top: 99, left: 99 },
                      reachedTop: false,
                      reachedBottom: false,
                      reachedLeft: false,
                      reachedRight: false,
                    }],
                    [{ top: 100, left: getRequiredOffsetLeft(100) }, {
                      scrollOffset: { top: 100, left: 100 },
                      reachedTop: false,
                      reachedBottom: !forceGeneratePockets || !reachBottomEnabled,
                      reachedLeft: false,
                      reachedRight: true,
                    }],
                    [{ top: 101, left: getRequiredOffsetLeft(101) }, {
                      scrollOffset: { top: 101, left: 101 },
                      reachedTop: false,
                      reachedBottom: !forceGeneratePockets || !reachBottomEnabled,
                      reachedLeft: false,
                      reachedRight: true,
                    }],
                    [{ top: 154, left: getRequiredOffsetLeft(154) }, {
                      scrollOffset: { top: 154, left: 154 },
                      reachedTop: false,
                      reachedBottom: !forceGeneratePockets || !reachBottomEnabled,
                      reachedLeft: false,
                      reachedRight: true,
                    }],
                    [{ top: 155, left: getRequiredOffsetLeft(155) }, {
                      scrollOffset: { top: 155, left: 155 },
                      reachedTop: false,
                      reachedBottom: true,
                      reachedLeft: false,
                      reachedRight: true,
                    }],
                    [{ top: 156, left: getRequiredOffsetLeft(156) }, {
                      scrollOffset: { top: 156, left: 156 },
                      reachedTop: false,
                      reachedBottom: true,
                      reachedLeft: false,
                      reachedRight: true,
                    }],
                  ]).describe('ScrollOffset: %o', (scrollOffset, expected) => {
                    it('emit "dxscroll" event, should be called with correct arguments', () => {
                      (getTranslateValues as jest.Mock).mockReturnValue({
                        top: pulledDown ? -80 : 0,
                        left: 0,
                      });

                      const onScrollHandler = jest.fn();

                      const event = { ...defaultEvent } as any;
                      const helper = new ScrollableTestHelper({
                        direction,
                        pullDownEnabled,
                        reachBottomEnabled,
                        forceGeneratePockets,
                        rtlEnabled,
                        onScroll: onScrollHandler,
                      });

                      helper.viewModel.eventForUserAction = event;
                      helper.viewModel.scrolling = true;
                      helper.initContainerPosition(scrollOffset);
                      (helper.viewModel as any).handlePocketState = jest.fn();

                      helper.viewModel.scrollEffect();
                      emit('scroll');

                      const expectedArgs = expected;
                      expectedArgs.event = { ...defaultEvent };

                      if (helper.options.direction === 'vertical') {
                        delete expectedArgs.reachedLeft;
                        delete expectedArgs.reachedRight;
                      } else if (helper.options.direction === 'horizontal') {
                        delete expectedArgs.reachedTop;
                        delete expectedArgs.reachedBottom;
                      }

                      expect(onScrollHandler).toBeCalledTimes(1);
                      expect(onScrollHandler).toBeCalledWith(expectedArgs);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    describe('Public methods', () => {
      test.each([true, false])('Content(), needScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
        const viewModel = new Scrollable({ needScrollViewContentWrapper });

        const contentEl = { clientHeight: 100 };
        const scrollViewContentEl = { clientHeight: 200 };

        viewModel.contentRef = { current: contentEl } as RefObject<HTMLDivElement>;
        viewModel.scrollViewContentRef = {
          current: scrollViewContentEl,
        } as RefObject<HTMLDivElement>;

        const expectedContentEl = needScrollViewContentWrapper ? scrollViewContentEl : contentEl;

        expect(viewModel.content()).toEqual(expectedContentEl);
      });

      it('Container()', () => {
        const viewModel = new Scrollable({});

        const containerElement = { clientHeight: 100 };

        viewModel.containerRef = { current: containerElement } as RefObject<HTMLDivElement>;

        expect(viewModel.container()).toEqual(containerElement);
      });

      describe('ScrollOffset', () => {
        it('scrollOffset()', () => {
          const helper = new ScrollableTestHelper({
            contentSize: 600,
            containerSize: 300,
          });

          const scrollLocation = { left: 130, top: 560 };
          helper.initContainerPosition(scrollLocation);

          expect(helper.viewModel.scrollOffset()).toEqual({
            left: scrollLocation.left,
            top: scrollLocation.top,
          });
        });

        it('scrollTop()', () => {
          const helper = new ScrollableTestHelper({});

          const scrollLocation = { left: 130, top: 560 };
          helper.initContainerPosition(scrollLocation);

          expect(helper.viewModel.scrollTop()).toEqual(560);
        });

        it('scrollLeft()', () => {
          const helper = new ScrollableTestHelper({});

          const scrollLocation = { left: 130, top: 560 };
          helper.initContainerPosition(scrollLocation);

          expect(helper.viewModel.scrollLeft()).toEqual(130);
        });
      });
    });

    describe('Methods', () => {
      it('initEventData()', () => {
        const containerRef = {
          current: {
            clientWidth: 10,
            clientHeight: 20,
          },
        } as RefObject;

        const viewModel = new Scrollable({});
        viewModel.containerRef = containerRef;

        const validateMock = () => true;
        const tryGetAllowedDirectionMock = () => 'horizontal' as ScrollableDirection;

        viewModel.tryGetAllowedDirection = tryGetAllowedDirectionMock;
        viewModel.validate = validateMock;

        const initEventData = viewModel.getInitEventData();

        expect(initEventData.getDirection({} as any)).toEqual('horizontal');
        expect(initEventData.validate({} as DxMouseEvent)).toEqual(true);
        expect(initEventData.isNative).toEqual(Scrollable === ScrollableNative);
        expect(initEventData.scrollTarget).toEqual(containerRef.current);
      });

      it('validate(event), locked: false, disabled: true', () => {
        const event = { ...defaultEvent } as any;
        const viewModel = new Scrollable({ disabled: true });

        viewModel.locked = false;
        viewModel.updateHandler = jest.fn();

        expect(viewModel.validate(event)).toEqual(false);
        expect(viewModel.updateHandler).toHaveBeenCalledTimes(0);
      });

      it('validate(event), locked: true, disabled: false', () => {
        const event = { ...defaultEvent } as any;
        const viewModel = new Scrollable({});

        viewModel.locked = true;
        viewModel.updateHandler = jest.fn();

        expect(viewModel.validate(event)).toEqual(false);
        expect(viewModel.updateHandler).toHaveBeenCalledTimes(0);
      });
    });

    describe('Getters', () => {
      each(['visible', 'scroll', 'hidden', 'auto']).describe('overflow: %o,', (overflow) => {
        it('contentWidth()', () => {
          (getElementOverflowX as jest.Mock).mockReturnValue(overflow);
          const viewModel = new Scrollable({});

          viewModel.contentRef = { current: {} } as RefObject<HTMLDivElement>;
          viewModel.contentClientWidth = 200;
          viewModel.contentScrollWidth = 700;

          expect(viewModel.contentWidth).toEqual(overflow === 'hidden' ? 200 : 700);
        });

        it('contentHeight()', () => {
          (getElementOverflowY as jest.Mock).mockReturnValue(overflow);
          const viewModel = new Scrollable({});

          viewModel.contentRef = { current: {} } as RefObject<HTMLDivElement>;
          viewModel.contentClientHeight = 200;
          viewModel.contentScrollHeight = 700;

          expect(viewModel.contentHeight).toEqual(overflow === 'hidden' ? 200 : 700);
        });
      });

      each([
        { expected: -100 },
        { contentSize: 190, containerSize: 200, expected: -0 },
        { contentSize: 200, containerSize: 200, expected: -0 },
        { contentSize: 200.49, containerSize: 200, expected: -0.4900000000000091 },
        { contentSize: 200.50, containerSize: 200, expected: -0.5 },
        { contentSize: 200.52, containerSize: 200, expected: -0.5200000000000102 },
        { contentSize: 400, containerSize: 125, expected: -275 },
      ]).describe('Dimensions: %o', ({ contentSize, containerSize, expected }) => {
        it('vScrollOffsetMax()', () => {
          const helper = new ScrollableTestHelper({
            direction: DIRECTION_VERTICAL,
            contentSize,
            containerSize,
          });

          expect(helper.viewModel.vScrollOffsetMax).toEqual(expected);
        });

        it('hScrollOffsetMax()', () => {
          const helper = new ScrollableTestHelper({
            direction: DIRECTION_HORIZONTAL,
            contentSize,
            containerSize,
          });

          expect(helper.viewModel.hScrollOffsetMax).toEqual(expected);
        });
      });

      describe('cssClasses', () => {
        each(optionValues.direction).describe('Direction: %o', (direction) => {
          each(['onScroll', 'onHover', 'always', 'never']).describe('showScrollbar: %o', (showScrollbar) => {
            it('strategy classes', () => {
              const helper = new ScrollableTestHelper({ direction, showScrollbar });

              const rootClasses = helper.getScrollable().getDOMNode().className;

              expect(rootClasses).toEqual(expect.not.stringMatching('dx-widget'));
              expect(rootClasses).toEqual(expect.stringMatching('dx-scrollable'));
              expect(rootClasses).toEqual(expect.stringMatching(`dx-scrollable-${direction}`));

              if (Scrollable === ScrollableNative) {
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

        each([true, false]).describe('Disabled: %o', (isDisabled) => {
          it('Scrollable should have dx-scrollable-disabled if disabled', () => {
            const instance = new Scrollable({ disabled: isDisabled });

            expect(instance.cssClasses).toEqual(isDisabled
              ? expect.stringMatching(SCROLLABLE_DISABLED_CLASS)
              : expect.not.stringMatching(SCROLLABLE_DISABLED_CLASS));
          });
        });
      });
    });
  });
});
