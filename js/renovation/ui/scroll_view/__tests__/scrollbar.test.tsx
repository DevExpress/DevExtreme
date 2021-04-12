import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';

import { RefObject } from '@devextreme-generator/declarations';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  Scrollbar,
  viewFunction as ScrollbarComponent,
} from '../scrollbar';

import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, TopPocketState } from '../common/consts';
import { ScrollbarProps } from '../scrollbar_props';

import {
  optionValues,
} from './utils';

describe('TopPocket', () => {
  it('render scrollbar with defaults', () => {
    const props = new ScrollbarProps();
    const scrollable = mount<Scrollbar>(<Scrollbar {...props} />);

    expect(scrollable.props()).toEqual({
      activeStateEnabled: false,
      baseContainerSize: 0,
      baseContentSize: 0,
      bottomPocketSize: 0,
      bounceEnabled: true,
      containerSize: 0,
      contentSize: 0,
      direction: 'vertical',
      expandable: true,
      forceGeneratePockets: false,
      forceVisibility: false,
      isScrollableHovered: false,
      needScrollViewContentWrapper: false,
      needScrollViewLoadPanel: false,
      pocketState: 0,
      pullDownEnabled: false,
      reachBottomEnabled: false,
      scaleRatio: 1,
      scrollByContent: true,
      scrollByThumb: false,
      scrollableOffset: 0,
      showScrollbar: 'onScroll',
      topPocketSize: 0,
      useKeyboard: true,
    });
  });

  describe('Styles', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each(['never', 'always', 'onScroll', 'onHover', null, undefined]).describe('ShowScrollbar: %o', (showScrollbar) => {
        each([100, 200]).describe('ContainerSize: %o', (containerSize) => {
          each([100, 200]).describe('ContentSize: %o', (contentSize) => {
            it('Should assign styles', () => {
              const scrollbar = new Scrollbar({
                showScrollbar,
                direction,
                containerSize,
                contentSize,
                scaleRatio: 1,
              });

              const { scrollStyles } = scrollbar;

              const expectedSize = contentSize
                ? containerSize * (containerSize / contentSize)
                : containerSize * containerSize;
              expect(scrollStyles).toHaveProperty(direction === 'vertical' ? 'height' : 'width', `${expectedSize}px`);
              expect(scrollStyles).toHaveProperty(direction === 'vertical' ? 'width' : 'height', undefined);
            });
          });
        });
      });
    });
  });

  describe('Classes', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (showScrollbar) => {
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

        each([0, 100, 500]).describe('BaseContainerSize: %o', (baseContainerSize) => {
          each([0, 100, 500]).describe('BaseContentSize: %o', (baseContentSize) => {
            each([true, false]).describe('Visibility: %o', (visibility) => {
              each([true, false]).describe('isScrollableHovered: %o', (isScrollableHovered) => {
                each([true, false]).describe('ScrollbarHovered: %o', (hovered) => {
                  each([true, false, undefined]).describe('ShowOnScrollByWheel: %o', (showOnScrollByWheel) => {
                    it('scrollbar & scroll visibility', () => {
                      const viewModel = new Scrollbar({
                        direction,
                        showScrollbar,
                        baseContainerSize,
                        baseContentSize,
                        isScrollableHovered,
                      });

                      viewModel.visibility = visibility;
                      viewModel.showOnScrollByWheel = showOnScrollByWheel;
                      viewModel.hovered = hovered;

                      const baseRatio = (baseContentSize
                        ? baseContainerSize / baseContentSize
                        : baseContainerSize
                      );

                      const expectedScrollbarVisibility = showScrollbar !== 'never' && baseRatio < 1;

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
  });
});

describe('Methods', () => {
  each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
    each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
      it('updateContent(), should not raise any errors when position change events not defined', () => {
        const viewModel = new Scrollbar({
          showScrollbar,
          direction,
          contentPositionChange: undefined,
          contentTranslateOffsetChange: undefined,
        });

        expect(viewModel.updateContent.bind(viewModel)).not.toThrow();
      });

      each([1, 0.5]).describe('ScaleRatio: %o', (scaleRatio) => {
        it('moveScrollbar(location) call should set correct location & scrollLocation values', () => {
          const viewModel = new Scrollbar({
            showScrollbar,
            direction,
            scaleRatio,
            containerSize: 100,
            contentSize: 500,
          });

          const location = -100;

          viewModel.moveScrollbar(location);

          const expectedLocation = location * scaleRatio;
          expect(viewModel.scrollLocation).toEqual(expectedLocation);
        });

        it('moveScrollbar() call should set correct location & scrollLocation values', () => {
          const viewModel = new Scrollbar({
            showScrollbar,
            direction,
            scaleRatio,
            containerSize: 100,
            contentSize: 500,
          });

          viewModel.scrollLocation = -20;

          viewModel.moveScrollbar();

          const expectedLocation = -20;
          expect(viewModel.scrollLocation).toEqual(expectedLocation);
          expect(viewModel.scrollLocation).toEqual(expectedLocation);
        });

        each([-500.25, -400, -100.25, 0.25, 100.25, 500.25]).describe('Location: %o', (location) => {
          each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
            each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
              it('updateContent() call should change position of content and scroll', () => {
                const contentPositionChange = jest.fn();
                const contentTranslateOffsetChange = jest.fn();
                const topPocketSize = 85;

                const viewModel = new Scrollbar({
                  showScrollbar,
                  direction,
                  scaleRatio,
                  forceGeneratePockets,
                  pullDownEnabled,
                  contentPositionChange,
                  contentTranslateOffsetChange,
                  topPocketSize,
                });

                const minOffset = -400;
                Object.defineProperties(viewModel, {
                  minOffset: { get() { return minOffset; } },
                });

                viewModel.scrollLocation = location;

                viewModel.updateContent();

                expect(contentPositionChange).toHaveBeenCalledTimes(1);
                expect(contentPositionChange)
                  .toHaveBeenCalledWith(viewModel.fullScrollProp, location, scaleRatio);

                let expectedContentTranslate = 0;
                if (location > 0) {
                  expectedContentTranslate = location;
                } else if (location <= minOffset) {
                  expectedContentTranslate = location - minOffset;
                } else {
                  expectedContentTranslate = location % 1;
                }

                if (forceGeneratePockets && pullDownEnabled) {
                  expectedContentTranslate -= topPocketSize;
                }

                expect(contentTranslateOffsetChange).toHaveBeenCalledTimes(1);
                expect(contentTranslateOffsetChange)
                  .toHaveBeenCalledWith({ [viewModel.scrollProp]: expectedContentTranslate });
              });
            });
          });
        });
      });

      it('isScrollbar(element), element is scrollbar element', () => {
        const viewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

        const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
        viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

        expect(viewModel.isScrollbar(scrollbar.getDOMNode())).toBe(true);
      });

      it('isScrollbar(element), element is not scrollbar element', () => {
        const viewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

        const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
        viewModel.scrollbarRef = scrollbar.getDOMNode();

        expect(viewModel.isScrollbar(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
      });

      it('isThumb(element), element is scrollable scroll element', () => {
        const viewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

        const scrollbar = mount(ScrollbarComponent(viewModel) as JSX.Element);
        viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

        expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(true);
      });

      it('isThumb(element), element is scrollable scroll element other scrollbar', () => {
        const firstViewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

        const invertedDirection = direction === 'vertical' ? 'horizontal' : 'vertical';
        const secondViewModel = new Scrollbar({
          showScrollbar, direction: invertedDirection,
        } as ScrollbarProps) as any;

        const firstScrollbar = mount(ScrollbarComponent(firstViewModel) as JSX.Element);
        firstViewModel.scrollbarRef = firstScrollbar.getDOMNode();

        const secondScrollbar = mount(ScrollbarComponent(secondViewModel) as JSX.Element);

        expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
      });

      it('isThumb(element), element is scrollable content element', () => {
        const viewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

        const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);
        viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

        expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(true);
      });

      it('isThumb(element), element is scrollable content element other scrollbar', () => {
        const firstViewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

        const invertedDirection = direction === 'vertical' ? 'horizontal' : 'vertical';
        const secondViewModel = new Scrollbar({
          showScrollbar, direction: invertedDirection,
        } as ScrollbarProps) as any;

        const firstScrollbar = mount(ScrollbarComponent(firstViewModel) as JSX.Element);
        firstViewModel.scrollbarRef = firstScrollbar.getDOMNode();

        const secondScrollbar = mount(ScrollbarComponent(secondViewModel) as JSX.Element);

        expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(false);
      });

      it('isThumb(element), element is scrollbar element', () => {
        const viewModel = new Scrollbar({
          showScrollbar, direction,
        } as ScrollbarProps) as any;

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

    it('get axis()', () => {
      const viewModel = new Scrollbar({ direction });

      expect((viewModel as any).axis).toBe(direction === 'horizontal' ? 'x' : 'y');
    });

    it('get prop()', () => {
      const viewModel = new Scrollbar({ direction });

      expect((viewModel as any).scrollProp).toBe(direction === 'horizontal' ? 'left' : 'top');
    });

    each([true, false]).describe('pullDownEnabled: %o', (pullDownEnabled) => {
      it('get topPocketSize()', () => {
        const viewModel = new Scrollbar({ direction, pullDownEnabled, topPocketSize: 30 });

        expect((viewModel as any).topPocketSize).toBe(pullDownEnabled ? 30 : 0);
      });

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

            if (pullDownEnabled
          && bounceEnabled && boundaryOffset >= 0) {
              expect(viewModel.isPullDown()).toBe(true);
            } else {
              expect(viewModel.isPullDown()).toBe(false);
            }
          });
        });
      });
    });

    each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
      it('get reachBottomEnabled()', () => {
        const viewModel = new Scrollbar({ direction, reachBottomEnabled, bottomPocketSize: 30 });

        expect((viewModel as any).bottomPocketSize).toBe(reachBottomEnabled ? 30 : 0);
      });

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
              });

              viewModel.minOffset = minOffset;
              viewModel.scrollLocation = scrollLocation;

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

    each([1, 0.5]).describe('ScaleRatio: %o', (scaleRatio) => {
      it('moveScrollbar()', () => {
        const viewModel = new Scrollbar({ direction, scaleRatio }) as any;
        viewModel.scrollLocation = 40;

        viewModel.moveScrollbar();

        expect(viewModel.getScrollLocation()).toBe(40);
      });

      it('moveScrollbar(50)', () => {
        const viewModel = new Scrollbar({ direction, scaleRatio }) as any;
        viewModel.scrollLocation = 40;

        viewModel.moveScrollbar(50);

        expect(viewModel.getScrollLocation()).toBe(50 * scaleRatio);
      });
    });

    each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
      each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
          it('updateMinOffset()', () => {
            const viewModel = new Scrollbar({
              direction,
              forceGeneratePockets,
              reachBottomEnabled,
              bounceEnabled,
              bottomPocketSize: 55,
              topPocketSize: 80,
            });

            viewModel.boundLocation = jest.fn(() => -300);
            viewModel.minOffset = -300;
            Object.defineProperties(viewModel, {
              bottomBoundaryOffset: { get() { return 300; } },
            });

            viewModel.updateMinOffset();

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
              });

              viewModel.boundLocation = jest.fn(() => -300);
              viewModel.scrollLocation = scrollLocation;
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
        it('getScrollLocation()', () => {
          const viewModel = new Scrollbar({
            direction,
            forceGeneratePockets,
            reachBottomEnabled: true,
          } as any);

          viewModel.isReachBottom = jest.fn(() => isReachBottom);
          viewModel.boundaryOffset = -100;
          viewModel.scrollLocation = -15;

          expect(viewModel.getScrollLocation()).toEqual(-15);
        });

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

              viewModel.moveScrollbar();

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
        each([-20, 20, -80, 80, 120, -120]).describe('Location: %o', (location) => {
          it('scrollBy({ x: 10, y: 15 })', () => {
            const delta = { x: 10, y: 15 };
            const OUT_BOUNDS_ACCELERATION = 0.5;

            const viewModel = new Scrollbar({
              direction,
              containerSize,
              contentSize,
            });

            viewModel.scrollLocation = location;
            viewModel.scrollStep = jest.fn();

            viewModel.updateMinOffset();
            viewModel.scrollBy(delta);

            const axis = direction === 'horizontal' ? 'x' : 'y';

            expect(viewModel.scrollStep).toBeCalledTimes(1);

            if ((containerSize - contentSize) < location && location < 0) {
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
      each([undefined, jest.fn()]).describe('onInertiaAnimatorStart: %o', (onAnimatorStartHandler) => {
        it('should start inertia animator on end', () => {
          const velocity = { x: 10, y: 20 };
          const e = { ...defaultEvent, velocity };
          const viewModel = new Scrollbar({ direction, onAnimatorStart: onAnimatorStartHandler });

          viewModel.thumbScrolling = thumbScrolling;
          viewModel.crossThumbScrolling = true;

          viewModel.endHandler(e.velocity);

          if (onAnimatorStartHandler) {
            expect(onAnimatorStartHandler).toHaveBeenCalledTimes(1);
            expect(onAnimatorStartHandler).toHaveBeenCalledWith('inertia', velocity[viewModel.axis], thumbScrolling, true);
          }
          expect(viewModel.thumbScrolling).toEqual(false);
          expect(viewModel.crossThumbScrolling).toEqual(false);
        });
      });
    });

    each([true, false]).describe('CrossThumbScrolling: %o', (crossThumbScrolling) => {
      it('should stop animator on init', () => {
        const onAnimatorCancel = jest.fn();
        const e = { ...defaultEvent };
        const viewModel = new Scrollbar({ direction, onAnimatorCancel });

        viewModel.prepareThumbScrolling = jest.fn();

        viewModel.initHandler(e, true);

        expect(onAnimatorCancel).toHaveBeenCalledTimes(1);
        expect(viewModel.visibility).toEqual(false);
      });

      each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
        each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
          each(['dx-scrollable-scroll', 'dx-scrollable-scrollbar']).describe('Event target: %o', (targetClass) => {
            each([optionValues.showScrollbar]).describe('ShowScrollbar: %o', (showScrollbar) => {
              it('initHandler(e, crossThumbScrolling)', () => {
                const e = { ...defaultEvent, originalEvent: {} };
                if (isDxWheelEvent) {
                  (e as any).originalEvent.type = 'dxmousewheel';
                }

                const viewModel = new Scrollbar({
                  direction,
                  showScrollbar,
                  scrollByThumb,
                } as ScrollbarProps);

                const scrollbar = mount(ScrollbarComponent(viewModel as any) as JSX.Element);

                viewModel.moveToMouseLocation = jest.fn();

                (e.originalEvent as any).target = scrollbar.find(`.${targetClass}`).getDOMNode();
                (viewModel as any).scrollbarRef = { current: scrollbar.getDOMNode() };
                viewModel.initHandler(e, crossThumbScrolling);

                const isScrollbarClicked = (targetClass !== 'dx-scrollable-scroll' && scrollByThumb);

                if (isDxWheelEvent || !isScrollbarClicked) {
                  expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
                } else {
                  expect(viewModel.moveToMouseLocation).toBeCalledTimes(1);
                  expect(viewModel.moveToMouseLocation).toHaveBeenCalledWith(e);
                }

                if (isDxWheelEvent) {
                  expect(viewModel.thumbScrolling).toBe(false);
                  expect(viewModel.crossThumbScrolling).toBe(false);

                  if (showScrollbar === 'onScroll') {
                    expect(viewModel.showOnScrollByWheel).toBe(true);
                  }
                } else {
                  const expectedThumbScrolling = isScrollbarClicked || (scrollByThumb && targetClass === 'dx-scrollable-scroll');

                  expect(viewModel.thumbScrolling).toBe(expectedThumbScrolling);
                  expect(viewModel.crossThumbScrolling)
                    .toBe(!expectedThumbScrolling && crossThumbScrolling);

                  expect(viewModel.showOnScrollByWheel).toBe(undefined);
                }
              });
            });
          });
        });

        it('change visibility scrollbar state on scrollstart', () => {
          const viewModel = new Scrollbar({ direction } as ScrollbarProps);

          viewModel.startHandler();

          expect(viewModel.visibility).toBe(true);
        });

        each([true, false]).describe('inBound: %o', (inBounds) => {
          it('scrollByHandler(delta)', () => {
            const onInertiaAnimatorStart = jest.fn();
            const delta = { x: 50, y: 70 };
            const viewModel = new Scrollbar({
              direction,
              onAnimatorStart: onInertiaAnimatorStart,
            });

            (viewModel as any).scrollBy = jest.fn();
            (viewModel as any).inBounds = () => inBounds;

            viewModel.scrollByHandler(delta);

            expect((viewModel as any).scrollBy).toBeCalledTimes(1);
            expect((viewModel as any).scrollBy).toHaveBeenCalledWith(delta);

            if (inBounds) {
              expect(onInertiaAnimatorStart).toHaveBeenCalledTimes(0);
            } else {
              expect(onInertiaAnimatorStart).toHaveBeenCalledTimes(1);
              expect(onInertiaAnimatorStart).toHaveBeenCalledWith('bounce');
            }
          });

          each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
            it('stopHandler()', () => {
              const onBounceAnimatorStartHandler = jest.fn();

              const viewModel = new Scrollbar({
                direction,
                onAnimatorStart: onBounceAnimatorStartHandler,
              });

              viewModel.thumbScrolling = thumbScrolling;
              viewModel.crossThumbScrolling = true;

              (viewModel as any).inBounds = () => inBounds;
              (viewModel as any).bounceAnimator = undefined;

              viewModel.stopHandler();

              expect(viewModel.thumbScrolling).toEqual(false);
              expect(viewModel.crossThumbScrolling).toEqual(false);

              if (!inBounds && onBounceAnimatorStartHandler) {
                expect(onBounceAnimatorStartHandler).toHaveBeenCalledTimes(1);
                expect(onBounceAnimatorStartHandler).toHaveBeenCalledWith('bounce');
              }
            });
          });
        });

        each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
          each([{ x: 30, y: 35 }, { x: 10, y: 40 }]).describe('Event.Delta: %o', (delta) => {
            each([0, 0.2, 0.5, 1]).describe('containerToContentRatio: %o', (containerToContentRatio) => {
              it('moveHandler(e.delta)', () => {
                const viewModel = new Scrollbar({
                  direction,
                  scrollByThumb,
                } as ScrollbarProps);

                mount(ScrollbarComponent(viewModel as any) as JSX.Element);

                const scrollByHandler = jest.fn();
                (viewModel as any).scrollBy = scrollByHandler;
                Object.defineProperties(viewModel, {
                  containerToContentRatio: { get() { return containerToContentRatio; } },
                });

                viewModel.thumbScrolling = thumbScrolling;
                viewModel.crossThumbScrolling = crossThumbScrolling;

                viewModel.moveHandler(delta);

                if (crossThumbScrolling) {
                  expect(scrollByHandler).toBeCalledTimes(0);
                  return;
                }

                const expectedDelta = delta;
                if (thumbScrolling) {
                  const axis = direction === 'horizontal' ? 'x' : 'y';
                  expectedDelta[axis] = -expectedDelta[axis] / containerToContentRatio;
                }

                expect(scrollByHandler).toBeCalledTimes(1);
                expect(scrollByHandler).toHaveBeenCalledWith(expectedDelta);
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
        } as ScrollbarProps) as any;

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
        } as ScrollbarProps) as any;

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
        } as ScrollbarProps) as any;

        viewModel.onReachBottom();

        if (actionHandler) {
          expect(actionHandler).toHaveBeenCalledTimes(1);
        }
      });
    });
  });
});
