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
} from './utils';

import {
  ensureLocation,
  SCROLLABLE_DISABLED_CLASS,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
  DIRECTION_BOTH,
  SCROLLABLE_SCROLLBAR_CLASS,
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
              each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
                each(['dx-scrollable-scrollbar', 'dx-scrollable-scroll', 'dx-scrollable-container']).describe('Event target: %o', (targetClass) => {
                  each([true, false]).describe('BounceEnabled: %o', (bounceEnabled) => {
                    each([0, undefined]).describe('TranslateOffset: %o', (translateOffset) => {
                      each([{ pageX: 50, pageY: 50 }, { pageX: 100, pageY: 100 }]).describe('mouseClickPosition: %o', (mouseClickPosition) => {
                        const extendProperties = (ref, additionalProps: any) => {
                          const extendedProps = { ...ref.props, ...additionalProps };

                          Object.assign(ref, { props: extendedProps });
                        };

                        it('should change scroll and content position on init', () => {
                          const e = { ...defaultEvent, originalEvent: {} };
                          if (isDxWheelEvent) {
                            (e as any).originalEvent.type = 'dxmousewheel';
                          }

                          Object.assign(e, mouseClickPosition);

                          const onStopActionHandler = jest.fn();

                          const viewModel = new Scrollable({
                            direction,
                            scrollByThumb,
                            bounceEnabled,
                            showScrollbar: 'always',
                            onStop: onStopActionHandler,
                          });
                          const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);
                          const scrollbars = scrollable.find(Scrollbar);

                          (e.originalEvent as any).target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                          const scrollableContainerElement = scrollable.find('.dx-scrollable-container').getDOMNode();
                          const scrollableContentElement = scrollable.find('.dx-scrollable-content').getDOMNode();
                          const scrollElements = scrollable.find('.dx-scrollable-scroll');

                          const initSettings = (scrollbarRef, index) => {
                            const scrollbar = scrollbarRef.at(index).instance();
                            scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                            scrollbar.scrollRef = scrollElements.at(index).getDOMNode();
                            (scrollbar as any)
                              .getContainerRef = () => ({ current: scrollableContainerElement });
                            (scrollbar as any)
                              .getContentRef = () => ({ current: scrollableContentElement });
                            scrollbar.scrollableOffset = 0;
                            scrollbar.cachedVariables.translateOffset = translateOffset;
                            extendProperties(scrollbar, {
                              contentSize: 500,
                              containerSize: 100,
                              scaleRatio: 1,
                              needScrollbar: true,
                            });
                            return scrollbar;
                          };

                          if (direction === DIRECTION_VERTICAL) {
                            viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                          } else if (direction === DIRECTION_HORIZONTAL) {
                            viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                          } else {
                            viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                            viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                          }

                          (viewModel as any).suppressDirections = () => {};

                          viewModel.initEffect();
                          emit('dxscrollinit', e);

                          if (direction === 'both') {
                            expect(onStopActionHandler).toBeCalledTimes(2);
                            expect(onStopActionHandler).nthCalledWith(1, e);
                            expect(onStopActionHandler).nthCalledWith(2, e);
                          } else {
                            expect(onStopActionHandler).toBeCalledTimes(1);
                            expect(onStopActionHandler).toBeCalledWith(e);
                          }

                          // eslint-disable-next-line no-nested-ternary
                          const expectedScrollPosition = mouseClickPosition.pageX === 50
                            ? 250 : (bounceEnabled ? 500 : 400);

                          const containerElement = scrollable.find('.dx-scrollable-container').getDOMNode();

                          if (isDxWheelEvent || !scrollByThumb || targetClass !== 'dx-scrollable-scrollbar') {
                            expect(containerElement.scrollTop).toEqual(0);
                            expect(containerElement.scrollLeft).toEqual(0);
                            scrollbars.forEach((scrollbar) => {
                              expect(window.getComputedStyle(scrollbar.getDOMNode()).transform).toEqual('');
                            });
                          } else if (direction === DIRECTION_VERTICAL) {
                            expect(containerElement.scrollTop).toEqual(expectedScrollPosition);
                            scrollbars.forEach((scrollbar) => {
                              expect(window.getComputedStyle(scrollbar.find('.dx-scrollable-scroll').getDOMNode()).transform).toEqual(`translate(0px, ${expectedScrollPosition * 0.2}px)`);
                            });
                          } else {
                            expect(containerElement.scrollLeft).toEqual(expectedScrollPosition);
                            expect(window.getComputedStyle(scrollbars.at(0).find('.dx-scrollable-scroll').getDOMNode()).transform).toEqual(`translate(${expectedScrollPosition * 0.2}px, 0px)`);

                            if (direction === DIRECTION_BOTH) {
                              expect(window.getComputedStyle(scrollbars.at(1).find('.dx-scrollable-scroll').getDOMNode()).transform).toEqual('');
                            }
                          }
                        });
                      });
                    });
                  });

                  each([true, false]).describe('ScrollByContent: %o', (scrollByContent) => {
                    it('should prepare directions on init', () => {
                      const e = { ...defaultEvent, originalEvent: {} };
                      if (isDxWheelEvent) {
                        (e as any).originalEvent.type = 'dxmousewheel';
                      }

                      const viewModel = new Scrollable({
                        direction, scrollByThumb, scrollByContent,
                      }) as any;
                      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                      viewModel.scrollableRef = scrollable.getDOMNode();

                      const scrollbars = scrollable.find(Scrollbar);

                      (e.originalEvent as any).target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();

                      const initSettings = (scrollbarRef, index) => {
                        const scrollbar = scrollbarRef.at(index).instance();
                        scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                        scrollbar.initHandler = jest.fn();

                        return scrollbar;
                      };

                      expect(viewModel.validDirections).toEqual({});

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      } else {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                      }

                      viewModel.initEffect();
                      emit('dxscrollinit', e);

                      if (isDxWheelEvent) {
                        expect(viewModel.validDirections).toEqual({
                          vertical: true,
                          horizontal: true,
                        });
                      } else {
                        const isDirectionValid = scrollByContent
                                    || (scrollByThumb && targetClass !== 'dx-scrollable-container');

                        expect(viewModel.validDirections).toEqual({
                          vertical: direction !== DIRECTION_HORIZONTAL && isDirectionValid && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
                          horizontal: direction !== DIRECTION_VERTICAL && isDirectionValid,
                        });
                      }
                    });

                    it('should pass correct event, action & crossThumbScrolling params to initHandler', () => {
                      const e = { ...defaultEvent, originalEvent: {} };
                      if (isDxWheelEvent) {
                        (e as any).originalEvent.type = 'dxmousewheel';
                      }

                      const jestInitHandler = jest.fn();
                      const onStopAction = jest.fn();

                      const viewModel = new Scrollable({
                        direction,
                        scrollByThumb,
                        scrollByContent,
                        onStop: onStopAction,
                      }) as any;
                      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                      viewModel.scrollableRef = scrollable.getDOMNode();

                      const scrollbars = scrollable.find(Scrollbar);

                      const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                      (e.originalEvent as any).target = target;

                      const initSettings = (scrollbarRef, index) => {
                        const scrollbar = scrollbarRef.at(index).instance();
                        scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                        scrollbar.initHandler = jestInitHandler;

                        return scrollbar;
                      };

                      expect(viewModel.validDirections).toEqual({});

                      let expectedVerticalThumbScrolling;
                      let expectedHorizontalThumbScrolling;

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                        expectedVerticalThumbScrolling = (scrollByThumb
                                    && viewModel.verticalScrollbarRef.isThumb(target));
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        expectedHorizontalThumbScrolling = (scrollByThumb
                                    && viewModel.horizontalScrollbarRef.isThumb(target));
                      } else {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                        expectedHorizontalThumbScrolling = (scrollByThumb
                                    && viewModel.horizontalScrollbarRef.isThumb(target));
                        expectedVerticalThumbScrolling = false;
                      }

                      viewModel.initEffect();
                      emit('dxscrollinit', e);

                      const expectedCrossThumbScrolling = expectedVerticalThumbScrolling
                                || expectedHorizontalThumbScrolling;

                      if (direction === 'both') {
                        expect(jestInitHandler).toBeCalledTimes(2);
                        expect(jestInitHandler)
                          .toHaveBeenNthCalledWith(1, e, onStopAction, expectedCrossThumbScrolling);
                        expect(jestInitHandler)
                          .toHaveBeenNthCalledWith(2, e, onStopAction, expectedCrossThumbScrolling);
                      } else {
                        expect(jestInitHandler).toBeCalledTimes(1);
                        expect(jestInitHandler).toBeCalledWith(
                          e,
                          onStopAction,
                          expectedCrossThumbScrolling,
                        );
                      }
                    });

                    each([1, 0.5, 2, undefined]).describe('DevicePixelRatio: %o', (devicePixelRatio) => {
                      it('should pass correct event param to moveHandler', () => {
                        const initialDeltaX = 50;
                        const initialDeltaY = 40;

                        const e = {
                          ...defaultEvent,
                          delta: { x: initialDeltaX, y: initialDeltaY },
                          preventDefault: jest.fn(),
                          originalEvent: {
                            type: isDxWheelEvent ? 'dxmousewheel' : undefined,
                          },
                        };

                        const jestMoveHandler = jest.fn();

                        const viewModel = new Scrollable({
                          direction,
                          scrollByThumb,
                          scrollByContent,
                        }) as any;

                        const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                        viewModel.scrollableRef = scrollable.getDOMNode();

                        const scrollbars = scrollable.find(Scrollbar);
                        const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                        (e.originalEvent as any).target = target;

                        const initSettings = (scrollbarRef, index) => {
                          const scrollbar = scrollbarRef.at(index).instance();
                          scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                          scrollbar.initHandler = jest.fn();
                          scrollbar.moveHandler = jestMoveHandler;

                          return scrollbar;
                        };

                        expect(viewModel.validDirections).toEqual({});

                        if (direction === DIRECTION_VERTICAL) {
                          viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                        } else if (direction === DIRECTION_HORIZONTAL) {
                          viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        } else {
                          viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                          viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                        }

                        viewModel.initEffect();
                        emit('dxscrollinit', e);

                        viewModel.tryGetDevicePixelRatio = () => devicePixelRatio;

                        viewModel.moveEffect();
                        emit('dxscroll', e);

                        const isDirectionValid = scrollByContent || (scrollByThumb && targetClass !== 'dx-scrollable-container');

                        const expectedValidDirections = {
                          vertical: isDxWheelEvent
                            ? true
                            : direction !== DIRECTION_HORIZONTAL && isDirectionValid && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
                          horizontal: isDxWheelEvent
                            ? true
                            : direction !== DIRECTION_VERTICAL && isDirectionValid,
                        };

                        expect(e.preventDefault).toBeCalled();

                        const expectedDeltaX = initialDeltaX * expectedValidDirections.horizontal;
                        const expectedDeltaY = initialDeltaY * expectedValidDirections.vertical;

                        if (direction === 'both') {
                          expect(jestMoveHandler).toBeCalledTimes(2);
                          expect(jestMoveHandler)
                            .toHaveBeenNthCalledWith(1, e.delta);
                          expect(jestMoveHandler)
                            .toHaveBeenNthCalledWith(2, e.delta);
                        } else {
                          expect(jestMoveHandler).toBeCalledTimes(1);
                          expect(jestMoveHandler).toBeCalledWith(e.delta);
                        }

                        if (isDxWheelEvent && devicePixelRatio) {
                          expect(e.delta.x).toEqual(expectedDeltaX / devicePixelRatio);
                          expect(e.delta.y).toEqual(expectedDeltaY / devicePixelRatio);
                        } else {
                          expect(e.delta.x).toEqual(expectedDeltaX);
                          expect(e.delta.y).toEqual(expectedDeltaY);
                        }
                      });

                      it('should pass correct event param to endHandler', () => {
                        const initialVelocityX = 2.25;
                        const initialVelocityY = 5.24;

                        const e = {
                          ...defaultEvent,
                          velocity: { x: initialVelocityX, y: initialVelocityY },
                          originalEvent: {
                            type: isDxWheelEvent ? 'dxmousewheel' : undefined,
                          },
                        };

                        const jestEndHandler = jest.fn();
                        const onEndActionHandler = jest.fn();

                        const viewModel = new Scrollable({
                          direction,
                          scrollByThumb,
                          scrollByContent,
                          onEnd: onEndActionHandler,
                        }) as any;

                        const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                        viewModel.scrollableRef = scrollable.getDOMNode();

                        const scrollbars = scrollable.find(Scrollbar);
                        const target = scrollable.find(`.${targetClass}`).at(0).getDOMNode();
                        (e.originalEvent as any).target = target;

                        const initSettings = (scrollbarRef, index) => {
                          const scrollbar = scrollbarRef.at(index).instance();
                          scrollbar.scrollbarRef = scrollbarRef.at(index).getDOMNode();
                          scrollbar.initHandler = () => {};
                          scrollbar.endHandler = jestEndHandler;

                          return scrollbar;
                        };

                        expect(viewModel.validDirections).toEqual({});

                        if (direction === DIRECTION_VERTICAL) {
                          viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                        } else if (direction === DIRECTION_HORIZONTAL) {
                          viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        } else {
                          viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                          viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                        }

                        viewModel.initEffect();
                        emit('dxscrollinit', e);

                        viewModel.tryGetDevicePixelRatio = () => devicePixelRatio;
                        viewModel.getEventArgs = jest.fn();

                        viewModel.endEffect();
                        emit('dxscrollend', e);

                        const isDirectionValid = scrollByContent || (scrollByThumb && targetClass !== 'dx-scrollable-container');

                        const expectedValidDirections = {
                          vertical: isDxWheelEvent
                            ? true
                            : direction !== DIRECTION_HORIZONTAL && isDirectionValid && !(direction === 'both' && scrollByThumb && !scrollByContent && targetClass !== 'dx-scrollable-container'),
                          horizontal: isDxWheelEvent
                            ? true
                            : direction !== DIRECTION_VERTICAL && isDirectionValid,
                        };

                        const expectedDeltaX = initialVelocityX
                                    * expectedValidDirections.horizontal;
                        const expectedDeltaY = initialVelocityY * expectedValidDirections.vertical;

                        if (direction === 'both') {
                          expect(jestEndHandler).toBeCalledTimes(2);
                          expect(jestEndHandler)
                            .toHaveBeenNthCalledWith(1, e.velocity);
                          expect(jestEndHandler)
                            .toHaveBeenNthCalledWith(2, e.velocity);
                        } else {
                          expect(jestEndHandler).toBeCalledTimes(1);
                          expect(jestEndHandler).toBeCalledWith(e.velocity);
                        }

                        if (isDxWheelEvent && devicePixelRatio) {
                          expect(e.velocity.x)
                            .toEqual(Math.round((expectedDeltaX / devicePixelRatio) * 100) / 100);
                          expect(e.velocity.y)
                            .toEqual(Math.round((expectedDeltaY / devicePixelRatio) * 100) / 100);
                        } else {
                          expect(e.velocity.x).toEqual(expectedDeltaX);
                          expect(e.velocity.y).toEqual(expectedDeltaY);
                        }
                      });
                    });

                    it('should call endAction on dxscrollend event', () => {
                      const e = {
                        ...defaultEvent,
                        velocity: { x: 5.56, y: 4.5986 },
                        originalEvent: {
                          type: isDxWheelEvent ? 'dxmousewheel' : undefined,
                        },
                      };

                      const onEndActionHandler = jest.fn();
                      const viewModel = new Scrollable({
                        direction,
                        scrollByThumb,
                        scrollByContent,
                        onEnd: onEndActionHandler,
                      }) as any;

                      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                      const scrollbars = scrollable.find(Scrollbar);

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = scrollbars.at(0).instance();
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = scrollbars.at(0).instance();
                      } else {
                        viewModel.horizontalScrollbarRef = scrollbars.at(0).instance();
                        viewModel.verticalScrollbarRef = scrollbars.at(1).instance();
                      }

                      viewModel.adjustDistance = jest.fn();
                      viewModel.getEventArgs = jest.fn();

                      viewModel.endEffect();
                      emit('dxscrollend', e);

                      expect(onEndActionHandler).toBeCalledTimes(1);
                      expect(onEndActionHandler).toHaveBeenCalledWith(viewModel.getEventArgs());
                    });

                    it('should call stopHandler', () => {
                      const e = {
                        ...defaultEvent,
                        originalEvent: {
                          type: isDxWheelEvent ? 'dxmousewheel' : undefined,
                        },
                      };

                      const jestStopHandler = jest.fn();

                      const viewModel = new Scrollable({
                        direction,
                        scrollByThumb,
                        scrollByContent,
                      }) as any;

                      const scrollable = mount(viewFunction(viewModel) as JSX.Element);
                      viewModel.scrollableRef = scrollable.getDOMNode();

                      const scrollbars = scrollable.find(Scrollbar);

                      const initSettings = (scrollbarRef, index) => {
                        const scrollbar = scrollbarRef.at(index).instance();
                        scrollbar.stopHandler = jestStopHandler;

                        return scrollbar;
                      };

                      if (direction === DIRECTION_VERTICAL) {
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 0);
                      } else if (direction === DIRECTION_HORIZONTAL) {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                      } else {
                        viewModel.horizontalScrollbarRef = initSettings(scrollbars, 0);
                        viewModel.verticalScrollbarRef = initSettings(scrollbars, 1);
                      }

                      viewModel.stopEffect();
                      emit('dxscrollstop', e);

                      if (direction === 'both') {
                        expect(jestStopHandler).toBeCalledTimes(2);
                      } else {
                        expect(jestStopHandler).toBeCalledTimes(1);
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
                const initRefs = (model) => {
                  const viewModel = model as any;

                  viewModel.containerRef = React.createRef();
                  viewModel.contentRef = React.createRef();

                  const scrollable = mount(viewFunction(model as any) as JSX.Element);

                  viewModel.containerRef = viewModel.containerRef.current;
                  viewModel.contentRef = viewModel.contentRef.current;

                  if (Scrollable === ScrollableSimulated) {
                    const scrollbar = scrollable.find(Scrollbar);
                    if (direction === DIRECTION_VERTICAL) {
                      viewModel.verticalScrollbarRef = scrollbar.instance();
                      Object.assign(viewModel.verticalScrollbarRef,
                        { props: { contentSize, containerSize } });
                    } else if (direction === DIRECTION_HORIZONTAL) {
                      viewModel.horizontalScrollbarRef = scrollbar.instance();
                      Object.assign(viewModel.horizontalScrollbarRef,
                        { props: { contentSize, containerSize } });
                    } else {
                      viewModel.horizontalScrollbarRef = scrollbar.at(0).instance();
                      Object.assign(viewModel.horizontalScrollbarRef,
                        { props: { contentSize, containerSize } });
                      viewModel.verticalScrollbarRef = scrollbar.at(1).instance();
                      Object.assign(viewModel.verticalScrollbarRef,
                        { props: { contentSize, containerSize } });
                    }
                  }
                };

                const setScrollbarPosition = (scrollbar, position) => {
                  if (scrollbar
                    && contentSize > containerSize
                    && Math.abs(contentSize) > Math.abs(position)) {
                    // eslint-disable-next-line no-param-reassign
                    scrollbar.cachedVariables.location = position;
                  }
                };

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
                      const viewModel = new Scrollable({ direction }) as any;

                      viewModel.containerRef = containerRef;
                      viewModel.contentRef = contentRef;
                      const scrollable = mount(viewFunction(viewModel as any) as JSX.Element);

                      if (direction !== 'horizontal') {
                        const styles = scrollable.find('.dx-scrollbar-vertical .dx-scrollable-scroll').getElement().props.style;

                        expect(styles).toEqual({ height: 15 });
                      }
                      if (direction !== 'vertical') {
                        const styles = scrollable.find('.dx-scrollbar-horizontal .dx-scrollable-scroll').getElement().props.style;

                        expect(styles).toEqual({ width: 15 });
                      }

                      initStyles(viewModel.containerRef.current, containerSize);
                      initStyles(viewModel.contentRef.current, contentSize);

                      if (isScrollableRef) {
                        viewModel.scrollableRef = scrollable.getDOMNode();
                        initStyles(viewModel.scrollableRef, containerSize);
                        Object.defineProperty(viewModel.scrollableRef, 'offsetWidth', { configurable: true, value: containerSize });
                        Object.defineProperty(viewModel.scrollableRef, 'offsetHeight', { configurable: true, value: containerSize });
                      } else {
                        viewModel.getScaleRatio = () => 1;
                      }

                      viewModel.containerRef = viewModel.containerRef.current;
                      viewModel.contentRef = viewModel.contentRef.current;

                      // TODO: mockwindow
                      viewModel.effectUpdateScrollbarSize();

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
                        const viewModel = new Scrollable({ direction, bounceEnabled }) as any;
                        initRefs(viewModel);

                        initStyles(viewModel.containerRef, containerSize);
                        initStyles(viewModel.contentRef, contentSize);

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

                    if (Scrollable === ScrollableSimulated) {
                      each([true, false]).describe('Disabled: %o', (disabled) => {
                        each([true, false]).describe('IsLocked: %o', (locked) => {
                          each([true, false]).describe('ScrollByContent: %o', (scrollByContent) => {
                            each([true, false]).describe('IsScrollbarClicked: %o', (isScrollbarClicked) => {
                              each([-1, 1]).describe('Wheel delta: %o', (delta) => {
                                each([-100, 0]).describe('Scrollbar position: %o', (scrollbarPosition) => {
                                  it('validate method in simulated strategy', () => {
                                    const viewModel = new Scrollable({
                                      direction, bounceEnabled, disabled, scrollByContent,
                                    }) as any;

                                    initRefs(viewModel);

                                    initStyles((viewModel).containerRef, containerSize);
                                    initStyles((viewModel).contentRef, contentSize);

                                    setScrollbarPosition(viewModel.horizontalScrollbarRef,
                                      scrollbarPosition);
                                    setScrollbarPosition(viewModel.verticalScrollbarRef,
                                      scrollbarPosition);

                                    viewModel.cachedVariables.locked = locked;

                                    let expectedValidationResult;
                                    if (disabled || locked) {
                                      expectedValidationResult = false;
                                    } else if (bounceEnabled) {
                                      expectedValidationResult = true;
                                    } else if (isDxWheelEvent) {
                                      expectedValidationResult = (contentSize > containerSize)
                                                  && (
                                                    (scrollbarPosition < 0 && delta > 0)
                                                    || (scrollbarPosition >= 0 && delta < 0)
                                                  );
                                    } else if (!scrollByContent && !isScrollbarClicked) {
                                      expectedValidationResult = false;
                                    } else {
                                      expectedValidationResult = containerSize < contentSize
                                                  || bounceEnabled;
                                    }

                                    const target = isScrollbarClicked
                                      ? viewModel.containerRef.querySelector(`.${SCROLLABLE_SCROLLBAR_CLASS}`)
                                      : viewModel.containerRef;
                                    const e = { ...defaultEvent, target, delta };
                                    if (isDxWheelEvent) {
                                      (e as any).type = 'dxmousewheel';
                                    }

                                    expect(viewModel.cachedVariables.validateWheelTimer)
                                      .toBe(undefined);

                                    const actualResult = (viewModel).validate(e);
                                    expect(actualResult).toBe(expectedValidationResult);

                                    const isCheckedByTimeout = isDxWheelEvent
                                                && expectedValidationResult && !bounceEnabled;

                                    if (isCheckedByTimeout) {
                                      expect(viewModel.cachedVariables.validateWheelTimer)
                                        .not.toBe(undefined);

                                      e.delta = 0;
                                      expect((viewModel).validate(e)).toBe(true);
                                    }

                                    viewModel.disposeWheelTimer()();
                                    expect(viewModel.cachedVariables.validateWheelTimer)
                                      .toBe(undefined);
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

                                  initRefs(viewModel);

                                  initStyles((viewModel).containerRef, containerSize);
                                  initStyles((viewModel).contentRef, contentSize);
                                  viewModel.containerRef.scrollLeft = scrollLeft;
                                  viewModel.containerRef.scrollTop = scrollTop;
                                  viewModel.cachedVariables.locked = locked;

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

        each(['always', 'onHover', 'never', 'onScroll']).describe('HoverEffect params. showScrollbar: %o', (showScrollbarMode) => {
          if (Scrollable === ScrollableSimulated) {
            it('hoverEffect should update invisible class only for onHover mode', () => {
              const viewModel = new Scrollable({
                direction: 'horizontal',
                showScrollbar: showScrollbarMode,
              }) as ScrollableSimulated;

              const isScrollbarHasInvisibleClass = (model) => {
                const scrollable = mount(viewFunction(model) as JSX.Element);

                const scrollbar = scrollable.find('.dx-scrollable-scroll');
                return scrollbar.hasClass('dx-state-invisible');
              };

              expect(isScrollbarHasInvisibleClass(viewModel)).toBe(showScrollbarMode !== 'always');

              viewModel.cursorEnterHandler();
              expect(isScrollbarHasInvisibleClass(viewModel)).toBe(
                (showScrollbarMode !== 'always' && showScrollbarMode !== 'onHover'),
              );

              viewModel.cursorLeaveHandler();
              expect(isScrollbarHasInvisibleClass(viewModel)).toBe(showScrollbarMode !== 'always');
            });
          }
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
