/* eslint-disable jest/expect-expect */
import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from '@devextreme-generator/declarations';
import { DisposeEffectReturn } from '../../../utils/effect_return';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  optionValues,
} from './utils';

import {
  SCROLLABLE_DISABLED_CLASS,
} from '../common/consts';

import { titleize } from '../../../../core/utils/inflector';

import { Widget } from '../../common/widget';

import {
  ScrollableNative,
  viewFunction as viewFunctionNative,
} from '../scrollable_native';

import {
  ScrollableSimulated,
  viewFunction as viewFunctionSimulated,
} from '../scrollable_simulated';

import getScrollRtlBehavior from '../../../../core/utils/scroll_rtl_behavior';

import { ScrollableTestHelper as ScrollableSimulatedTestHelper } from './scrollable_simulated_test_helper';
import { ScrollableTestHelper as ScrollableNativeTestHelper } from './scrollable_native_test_helper';

jest.mock('../../../../core/utils/scroll_rtl_behavior');
jest.mock('../../../../ui/themes', () => ({
  isMaterial: jest.fn(() => false),
  isGeneric: jest.fn(() => true),
  current: jest.fn(() => 'generic'),
}));

each([{
  viewFunction: viewFunctionNative,
  Scrollable: ScrollableNative,
  ScrollableTestHelper: ScrollableNativeTestHelper,
}, {
  viewFunction: viewFunctionSimulated,
  Scrollable: ScrollableSimulated,
  ScrollableTestHelper: ScrollableSimulatedTestHelper,
}]).describe('Scrollable ', ({ viewFunction, Scrollable, ScrollableTestHelper }) => {
  describe(`${Scrollable === ScrollableNative ? 'Native' : 'Simulated'}`, () => {
    describe('Render', () => {
      it('should render scrollable content', () => {
        const viewModel = new Scrollable({ });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);

        const scrollableContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content');
        expect(scrollableContent.exists()).toBe(true);
      });

      each([true, false]).describe('NeedScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
        it('should render scrollView content only if needScrollViewContentWrapper option is enabled', () => {
          const viewModel = new Scrollable({ needScrollViewContentWrapper });
          viewModel.contentRef = React.createRef();
          viewModel.containerRef = React.createRef();
          viewModel.hScrollbarRef = React.createRef();
          viewModel.vScrollbarRef = React.createRef();

          const scrollable = mount(viewFunction(viewModel) as JSX.Element);

          const scrollViewContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(needScrollViewContentWrapper);
        });
      });

      it('should not render top & bottom pockets', () => {
        const viewModel = new Scrollable({ });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);
        const topPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
        expect(topPocket.exists()).toBe(false);
        const bottomPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
        expect(bottomPocket.exists()).toBe(false);
      });

      it('should render top & bottom pockets', () => {
        const viewModel = new Scrollable({ forceGeneratePockets: true });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);
        const topPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
        expect(topPocket.exists()).toBe(true);
        const bottomPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
        expect(bottomPocket.exists()).toBe(true);
      });

      it('should render top pockets with classes', () => {
        const viewModel = new Scrollable({ forceGeneratePockets: true });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);

        const pullDown = scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down');
        expect(pullDown.exists()).toBe(true);
        const pullDownImage = scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down > .dx-scrollview-pull-down-image');
        expect(pullDownImage.exists()).toBe(true);
        const pullDownIndicator = scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down > .dx-scrollview-pull-down-indicator');
        expect(pullDownIndicator.exists()).toBe(true);
        const pullDownText = scrollable.find('.dx-scrollview-top-pocket > .dx-scrollview-pull-down > .dx-scrollview-pull-down-image');
        expect(pullDownText.exists()).toBe(true);
      });

      it('should render bottom pockets with classes', () => {
        const viewModel = new Scrollable({ forceGeneratePockets: true });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);
        const reachBottom = scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom');
        expect(reachBottom.exists()).toBe(true);
        const reachBottomIndicator = scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom > .dx-scrollview-scrollbottom-indicator');
        expect(reachBottomIndicator.exists()).toBe(true);
        const reachBottomText = scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom > .dx-scrollview-scrollbottom-text');
        expect(reachBottomText.exists()).toBe(true);
      });

      it('should render slot', () => {
        const viewModel = new Scrollable({ children: <div className="content" /> });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = shallow(viewFunction(viewModel) as JSX.Element);
        expect(scrollable.find('.dx-scrollable-content .content').exists()).toBe(true);
      });

      it('should pass all necessary properties to the Widget', () => { // TODO: all props
        const cssClasses = 'dx-scrollview';

        const config = {
          width: '120px',
          height: '300px',
          rtlEnabled: true,
          disabled: true,
        };

        const viewModel = new Scrollable(config);
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        Object.defineProperties(viewModel, {
          cssClasses: {
            get() { return (cssClasses); },
          },
        });

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);

        expect(scrollable.find(Widget).at(0).props()).toMatchObject({
          classes: cssClasses,
          ...config,
        });
      });

      it('should have ref to scrollable content', () => {
        const contentRef = React.createRef();
        const viewModel = new Scrollable({});
        viewModel.contentRef = contentRef;
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        Object.defineProperties(viewModel, {
          contentWidth: { get() { return 0; } },
          contentHeight: { get() { return 0; } },
        });

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);

        expect(scrollable.find('.dx-scrollable-content').instance()).toBe(contentRef.current);
      });

      it('should have ref to scrollable container', () => {
        const containerRef = React.createRef();
        const viewModel = new Scrollable({});
        viewModel.containerRef = containerRef;
        viewModel.hScrollbarRef = React.createRef();
        viewModel.vScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);
        expect(scrollable.find('.dx-scrollable-container').instance()).toBe(containerRef.current);
      });

      if (Scrollable === ScrollableNative) {
        each([true, false]).describe('tabIndex on container. useKeyboard: %o', (useKeyboard) => {
          it('tabIndex on scrollable, useKeyboard', () => {
            const viewModel = new Scrollable({ useKeyboard });
            viewModel.contentRef = React.createRef();
            viewModel.containerRef = React.createRef();
            viewModel.scrollableRef = React.createRef();

            const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
            const scrollableTabIndex = scrollable.getDOMNode().attributes.getNamedItem('tabindex');

            expect(scrollableTabIndex).toEqual(null);
          });
        });
      }
    });

    describe('Scrollbar', () => {
      describe('cssClasses', () => {
        each(['horizontal', 'vertical', 'both', undefined, null]).describe('Direction: %o', (direction) => {
          it('should add direction class', () => {
            const viewModel = new Scrollable({ direction, useSimulatedScrollbar: true, showScrollbar: 'always' });
            viewModel.contentRef = React.createRef();
            viewModel.containerRef = React.createRef();
            viewModel.hScrollbarRef = React.createRef();
            viewModel.vScrollbarRef = React.createRef();

            const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);

            const horizontalScrollbar = scrollable.find('.dx-scrollable-scrollbar.dx-scrollbar-horizontal');
            const verticalScrollbar = scrollable.find('.dx-scrollable-scrollbar.dx-scrollbar-vertical');

            const isHorizontalScrollbarExists = direction === 'horizontal' || direction === 'both';
            const isVerticalScrollbarExists = direction === 'vertical' || direction === 'both' || !direction;

            expect(horizontalScrollbar.exists()).toBe(isHorizontalScrollbarExists);
            expect(verticalScrollbar.exists()).toBe(isVerticalScrollbarExists);
          });
        });
      });
    });

    describe('Behavior', () => {
      describe('Effects', () => {
        beforeEach(clearEventHandlers);

        each([optionValues.direction]).describe('ScrollEffect params. Direction: %o', (direction) => {
          each([
            { eventName: 'dxscrollinit', effectName: 'init', passEvent: true },
            { eventName: 'dxscroll', effectName: 'move', passEvent: true },
            { eventName: 'dxscrollstop', effectName: 'stop' },
            { eventName: 'dxscrollend', effectName: 'end' },
          ]).describe('Event: %o', (eventInfo) => {
            it(`should subscribe to ${eventInfo.eventName} event`, () => {
              const e = { ...defaultEvent };
              const viewModel = new Scrollable({ direction });

              const { eventName, effectName, passEvent } = eventInfo;
              const eventHandlerName = `handle${titleize(effectName)}`;
              viewModel[eventHandlerName] = jest.fn();
              viewModel.wrapperRef = React.createRef();
              viewModel.containerRef = React.createRef();

              viewModel[`${effectName}Effect`]();
              emit(eventName, e);

              expect(viewModel[eventHandlerName]).toHaveBeenCalledTimes(1);

              if (passEvent) {
                expect(viewModel[eventHandlerName]).toHaveBeenCalledWith(e);
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
              viewModel.wrapperRef = { current: {} };
              viewModel.containerRef = { current: {} };

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
                const e = { ...defaultEvent };
                const viewModel = new Scrollable({ direction });

                const { eventName, effectName, passEvent } = eventInfo;
                const eventHandlerName = `handle${titleize(effectName)}`;
                viewModel[eventHandlerName] = jest.fn();
                viewModel.wrapperRef = React.createRef();
                viewModel.containerRef = React.createRef();

                viewModel[`${effectName}Effect`]();
                emit(eventName, e);

                expect(viewModel[eventHandlerName]).toHaveBeenCalledTimes(1);

                if (passEvent) {
                  expect(viewModel[eventHandlerName]).toHaveBeenCalledWith(e);
                }
              });
            });

            each([
              { eventName: 'dxscrollstart', effectName: 'start' },
              { eventName: 'dxscrollcancel', effectName: 'cancel' },
            ]).describe('Event: %o', (eventInfo) => {
              it(`${eventInfo.effectName}Effect should return unsubscribe callback`, () => {
                const viewModel = new Scrollable({ direction });
                viewModel.wrapperRef = { current: {} };
                viewModel.containerRef = { current: {} };

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
                  each([{ decreasing: true, positive: false }, { decreasing: true, positive: true }, { decreasing: false, positive: true }]).describe('rtlBehavior: %o', (rtlBehavior) => {
                    const isNativeINChrome86 = Scrollable === ScrollableNative && rtlEnabled
                      && rtlBehavior.decreasing && !rtlBehavior.positive;
                    const isNativeINIE11 = Scrollable === ScrollableNative && rtlEnabled
                      && !rtlBehavior.decreasing && rtlBehavior.positive;

                    const getRequiredOffsetLeft = (value) => {
                      const maxLeftOffset = 100;

                      if (isNativeINChrome86) {
                        return value - maxLeftOffset;
                      }

                      if (isNativeINIE11) {
                        return -value + maxLeftOffset;
                      }

                      return value;
                    };

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
                        // chrome 86 - true {decreasing: true, positive: false} - [-max, 0]
                        // chrome 84 - false {decreasing: true, positive: true} - [0 -> max]
                        // ie11 - true [max -> 0] - {decreasing: false, positive: true}
                        (getScrollRtlBehavior as jest.Mock)
                          .mockReturnValue(rtlBehavior);

                        const e = { ...defaultEvent };
                        const helper = new ScrollableTestHelper({
                          direction,
                          pullDownEnabled,
                          reachBottomEnabled,
                          forceGeneratePockets,
                          rtlEnabled,
                        });

                        helper.viewModel.eventForUserAction = e;
                        helper.initContainerPosition(scrollOffset);
                        helper.viewModel.handlePocketState = jest.fn();

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

                        helper.checkActionHandlerCalls(expect, ['onScroll'], [[expectedArgs]]);
                      });
                    });
                  });
                });
              });
            });
          });
        });

        it('should not raise any error if onScroll is not defined', () => {
          const scrollable = new Scrollable({ onScroll: undefined });
          scrollable.containerRef = React.createRef();
          scrollable.containerRef.current = {} as HTMLDivElement;

          scrollable.scrollEffect();
          emit('scroll');

          expect(scrollable.scrollEffect.bind(scrollable)).not.toThrow();
        });
      });
    });

    describe('Public methods', () => {
      test.each([true, false])('Content(), needScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
        const viewModel = new Scrollable({ needScrollViewContentWrapper });

        const contentEl = { clientHeight: 100 };
        const scrollViewContentEl = { clientHeight: 100 };

        viewModel.contentRef = { current: contentEl } as RefObject<HTMLDivElement>;
        viewModel.scrollViewContentRef = {
          current: scrollViewContentEl,
        } as RefObject<HTMLDivElement>;

        const expectedContentEl = needScrollViewContentWrapper ? scrollViewContentEl : contentEl;

        expect(viewModel.content()).toEqual(expectedContentEl);
      });

      describe('ScrollOffset', () => {
        it('scrollOffset()', () => {
          const helper = new ScrollableTestHelper({});

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

        it('scrollLeft(), scrollTop()', () => {
          const helper = new ScrollableTestHelper({});

          helper.viewModel.scrollOffset = jest.fn(() => ({ left: 25, top: 30 }));

          expect(helper.viewModel.scrollLeft()).toEqual(25);
          expect(helper.viewModel.scrollTop()).toEqual(30);
        });
      });
    });

    describe('Methods', () => {
      it('validate(e), locked: false, disabled: true', () => {
        const e = { ...defaultEvent } as any;
        const viewModel = new Scrollable({ disabled: true });

        viewModel.locked = false;
        viewModel.update = jest.fn();

        expect((viewModel as any).validate(e)).toEqual(false);
        expect(viewModel.update).toHaveBeenCalledTimes(1);
      });

      it('validate(e), locked: true, disabled: false', () => {
        const e = { ...defaultEvent } as any;
        const viewModel = new Scrollable({});

        viewModel.locked = true;
        viewModel.update = jest.fn();

        expect((viewModel as any).validate(e)).toEqual(false);
        expect(viewModel.update).toHaveBeenCalledTimes(0);
      });
    });

    describe('Getters', () => {
      describe('cssClasses', () => {
        it('should add vertical direction class', () => {
          const { cssClasses } = new Scrollable({ direction: 'vertical' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-vertical'));
          expect(cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-horizontal'));
          expect(cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-both'));
        });

        it('should add horizontal direction class', () => {
          const { cssClasses } = new Scrollable({ direction: 'horizontal' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-horizontal'));
          expect(cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-vertical'));
          expect(cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-both'));
        });

        it('should add both direction class', () => {
          const { cssClasses } = new Scrollable({ direction: 'both' });
          expect(cssClasses).toEqual(expect.stringMatching('dx-scrollable-both'));
          expect(cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-vertical'));
          expect(cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-horizontal'));
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
