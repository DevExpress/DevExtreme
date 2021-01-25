import React from 'react';
import { mount, shallow } from 'enzyme';
import each from 'jest-each';
import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';
import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import devices from '../../../../core/devices';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  ScrollableNative,
  viewFunction as viewFunctionNative,
} from '../scrollable_native';

import {
  ensureLocation,
  SCROLLABLE_DISABLED_CLASS,
  SCROLLABLE_SCROLLBAR_SIMULATED,
  SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE,
  SCROLLABLE_SCROLLBARS_HIDDEN,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
} from '../scrollable_utils';

import {
  ScrollableSimulated,
  viewFunction as viewFunctionSimulated,
} from '../scrollable_simulated';

import { Widget } from '../../common/widget';

import {
  ScrollableProps,
} from '../scrollable_props';

import {
  ScrollableLocation,
  ScrollOffset,
  ScrollableDirection,
} from '../types.d';

import { Scrollbar } from '../scrollbar';

const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
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

      [true, false].forEach((needScrollViewContentWrapper) => {
        it(`should render scrollView content only if needScrollViewContentWrapper option is enabled. needScrollViewContentWrapper=${needScrollViewContentWrapper}`, () => {
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
      ['horizontal', 'vertical', 'both', undefined, null].forEach((direction) => {
        [true, false, undefined, null].forEach((useSimulatedScrollbar) => {
          ['never', 'always', 'onScroll', 'onHover', true, false, undefined, null].forEach((showScrollbar: any) => {
            it(`Scrollbar should render if useSimulatedScrollbar is set to true and nativeStrategy is used. ShowScrollbar=${showScrollbar}, useSimulatedScrollbar=${useSimulatedScrollbar}, direction: ${direction}`, () => {
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

            it(`Should pass correct visibilityMode to Scrollbar. ShowScrollbar=${showScrollbar}, useSimulatedScrollbar=${useSimulatedScrollbar}, direction: ${direction}`, () => {
              if (Scrollable === ScrollableNative) {
                return; // actual only for simulated strategy
              }

              const props = {
                props: {
                  showScrollbar,
                },
              } as Partial<any>;

              const scrollable = mount(viewFunction(props as any) as JSX.Element);
              const scrollbarProps = scrollable.find(Scrollbar).props();

              let expectedVisibilityMode = showScrollbar;
              if (showScrollbar === true) {
                expectedVisibilityMode = 'onScroll';
              } else if (showScrollbar === false) {
                expectedVisibilityMode = 'never';
              }

              expect(scrollbarProps.visibilityMode).toBe(expectedVisibilityMode);
            });
          });
        });
      });

      describe('cssClasses', () => {
        ['horizontal', 'vertical', 'both', undefined, null].forEach((direction) => {
          it(`should add direction class. Direction: ${direction}`, () => {
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
      const createElement = ({
        location,
        width = 50,
        height = 50,
        offsetParent = {},
        className = '',
        isInScrollableContent = false,
      }): HTMLElement => {
        const checkSelector = (selector: string): boolean => className.indexOf(selector.replace('.', '')) > -1;
        return {
          offsetHeight: height,
          offsetWidth: width,
          offsetTop: location.top,
          offsetLeft: location.left,
          offsetParent,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          closest: (selector: string): Element | null => (
            isInScrollableContent ? {} as Element : null
          ),
          matches: (selector: string): boolean => checkSelector(selector),
        } as HTMLElement;
      };

      const createContainerRef = (
        location: Partial<ScrollableLocation>,
        direction: ScrollableDirection = 'vertical',
        scrollBarWidth = 17,
        isRtlEnabled = false,
      ): RefObject<HTMLDivElement> => {
        const offsetWidth = 300;
        const offsetHeight = 300;
        const scrollWidth = 600;
        const scrollHeight = 600;
        return ({
          scrollTop: location.top,
          scrollLeft: isRtlEnabled ? -1 * (location.left || 0) : location.left,
          offsetHeight: offsetWidth,
          offsetWidth: offsetHeight,
          scrollWidth: direction === 'horizontal' || direction === 'both' ? scrollWidth - scrollBarWidth : scrollWidth,
          scrollHeight: direction === 'vertical' || direction === 'both' ? scrollHeight - scrollBarWidth : scrollHeight,
          clientWidth: direction === 'horizontal' || direction === 'both' ? offsetWidth - scrollBarWidth : offsetWidth,
          clientHeight: direction === 'vertical' || direction === 'both' ? offsetHeight - scrollBarWidth : offsetHeight,
        }) as RefObject<HTMLDivElement>;
      };

      const normalizeRtl = (isRtlEnabled: boolean, coordinate: number) => (isRtlEnabled
        ? -1 * coordinate
        : coordinate) as number;

      const calculateRtlScrollLeft = (container: HTMLElement, coordinate: number): number => {
        const scrollLeft = container.scrollWidth - container.clientWidth - coordinate;
        return normalizeRtl(true, scrollLeft) as number;
      };

      const createTargetElement = (args): HTMLElement => {
        const scrollableContent = createElement({
          location: { },
          className: SCROLLABLE_CONTENT_CLASS,
        });
        return createElement({
          ...args,
          ...{ offsetParent: scrollableContent, isInScrollableContent: true },
        });
      };

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

          if (Scrollable === ScrollableSimulated) {
            each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
              each(['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-scroll-content', 'dx-scrollable-container']).describe('Event target: %o', (targetClass) => {
                each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
                  each([true, false]).describe('ScrollByContent: %o', (scrollByContent) => {
                    it('should prepare directions on init', () => {
                      const e = { ...defaultEvent, originalEvent: {} };
                      if (isDxWheelEvent) {
                        (e as any).originalEvent.type = 'dxmousewheel';
                      }

                      const viewModel = new Scrollable({
                        direction, scrollByThumb, scrollByContent,
                      });
                      const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
                      const scrollbar = scrollable.find(Scrollbar);

                      (e.originalEvent as any).target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                      if (direction === DIRECTION_VERTICAL) {
                        (viewModel as any).verticalScrollbarRef = scrollbar.instance();
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        (viewModel as any).horizontalScrollbarRef = scrollbar.instance();
                      } else {
                        (viewModel as any).horizontalScrollbarRef = scrollbar.at(0).instance();
                        (viewModel as any).verticalScrollbarRef = scrollbar.at(1).instance();
                      }

                      expect((viewModel as any).validDirections).toEqual({});

                      viewModel.initEffect();
                      emit('dxscrollinit', e);

                      if (isDxWheelEvent) {
                        expect((viewModel as any).validDirections).toEqual({
                          vertical: true,
                          horizontal: true,
                        });
                      } else {
                        const isDirectionValid = (scrollByContent || scrollByThumb)
                        && ((targetClass !== 'dx-scrollable-scrollbar' && targetClass !== 'dx-scrollable-container') || !scrollByThumb || scrollByContent);

                        expect((viewModel as any).validDirections).toEqual({
                          vertical: direction !== DIRECTION_HORIZONTAL && isDirectionValid,
                          horizontal: direction !== DIRECTION_VERTICAL && isDirectionValid,
                        });
                      }
                    });
                  });
                });
              });
            });
          }

          each([100, 200]).describe('ContainerSize: %o', (containerSize) => {
            each([0, 100, 200]).describe('ContentSize: %o', (contentSize) => {
              each(['hidden', 'visible']).describe('OverflowStyle: %o', (overflow) => {
                const initStyles = (ref, size) => {
                  const elementRef = ref;

                  ['width', 'height', 'outerWidth', 'outerHeight', 'scrollWidth', 'scrollHeight'].forEach((prop) => {
                    elementRef.style[prop] = `${size}px`;
                  });

                  ['overflowX', 'overflowY'].forEach((prop) => {
                    elementRef.style[prop] = overflow;
                  });
                  elementRef.getBoundingClientRect = jest.fn(() => ({
                    width: size,
                    height: size,
                  }));

                  return elementRef;
                };

                if (Scrollable === ScrollableSimulated) {
                  each([true, false]).describe('ScrollableRef: %o', (isScrollableRef) => {
                    it('UpdateScrollbarSize(), thumbSize default', () => {
                      const containerRef = React.createRef();
                      const contentRef = React.createRef();
                      const viewModel = new Scrollable({ direction });

                      (viewModel as any).containerRef = containerRef;
                      (viewModel as any).contentRef = contentRef;
                      const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);

                      if (direction !== 'horizontal') {
                        const styles = scrollable.find('.dx-scrollbar-vertical .dx-scrollable-scroll').getElement().props.style;

                        expect(styles).toEqual({ display: '', height: 15, width: undefined });
                      }
                      if (direction !== 'vertical') {
                        const styles = scrollable.find('.dx-scrollbar-horizontal .dx-scrollable-scroll').getElement().props.style;

                        expect(styles).toEqual({ display: '', height: undefined, width: 15 });
                      }

                      initStyles((viewModel as any).containerRef.current, containerSize);
                      initStyles((viewModel as any).contentRef.current, contentSize);

                      if (isScrollableRef) {
                        (viewModel as any).scrollableRef = scrollable.getDOMNode();
                        initStyles((viewModel as any).scrollableRef, containerSize);
                        Object.defineProperty((viewModel as any).scrollableRef, 'offsetWidth', { configurable: true, value: containerSize });
                        Object.defineProperty((viewModel as any).scrollableRef, 'offsetHeight', { configurable: true, value: containerSize });
                      } else {
                        viewModel.getScaleRatio = () => 1;
                      }

                      (viewModel as any).containerRef = (viewModel as any).containerRef.current;
                      (viewModel as any).contentRef = (viewModel as any).contentRef.current;

                      // TODO: mockwindow
                      (viewModel as any).effectUpdateScrollbarSize();

                      if (direction !== 'horizontal') {
                        expect(viewModel.scrollableOffsetLeft).toEqual(0);
                        expect(viewModel.containerWidth).toEqual(containerSize);
                        expect(viewModel.contentWidth).toEqual(contentSize);
                        expect(viewModel.scaleRatioWidth).toEqual(1);
                      }
                      if (direction !== 'vertical') {
                        expect(viewModel.scrollableOffsetTop).toEqual(0);
                        expect(viewModel.containerHeight).toEqual(containerSize);
                        expect(viewModel.contentHeight).toEqual(contentSize);
                        expect(viewModel.scaleRatioHeight).toEqual(1);
                      }
                    });
                  });
                }

                each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
                  each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
                    each([true, false]).describe('IsShiftKeyPressed: %o', (isShiftKeyPressed) => {
                      it('scrollinit eventArgs', () => {
                        const containerRef = React.createRef();
                        const contentRef = React.createRef();
                        const viewModel = new Scrollable({ direction, bounceEnabled });

                        (viewModel as any).containerRef = containerRef;
                        (viewModel as any).contentRef = contentRef;

                        const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);

                        (viewModel as any).containerRef = (viewModel as any).containerRef.current;
                        (viewModel as any).contentRef = (viewModel as any).contentRef.current;

                        initStyles((viewModel as any).containerRef, containerSize);
                        initStyles((viewModel as any).contentRef, contentSize);

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

                        if (isSimulatedStrategy) {
                          const scrollbar = scrollable.find(Scrollbar);
                          if (direction === DIRECTION_VERTICAL) {
                            (viewModel as any).verticalScrollbarRef = scrollbar.instance();
                            Object.assign((viewModel as any).verticalScrollbarRef,
                              { props: { contentSize, containerSize } });
                          } else if (direction === DIRECTION_HORIZONTAL) {
                            (viewModel as any).horizontalScrollbarRef = scrollbar.instance();
                            Object.assign((viewModel as any).horizontalScrollbarRef,
                              { props: { contentSize, containerSize } });
                          } else {
                            (viewModel as any).horizontalScrollbarRef = scrollbar.at(0).instance();
                            Object.assign((viewModel as any).horizontalScrollbarRef,
                              { props: { contentSize, containerSize } });
                            (viewModel as any).verticalScrollbarRef = scrollbar.at(1).instance();
                            Object.assign((viewModel as any).verticalScrollbarRef,
                              { props: { contentSize, containerSize } });
                          }
                        }

                        expect((viewModel as any).getDirection(e)).toBe(expectedDirectionResult);
                        expect((viewModel as any).validate(e)).toBe(true); // TODO
                      });
                    });
                  });
                });
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
            expect(handleStop).toHaveBeenCalledWith(e);
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
        });

        it('should not raise any error if onScroll is not defined', () => {
          const scrollable = new Scrollable({ onScroll: undefined });

          scrollable.scrollEffect();
          emit('scroll');

          expect(scrollable.scrollEffect.bind(scrollable)).not.toThrow();
        });

        each([0, 0.5, 1]).describe('baseContainerToContentRatio: %o', (contentRatio) => {
          each(['always', 'onHover', 'never', 'onScroll']).describe('HoverEffect params. showScrollbar: %o', (showScrollbarMode) => {
            it('hoverEffect should update invisible class only for onHover mode', () => {
              if (Scrollable === ScrollableNative) {
                return; // actual only for simulated strategy
              }

              const scrollable = new Scrollable({
                direction: 'horizontal',
                showScrollbar: showScrollbarMode,
              }) as ScrollableSimulated;
              scrollable.baseContainerToContentRatio = contentRatio;

              const isScrollbarHasInvisibleClass = (scrollableInstance) => {
                const scrollableElement = mount(
                  viewFunction(scrollableInstance as any) as JSX.Element,
                );

                const scrollbar = scrollableElement.find('.dx-scrollable-scroll');
                return scrollbar.hasClass('dx-state-invisible');
              };
              const isHiddenByRatio = contentRatio >= 1;
              expect(isScrollbarHasInvisibleClass(scrollable)).toBe(showScrollbarMode !== 'always' || isHiddenByRatio);

              scrollable.cursorEnterHandler();
              expect(isScrollbarHasInvisibleClass(scrollable)).toBe(
                (showScrollbarMode !== 'always' && showScrollbarMode !== 'onHover') || isHiddenByRatio,
              );

              scrollable.cursorLeaveHandler();
              expect(isScrollbarHasInvisibleClass(scrollable)).toBe(showScrollbarMode !== 'always' || isHiddenByRatio);
            });
          });
        });
      });

      if (Scrollable === ScrollableSimulated) {
        describe('Key down', () => {
          it('should call onKeyDown callback by Widget key down', () => {
            const onKeyDown = jest.fn(() => ({ cancel: true }));
            const options = {};
            const scrollable = new Scrollable({ onKeyDown });
            scrollable.onWidgetKeyDown(options);
            expect(onKeyDown).toHaveBeenCalledTimes(1);
            expect(onKeyDown).toHaveBeenCalledWith(options);
          });

          it('should prevent key down event processing if onKeyDown event handler returns event.cancel="true"', () => {
            const onKeyDown = jest.fn(() => ({ cancel: true }));
            const options = { keyName: 'down' };
            const scrollable = new Scrollable({ onKeyDown });
            scrollable.onWidgetKeyDown(options);
            expect(onKeyDown).toBeCalled();
          });

          each(['vertical', 'horizontal', 'both']).describe('Direction: %o', (direction) => {
            each(['leftArrow', 'upArrow', 'rightArrow', 'downArrow']).describe('Key: %o', (keyName) => {
              it(`should prevent default key down event by key - ${keyName}`, () => {
                const scrollFunc = jest.fn();
                const options = {
                  originalEvent: {
                    key: keyName,
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                  },
                };
                const scrollable = new Scrollable({ });
                scrollable.scrollByLine = scrollFunc;
                scrollable.onWidgetKeyDown(options);
                expect(options.originalEvent.preventDefault).toBeCalled();
                expect(options.originalEvent.stopPropagation).toBeCalled();
                expect(scrollFunc).toBeCalledTimes(1);
                expect(scrollFunc).toBeCalledWith({ [`${(keyName === 'upArrow' || keyName === 'downArrow') ? 'y' : 'x'}`]: (keyName === 'upArrow' || keyName === 'leftArrow') ? -1 : 1 });
              });

              each([1, 2, undefined]).describe('devicePixelRatio: %o', (devicePixelRatio) => {
                it(`should call scrollBy by ${keyName} key`, () => {
                  const scrollByHandler = jest.fn();
                  const options = {
                    originalEvent: {
                      key: keyName,
                      preventDefault: jest.fn(),
                      stopPropagation: jest.fn(),
                    },
                  };
                  const scrollable = new Scrollable({ direction });
                  scrollable.tryGetDevicePixelRatio = () => devicePixelRatio;
                  scrollable.scrollBy = scrollByHandler;
                  scrollable.onWidgetKeyDown(options);
                  expect(scrollByHandler).toBeCalledTimes(1);
                  const expectedParams = { top: 0, left: 0 };
                  if (keyName === 'leftArrow') {
                    expectedParams.left = -40 / (devicePixelRatio || 1);
                  }
                  if (keyName === 'rightArrow') {
                    expectedParams.left = 40 / (devicePixelRatio || 1);
                  }
                  if (keyName === 'upArrow') {
                    expectedParams.top = -40 / (devicePixelRatio || 1);
                  }
                  if (keyName === 'downArrow') {
                    expectedParams.top = 40 / (devicePixelRatio || 1);
                  }
                  expect(scrollByHandler).toBeCalledWith(expectedParams);
                });
              });
            });

            each(['pageUp', 'pageDown']).describe('Key: %o', (keyName) => {
              it(`should prevent default key down event by key - ${keyName}`, () => {
                const scrollByPageHandler = jest.fn();
                const options = {
                  originalEvent: {
                    key: keyName,
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                  },
                };
                const scrollable = new Scrollable({ direction });
                scrollable.scrollByPage = scrollByPageHandler;
                scrollable.onWidgetKeyDown(options);
                expect(options.originalEvent.preventDefault).toBeCalled();
                expect(options.originalEvent.stopPropagation).toBeCalled();
                expect(scrollByPageHandler).toBeCalledTimes(1);
                expect(scrollByPageHandler).toBeCalledWith(keyName === 'pageUp' ? -1 : 1);
              });

              it(`should call scrollBy by ${keyName} key`, () => {
                const scrollByHandler = jest.fn();
                const options = {
                  originalEvent: {
                    key: keyName,
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                  },
                };
                const scrollable = new Scrollable({ direction });
                scrollable.scrollBy = scrollByHandler;
                scrollable.onWidgetKeyDown(options);
                expect(scrollByHandler).toBeCalledTimes(1);
              });
            });

            it('should prevent default key down event by "home" key', () => {
              const scrollFunc = jest.fn();
              const options = {
                originalEvent: {
                  key: 'home',
                  preventDefault: jest.fn(),
                  stopPropagation: jest.fn(),
                },
              };
              const scrollable = new Scrollable({ direction });
              scrollable.scrollToHome = scrollFunc;
              scrollable.onWidgetKeyDown(options);
              expect(options.originalEvent.preventDefault).toBeCalled();
              expect(options.originalEvent.stopPropagation).toBeCalled();
              expect(scrollFunc).toBeCalledTimes(1);
            });

            it('should scroll to start by "home" key', () => {
              const scrollFunc = jest.fn();
              const options = {
                originalEvent: {
                  key: 'home',
                  preventDefault: jest.fn(),
                  stopPropagation: jest.fn(),
                },
              };
              const scrollable = new Scrollable({ direction });
              scrollable.scrollTo = scrollFunc;
              scrollable.onWidgetKeyDown(options);
              expect(scrollFunc).toBeCalledTimes(1);
              expect(scrollFunc).toBeCalledWith({ [`${direction === 'horizontal' ? 'left' : 'top'}`]: 0 }); // TODO: returns { top: 0 } when direction is 'both'
            });

            it('should prevent default key down event by "end" key', () => {
              const scrollFunc = jest.fn();
              const options = {
                originalEvent: {
                  key: 'end',
                  preventDefault: jest.fn(),
                  stopPropagation: jest.fn(),
                },
              };
              const scrollable = new Scrollable({ direction });
              scrollable.scrollToEnd = scrollFunc;
              scrollable.onWidgetKeyDown(options);
              expect(options.originalEvent.preventDefault).toBeCalled();
              expect(options.originalEvent.stopPropagation).toBeCalled();
              expect(scrollFunc).toBeCalledTimes(1);
            });

            it('should scroll to end by "end" key', () => {
              const scrollToFunc = jest.fn();
              const options = {
                originalEvent: {
                  key: 'end',
                  preventDefault: jest.fn(),
                  stopPropagation: jest.fn(),
                },
              };
              const scrollable = new Scrollable({ direction });
              scrollable.scrollTo = scrollToFunc;
              scrollable.onWidgetKeyDown(options);
              expect(scrollToFunc).toBeCalledTimes(1);
            });
          });

          it('should prevent default key down event by common keys down', () => {
            const scrollFunc = jest.fn();
            const options = {
              originalEvent: {
                key: 'A',
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
              },
            };
            const scrollable = new Scrollable({ });
            scrollable.scrollToHome = scrollFunc;
            scrollable.scrollToEnd = scrollFunc;
            scrollable.scrollByLine = scrollFunc;
            scrollable.scrollByPage = scrollFunc;
            scrollable.onWidgetKeyDown(options);

            expect(options.originalEvent.preventDefault).not.toBeCalled();
            expect(options.originalEvent.stopPropagation).not.toBeCalled();
            expect(scrollFunc).toBeCalledTimes(0);
          });
        });
      }

      describe('Methods', () => {
        describe('Content', () => {
          it('should get the content of the widget', () => {
            const scrollable = new Scrollable({});
            const content = { };
            scrollable.contentRef = content as RefObject<HTMLDivElement>;
            expect(scrollable.content()).toEqual(content);
          });
        });

        describe('ScrollBy', () => {
          each([true, false]).describe('rtlEnabled: %o', (rtlEnabled) => {
            it('should scroll by positive distance as number in the vertical direction', () => {
              const containerRefMock = createContainerRef({ top: 150, left: 0 },
                undefined, undefined, rtlEnabled);

              const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy(100);
              const expected = normalizeRtl(rtlEnabled, 0);

              expect(containerRefMock.scrollTop).toEqual(250);
              expect(containerRefMock.scrollLeft).toEqual(expected);
            });

            it(`should scroll by positive distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 0, left: 150 },
                undefined, undefined, rtlEnabled);

              const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy(normalizeRtl(rtlEnabled, 100));
              const expectedLeft = normalizeRtl(rtlEnabled, 250);

              expect(containerRefMock.scrollTop).toEqual(0);
              expect(containerRefMock.scrollLeft).toEqual(expectedLeft);
            });

            it(`should scroll by positive distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 150 },
                undefined, undefined, rtlEnabled);

              const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: 100, left: normalizeRtl(rtlEnabled, 100) });

              expect(containerRefMock.scrollTop).toEqual(250);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
            });

            it(`should scroll by positive distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 0 },
                undefined, undefined, rtlEnabled);

              const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: 100 });

              expect(containerRefMock.scrollTop).toEqual(250);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
            });

            it(`should scroll by positive distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 0, left: 150 },
                undefined, undefined, rtlEnabled);

              const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 100) });

              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 250));
              expect(containerRefMock.scrollTop).toEqual(0);
            });

            it(`should scroll by positive distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, 70) });

              expect(containerRefMock.scrollTop).toEqual(220);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 220));
            });

            it(`should scroll by negative distance as number in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 0 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy(-50);

              expect(containerRefMock.scrollTop).toEqual(100);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
            });

            it(`should scroll by negative distance as number in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 0, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
              expect(containerRefMock.scrollTop).toEqual(0);
            });

            it(`should scroll by negative distance as number in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: -50, left: normalizeRtl(rtlEnabled, -50) });

              expect(containerRefMock.scrollTop).toEqual(100);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            });

            it(`should scroll by negative distance as object in the vertical direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 0 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: -50, left: 70 });

              expect(containerRefMock.scrollTop).toEqual(100);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
            });

            it(`should scroll by negative distance as object in the horizontal direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 0, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: 70, left: normalizeRtl(rtlEnabled, -50) });

              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
              expect(containerRefMock.scrollTop).toEqual(0);
            });

            it(`should scroll by negative distance as object in the both direction. rtlEnabled: ${rtlEnabled}`, () => {
              const containerRefMock = createContainerRef({ top: 150, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollBy({ top: -70, left: normalizeRtl(rtlEnabled, -50) });

              expect(containerRefMock.scrollTop).toEqual(80);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 100));
            });
          });
        });

        describe('ScrollTo', () => {
          each([false, true]).describe('rtlEnabled: %o', (rtlEnabled) => {
            it('should scroll to position as number in the vertical direction', () => {
              const containerRefMock = createContainerRef({ top: 150, left: 0 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollTo(200);

              expect(containerRefMock.scrollTop).toEqual(200);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
            });

            it('should scroll position as number in the horizontal direction', () => {
              const containerRefMock = createContainerRef({ top: 0, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
              scrollable.containerRef = containerRefMock;

              const expected = 200;
              scrollable.scrollTo(expected);

              expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
                ? calculateRtlScrollLeft(containerRefMock, expected)
                : expected);
              expect(containerRefMock.scrollTop).toEqual(0);
            });

            it('should scroll position as number in the both direction', () => {
              const containerRefMock = createContainerRef({ top: 150, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollTo(200);
              const expected = 200;

              expect(containerRefMock.scrollTop).toEqual(200);
              expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
                ? calculateRtlScrollLeft(containerRefMock, expected)
                : expected);
            });

            it('should scroll position as object in the vertical direction', () => {
              const containerRefMock = createContainerRef({ top: 150, left: 0 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'vertical' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollTo({ top: 100, left: 70 });

              expect(containerRefMock.scrollTop).toEqual(100);
              expect(containerRefMock.scrollLeft).toEqual(normalizeRtl(rtlEnabled, 0));
            });

            it('should scroll position as object in the horizontal direction', () => {
              const containerRefMock = createContainerRef({ top: 0, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'horizontal' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollTo({ top: 70, left: 100 });
              const expectedLeft = 100;

              expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
                ? calculateRtlScrollLeft(containerRefMock, expectedLeft)
                : expectedLeft);
              expect(containerRefMock.scrollTop).toEqual(0);
            });

            it('should scroll position as object in the both direction', () => {
              const containerRefMock = createContainerRef({ top: 150, left: 150 },
                undefined, undefined, rtlEnabled);
              const scrollable = new Scrollable({ rtlEnabled, direction: 'both' });
              scrollable.containerRef = containerRefMock;

              scrollable.scrollTo({ top: 70, left: 70 });

              expect(containerRefMock.scrollTop).toEqual(70);
              expect(containerRefMock.scrollLeft).toEqual(rtlEnabled
                ? calculateRtlScrollLeft(containerRefMock, 70)
                : 70);
            });
          });
        });

        describe('ScrollToElement', () => {
          const getOffsetValue = (
            name: keyof ScrollOffset,
            offset?,
          ): number => (offset ? offset[name] : 0);

          const offsets = [undefined, {
            left: 10,
            right: 20,
            top: 10,
            bottom: 20,
          }];

          const directions = [
            'horizontal' as ScrollableDirection,
            'vertical' as ScrollableDirection,
            'both' as ScrollableDirection,
          ];

          each([undefined, null]).describe('scrollbarSize: %o', (fakeElement) => {
            it('should not be exepted when element is not exist', () => {
              const containerRef = createContainerRef({ top: 200, left: 0 }, 'both', 10);
              const scrollView = new Scrollable({ direction: 'vertical' } as ScrollableProps);
              scrollView.containerRef = containerRef;
              scrollView.scrollToElement(fakeElement, {});

              expect(true).toEqual(true);
            });
          });

          each([5, 10, 20]).describe('scrollbarSize: %o', (scrollBarSize) => {
            each(directions).describe('Direction: %o', (direction) => {
              each(offsets).describe('Element is smaller than container. Offset: %o', (offset) => {
                it('should scroll to element from top side by vertical direction', () => {
                  const element = createTargetElement({ location: { top: 20, left: 0 } });
                  const containerRef = createContainerRef({ top: 200, left: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                  expect(containerRef.scrollLeft).toEqual(0);
                });

                it('should scroll to element from bottom side by vertical direction.', () => {
                  const element = createTargetElement({ location: { top: 500, left: 0 } });
                  const containerRef = createContainerRef({ top: 100, left: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                  scrollable.containerRef = containerRef;

                  scrollable.scrollToElement(element, offset);

                  const scrollOffset = direction === 'vertical' || direction === 'both'
                    ? scrollBarSize
                    : 0;

                  expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollOffset);
                  expect(containerRef.scrollLeft).toEqual(0);
                });

                it('should scroll to element from left side by horizontal direction', () => {
                  const element = createTargetElement({ location: { left: 20, top: 0 } });
                  const containerRef = createContainerRef({ left: 200, top: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                  scrollable.containerRef = containerRef;

                  scrollable.scrollToElement(element, offset);

                  const expectedLeft = element.offsetLeft - getOffsetValue('left', offset);
                  expect(containerRef.scrollLeft).toEqual(expectedLeft);
                  expect(containerRef.scrollTop).toEqual(0);
                });

                it('should scroll to element from right side by horizontal direction', () => {
                  const element = createTargetElement({ location: { left: 500, top: 0 } });
                  const containerRef = createContainerRef({ left: 100, top: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  const scrollOffset = direction === 'horizontal' || direction === 'both'
                    ? scrollBarSize
                    : 0;
                  expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollOffset);
                  expect(containerRef.scrollTop).toEqual(0);
                });

                it('should scroll to element from left side and top side by both direction', () => {
                  const element = createTargetElement({ location: { left: 20, top: 20 } });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                });

                it('should scroll to element from right side and top side by both direction', () => {
                  const element = createTargetElement({ location: { left: 500, top: 20 } });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                });

                it('should scroll to element from left side and bottom side by both direction', () => {
                  const element = createTargetElement({ location: { left: 20, top: 500 } });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                  expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
                });

                it('should scroll to element from right side and bottom side by both direction', () => {
                  const element = createTargetElement({ location: { left: 500, top: 500 } });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(250 + getOffsetValue('right', offset) + scrollBarSize);
                  expect(containerRef.scrollTop).toEqual(250 + getOffsetValue('bottom', offset) + scrollBarSize);
                });

                it('should do not scroll to an element when it in the visible area', () => {
                  const element = createTargetElement({ location: { top: 200, left: 200 } });
                  const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollTop).toEqual(100);
                  expect(containerRef.scrollLeft).toEqual(100);
                });
              });

              /* eslint-disable jest/no-identical-title */
              each(offsets).describe(`Element larger than container. Offset: %o, scrollbarSize: ${scrollBarSize}, direction: ${direction}`, (offset) => {
                it('should scroll to element from top side by vertical direction', () => {
                  const element = createTargetElement({
                    location: { top: 20, left: 0 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ top: 200, left: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  const scrollOffset = direction === 'vertical' || direction === 'both'
                    ? scrollBarSize
                    : 0;
                  expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollOffset);
                  expect(containerRef.scrollLeft).toEqual(0);
                });

                it('should scroll to element from bottom side by vertical direction', () => {
                  const element = createTargetElement({
                    location: { top: 500, left: 0 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ top: 100, left: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'vertical' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                  expect(containerRef.scrollLeft).toEqual(0);
                });

                it('should scroll to element from left side by horizontal direction', () => {
                  const element = createTargetElement({
                    location: { left: 20, top: 0 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ left: 200, top: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  const scrollOffset = direction === 'horizontal' || direction === 'both'
                    ? scrollBarSize
                    : 0;
                  expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollOffset);
                  expect(containerRef.scrollTop).toEqual(0);
                });

                it('should scroll to element from right side by horizontal direction', () => {
                  const element = createTargetElement({
                    location: { left: 500, top: 0 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ left: 100, top: 0 },
                    direction, scrollBarSize);

                  const scrollable = new Scrollable({ direction: 'horizontal' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                  expect(containerRef.scrollTop).toEqual(0);
                });

                it('should scroll to element from left side and top side by both direction', () => {
                  const element = createTargetElement({
                    location: { left: 20, top: 20 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
                  expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
                });

                it('should scroll to element from right side and top side by both direction', () => {
                  const element = createTargetElement({
                    location: { left: 500, top: 20 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                  expect(containerRef.scrollTop).toEqual(120 + getOffsetValue('bottom', offset) + scrollBarSize);
                });

                it('should scroll to element from left side and bottom side by both direction', () => {
                  const element = createTargetElement({
                    location: { left: 20, top: 500 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(120 + getOffsetValue('right', offset) + scrollBarSize);
                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                });

                it('should scroll to element from right side and bottom side by both direction', () => {
                  const element = createTargetElement({
                    location: { left: 500, top: 500 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ left: 100, top: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                });

                it('should do not scroll to an element when it in the visible area', () => {
                  const element = createTargetElement({
                    location: { left: 200, top: 200 },
                    width: 400,
                    height: 400,
                  });
                  const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', scrollBarSize);
                  const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                  scrollable.containerRef = containerRef;
                  scrollable.scrollToElement(element, offset);

                  expect(containerRef.scrollLeft).toEqual(element.offsetLeft - getOffsetValue('left', offset));
                  expect(containerRef.scrollTop).toEqual(element.offsetTop - getOffsetValue('top', offset));
                });
              });
              /* eslint-enable jest/no-identical-title */
            });

            describe('Other scenarios', () => {
              it('it should scroll to element when it is located inside the positioned element', () => {
                const content = createElement({
                  location: {},
                  className: SCROLLABLE_CONTENT_CLASS,
                });
                const parent = createElement({
                  location: { top: 250, left: 250 },
                  offsetParent: content,
                });
                const element = createElement({
                  location: { top: 200, left: 200 },
                  offsetParent: parent,
                  isInScrollableContent: true,
                });
                const containerRef = createContainerRef({ top: 100, left: 100 }, 'both');
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);

                expect(containerRef.scrollTop).toEqual(217);
                expect(containerRef.scrollLeft).toEqual(217);
              });

              it('it should not scroll to element when it is not located inside the scrollable content', () => {
                const element = createElement({ location: { top: 200, left: 200 } });
                const containerRef = createContainerRef({ top: 100, left: 100 }, 'both', undefined);
                const scrollable = new Scrollable({ direction: 'both' } as ScrollableProps);
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);

                expect(containerRef.scrollTop).toEqual(100);
                expect(containerRef.scrollLeft).toEqual(100);
              });
            });
          });

          describe('rtlEnabled', () => {
            describe('Element is smaller than container. rtlEnabled: true', () => {
              it('should scroll to element from right side by horizontal direction', () => {
                const element = createTargetElement({ location: { top: 0, left: -320 } });
                const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

                const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);
                expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
              });

              it('should scroll to element from left side by horizontal direction', () => {
                const element = createTargetElement({ location: { top: 0, left: 0 } });
                const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

                const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);
                expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
              });

              it('should scroll to element from right side by horizontal direction for IE', () => {
                testBehavior.positive = true;
                const element = createTargetElement({ location: { top: 0, left: -320 } });
                const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

                const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);
                expect(containerRef.scrollLeft).toEqual(element.offsetLeft * -1);
                testBehavior.positive = false;
              });
            });

            describe('Element is larger than container. rtlEnabled: true', () => {
              it('should scroll to element from right side by horizontal direction', () => {
                const element = createTargetElement({
                  location: {
                    top: 0, left: -320, width: 400, height: 400,
                  },
                });
                const containerRef = createContainerRef({ top: 0, left: 0 }, 'both', undefined, true);

                const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);
                expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
              });

              it('should scroll to element from left side by horizontal direction', () => {
                const element = createTargetElement({
                  location: {
                    top: 0, left: 0, width: 400, height: 400,
                  },
                });
                const containerRef = createContainerRef({ top: 0, left: -320 }, 'both', undefined, true);

                const scrollable = new Scrollable({ rtlEnabled: true, direction: 'both' });
                scrollable.containerRef = containerRef;
                scrollable.scrollToElement(element);
                expect(containerRef.scrollLeft).toEqual(element.offsetLeft);
              });
            });
          });
        });

        describe('ScrollHeight', () => {
          it('should get height of the scroll content', () => {
            const scrollable = new Scrollable({});
            scrollable.contentRef = { offsetHeight: 300 } as RefObject<HTMLDivElement>;

            expect(scrollable.scrollHeight()).toEqual(300);
          });
        });

        describe('ScrollWidth', () => {
          it('should get width of the scroll content', () => {
            const scrollable = new Scrollable({});
            scrollable.contentRef = { offsetWidth: 400 } as RefObject<HTMLDivElement>;

            expect(scrollable.scrollWidth()).toEqual(400);
          });
        });

        describe('ScrollOffset', () => {
          it('should get scroll offset', () => {
            const scrollable = new Scrollable({});
            const location = { left: 130, top: 560 };
            scrollable.containerRef = createContainerRef(location);

            expect(scrollable.scrollOffset()).toEqual(location);
          });

          it('should get scroll top', () => {
            const scrollable = new Scrollable({});
            scrollable.containerRef = createContainerRef({ left: 130, top: 560 });

            expect(scrollable.scrollTop()).toEqual(560);
          });

          it('should get scroll left', () => {
            const scrollable = new Scrollable({});
            scrollable.containerRef = createContainerRef({ left: 130, top: 560 });

            expect(scrollable.scrollLeft()).toEqual(130);
          });
        });

        describe('ClientHeight', () => {
          it('should get client height of the scroll container', () => {
            const scrollable = new Scrollable({});
            scrollable.containerRef = { clientHeight: 120 } as RefObject<HTMLDivElement>;

            expect(scrollable.clientHeight()).toEqual(120);
          });
        });

        describe('ClientWidth', () => {
          it('should get client width of the scroll container', () => {
            const scrollable = new Scrollable({});
            scrollable.containerRef = { clientWidth: 120 } as RefObject<HTMLDivElement>;

            expect(scrollable.clientWidth()).toEqual(120);
          });
        });

        if (Scrollable === ScrollableSimulated) {
          describe('isContent', () => {
            it('element is scrollable container', () => {
              const viewModel = new Scrollable({ direction: 'vertical' });

              const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
              expect(viewModel.isContent(scrollable.find('.dx-scrollable-container').getDOMNode())).toBe(true);
            });

            it('element is scrollbar', () => {
              const viewModel = new Scrollable({ direction: 'vertical' });

              const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
              expect(viewModel.isContent(scrollable.find('.dx-scrollable-scrollbar').getDOMNode())).toBe(true);
            });

            it('element is not inside scrollable', () => {
              const viewModel = new Scrollable({ direction: 'vertical' });

              mount(viewFunction(viewModel as any) as JSX.Element);
              expect(viewModel.isContent(mount(<div />).getDOMNode())).toBe(false);
            });
          });
        }
      });
    });

    describe('Logic', () => {
      describe('Getters', () => {
        describe('cssClasses', () => {
          each(['android', 'ios', 'generic']).describe('Platform: %o', (platform) => {
            it('should add scrolling classes by default', () => {
              devices.real = () => ({ platform });
              const instance = new Scrollable({});
              expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable'));

              if (instance instanceof ScrollableNative) {
                expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-native'));
                expect(instance.cssClasses).toEqual(expect.stringMatching(`dx-scrollable-native-${platform}`));
              } else {
                expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
              }
            });

            it('should assign custom pushBackValue = 5', () => {
              if (Scrollable === ScrollableSimulated) {
                return; // actual only for native strategy
              }

              devices.real = () => ({ platform });

              const scrollable = new Scrollable({ pushBackValue: 5 });
              expect((scrollable as any).pushBackValue).toEqual(5);
            });

            it('should assign custom pushBackValue = 0', () => {
              if (Scrollable === ScrollableSimulated) {
                return; // actual only for native strategy
              }

              devices.real = () => ({ platform });

              const scrollable = new Scrollable({ pushBackValue: 0 });
              expect((scrollable as any).pushBackValue).toEqual(0);
            });

            it('should assign default pushBackValue', () => {
              if (Scrollable === ScrollableSimulated) {
                return; // actual only for native strategy
              }

              devices.real = () => ({ platform });

              const scrollable = new Scrollable({ });
              expect((scrollable as any).pushBackValue).toEqual(platform === 'ios' ? 1 : 0);
            });
          });

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

          [true, false].forEach((isDisabled) => {
            it(`Scrollable should have dx-scrollable-disabled if disabled. Disabled: ${isDisabled}`, () => {
              const instance = new Scrollable({ disabled: isDisabled });

              expect(instance.cssClasses).toEqual(isDisabled
                ? expect.stringMatching(SCROLLABLE_DISABLED_CLASS)
                : expect.not.stringMatching(SCROLLABLE_DISABLED_CLASS));
            });
          });

          ['horizontal', 'vertical', 'both', null, undefined].forEach((direction: any) => {
            [true, false, undefined, null].forEach((useSimulatedScrollbar: any) => {
              ['never', 'always', 'onScroll', 'onHover', true, false, undefined, null].forEach((showScrollbar: any) => {
                it(`Should have correct css classes if useSimulatedScrollbar is set to true and nativeStrategy is used. ShowScrollbar=${showScrollbar}, useSimulatedScrollbar=${useSimulatedScrollbar}, direction: ${direction}`, () => {
                  if (Scrollable === ScrollableSimulated) {
                    return; // actual only for native strategy
                  }
                  const instance = new Scrollable({
                    showScrollbar,
                    useSimulatedScrollbar,
                    direction,
                  });

                  const hasSimulatedCssClasses = showScrollbar && useSimulatedScrollbar;

                  expect(instance.cssClasses).toEqual(hasSimulatedCssClasses
                    ? expect.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED)
                    : expect.not.stringMatching(SCROLLABLE_SCROLLBAR_SIMULATED));
                });

                it(`Should have correct css classes if simulatedStrategy is used. ShowScrollbar=${showScrollbar}, useSimulatedScrollbar=${useSimulatedScrollbar}, direction: ${direction}`, () => {
                  if (Scrollable === ScrollableNative) {
                    return; // actual only for simulated strategy
                  }
                  const instance = new Scrollable({
                    showScrollbar,
                    useSimulatedScrollbar,
                    direction,
                  });

                  const hasScrollbarsAlwaysVisibleClass = showScrollbar === 'always';
                  const hasScrollbarsHiddenClass = !showScrollbar;

                  expect(instance.cssClasses).toEqual(hasScrollbarsAlwaysVisibleClass
                    ? expect.stringMatching(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE)
                    : expect.not.stringMatching(SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE));

                  expect(instance.cssClasses).toEqual(hasScrollbarsHiddenClass
                    ? expect.stringMatching(SCROLLABLE_SCROLLBARS_HIDDEN)
                    : expect.not.stringMatching(SCROLLABLE_SCROLLBARS_HIDDEN));

                  expect(instance.cssClasses).toEqual(expect.stringMatching('dx-scrollable-simulated'));
                });
              });
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
