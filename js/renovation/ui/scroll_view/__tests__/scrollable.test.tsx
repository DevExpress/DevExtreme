import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  ScrollableNative,
  viewFunction as viewFunctionNative,
} from '../scrollable_native';

import {
  createContainerRef,
  initRefs,
  initStyles,
} from './utils';

import {
  ensureLocation,
  SCROLLABLE_DISABLED_CLASS,
} from '../scrollable_utils';

import {
  ScrollableSimulated,
  viewFunction as viewFunctionSimulated,
} from '../scrollable_simulated';

import { Widget } from '../../common/widget';

import { Scrollbar } from '../scrollbar';

const testBehavior = { positive: false };
jest.mock('../../../../core/utils/scroll_rtl_behavior', () => () => testBehavior);
jest.mock('../../../../core/devices', () => {
  const actualDevices = jest.requireActual('../../../../core/devices').default;
  actualDevices.real = jest.fn(() => ({ platform: 'generic' }));
  return actualDevices;
});

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
        const scrollable = shallow(viewFunction({ props: { } } as any) as JSX.Element);
        const scrollableContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content');
        expect(scrollableContent.exists()).toBe(true);
      });

      each([true, false]).describe('NeedScrollViewContentWrapper: %o', (needScrollViewContentWrapper) => {
        it('should render scrollView content only if needScrollViewContentWrapper option is enabled', () => {
          const scrollable = mount(
            viewFunction({ props: { needScrollViewContentWrapper } } as any) as JSX.Element,
          );
          const scrollViewContent = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content > .dx-scrollview-content');
          expect(scrollViewContent.exists()).toBe(needScrollViewContentWrapper);
        });
      });

      it('should not render top & bottom pockets', () => {
        const scrollable = shallow(viewFunction({ props: { } } as any) as JSX.Element);
        const topPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
        expect(topPocket.exists()).toBe(false);
        const bottomPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
        expect(bottomPocket.exists()).toBe(false);
      });

      it('should render top & bottom pockets', () => {
        const scrollable = mount(viewFunction({
          props:
            { forceGeneratePockets: true },
        } as any) as JSX.Element);
        const topPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-top-pocket');
        expect(topPocket.exists()).toBe(true);
        const bottomPocket = scrollable.find('.dx-scrollable-wrapper > .dx-scrollable-container > .dx-scrollable-content .dx-scrollview-bottom-pocket');
        expect(bottomPocket.exists()).toBe(true);
      });

      it('should render top pockets with classes', () => {
        const scrollable = mount(viewFunction({
          props:
            { forceGeneratePockets: true },
        } as any) as JSX.Element);
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
        const scrollable = mount(viewFunction({
          props:
            { forceGeneratePockets: true },
        } as any) as JSX.Element);
        const reachBottom = scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom');
        expect(reachBottom.exists()).toBe(true);
        const reachBottomIndicator = scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom > .dx-scrollview-scrollbottom-indicator');
        expect(reachBottomIndicator.exists()).toBe(true);
        const reachBottomText = scrollable.find('.dx-scrollview-bottom-pocket > .dx-scrollview-scrollbottom > .dx-scrollview-scrollbottom-text');
        expect(reachBottomText.exists()).toBe(true);
      });

      it('should render slot', () => {
        const props = {
          props: { children: <div className="content" /> },
        } as Partial<any>;
        const scrollable = shallow(viewFunction(props as any) as JSX.Element);
        expect(scrollable.find('.dx-scrollable-content .content').exists()).toBe(true);
      });

      it('should pass all necessary properties to the Widget', () => {
        const cssClasses = 'dx-scrollview';
        const props = {
          props: {
            width: '120px',
            height: '300px',
            rtlEnabled: true,
            disabled: true,
          },
          cssClasses,
        } as Partial<any>;
        const scrollable = mount(viewFunction(props as any) as JSX.Element);

        expect(scrollable.find(Widget).at(0).props()).toMatchObject({
          classes: cssClasses,
          ...props.props,
        });
      });

      if (Scrollable === ScrollableSimulated) {
        each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
          each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (showScrollbar) => {
            each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
              each([true, false]).describe('InertiaEnabled: %o', (inertiaEnabled) => {
                it('should pass all necessary properties to the nested Scrollbars', () => {
                  const propertySettings = {
                    showScrollbar,
                    bounceEnabled,
                    inertiaEnabled,
                    scrollByThumb: true,
                  };

                  const viewModel = new Scrollable({ direction, ...propertySettings });
                  const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);

                  const scrollbars = scrollable.find(Scrollbar);
                  if (direction === 'both') {
                    expect(scrollbars.at(0).instance().props).toMatchObject({
                      direction: 'horizontal',
                      ...propertySettings,
                    });
                    expect(scrollbars.at(1).instance().props).toMatchObject({
                      direction: 'vertical',
                      ...propertySettings,
                    });
                  } else {
                    expect(scrollbars.at(0).instance().props).toMatchObject({
                      direction,
                      ...propertySettings,
                    });
                  }
                });
              });
            });
          });
        });
      }

      it('should have ref to scrollable content', () => {
        const contentRef = React.createRef();
        const props = {
          props: {},
          contentRef,
        } as any as Partial<any>;
        const scrollable = mount(viewFunction(props as any) as JSX.Element);
        expect(scrollable.find('.dx-scrollable-content').instance()).toBe(contentRef.current);
      });

      it('should have ref to scrollable container', () => {
        const containerRef = React.createRef();
        const props = {
          props: {},
          containerRef,
        } as any as Partial<any>;
        const scrollable = mount(viewFunction(props as any) as JSX.Element);
        expect(scrollable.find('.dx-scrollable-container').instance()).toBe(containerRef.current);
      });

      each([true, false]).describe('tabIndex on container. useKeyboard: %o', (useKeyboard) => {
        it('tabIndex on scrollable, useKeyboard', () => {
          const viewModel = new Scrollable({ useKeyboard });

          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
          const scrollableTabIndex = scrollable.getDOMNode().attributes.getNamedItem('tabindex');

          if (Scrollable === ScrollableSimulated && useKeyboard) {
            expect((scrollableTabIndex as any).value).toEqual('0');
          } else {
            expect(scrollableTabIndex).toEqual(null);
          }
        });
      });
    });

    describe('Scrollbar', () => {
      each(['horizontal', 'vertical', 'both', undefined, null]).describe('Direction: %o', (direction) => {
        each([true, false, undefined, null]).describe('UseSimulatedScrollbar: %o', (useSimulatedScrollbar) => {
          each(['never', 'always', 'onScroll', 'onHover', true, false, undefined, null]).describe('ShowScrollbar: %o', (showScrollbar) => {
            it('Scrollbar should render if useSimulatedScrollbar is set to true and nativeStrategy is used', () => {
              const scrollable = mount(
                viewFunction({
                  props: { showScrollbar, useSimulatedScrollbar, direction },
                } as any) as JSX.Element,
              );

              const scrollBar = scrollable.find(Scrollbar);
              const isScrollbarsForSimulatedStrategy = Scrollable === ScrollableSimulated;
              const isScrollbarsForNativeStrategy = (showScrollbar ?? false)
                  && (useSimulatedScrollbar ?? false);

              const needRenderScrollbars = isScrollbarsForSimulatedStrategy
                  || isScrollbarsForNativeStrategy;

              let expectedScrollbarsCount = 0;
              if (needRenderScrollbars) {
                expectedScrollbarsCount = direction === 'both'
                  ? 2
                  : 1;
              }
              expect(scrollBar.length).toBe(expectedScrollbarsCount);
            });
          });
        });
      });

      describe('cssClasses', () => {
        each(['horizontal', 'vertical', 'both', undefined, null]).describe('Direction: %o', (direction) => {
          it('should add direction class', () => {
            const scrollable = mount(viewFunction({ props: { direction, useSimulatedScrollbar: true, showScrollbar: 'always' } } as any) as JSX.Element);

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

            const detach = scrollable.scrollEffect() as DisposeEffectReturn;

            expect(getEventHandlers('scroll').length).toBe(1);
            detach();
            expect(getEventHandlers('scroll').length).toBe(0);
          });

          it('should subscribe to scrollinit event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleInit = jest.fn();
            (scrollable as any).handleInit = handleInit;

            scrollable.initEffect();
            emit('dxscrollinit', e);

            expect(handleInit).toHaveBeenCalledTimes(1);
            expect(handleInit).toHaveBeenCalledWith(e);
          });

          each([100, 200]).describe('ContainerSize: %o', (containerSize) => {
            each([0, 100, 200]).describe('ContentSize: %o', (contentSize) => {
              each(['hidden', 'visible']).describe('OverflowStyle: %o', (overflow) => {
                each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
                  each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
                    each([true, false]).describe('IsShiftKeyPressed: %o', (isShiftKeyPressed) => {
                      it('scrollinit eventArgs', () => {
                        const viewModel = new Scrollable({ direction, bounceEnabled }) as any;
                        initRefs(viewModel, viewFunction, {
                          strategy: Scrollable === ScrollableSimulated ? 'simulated' : 'native',
                          direction,
                          contentSize,
                          containerSize,
                        });

                        initStyles({
                          ref: (viewModel).containerRef,
                          size: containerSize,
                          overflow,
                        });
                        initStyles({
                          ref: (viewModel).contentRef,
                          size: contentSize,
                          overflow,
                        });

                        const isSimulatedStrategy = Scrollable === ScrollableSimulated;
                        const hasScrollBar = isSimulatedStrategy
                          ? (containerSize < contentSize || bounceEnabled)
                          : containerSize < contentSize;
                        let expectedDirectionResult = hasScrollBar
                          ? direction
                          : undefined;

                        const e = { ...defaultEvent, shiftKey: isShiftKeyPressed };
                        if (isDxWheelEvent) {
                          (e as any).type = 'dxmousewheel';
                        }

                        if (isSimulatedStrategy && isDxWheelEvent) {
                          expectedDirectionResult = direction;
                          if (direction === 'both') {
                            expectedDirectionResult = isShiftKeyPressed ? 'horizontal' : 'vertical';
                          }
                        }

                        expect(viewModel.getDirection(e)).toBe(expectedDirectionResult);
                      });
                    });
                  });
                });

                if (Scrollable === ScrollableNative) {
                  each([true, false]).describe('Disabled: %o', (disabled) => {
                    each([true, false]).describe('IsLocked: %o', (locked) => {
                      each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
                        each([true, false]).describe('ShiftKey: %o', (shiftKey) => {
                          each([-1, 1]).describe('Delta: %o', (delta) => {
                            each([0, 1]).describe('ScrollLeft: %o', (scrollLeft) => {
                              each([0, 1]).describe('ScrollTop: %o', (scrollTop) => {
                                it('validate method in native strategy', () => {
                                  const isScrolledInMaxDirection = (ref) => {
                                    const {
                                      scrollWidth, clientWidth, scrollHeight, clientHeight,
                                    } = ref;

                                    if (delta > 0) {
                                      return shiftKey ? !scrollLeft : !scrollTop;
                                    }

                                    return shiftKey
                                      ? scrollLeft >= scrollWidth - clientWidth
                                      : scrollTop >= scrollHeight - clientHeight;
                                  };

                                  const viewModel = new Scrollable({
                                    direction, disabled,
                                  }) as any;

                                  initRefs(viewModel, viewFunction, {
                                    strategy: 'native',
                                    direction,
                                    contentSize,
                                    containerSize,
                                  });

                                  initStyles({
                                    ref: (viewModel).containerRef,
                                    size: containerSize,
                                    overflow,
                                  });
                                  initStyles({
                                    ref: (viewModel).contentRef,
                                    size: contentSize,
                                    overflow,
                                  });
                                  viewModel.containerRef.scrollLeft = scrollLeft;
                                  viewModel.containerRef.scrollTop = scrollTop;
                                  viewModel.locked = locked;

                                  let expectedValidationResult;
                                  if (disabled || locked) {
                                    expectedValidationResult = false;
                                  } else if (isDxWheelEvent
                                          && isScrolledInMaxDirection(viewModel.containerRef)) {
                                    expectedValidationResult = false;
                                  } else {
                                    expectedValidationResult = containerSize < contentSize;
                                  }

                                  const e = { ...defaultEvent, delta, shiftKey };
                                  if (isDxWheelEvent) {
                                    (e as any).type = 'dxmousewheel';
                                  }

                                  const actualResult = (viewModel).validate(e);

                                  expect(actualResult).toBe(expectedValidationResult);
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                }
              });
            });
          });

          it('should subscribe to scrollstart event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleStart = jest.fn();
            (scrollable as any).handleStart = handleStart;

            scrollable.startEffect();
            emit('dxscrollstart', e);

            expect(handleStart).toHaveBeenCalledTimes(1);
            expect(handleStart).toHaveBeenCalledWith(e);
          });

          it('should subscribe to dxscroll event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleMove = jest.fn();
            (scrollable as any).handleMove = handleMove;

            scrollable.moveEffect();
            emit('dxscroll', e);

            expect(handleMove).toHaveBeenCalledTimes(1);
            expect(handleMove).toHaveBeenCalledWith(e);
          });

          it('should subscribe to scrollend event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleEnd = jest.fn();
            (scrollable as any).handleEnd = handleEnd;

            scrollable.endEffect();
            emit('dxscrollend', e);

            expect(handleEnd).toHaveBeenCalledTimes(1);
            expect(handleEnd).toHaveBeenCalledWith(e);
          });

          it('should subscribe to scrollStop event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleStop = jest.fn();
            (scrollable as any).handleStop = handleStop;

            scrollable.stopEffect();
            emit('dxscrollstop', e);

            expect(handleStop).toHaveBeenCalledTimes(1);
          });

          it('should subscribe to scrollcancel event', () => {
            const e = { ...defaultEvent };
            const scrollable = new Scrollable({ direction });
            const handleCancel = jest.fn();
            (scrollable as any).handleCancel = handleCancel;

            scrollable.cancelEffect();
            emit('dxscrollcancel', e);

            expect(handleCancel).toHaveBeenCalledTimes(1);
            expect(handleCancel).toHaveBeenCalledWith(e);
          });

          each(['init', 'start', 'end', 'stop', 'cancel']).describe('EventName: %o', (shortEventName) => {
            it('Effect should return unsubscribe callback', () => {
              const scrollable = new Scrollable({ direction });

              const detach = scrollable[`${shortEventName}Effect`]() as DisposeEffectReturn;

              const eventName = `dxscroll${shortEventName}`;
              expect(getEventHandlers(eventName).length).toBe(1);
              detach();
              expect(getEventHandlers(eventName).length).toBe(0);
            });
          });

          it('moveEffect should return unsubscribe callback', () => {
            const scrollable = new Scrollable({ direction });

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

            it('ScrollPosition: { top: 0, left: 0 }', () => {
              const scrollOffset = { top: 0, left: 0 };
              const containerRef = createContainerRef(scrollOffset);

              const onScroll = jest.fn();
              const scrollable = new Scrollable({ onScroll, direction });
              scrollable.containerRef = containerRef as RefObject<HTMLDivElement>;
              scrollable.scrollEffect();
              emit('scroll');

              expect(onScroll).toHaveBeenCalledTimes(1);
              checkScrollParams(onScroll.mock.calls[0][0], {
                scrollOffset,
                reachedTop: true,
                reachedBottom: false,
                reachedLeft: true,
                reachedRight: false,
              });
            });

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
