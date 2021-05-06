import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';

import { RefObject } from '@devextreme-generator/declarations';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  Scrollbar,
  ScrollbarPropsType,
  viewFunction as ScrollbarComponent,
} from '../scrollbar';

import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, TopPocketState } from '../common/consts';

import {
  optionValues,
  getPermutations,
} from './utils';
import { ScrollbarProps } from '../scrollbar_props';

describe('Scrollbar', () => {
  it('render scrollbar with defaults', () => {
    const props = new ScrollbarProps();
    const viewModel = mount<Scrollbar>(<Scrollbar {...props} />);

    expect({ ...viewModel.props() }).toMatchObject({
      activeStateEnabled: false,
      bottomPocketSize: 0,
      containerSize: 0,
      contentSize: 0,
      forceUpdateScrollbarLocation: false,
      forceVisibility: false,
      isScrollableHovered: false,
      pocketState: 0,
      scrollLocation: 0,
      scrollableOffset: 0,
      topPocketSize: 0,
    });
  });

  describe('Styles', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each([...optionValues.direction, null, undefined]).describe('ShowScrollbar: %o', (showScrollbar) => {
        each([50, 100, 200]).describe('ContainerSize: %o', (containerSize) => {
          each([100, 200, 500]).describe('ContentSize: %o', (contentSize) => {
            each([-200, -64, -20, 0, 28, 100]).describe('ScrollLocation: %o', (scrollLocation) => {
              it('scrollStyles', () => {
                const viewModel = new Scrollbar({
                  showScrollbar,
                  direction,
                  containerSize,
                  contentSize,
                  scrollLocation,
                });

                const expectedScrollSize = Math.max(contentSize
                  ? containerSize * (containerSize / contentSize)
                  : containerSize * containerSize, 15);
                const expectedScrollTranslate = -scrollLocation
                * ((contentSize - containerSize)
                  ? (containerSize - expectedScrollSize) / (contentSize - containerSize)
                  : 1
                );

                // TODO: test with bottom & top
                expect(viewModel.scrollStyles).toEqual({
                  [direction === 'vertical' ? 'height' : 'width']: expectedScrollSize,
                  transform: direction === DIRECTION_VERTICAL ? `translate(0px, ${expectedScrollTranslate}px)` : `translate(${expectedScrollTranslate}px, 0px)`,
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Classes', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
        each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
          it('should add hoverable class to scrollbar', () => {
            const viewModel = new Scrollbar({ direction, scrollByThumb, showScrollbar });

            const needHoverableClass = (showScrollbar === 'onHover' || showScrollbar === 'always') && scrollByThumb;

            const scrollbar = mount(ScrollbarComponent(viewModel) as JSX.Element);

            if (needHoverableClass) {
              expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollbar-hoverable'));
              expect(scrollbar.find('.dx-scrollbar-hoverable').length).toBe(1);
            } else {
              expect(viewModel.cssClasses).toEqual(expect.not.stringMatching('dx-scrollbar-hoverable'));
              expect(scrollbar.find('.dx-scrollbar-hoverable').length).toBe(0);
            }
          });
        });

        it('hoverStart, hoverEnd handlers should update hovered state only for onHover mode', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar }) as any;

          expect(viewModel.hovered).toBe(false);

          viewModel.onHoverStart();
          expect(viewModel.hovered).toBe(showScrollbar === 'onHover');

          viewModel.onHoverEnd();
          expect(viewModel.hovered).toBe(false);
        });

        each([0, 0.2, 0.5, 1, 2]).describe('containerToContentRatio: %o', (containerToContentRatio) => {
          each([true, false]).describe('visibility: %o', (visibility) => {
            each([true, false]).describe('isScrollableHovered: %o', (isScrollableHovered) => {
              each([true, false]).describe('hovered: %o', (hovered) => {
                each([true, false, undefined]).describe('ShowOnScrollByWheel: %o', (showOnScrollByWheel) => {
                  it('scroll visibility', () => {
                    const viewModel = new Scrollbar({
                      direction,
                      showScrollbar,
                      isScrollableHovered,
                    });

                    viewModel.visibility = visibility;
                    viewModel.showOnScrollByWheel = showOnScrollByWheel;
                    viewModel.hovered = hovered;
                    Object.defineProperties(viewModel, {
                      containerToContentRatio: { get() { return containerToContentRatio; } },
                    });

                    const expectedScrollbarVisibility = showScrollbar !== 'never' && containerToContentRatio < 1;

                    expect(viewModel.isVisible).toEqual(expectedScrollbarVisibility);

                    let expectedScrollVisibility;

                    if (!expectedScrollbarVisibility) {
                      expectedScrollVisibility = false;
                    } else if (showScrollbar === 'onHover') {
                      expectedScrollVisibility = visibility || isScrollableHovered || hovered;
                    } else if (showScrollbar === 'always') {
                      expectedScrollVisibility = true;
                    } else {
                      expectedScrollVisibility = visibility || !!showOnScrollByWheel;
                    }

                    expect(viewModel.scrollClasses).toEqual(expectedScrollVisibility
                      ? expect.not.stringMatching('dx-state-invisible')
                      : expect.stringMatching('dx-state-invisible'));
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Effects', () => {
    beforeEach(clearEventHandlers);

    it('should subscribe to pointerDown event', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.scrollRef = {} as RefObject<HTMLDivElement>;
      scrollbar.expand = jest.fn();

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.expand).toHaveBeenCalledTimes(1);
    });

    it('pointerDownEffect should return unsubscribe callback', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.scrollRef = {} as RefObject<HTMLDivElement>;

      const detach = scrollbar.pointerDownEffect() as DisposeEffectReturn;

      expect(getEventHandlers('dxpointerdown').length).toBe(1);
      detach();
      expect(getEventHandlers('dxpointerdown').length).toBe(0);
    });

    it('Down & Up effects should add & remove scroll active class', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.scrollRef = {} as RefObject<HTMLDivElement>;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.expanded).toEqual(true);
      expect(scrollbar.cssClasses).toEqual(expect.stringMatching('dx-scrollable-scrollbar-active'));

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.expanded).toEqual(false);
      expect(scrollbar.cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbar-active'));
    });

    it('should subscribe to pointerUp event', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.collapse = jest.fn();

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.collapse).toHaveBeenCalledTimes(1);
    });

    it('pointerUpEffect should return unsubscribe callback', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.scrollRef = {} as RefObject<HTMLDivElement>;

      const detach = scrollbar.pointerUpEffect() as DisposeEffectReturn;

      expect(getEventHandlers('dxpointerup').length).toBe(1);
      detach();
      expect(getEventHandlers('dxpointerup').length).toBe(0);
    });

    each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
      each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
        each([0, 55, 85]).describe('initialTopPocketSize: %o', (initialTopPocketSize) => {
          it('updateContentTranslate(), should update content transform style when topPocket size was changed', () => {
            const topPocketSize = 85;

            const viewModel = new Scrollbar({
              showScrollbar: 'always',
              direction: 'vertical',
              topPocketSize,
              scrollLocation: -200,
              forceGeneratePockets,
              pullDownEnabled,
            });

            viewModel.initialTopPocketSize = initialTopPocketSize;
            viewModel.updateContent = jest.fn();

            viewModel.updateContentTranslate();

            if (forceGeneratePockets && pullDownEnabled && initialTopPocketSize !== topPocketSize) {
              expect(viewModel.updateContent).toHaveBeenCalledTimes(1);
              expect(viewModel.updateContent).toHaveBeenCalledWith(-200);
              expect(viewModel.initialTopPocketSize).toEqual(topPocketSize);
            } else {
              expect(viewModel.updateContent).not.toBeCalled();
              expect(viewModel.initialTopPocketSize).toEqual(viewModel.initialTopPocketSize);
            }
          });
        });
      });
    });
  });

  each([true, false]).describe('forceUpdateScrollbarLocation: %o', (forceUpdateScrollbarLocation) => {
    each([-100, -50, 0, 50]).describe('scrollLocation: %o', (scrollLocation) => {
      each([0, -80]).describe('initialTopPocketSize: %o', (maxOffset) => {
        it('moveToBoundaryOnSizeChange() should call moveTo(boundaryLocation)', () => {
          const topPocketSize = 85;

          const viewModel = new Scrollbar({
            showScrollbar: 'always',
            direction: 'vertical',
            topPocketSize,
            scrollLocation,
            forceUpdateScrollbarLocation,
          });

          Object.defineProperties(viewModel, {
            maxOffset: { get() { return maxOffset; } },
          });
          viewModel.moveTo = jest.fn();
          viewModel.boundLocation = jest.fn(() => -300);

          viewModel.moveToBoundaryOnSizeChange();

          if (forceUpdateScrollbarLocation && scrollLocation <= maxOffset) {
            expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
            expect(viewModel.moveTo).toHaveBeenCalledWith(-300);
          } else {
            expect(viewModel.moveTo).not.toBeCalled();
          }
        });
      });
    });
  });

  describe('Methods', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      it('updateContent(), should not raise any errors when position change events not defined', () => {
        const viewModel = new Scrollbar({
          showScrollbar: 'always',
          direction,
          scrollLocationChange: undefined,
          contentTranslateOffsetChange: undefined,
        });

        expect(viewModel.updateContent.bind(viewModel)).not.toThrow();
      });

      each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
        each(optionValues.bounceEnabled).describe('BounceEnabled: %o', (bounceEnabled) => {
          each([
            { eventData: { pageX: 50, pageY: 50 }, expected: bounceEnabled ? 60 : 0 },
            { eventData: { pageX: 150, pageY: 150 }, expected: -340 },
            { eventData: { pageX: 250, pageY: 250 }, expected: bounceEnabled ? -740 : -590 },
          ]).describe('ClickLocation: %o', (clickLocation) => {
            it('moveToMouseLocation(e)', () => {
              const viewModel = new Scrollbar({
                showScrollbar,
                direction,
                bounceEnabled,
                containerSize: 200,
                scrollableOffset: 40,
                scrollLocation: -250,
              });

              viewModel.moveTo = jest.fn();
              viewModel.maxOffset = 0;

              Object.defineProperties(viewModel, {
                minOffset: { get() { return -590; } },
                containerToContentRatio: { get() { return 0.25; } },
              });

              viewModel.moveToMouseLocation(clickLocation.eventData);
              // TODO
              expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
              expect(viewModel.moveTo).toHaveBeenCalledWith(clickLocation.expected);
            });
          });
        });

        each([
          { location: -500.25, expected: -100.25 },
          { location: -400, expected: 0 },
          { location: -100.25, expected: -0.25 },
          { location: -55.75, expected: -0.75 },
          { location: 0.25, expected: 0.25 },
          { location: 100.25, expected: 100.25 },
          { location: 500.25, expected: 500.25 },
        ]).describe('Location: %o', ({ location, expected }) => {
          each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
            each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
              it('updateContent(location) should change the transform style of content', () => {
                const topPocketSize = 85;
                const contentTranslateOffsetChange = jest.fn();

                const viewModel = new Scrollbar({
                  showScrollbar,
                  direction,
                  forceGeneratePockets,
                  contentTranslateOffsetChange,
                  pullDownEnabled,
                  topPocketSize,
                  scrollLocation: location,
                  containerSize: 100,
                  contentSize: 500,
                });

                const minOffset = -400;
                Object.defineProperties(viewModel, {
                  minOffset: { get() { return minOffset; } },
                });

                viewModel.updateContent(location);

                let expectedContentTranslate = expected;

                if (forceGeneratePockets && pullDownEnabled) {
                  expectedContentTranslate -= topPocketSize;
                }
                expect(contentTranslateOffsetChange).toHaveBeenCalledTimes(1);
                expect(contentTranslateOffsetChange)
                  .toHaveBeenCalledWith(viewModel.scrollProp, expectedContentTranslate);
              });

              it('moveTo(location) call should change position of content and scroll', () => {
                const scrollLocationChange = jest.fn();
                const topPocketSize = 85;

                const viewModel = new Scrollbar({
                  showScrollbar,
                  direction,
                  forceGeneratePockets,
                  pullDownEnabled,
                  scrollLocationChange,
                  topPocketSize,
                  scrollLocation: location,
                });

                viewModel.updateContent = jest.fn();
                viewModel.moveTo(location);

                expect(scrollLocationChange).toHaveBeenCalledTimes(1);
                expect(scrollLocationChange)
                  .toHaveBeenCalledWith(viewModel.fullScrollProp, location);
                expect(viewModel.updateContent).toHaveBeenCalledTimes(1);
                expect(viewModel.updateContent).toHaveBeenCalledWith(location);
              });
            });
          });
        });

        it('isScrollbar(element), element is scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
          viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

          expect(viewModel.isScrollbar(scrollbar.getDOMNode())).toBe(true);
        });

        it('isScrollbar(element), element is not scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
          viewModel.scrollbarRef = scrollbar.getDOMNode();

          expect(viewModel.isScrollbar(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollable scroll element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel) as JSX.Element);
          viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

          expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(true);
        });

        it('isThumb(element), element is scrollable scroll element other scrollbar', () => {
          const firstViewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const invertedDirection = direction === 'vertical' ? 'horizontal' : 'vertical';
          const secondViewModel = new Scrollbar({
            showScrollbar, direction: invertedDirection,
          } as ScrollbarPropsType) as any;

          const firstScrollbar = mount(ScrollbarComponent(firstViewModel) as JSX.Element);
          firstViewModel.scrollbarRef = firstScrollbar.getDOMNode();

          const secondScrollbar = mount(ScrollbarComponent(secondViewModel) as JSX.Element);

          expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollable content element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
          viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

          expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(true);
        });

        it('isThumb(element), element is scrollable content element other scrollbar', () => {
          const firstViewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const invertedDirection = direction === 'vertical' ? 'horizontal' : 'vertical';
          const secondViewModel = new Scrollbar({
            showScrollbar, direction: invertedDirection,
          } as ScrollbarPropsType) as any;

          const firstScrollbar = mount(ScrollbarComponent(firstViewModel) as JSX.Element);
          firstViewModel.scrollbarRef = firstScrollbar.getDOMNode();

          const secondScrollbar = mount(ScrollbarComponent(secondViewModel) as JSX.Element);

          expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
          viewModel.scrollbarRef = scrollbar.getDOMNode();
          expect(viewModel.isThumb(scrollbar.getDOMNode())).toBe(false);
        });
      });

      it('getMinOffset()', () => {
        const viewModel = new Scrollbar({ direction });

        Object.defineProperties(viewModel, { minOffset: { get() { return -200; } } });

        expect(viewModel.getMinOffset()).toBe(-200);
      });

      it('getMaxOffset()', () => {
        const viewModel = new Scrollbar({ direction });

        expect(viewModel.getMaxOffset()).toBe(0);
      });

      each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
        each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
          each([-100, 0, 100]).describe('boundaryOffset: %o', (boundaryOffset) => {
            it('isPullDown()', () => {
              const topPocketSize = 85;
              const bottomPocketSize = 55;

              const viewModel = new Scrollbar({
                direction,
                bounceEnabled,
                pullDownEnabled,
                topPocketSize,
                bottomPocketSize,
              });

              viewModel.boundaryOffset = boundaryOffset;

              if (pullDownEnabled && bounceEnabled && boundaryOffset >= 0) {
                expect(viewModel.isPullDown()).toBe(true);
              } else {
                expect(viewModel.isPullDown()).toBe(false);
              }
            });
          });
        });
      });

      each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
          each([-200, -500]).describe('minOffset: %o', (minOffset) => {
            each([-100, -300, -359.4, -359.6, -500]).describe('scrollLocation: %o', (scrollLocation) => {
              it('isReachBottom()', () => {
                const topPocketSize = 85;
                const bottomPocketSize = 55;

                const viewModel = new Scrollbar({
                  direction,
                  reachBottomEnabled,
                  pullDownEnabled,
                  topPocketSize,
                  bottomPocketSize,
                  scrollLocation,
                });

                Object.defineProperties(viewModel, {
                  minOffset: { get() { return minOffset; } },
                });

                if (reachBottomEnabled
                && (scrollLocation - minOffset - viewModel.bottomPocketSize) <= 0.5) {
                  expect(viewModel.isReachBottom()).toBe(true);
                } else {
                  expect(viewModel.isReachBottom()).toBe(false);
                }
              });
            });
          });
        });
      });

      each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
        each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
          each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
            it('minOffset()', () => {
              const viewModel = new Scrollbar({
                direction,
                forceGeneratePockets,
                reachBottomEnabled,
                bounceEnabled,
                bottomPocketSize: 55,
                topPocketSize: 80,
              });

              viewModel.boundLocation = jest.fn(() => -300);
              Object.defineProperties(viewModel, {
                bottomBoundaryOffset: { get() { return 300; } },
              });

              if (forceGeneratePockets && reachBottomEnabled) {
                expect(viewModel.minOffset).toEqual(-355);
              } else {
                expect(viewModel.minOffset).toEqual(-300);
              }
            });
          });
        });

        each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
          each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
            each([-50, 50, 100]).describe('scrollLocation: %o', (scrollLocation) => {
              it('updateBoundaryOffset()', () => {
                const viewModel = new Scrollbar({
                  direction,
                  forceGeneratePockets,
                  pullDownEnabled,
                  bounceEnabled,
                  bottomPocketSize: 55,
                  topPocketSize: 80,
                  scrollLocation,
                });

                viewModel.boundLocation = jest.fn(() => -300);
                viewModel.boundaryOffset = 10;

                viewModel.updateBoundaryOffset();

                if (forceGeneratePockets) {
                  if (pullDownEnabled) {
                    expect(viewModel.boundaryOffset).toEqual(scrollLocation - 80);
                  } else {
                    expect(viewModel.boundaryOffset).toEqual(scrollLocation);
                  }

                  if (scrollLocation === 100 && pullDownEnabled) {
                    expect(viewModel.maxOffset).toEqual(80);
                  } else {
                    expect(viewModel.maxOffset).toEqual(0);
                  }
                } else {
                  expect(viewModel.boundaryOffset).toEqual(10);
                  expect(viewModel.maxOffset).toEqual(0);
                }
              });
            });
          });
        });

        each([true, false]).describe('isReachBottom: %o', (isReachBottom) => {
          each([TopPocketState.STATE_RELEASED, TopPocketState.STATE_LOADING,
            TopPocketState.STATE_READY, TopPocketState.STATE_REFRESHING]).describe('pocketState: %o', (pocketState) => {
            each([true, false]).describe('isPullDown: %o', (isPullDown) => {
              it('set correct pocketState on content position change', () => {
                const pocketStateChangeHandler = jest.fn();
                const releaseHandler = jest.fn();

                const viewModel = new Scrollbar({
                  direction,
                  forceGeneratePockets,
                  pocketState,
                  onRelease: releaseHandler,
                  pocketStateChange: pocketStateChangeHandler,
                }) as any;

                viewModel.isPullDown = jest.fn(() => isPullDown);
                viewModel.isReachBottom = jest.fn(() => isReachBottom);

                viewModel.moveTo(1);

                if (forceGeneratePockets) {
                  if (isPullDown) {
                    if (pocketState !== 1) {
                      expect(pocketStateChangeHandler).toHaveBeenCalledTimes(1);
                      expect(pocketStateChangeHandler).toHaveBeenCalledWith(1);
                      return;
                    }
                  } else if (isReachBottom) {
                    if (pocketState !== 3) {
                      expect(pocketStateChangeHandler).toHaveBeenCalledTimes(1);
                      expect(pocketStateChangeHandler).toHaveBeenCalledWith(3);
                      return;
                    }
                  } else if (pocketState !== 0) {
                    expect(pocketStateChangeHandler).toHaveBeenCalledTimes(1);
                    expect(pocketStateChangeHandler).toHaveBeenCalledWith(0);
                    expect(releaseHandler).toHaveBeenCalledTimes(1);
                    return;
                  }
                }

                expect(pocketStateChangeHandler).not.toHaveBeenCalled();
              });
            });

            each([true, false]).describe('inBounds: %o', (inBounds) => {
              it('scrollComplete()', () => {
                const pullDownHandler = jest.fn();
                const reachBottomHandler = jest.fn();
                const pocketStateChangeHandler = jest.fn();

                const viewModel = new Scrollbar({
                  direction,
                  forceGeneratePockets,
                  pocketState,
                  onPullDown: pullDownHandler,
                  onReachBottom: reachBottomHandler,
                  pocketStateChange: pocketStateChangeHandler,
                } as any);

                viewModel.scrollToBounds = jest.fn();
                viewModel.inBounds = jest.fn(() => inBounds);
                viewModel.isReachBottom = jest.fn(() => isReachBottom);

                viewModel.scrollComplete();

                if (forceGeneratePockets) {
                  if (inBounds) {
                    if (pocketState === TopPocketState.STATE_READY) {
                      if (pocketState !== TopPocketState.STATE_REFRESHING) {
                        expect(pocketStateChangeHandler).toHaveBeenCalledTimes(1);
                        expect(pocketStateChangeHandler).toHaveBeenCalledWith(2);
                        expect(reachBottomHandler).not.toHaveBeenCalled();
                        expect(pullDownHandler).toHaveBeenCalledTimes(1);
                      } else {
                        expect(pocketStateChangeHandler).not.toHaveBeenCalled();
                        expect(reachBottomHandler).not.toHaveBeenCalled();
                        expect(pullDownHandler).not.toHaveBeenCalled();
                      }

                      return;
                    }
                    if (pocketState === TopPocketState.STATE_LOADING) {
                      expect(pocketStateChangeHandler).not.toHaveBeenCalled();
                      expect(reachBottomHandler).toHaveBeenCalledTimes(1);
                      expect(pullDownHandler).not.toHaveBeenCalled();
                      return;
                    }
                  }

                  expect(viewModel.scrollToBounds).toHaveBeenCalledTimes(1);
                }

                expect(pullDownHandler).not.toHaveBeenCalled();
                expect(reachBottomHandler).not.toHaveBeenCalled();
                expect(pocketStateChangeHandler).not.toHaveBeenCalled();
              });
            });
          });
        });
      });

      each([100, 200]).describe('ContainerSize: %o', (containerSize) => {
        each([0, 100, 200]).describe('ContentSize: %o', (contentSize) => {
          each([-20, 20, -80, 80, 120, -120]).describe('scrollLocation: %o', (scrollLocation) => {
            it('scrollBy({ x: 10, y: 15 })', () => {
              const delta = { x: 10, y: 15 };
              const OUT_BOUNDS_ACCELERATION = 0.5;

              const viewModel = new Scrollbar({
                direction,
                containerSize,
                contentSize,
                scrollLocation,
              });

              viewModel.scrollStep = jest.fn();

              viewModel.scrollBy(delta);

              const axis = direction === 'horizontal' ? 'x' : 'y';

              expect(viewModel.scrollStep).toBeCalledTimes(1);

              if ((containerSize - contentSize) < scrollLocation && scrollLocation < 0) {
                expect(viewModel.scrollStep).toBeCalledWith(delta[axis]);
              } else {
                expect(viewModel.scrollStep).toBeCalledWith(delta[axis] * OUT_BOUNDS_ACCELERATION);
              }
            });
          });
        });
      });
    });
  });

  describe('Getters', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      it('axis()', () => {
        const viewModel = new Scrollbar({ direction });

        expect((viewModel as any).axis).toBe(direction === 'horizontal' ? 'x' : 'y');
      });

      it('prop()', () => {
        const viewModel = new Scrollbar({ direction });

        expect((viewModel as any).scrollProp).toBe(direction === 'horizontal' ? 'left' : 'top');
      });

      each([optionValues.pullDownEnabled]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
        it('topPocketSize()', () => {
          const viewModel = new Scrollbar({ direction, pullDownEnabled, topPocketSize: 30 });

          expect((viewModel as any).topPocketSize).toBe(pullDownEnabled ? 30 : 0);
        });
      });

      each([optionValues.reachBottomEnabled]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        it('bottomPocketSize()', () => {
          const viewModel = new Scrollbar({ direction, reachBottomEnabled, bottomPocketSize: 30 });

          expect((viewModel as any).bottomPocketSize).toBe(reachBottomEnabled ? 30 : 0);
        });
      });

      each([0, 200]).describe('contentSize: %o', (contentSize) => {
        each([0, 55]).describe('bottomPocketSize: %o', (bottomPocketSize) => {
          each([0, 80]).describe('topPocketSize: %o', (topPocketSize) => {
            it('contentSize()', () => {
              const viewModel = new Scrollbar({
                direction,
                contentSize,
              });

              Object.defineProperties(viewModel, {
                bottomPocketSize: { get() { return bottomPocketSize; } },
                topPocketSize: { get() { return topPocketSize; } },
              });

              let expectedContentSize = 0;

              if (contentSize) {
                expectedContentSize = contentSize - bottomPocketSize - topPocketSize;
              }

              expect(viewModel.contentSize).toEqual(expectedContentSize);
            });
          });
        });
      });

      each([0, 100, 200, 500]).describe('containerSize: %o', (containerSize) => {
        each([0, 100, 150, 500]).describe('contentSize: %o', (contentSize) => {
          it('containerToContentRatio()', () => {
            const viewModel = new Scrollbar({
              direction,
              contentSize,
              containerSize,
            });

            let expectedContainerToContentRatio = containerSize;

            if (contentSize) {
              expectedContainerToContentRatio = containerSize / contentSize;
            }

            expect(viewModel.containerToContentRatio).toEqual(expectedContainerToContentRatio);
          });
        });
      });
    });
  });

  describe('Handlers', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      it('releaseHandler()', () => {
        const releaseHandler = jest.fn();
        const pocketStateChangeHandler = jest.fn();

        const viewModel = new Scrollbar({
          direction,
          onRelease: releaseHandler,
          pocketStateChange: pocketStateChangeHandler,
        });

        viewModel.scrollComplete = jest.fn();

        viewModel.releaseHandler();

        expect(viewModel.scrollComplete).toHaveBeenCalledTimes(1);
        expect(pocketStateChangeHandler).toHaveBeenCalledTimes(1);
        expect(pocketStateChangeHandler).toHaveBeenCalledWith(0);
        expect(releaseHandler).toHaveBeenCalledTimes(1);
      });

      each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
        it('should start inertia animator on end', () => {
          const onAnimatorStart = jest.fn();
          const velocity = { x: 10, y: 20 };
          const e = { ...defaultEvent, velocity };
          const viewModel = new Scrollbar({ direction, onAnimatorStart });

          viewModel.thumbScrolling = thumbScrolling;
          viewModel.crossThumbScrolling = true;

          viewModel.endHandler(e.velocity);

          expect(onAnimatorStart).toHaveBeenCalledTimes(1);
          expect(onAnimatorStart).toHaveBeenCalledWith('inertia', velocity[viewModel.axis], thumbScrolling, true);
          expect(viewModel.thumbScrolling).toEqual(false);
          expect(viewModel.crossThumbScrolling).toEqual(false);
        });
      });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        [true, false],
        optionValues.scrollByThumb,
        ['dx-scrollable-scroll', 'dx-scrollable-scrollbar'],
        optionValues.showScrollbar,
      ]))('initHandler(e, crossThumbScrolling), isDxWheelEvent: %o, crossThumbScrolling: %o, scrollByThumb: %o, targetClass: %, showScrollbar: %o',
        (isDxWheelEvent, crossThumbScrolling, scrollByThumb, targetClass, showScrollbar) => {
          const onAnimatorCancel = jest.fn();
          const e = { ...defaultEvent, originalEvent: {} };
          if (isDxWheelEvent) {
            (e as any).originalEvent.type = 'dxmousewheel';
          }

          const viewModel = new Scrollbar({
            direction,
            showScrollbar,
            scrollByThumb,
            onAnimatorCancel,
          });

          const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);

          viewModel.moveToMouseLocation = jest.fn();
          (e.originalEvent as any).target = scrollbar.find(`.${targetClass}`).getDOMNode();
          (viewModel as any).scrollbarRef = { current: scrollbar.getDOMNode() };

          viewModel.initHandler(e, crossThumbScrolling);

          const isScrollbarClicked = (targetClass !== 'dx-scrollable-scroll' && scrollByThumb);

          let expectedShowOnScrollByWheel;
          let expectedThumbScrolling = false;
          let expectedCrossThumbScrolling = crossThumbScrolling;

          if (isDxWheelEvent || !isScrollbarClicked) {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
          } else {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(1);
            expect(viewModel.moveToMouseLocation).toHaveBeenCalledWith(e);
          }

          if (isDxWheelEvent) {
            expectedThumbScrolling = false;
            expectedCrossThumbScrolling = false;

            if (showScrollbar === 'onScroll') {
              expectedShowOnScrollByWheel = true;
            }
          } else {
            expectedThumbScrolling = isScrollbarClicked || (scrollByThumb && targetClass === 'dx-scrollable-scroll');
            expectedCrossThumbScrolling = !expectedThumbScrolling && crossThumbScrolling;
            expectedShowOnScrollByWheel = undefined;
          }

          expect(viewModel.showOnScrollByWheel).toEqual(expectedShowOnScrollByWheel);
          expect(viewModel.thumbScrolling).toEqual(expectedThumbScrolling);
          expect(viewModel.crossThumbScrolling).toEqual(expectedCrossThumbScrolling);
          expect(onAnimatorCancel).toHaveBeenCalledTimes(1);
          expect(viewModel.visibility).toEqual(false);
        });

      it('change visibility scrollbar state on scrollstart', () => {
        const viewModel = new Scrollbar({ direction } as ScrollbarPropsType);

        viewModel.startHandler();

        expect(viewModel.visibility).toBe(true);
      });

      test.each(optionValues.showScrollbar)('change visibility scrollbar on hide(), showScrollbar: %o,', (showScrollbar) => {
        jest.clearAllTimers();
        jest.useFakeTimers();

        const viewModel = new Scrollbar({
          direction,
          showScrollbar,
        } as ScrollbarPropsType);
        viewModel.showOnScrollByWheel = true;

        viewModel.hide();

        if (showScrollbar === 'onScroll') {
          expect(setTimeout).toHaveBeenCalledTimes(1);
          expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
        }

        jest.runOnlyPendingTimers();

        if (showScrollbar === 'onScroll') {
          expect(viewModel.showOnScrollByWheel).toEqual(undefined);
        } else {
          expect(viewModel.showOnScrollByWheel).toEqual(true);
        }
      });

      test.each([true, false])('scrollByHandler(delta), inBounds: %o,', (inBounds) => {
        const onInertiaAnimatorStart = jest.fn();
        const delta = { x: 50, y: 70 };
        const viewModel = new Scrollbar({
          direction,
          onAnimatorStart: onInertiaAnimatorStart,
        });

        viewModel.scrollBy = jest.fn();
        viewModel.inBounds = () => inBounds;

        viewModel.scrollByHandler(delta);

        expect(viewModel.scrollBy).toBeCalledTimes(1);
        expect(viewModel.scrollBy).toHaveBeenCalledWith(delta);

        if (inBounds) {
          expect(onInertiaAnimatorStart).toHaveBeenCalledTimes(0);
        } else {
          expect(onInertiaAnimatorStart).toHaveBeenCalledTimes(1);
          expect(onInertiaAnimatorStart).toHaveBeenCalledWith('bounce');
        }
      });

      each([true, false]).describe('CrossThumbScrolling: %o', (crossThumbScrolling) => {
        each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
          each([true, false]).describe('inBound: %o', (inBounds) => {
            it('stopHandler()', () => {
              const onBounceAnimatorStartHandler = jest.fn();

              const viewModel = new Scrollbar({
                direction,
                onAnimatorStart: onBounceAnimatorStartHandler,
              });

              viewModel.thumbScrolling = thumbScrolling;
              viewModel.crossThumbScrolling = true;
              viewModel.inBounds = () => inBounds;
              viewModel.stopHandler();

              expect(viewModel.thumbScrolling).toEqual(false);
              expect(viewModel.crossThumbScrolling).toEqual(false);

              if (!inBounds) {
                expect(onBounceAnimatorStartHandler).toHaveBeenCalledTimes(1);
                expect(onBounceAnimatorStartHandler).toHaveBeenCalledWith('bounce');
              }
            });
          });

          each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
            each([{ x: 30, y: 35 }, { x: 10, y: 40 }]).describe('Event.Delta: %o', (delta) => {
              each([0, 0.2, 0.5, 1]).describe('containerToContentRatio: %o', (containerToContentRatio) => {
                it('moveHandler(e.delta)', () => {
                  const viewModel = new Scrollbar({
                    direction,
                    scrollByThumb,
                  } as ScrollbarPropsType);

                  mount(ScrollbarComponent(viewModel as any) as JSX.Element);

                  viewModel.scrollBy = jest.fn();
                  Object.defineProperties(viewModel, {
                    containerToContentRatio: { get() { return containerToContentRatio; } },
                  });

                  viewModel.thumbScrolling = thumbScrolling;
                  viewModel.crossThumbScrolling = crossThumbScrolling;

                  viewModel.moveHandler(delta);

                  if (crossThumbScrolling) {
                    expect(viewModel.scrollBy).toBeCalledTimes(0);
                    return;
                  }

                  const expectedDelta = delta;
                  if (thumbScrolling) {
                    const axis = direction === 'horizontal' ? 'x' : 'y';
                    expectedDelta[axis] = -expectedDelta[axis] / containerToContentRatio;
                  }

                  expect(viewModel.scrollBy).toBeCalledTimes(1);
                  expect(viewModel.scrollBy).toHaveBeenCalledWith(expectedDelta);
                });
              });
            });
          });
        });
      });
    });
  });

  describe('Action handlers', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      each([undefined, jest.fn()]).describe('handler: %o', (actionHandler) => {
        it('onInertiaAnimatorStart()', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar: 'always', onAnimatorStart: actionHandler });

          const velocity = 0.15;
          viewModel.thumbScrolling = true;
          viewModel.crossThumbScrolling = false;

          viewModel.onInertiaAnimatorStart(velocity);

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith('inertia', 0.15, true, false);
          }
        });

        it('onBounceAnimatorStart()', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar: 'always', onAnimatorStart: actionHandler });

          viewModel.thumbScrolling = true;
          viewModel.crossThumbScrolling = false;

          viewModel.onBounceAnimatorStart();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith('bounce');
          }
        });

        it('onAnimatorCancel()', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar: 'always', onAnimatorCancel: actionHandler });

          viewModel.onAnimatorCancel();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
          }
        });

        it('onRelease()', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar: 'always', onRelease: actionHandler });

          viewModel.onRelease();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
          }
        });

        it('setPocketState(state)', () => {
          const viewModel = new Scrollbar({
            showScrollbar: 'always',
            direction,
            pocketStateChange: actionHandler,
          } as ScrollbarPropsType) as any;

          viewModel.setPocketState(TopPocketState.STATE_REFRESHING);

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith(TopPocketState.STATE_REFRESHING);
          }
        });

        it('onPullDown()', () => {
          const viewModel = new Scrollbar({
            showScrollbar: 'always',
            direction,
            onPullDown: actionHandler,
          } as ScrollbarPropsType) as any;

          viewModel.onPullDown();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
          }
        });

        it('onReachBottom()', () => {
          const viewModel = new Scrollbar({
            showScrollbar: 'always',
            direction,
            onReachBottom: actionHandler,
          } as ScrollbarPropsType) as any;

          viewModel.onReachBottom();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
          }
        });
      });
    });
  });
});
