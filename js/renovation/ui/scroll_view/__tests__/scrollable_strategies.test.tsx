import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { DisposeEffectReturn } from '../../../utils/effect_return';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  createContainerRef,
} from './utils';

import {
  ensureLocation,
} from '../scrollable_utils';

import {
  SCROLLABLE_DISABLED_CLASS,
} from '../common/consts';

import { Widget } from '../../common/widget';

const testBehavior = { positive: false };
jest.mock('../../../../ui/themes', () => ({
  isMaterial: jest.fn(() => false),
  isGeneric: jest.fn(() => true),
  current: jest.fn(() => 'generic'),
}));
jest.mock('../../../../core/utils/scroll_rtl_behavior', () => () => testBehavior);
jest.mock('../../../../core/devices', () => ({
  ...jest.requireActual('../../../../core/devices'),
  real: jest.fn(() => ({ platform: 'generic' })),
}));

// eslint-disable-next-line import/first
import {
  ScrollableNative,
  viewFunction as viewFunctionNative,
} from '../scrollable_native';

// eslint-disable-next-line import/first
import {
  ScrollableSimulated,
  viewFunction as viewFunctionSimulated,
} from '../scrollable_simulated';

each([{
  viewFunction: viewFunctionNative,
  Scrollable: ScrollableNative,
}, {
  viewFunction: viewFunctionSimulated,
  Scrollable: ScrollableSimulated,
}]).describe('Scrollable', ({ viewFunction, Scrollable }) => {
  describe(`${Scrollable === ScrollableNative ? 'Native' : 'Simulated'}`, () => {
    describe('Render', () => {
      it('should render scrollable content', () => {
        const viewModel = new Scrollable({ });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

        const scrollable = mount(viewFunction(viewModel) as JSX.Element);

        const scrollableContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content');
        expect(scrollableContent.exists()).toBe(true);
      });

      each([true, false]).describe('NeedScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
        it('should render scrollView content only if needScrollViewContentWrapper option is enabled', () => {
          const viewModel = new Scrollable({ needScrollViewContentWrapper });
          viewModel.contentRef = React.createRef();
          viewModel.containerRef = React.createRef();
          viewModel.horizontalScrollbarRef = React.createRef();
          viewModel.verticalScrollbarRef = React.createRef();

          const scrollable = mount(viewFunction(viewModel) as JSX.Element);

          const scrollViewContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(needScrollViewContentWrapper);
        });
      });

      it('should not render top & bottom pockets', () => {
        const viewModel = new Scrollable({ });
        viewModel.contentRef = React.createRef();
        viewModel.containerRef = React.createRef();
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

        const scrollable = shallow(viewFunction(viewModel) as JSX.Element);
        expect(scrollable.find('.dx-scrollable-content .content').exists()).toBe(true);
      });

      it('should pass all necessary properties to the Widget', () => {
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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
        viewModel.horizontalScrollbarRef = React.createRef();
        viewModel.verticalScrollbarRef = React.createRef();

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
            viewModel.horizontalScrollbarRef = React.createRef();
            viewModel.verticalScrollbarRef = React.createRef();

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

        each(['vertical', 'horizontal', 'both']).describe('ScrollEffect params. Direction: %o', (direction) => {
          const checkScrollParams = (
            actualParams,
            expectedParams,
          ) => {
            const checkedParams = expectedParams;

            if (direction === 'vertical') {
              delete checkedParams.reachedLeft;
              delete checkedParams.reachedRight;
            } else if (direction === 'horizontal') {
              delete checkedParams.reachedTop;
              delete checkedParams.reachedBottom;
            }

            expect(actualParams).toMatchObject(checkedParams);
          };

          it('scrollEffect should return unsubscribe callback', () => {
            const scrollable = new Scrollable({ direction });
            scrollable.containerRef = React.createRef();
            scrollable.containerRef.current = {};

            const detach = scrollable.scrollEffect() as DisposeEffectReturn;

            expect(getEventHandlers('scroll').length).toBe(1);
            detach();
            expect(getEventHandlers('scroll').length).toBe(0);
          });

          it('should subscribe to scrollinit event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleInit = jest.fn();
            scrollable.handleInit = handleInit;
            scrollable.wrapperRef = React.createRef();
            scrollable.containerRef = React.createRef();

            scrollable.initEffect();
            emit('dxscrollinit', e);

            expect(handleInit).toHaveBeenCalledTimes(1);
            expect(handleInit).toHaveBeenCalledWith(e);
          });

          it('should subscribe to dxscroll event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleMove = jest.fn();
            scrollable.handleMove = handleMove;
            scrollable.wrapperRef = React.createRef();

            scrollable.moveEffect();
            emit('dxscroll', e);

            expect(handleMove).toHaveBeenCalledTimes(1);
            expect(handleMove).toHaveBeenCalledWith(e);
          });

          each(['init']).describe('EventName: %o', (shortEventName) => {
            it('Effect should return unsubscribe callback', () => {
              const scrollable = new Scrollable({ direction });
              scrollable.wrapperRef = React.createRef();
              scrollable.containerRef = React.createRef();

              const detach = scrollable[`${shortEventName}Effect`]() as DisposeEffectReturn;

              const eventName = `dxscroll${shortEventName}`;
              expect(getEventHandlers(eventName).length).toBe(1);
              detach();
              expect(getEventHandlers(eventName).length).toBe(0);
            });
          });

          if (Scrollable === ScrollableSimulated) {
            it('should subscribe to scrollstart event', () => {
              const e = { ...defaultEvent };
              const scrollable = new Scrollable({ direction });
              const handleStart = jest.fn();
              scrollable.handleStart = handleStart;
              scrollable.wrapperRef = React.createRef();

              scrollable.startEffect();
              emit('dxscrollstart', e);

              expect(handleStart).toHaveBeenCalledTimes(1);
              expect(handleStart).toHaveBeenCalledWith(e);
            });

            it('should subscribe to scrollend event', () => {
              const e = { ...defaultEvent };
              const scrollable = new Scrollable({ direction });
              const handleEnd = jest.fn();
              scrollable.handleEnd = handleEnd;
              scrollable.wrapperRef = React.createRef();

              scrollable.endEffect();
              emit('dxscrollend', e);

              expect(handleEnd).toHaveBeenCalledTimes(1);
              expect(handleEnd).toHaveBeenCalledWith(e);
            });

            each(['start', 'end', 'stop', 'cancel']).describe('EventName: %o', (shortEventName) => {
              it(`${shortEventName}Effect should return unsubscribe callback`, () => {
                const scrollable = new Scrollable({ direction });
                scrollable.wrapperRef = React.createRef();
                scrollable.containerRef = React.createRef();

                const detach = scrollable[`${shortEventName}Effect`]() as DisposeEffectReturn;

                const eventName = `dxscroll${shortEventName}`;
                expect(getEventHandlers(eventName).length).toBe(1);
                detach();
                expect(getEventHandlers(eventName).length).toBe(0);
              });
            });
          }

          it('moveEffect should return unsubscribe callback', () => {
            const scrollable = new Scrollable({ direction });
            scrollable.wrapperRef = React.createRef();

            const detach = scrollable.moveEffect() as DisposeEffectReturn;

            expect(getEventHandlers('dxscroll').length).toBe(1);
            detach();
            expect(getEventHandlers('dxscroll').length).toBe(0);
          });

          if (Scrollable === ScrollableNative) {
            it('scrollEffect', () => {
              const scrollOffset = { top: 150, left: 150 };
              const containerRef = createContainerRef(scrollOffset);
              const onScroll = jest.fn();
              const scrollable = new Scrollable({ onScroll, direction });
              scrollable.containerRef = containerRef;

              scrollable.scrollEffect();
              emit('scroll');

              expect(onScroll).toHaveBeenCalledTimes(1);
              checkScrollParams(onScroll.mock.calls[0][0], {
                scrollOffset,
                reachedTop: false,
                reachedBottom: false,
                reachedLeft: false,
                reachedRight: false,
              });
            });

            // it doesn't work when position of container was not changed
            // it('ScrollPosition: { top: 0, left: 0 }', () => {
            //   const scrollOffset = { top: 0, left: 0 };
            //   const containerRef = createContainerRef(scrollOffset);

            //   const onScroll = jest.fn();
            //   const scrollable = new Scrollable({ onScroll, direction });
            //   scrollable.containerRef = containerRef as RefObject<HTMLDivElement>;

            //   scrollable.scrollEffect();
            //   emit('scroll');

            //   expect(onScroll).toHaveBeenCalledTimes(1);
            //   checkScrollParams(onScroll.mock.calls[0][0], {
            //     scrollOffset,
            //     reachedTop: true,
            //     reachedBottom: false,
            //     reachedLeft: true,
            //     reachedRight: false,
            //   });
            // });

            it('ScrollPosition: { top: maxOffset, left: maxOffset }', () => {
              const scrollOffset = { top: 300, left: 300 };
              const containerRef = createContainerRef(scrollOffset, 'both');

              const onScroll = jest.fn();
              const scrollable = new Scrollable({ onScroll, direction });
              scrollable.containerRef = containerRef as RefObject<HTMLDivElement>;
              scrollable.scrollEffect();
              emit('scroll');

              expect(onScroll).toHaveBeenCalledTimes(1);
              checkScrollParams(onScroll.mock.calls[0][0], {
                scrollOffset,
                reachedTop: false,
                reachedBottom: true,
                reachedLeft: false,
                reachedRight: true,
              });
            });

            it('ScrollPosition: { top: maxOffset - 1, left: maxOffset - 1 }', () => {
              const scrollOffset = { top: 199, left: 199 };
              const containerRef = createContainerRef(scrollOffset);

              const onScroll = jest.fn();
              const scrollable = new Scrollable({ onScroll, direction });
              scrollable.containerRef = containerRef as RefObject<HTMLDivElement>;
              scrollable.scrollEffect();
              emit('scroll');

              expect(onScroll).toHaveBeenCalledTimes(1);
              checkScrollParams(onScroll.mock.calls[0][0], {
                scrollOffset,
                reachedTop: false,
                reachedBottom: false,
                reachedLeft: false,
                reachedRight: false,
              });
            });

            it('ScrollPosition: { top: 1, left: 1 }', () => {
              const scrollOffset = { top: 1, left: 1 };
              const containerRef = createContainerRef(scrollOffset, 'both');

              const onScroll = jest.fn();
              const scrollable = new Scrollable({ onScroll, direction });
              scrollable.containerRef = containerRef as RefObject<HTMLDivElement>;
              scrollable.scrollEffect();
              emit('scroll');

              expect(onScroll).toHaveBeenCalledTimes(1);
              checkScrollParams(onScroll.mock.calls[0][0], {
                scrollOffset,
                reachedTop: false,
                reachedBottom: false,
                reachedLeft: false,
                reachedRight: false,
              });
            });
          }
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

    describe('Logic', () => {
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

      describe('Ensure location', () => {
        it('should convert number type to Location type', () => {
          expect(ensureLocation(350)).toMatchObject({ top: 350, left: 350 });
        });

        it('should return Location type if input type is Location', () => {
          const location = { top: 345, left: 10 };
          expect(ensureLocation(location)).toMatchObject(location);
        });

        it('should fill undefined value with value by default', () => {
          expect(ensureLocation({ top: 100 })).toMatchObject({ top: 100, left: 0 });
          expect(ensureLocation({ left: 100 })).toMatchObject({ left: 100, top: 0 });
          expect(ensureLocation({})).toMatchObject({ top: 0, left: 0 });
        });
      });
    });
  });
});
