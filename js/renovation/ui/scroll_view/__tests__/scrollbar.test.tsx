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
  THUMB_MIN_SIZE,
} from '../scrollbar';

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
      forceVisibility: false,
      isScrollableHovered: false,
      pocketState: 0,
      scrollLocation: 0,
      scrollableOffset: 0,
      topPocketSize: 0,
    });
  });

  describe('Classes', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
        each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
          it('should add hoverable class to scrollbar', () => {
            const viewModel = new Scrollbar({ direction, scrollByThumb, showScrollbar });

            const needHoverableClass = (showScrollbar === 'onHover' || showScrollbar === 'always') && scrollByThumb;

            const scrollbar = mount(ScrollbarComponent(viewModel));

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
                  each([10, 15, 20]).describe('containerSize: %o', (containerSize) => {
                    it('scroll visibility', () => {
                      const viewModel = new Scrollbar({
                        direction,
                        showScrollbar,
                        isScrollableHovered,
                        containerSize,
                      });

                      viewModel.visibility = visibility;
                      viewModel.showOnScrollByWheel = showOnScrollByWheel;
                      viewModel.hovered = hovered;
                      Object.defineProperties(viewModel, {
                        containerToContentRatio: { get() { return containerToContentRatio; } },
                      });

                      const expectedScrollbarVisibility = showScrollbar !== 'never' && containerToContentRatio < 1 && containerSize > 15;

                      expect(viewModel.isVisible).toEqual(expectedScrollbarVisibility);

                      // eslint-disable-next-line @typescript-eslint/init-declarations
                      let expectedScrollVisibility: boolean | undefined;

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

      const detach = scrollbar.pointerDownEffect();

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

      const detach = scrollbar.pointerUpEffect();

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

    each([undefined, jest.fn()]).describe('lockHandler: %o', (lockHandler) => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      each([true, false]).describe('pendingBounceAnimator: %o', (pendingBounceAnimator) => {
        each([true, false]).describe('pendingPullDown: %o', (pendingPullDown) => {
          it('updateLockState()', () => {
            const viewModel = new Scrollbar({ direction: 'vertical', onLock: lockHandler });
            viewModel.scrollRef = {} as RefObject<HTMLDivElement>;

            viewModel.pendingBounceAnimator = pendingBounceAnimator;
            viewModel.pendingPullDown = pendingPullDown;

            viewModel.updateLockedState();

            if (lockHandler) {
              if (pendingBounceAnimator || pendingPullDown) {
                expect(lockHandler).toHaveBeenCalledTimes(1);
              } else {
                expect(lockHandler).toHaveBeenCalledTimes(0);
              }
            }
          });
        });
      });
    });
  });

  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL]).describe('direction: %o', (direction) => {
    each(optionValues.rtlEnabled).describe('rtlEnabled: %o', (rtlEnabled) => {
      each([-600, -500, -100, -50, 0, 50, 100]).describe('scrollLocation: %o', (scrollLocation) => {
        each([0, 80]).describe('maxOffset: %o', (maxOffset) => {
          each([0, 100, 500]).describe('contentSize: %o', (contentSize) => {
            each([0, 50, 200]).describe('containerSize: %o', (containerSize) => {
              it('moveToBoundaryOnSizeChange() should call moveTo(boundaryLocation)', () => {
                const topPocketSize = 85;

                const viewModel = new Scrollbar({
                  showScrollbar: 'always',
                  direction,
                  rtlEnabled,
                  topPocketSize,
                  scrollLocation,
                  contentSize,
                  containerSize,
                });

                const minOffset = -300;
                Object.defineProperties(viewModel, {
                  maxOffset: { get() { return maxOffset; } },
                  minOffset: { get() { return minOffset; } },
                });

                [0, 100, 500].forEach((prevContentSize) => {
                  [0, 50, 200].forEach((prevContainerSize) => {
                    [0, -50, -100, -250, -400].forEach((rightScrollLocation) => {
                      viewModel.moveTo = jest.fn();

                      viewModel.prevContentSize = prevContentSize;
                      viewModel.prevContainerSize = prevContainerSize;
                      viewModel.rightScrollLocation = rightScrollLocation;

                      viewModel.moveToBoundaryOnSizeChange();

                      let expectedBoundaryLocation = Math.max(
                        Math.min(scrollLocation, maxOffset), minOffset,
                      );

                      const contentSizeChanged = contentSize !== prevContentSize;
                      const containerSizeChanged = containerSize !== prevContainerSize;

                      if ((contentSizeChanged || containerSizeChanged)
                        && scrollLocation <= maxOffset) {
                        expect(viewModel.moveTo).toHaveBeenCalledTimes(1);

                        if (direction === 'horizontal' && rtlEnabled) {
                          expectedBoundaryLocation = minOffset - rightScrollLocation;

                          if (expectedBoundaryLocation >= 0) {
                            expectedBoundaryLocation = 0;
                          }
                        }

                        expect(viewModel.moveTo).toHaveBeenCalledWith(expectedBoundaryLocation);
                      } else {
                        expect(viewModel.moveTo).not.toBeCalled();
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

      it('moveTo(), should not raise any errors when scrollLocationChange && onScrollHandler events not defined', () => {
        const viewModel = new Scrollbar({
          showScrollbar: 'always',
          direction,
          onScroll: undefined,
          scrollLocationChange: undefined,
        });

        viewModel.prevScrollLocation = -99;
        viewModel.updateContent = jest.fn();

        expect(() => {
          viewModel.moveTo(-100);
        }).not.toThrow();
      });

      each([
        { eventData: { pageX: 50, pageY: 50 }, scrollLocation: 0, expected: 0 },
        { eventData: { pageX: 50, pageY: 50 }, scrollLocation: -150, expected: 0 },
        { eventData: { pageX: 50, pageY: 50 }, scrollLocation: -300, expected: 0 },
        { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: 0, expected: -52 },
        { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: -150, expected: -52 },
        { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: -300, expected: -52 },
        { eventData: { pageX: 87, pageY: 87 }, scrollLocation: 0, expected: -138 },
        { eventData: { pageX: 87, pageY: 87 }, scrollLocation: -150, expected: -138 },
        { eventData: { pageX: 87, pageY: 87 }, scrollLocation: -300, expected: -138 },
        { eventData: { pageX: 139, pageY: 139 }, scrollLocation: 0, expected: -300 },
        { eventData: { pageX: 139, pageY: 139 }, scrollLocation: -150, expected: -300 },
        { eventData: { pageX: 139, pageY: 139 }, scrollLocation: -300, expected: -300 },
      ]).describe('testData: %o', (testData) => {
        it('moveToMouseLocation(event)', () => {
          const viewModel = new Scrollbar({
            direction,
            containerSize: 100,
            contentSize: 400,
            scrollableOffset: 40,
            scrollLocation: testData.scrollLocation,
          });

          viewModel.moveTo = jest.fn();
          viewModel.visibility = false;

          Object.defineProperties(viewModel, {
            visibleContentAreaSize: { get() { return 400; } },
          });

          viewModel.moveToMouseLocation(testData.eventData);

          expect(viewModel.visibility).toEqual(true);
          expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
          expect(viewModel.moveTo).toHaveBeenCalledWith(testData.expected);
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

              viewModel.wasInit = false;
              Object.defineProperties(viewModel, {
                minOffset: { get() { return minOffset; } },
              });

              viewModel.updateContent(location);

              let expectedContentTranslate = expected;

              if (forceGeneratePockets && pullDownEnabled) {
                expectedContentTranslate -= topPocketSize;
              }
              expect(viewModel.wasInit).toEqual(true);
              expect(contentTranslateOffsetChange).toHaveBeenCalledTimes(1);
              expect(contentTranslateOffsetChange)
                .toHaveBeenCalledWith(viewModel.scrollProp, expectedContentTranslate);
            });

            it('moveTo(location) should pass to scrollable correct newScrollLocation with delta', () => {
              const scrollLocationChange = jest.fn();
              const onScrollHandler = jest.fn();
              const topPocketSize = 85;

              const viewModel = new Scrollbar({
                direction,
                forceGeneratePockets,
                pullDownEnabled,
                scrollLocationChange,
                onScroll: onScrollHandler,
                topPocketSize,
                scrollLocation: location,
              });

              viewModel.updateContent = jest.fn();
              const prevScrollLocation = Math.floor(Math.random() * 10) - 5;
              viewModel.prevScrollLocation = prevScrollLocation;

              viewModel.moveTo(location);

              expect(scrollLocationChange).toHaveBeenCalledTimes(1);
              expect(scrollLocationChange).toHaveBeenCalledWith(
                viewModel.fullScrollProp,
                location,
              );
              expect(viewModel.updateContent).toHaveBeenCalledTimes(1);
              expect(viewModel.updateContent).toHaveBeenCalledWith(location);

              if (Math.abs(prevScrollLocation - location) >= 1) {
                expect(onScrollHandler).toHaveBeenCalledTimes(1);
                expect(onScrollHandler).toHaveBeenCalledWith();
              } else {
                expect(onScrollHandler).not.toBeCalled();
              }
            });
          });
        });
      });

      each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
        it('isScrollbar(element), element is scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
          viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

          expect(viewModel.isScrollbar(scrollbar.getDOMNode())).toBe(true);
        });

        it('isScrollbar(element), element is not scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
          viewModel.scrollbarRef = scrollbar.getDOMNode();

          expect(viewModel.isScrollbar(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollable scroll element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
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

          const firstScrollbar = mount(ScrollbarComponent(firstViewModel));
          firstViewModel.scrollbarRef = firstScrollbar.getDOMNode();

          const secondScrollbar = mount(ScrollbarComponent(secondViewModel));

          expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollable content element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
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

          const firstScrollbar = mount(ScrollbarComponent(firstViewModel));
          firstViewModel.scrollbarRef = firstScrollbar.getDOMNode();

          const secondScrollbar = mount(ScrollbarComponent(secondViewModel));

          expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
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
          each([-200, -81, -80, -79, -50, 0, 28, 79, 80, 81, 100]).describe('scrollLocation: %o', (scrollLocation) => {
            it('isPullDown()', () => {
              const topPocketSize = 80;
              const bottomPocketSize = 55;

              const viewModel = new Scrollbar({
                direction,
                bounceEnabled,
                pullDownEnabled,
                topPocketSize,
                bottomPocketSize,
                scrollLocation,
              });

              expect(viewModel.isPullDown).toEqual(
                pullDownEnabled && bounceEnabled && scrollLocation >= 80,
              );
            });
          });
        });
      });

      each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
        each([300, 360, 600]).describe('visibleScrollAreaSize: %o', (visibleScrollAreaSize) => {
          each([-100, -300, -359.4, -359.6, -500]).describe('scrollLocation: %o', (scrollLocation) => {
            it('isReachBottom()', () => {
              const topPocketSize = 85;
              const bottomPocketSize = 55;

              const viewModel = new Scrollbar({
                direction,
                reachBottomEnabled,
                topPocketSize,
                bottomPocketSize,
                scrollLocation,
              });

              Object.defineProperties(viewModel, {
                visibleScrollAreaSize: { get() { return visibleScrollAreaSize; } },
              });

              if (reachBottomEnabled
              && ((scrollLocation as number) + (visibleScrollAreaSize as number)) <= 0.5) {
                expect(viewModel.isReachBottom).toBe(true);
              } else {
                expect(viewModel.isReachBottom).toBe(false);
              }
            });
          });
        });
      });

      each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
        each([true, false]).describe('isPullDown: %o', (isPullDown) => {
          it('Effect - updateMaxOffset()', () => {
            const topPocketSize = 80;

            const viewModel = new Scrollbar({
              direction,
              forceGeneratePockets,
              reachBottomEnabled: true,
              bottomPocketSize: 55,
              pullDownEnabled: true,
              topPocketSize,
            });

            Object.defineProperties(viewModel, {
              isPullDown: { get() { return isPullDown; } },
            });

            viewModel.updateMaxOffset();

            let expectedMaxOffset = 0;
            if (forceGeneratePockets && isPullDown) {
              expectedMaxOffset = topPocketSize;
            }

            expect(viewModel.maxOffset).toEqual(expectedMaxOffset);
          });
        });

        each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
          each([0, 55]).describe('bottomPocketSize: %o', (bottomPocketSize) => {
            each([0, 80]).describe('topPocketSize: %o', (topPocketSize) => {
              each([0, 8]).describe('contentPaddingBottom: %o', (contentPaddingBottom) => {
                each([-100, 0, 300]).describe('visibleScrollAreaSize: %o', (visibleScrollAreaSize) => {
                  each([true, false]).describe('forceAnimationToBottomBound: %o', (forceAnimationToBottomBound) => {
                    it('minOffset()', () => {
                      const viewModel = new Scrollbar({
                        direction,
                        forceGeneratePockets,
                        reachBottomEnabled,
                        bottomPocketSize,
                        topPocketSize,
                        contentPaddingBottom,
                      });

                      viewModel.forceAnimationToBottomBound = forceAnimationToBottomBound;
                      Object.defineProperties(viewModel, {
                        visibleScrollAreaSize: { get() { return visibleScrollAreaSize; } },
                      });

                      let expectedMinOffsetValue = 0;

                      if (
                        forceGeneratePockets
                        && reachBottomEnabled
                        && !forceAnimationToBottomBound
                      ) {
                        expectedMinOffsetValue = (visibleScrollAreaSize as number)
                        + (bottomPocketSize as number) + (contentPaddingBottom as number);
                      } else {
                        expectedMinOffsetValue = visibleScrollAreaSize;
                      }

                      expect(viewModel.minOffset)
                        .toEqual(expectedMinOffsetValue < 0 ? -0 : -expectedMinOffsetValue);
                    });
                  });
                });
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
                topPocketSize: 0,
                bottomPocketSize: 0,
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

      it('stopScrolling()', () => {
        const viewModel = new Scrollbar({ direction });

        viewModel.isScrolling = true;
        viewModel.wasScrollComplete = false;

        viewModel.stopScrolling();

        expect(viewModel.isScrolling).toEqual(false);
        expect(viewModel.wasScrollComplete).toEqual(true);
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

      it('dimension()', () => {
        const viewModel = new Scrollbar({ direction });

        expect((viewModel as any).dimension).toBe(direction === 'horizontal' ? 'width' : 'height');
      });

      each([0, 50, 200]).describe('containerSize: %o', (containerSize) => {
        each([0, 0.2, 0.5, 1]).describe('containerToContentRatio: %o', (containerToContentRatio) => {
          it('scrollSize()', () => {
            const viewModel = new Scrollbar({
              direction,
              containerSize,
            });

            Object.defineProperties(viewModel, {
              containerToContentRatio: { get() { return containerToContentRatio; } },
            });

            const expectedThumbSize = containerSize * containerToContentRatio;

            expect(viewModel.scrollSize)
              .toEqual(expectedThumbSize < THUMB_MIN_SIZE ? THUMB_MIN_SIZE : expectedThumbSize);
          });
        });
      });

      each([0, 100, 200]).describe('visibleContentAreaSize: %o', (visibleContentAreaSize) => {
        each([0, 100, 200]).describe('containerSize: %o', (containerSize) => {
          it('visibleScrollAreaSize()', () => {
            const viewModel = new Scrollbar({
              direction,
              containerSize,
            });

            Object.defineProperties(viewModel, {
              visibleContentAreaSize: { get() { return visibleContentAreaSize; } },
            });

            const expectedScrollAreaSize = visibleContentAreaSize - containerSize;

            expect(viewModel.visibleScrollAreaSize)
              .toEqual(expectedScrollAreaSize < 0 ? 0 : expectedScrollAreaSize);
          });
        });
      });

      each([0, 300, 600]).describe('visibleScrollAreaSize: %o', (visibleScrollAreaSize) => {
        each([0, 100, 200]).describe('containerSize: %o', (containerSize) => {
          each([15, 25.66, 30]).describe('scrollSize: %o', (scrollSize) => {
            it('scrollRatio()', () => {
              const viewModel = new Scrollbar({
                direction,
                containerSize,
              });

              Object.defineProperties(viewModel, {
                visibleScrollAreaSize: { get() { return visibleScrollAreaSize; } },
                scrollSize: { get() { return scrollSize; } },
              });

              let expectedScrollRatio = 1;

              if (visibleScrollAreaSize) {
                expectedScrollRatio = (containerSize - scrollSize) / visibleScrollAreaSize;
              }

              expect(viewModel.scrollRatio).toEqual(expectedScrollRatio);
            });
          });
        });
      });

      each(['vertical', 'horizontal', null, undefined]).describe('ShowScrollbar: %o', (showScrollbar) => {
        each([-200, -64, -20, 0, 28, 100]).describe('ScrollLocation: %o', (scrollLocation) => {
          each([0, 0.1, 0.433, 0.75, 1]).describe('scrollRatio: %o', (scrollRatio) => {
            it('scrollTransform()', () => {
              const viewModel = new Scrollbar({
                direction,
                showScrollbar,
                scrollLocation,
              });

              Object.defineProperties(viewModel, {
                scrollRatio: { get() { return scrollRatio; } },
              });

              let expectedScrollTransform = '';

              if (showScrollbar === 'never') {
                expectedScrollTransform = 'none';
              } else if (direction === 'horizontal') {
                expectedScrollTransform = `translate(${-scrollLocation * scrollRatio}px, 0px)`;
              } else {
                expectedScrollTransform = `translate(0px, ${-scrollLocation * scrollRatio}px)`;
              }

              expect(viewModel.scrollTransform).toEqual(expectedScrollTransform);
            });
          });
        });
      });

      each([0, 200]).describe('contentSize: %o', (contentSize) => {
        each([0, 55]).describe('bottomPocketSize: %o', (bottomPocketSize) => {
          each([0, 80]).describe('topPocketSize: %o', (topPocketSize) => {
            each([true, false]).describe('forceGeneratePockets: %o', (forceGeneratePockets) => {
              each([true, false]).describe('reachBottomEnabled: %o', (reachBottomEnabled) => {
                each([0, 8]).describe('contentPaddingBottom: %o', (contentPaddingBottom) => {
                  it('visibleContentAreaSize()', () => {
                    const viewModel = new Scrollbar({
                      direction,
                      contentSize,
                      bottomPocketSize,
                      topPocketSize,
                      forceGeneratePockets,
                      reachBottomEnabled,
                      contentPaddingBottom,
                    });

                    let expectedContentSize = contentSize - bottomPocketSize - topPocketSize;

                    if (forceGeneratePockets && reachBottomEnabled) {
                      expectedContentSize -= contentPaddingBottom;
                    }

                    expect(viewModel.visibleContentAreaSize)
                      .toEqual(expectedContentSize < 0 ? 0 : expectedContentSize);
                  });
                });
              });
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

            Object.defineProperties(viewModel, {
              visibleContentAreaSize: { get() { return contentSize; } },
            });

            let expectedContainerToContentRatio = containerSize;

            if (contentSize) {
              expectedContainerToContentRatio = containerSize / contentSize;
            }

            expect(viewModel.containerToContentRatio).toEqual(expectedContainerToContentRatio);
          });
        });
      });

      it('scrollStyles, ', () => {
        const scrollSize = 25;
        const scrollTransform = 'translate(0px, 150px)';

        const viewModel = new Scrollbar({
          direction,
        });

        Object.defineProperties(viewModel, {
          scrollSize: { get() { return scrollSize; } },
          scrollTransform: { get() { return scrollTransform; } },
        });

        expect(viewModel.scrollStyles).toEqual({
          [direction === 'vertical' ? 'height' : 'width']: scrollSize,
          transform: scrollTransform,
        });
      });
    });
  });

  describe('Handlers', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each([
        {
          scrollLocation: -400,
          visibleScrollAreaSize: 350,
          inRange: true,
          expectedForceAnimationToBottomBound: true,
        },
        {
          scrollLocation: -400,
          visibleScrollAreaSize: 420,
          inRange: true,
          expectedForceAnimationToBottomBound: false,
        },
        {
          scrollLocation: -400,
          visibleScrollAreaSize: 400,
          inRange: true,
          expectedForceAnimationToBottomBound: true,
        },
        {
          scrollLocation: -399.5,
          visibleScrollAreaSize: 400,
          inRange: true,
          expectedForceAnimationToBottomBound: false,
        },
        {
          scrollLocation: -500,
          visibleScrollAreaSize: 350,
          inRange: false,
          expectedForceAnimationToBottomBound: false,
        },
      ]).describe('testData: %o', (testData) => {
        it('releaseHandler()', () => {
          const onReleaseHandler = jest.fn();
          const pocketStateChangeHandler = jest.fn();

          const viewModel = new Scrollbar({
            direction,
            onRelease: onReleaseHandler,
            pocketStateChange: pocketStateChangeHandler,
            scrollLocation: testData.scrollLocation,
          });

          viewModel.stopScrolling = jest.fn();
          viewModel.pendingPullDown = true;
          viewModel.pendingReachBottom = true;
          viewModel.forceAnimationToBottomBound = false;

          Object.defineProperties(viewModel, {
            visibleScrollAreaSize: { get() { return testData.visibleScrollAreaSize; } },
            inRange: { get() { return testData.inRange; } },
          });

          viewModel.releaseHandler();

          expect(pocketStateChangeHandler).toHaveBeenCalledTimes(1);
          expect(pocketStateChangeHandler).toHaveBeenCalledWith(0);

          expect(viewModel.pendingPullDown).toEqual(false);
          expect(viewModel.pendingReachBottom).toEqual(false);
          expect(viewModel.forceAnimationToBottomBound)
            .toEqual(testData.expectedForceAnimationToBottomBound);

          expect(onReleaseHandler).toHaveBeenCalledTimes(1);
          expect(viewModel.stopScrolling).toHaveBeenCalledTimes(1);
        });
      });

      each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
        each([true, false]).describe('ThumbScrolling: %o', (needRiseEnd) => {
          it('endHandler(), should start inertia animator on end', () => {
            const onAnimatorStart = jest.fn();
            const velocity = { x: 10, y: 20 };
            const event = { ...defaultEvent, velocity };
            const viewModel = new Scrollbar({ direction, onAnimatorStart });

            viewModel.thumbScrolling = thumbScrolling;
            viewModel.crossThumbScrolling = true;
            viewModel.needRiseEnd = !needRiseEnd;
            viewModel.isScrolling = true;

            viewModel.endHandler(event.velocity, needRiseEnd);

            viewModel.needRiseEnd = needRiseEnd;
            viewModel.needRiseEnd = false;

            expect(onAnimatorStart).toHaveBeenCalledTimes(1);
            expect(onAnimatorStart).toHaveBeenCalledWith('inertia', velocity[viewModel.axis], thumbScrolling, true);
            expect(viewModel.thumbScrolling).toEqual(false);
            expect(viewModel.crossThumbScrolling).toEqual(false);
          });
        });
      });

      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        [true, false],
        optionValues.scrollByThumb,
        ['dx-scrollable-scroll', 'dx-scrollable-scrollbar'],
        optionValues.showScrollbar,
      ]))('initHandler(event, crossThumbScrolling), isDxWheelEvent: %o, crossThumbScrolling: %o, scrollByThumb: %o, targetClass: %, showScrollbar: %o',
        (isDxWheelEvent, crossThumbScrolling, scrollByThumb, targetClass, showScrollbar) => {
          const event = { ...defaultEvent, originalEvent: {} } as any;
          if (isDxWheelEvent) {
            event.originalEvent.type = 'dxmousewheel';
          }

          const viewModel = new Scrollbar({
            direction,
            showScrollbar,
            scrollByThumb,
          });

          const scrollbar = mount(ScrollbarComponent(viewModel as any));

          viewModel.cancelScrolling = jest.fn();
          viewModel.moveToMouseLocation = jest.fn();
          event.originalEvent.target = scrollbar.find(`.${targetClass}`).getDOMNode();
          (viewModel as any).scrollbarRef = { current: scrollbar.getDOMNode() };
          viewModel.isScrolling = false;
          viewModel.expanded = false;

          viewModel.initHandler(event, crossThumbScrolling);

          const isScrollbarClicked = targetClass !== 'dx-scrollable-scroll' && scrollByThumb;
          // eslint-disable-next-line no-undef-init
          let expectedShowOnScrollByWheel: boolean | undefined = undefined;
          let expectedThumbScrolling = false;
          let expectedCrossThumbScrolling = crossThumbScrolling;
          let expectedExpandedValue = false;

          if (isDxWheelEvent || !isScrollbarClicked) {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
          } else {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(1);
            expect(viewModel.moveToMouseLocation).toHaveBeenCalledWith(event);
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
            if (expectedThumbScrolling) {
              expectedExpandedValue = true;
            }
          }

          expect(viewModel.cancelScrolling).toHaveBeenCalledTimes(1);

          expect(viewModel.isScrolling).toEqual(true);
          expect(viewModel.onReachBottomWasFiredOnce).toEqual(false);
          expect(viewModel.onPullDownWasFiredOnce).toEqual(false);

          expect(viewModel.showOnScrollByWheel).toEqual(expectedShowOnScrollByWheel);
          expect(viewModel.thumbScrolling).toEqual(expectedThumbScrolling);
          expect(viewModel.crossThumbScrolling).toEqual(expectedCrossThumbScrolling);
          expect(viewModel.expanded).toEqual(expectedExpandedValue);
        });

      it('cancelScrolling()', () => {
        const onAnimatorCancel = jest.fn();
        const viewModel = new Scrollbar({ direction, onAnimatorCancel });

        viewModel.isScrolling = true;
        viewModel.hide = jest.fn();

        viewModel.cancelScrolling();

        expect(viewModel.hide).toHaveBeenCalledTimes(1);
        expect(viewModel.isScrolling).toEqual(false);
        expect(onAnimatorCancel).toHaveBeenCalledTimes(1);
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
        viewModel.visibility = true;

        viewModel.hide();

        viewModel.visibility = false;
        if (showScrollbar === 'onScroll') {
          expect(setTimeout).toHaveBeenCalledTimes(1);
          expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500);
        }

        jest.runOnlyPendingTimers();

        if (showScrollbar === 'onScroll') {
          expect(viewModel.showOnScrollByWheel).toEqual(undefined);
          expect(viewModel.hideScrollbarTimer === undefined).toBe(false);
        } else {
          expect(viewModel.showOnScrollByWheel).toEqual(true);
        }

        viewModel.disposeHideScrollbarTimer()();
        expect(viewModel.hideScrollbarTimer).toBe(undefined);
      });

      it('scrollByHandler(delta)', () => {
        const onInertiaAnimatorStart = jest.fn();
        const delta = { x: 50, y: 70 };
        const viewModel = new Scrollbar({
          direction,
          onAnimatorStart: onInertiaAnimatorStart,
        });

        viewModel.scrollBy = jest.fn();
        viewModel.stopScrolling = jest.fn();

        viewModel.scrollByHandler(delta);

        expect(viewModel.scrollBy).toBeCalledTimes(1);
        expect(viewModel.scrollBy).toHaveBeenCalledWith(delta);
        expect(viewModel.stopScrolling).toBeCalledTimes(1);
      });

      each([true, false]).describe('CrossThumbScrolling: %o', (crossThumbScrolling) => {
        each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
          it('stopHandler()', () => {
            const viewModel = new Scrollbar({ direction });

            viewModel.thumbScrolling = thumbScrolling;
            viewModel.crossThumbScrolling = true;
            viewModel.hide = jest.fn();
            viewModel.stopScrolling = jest.fn();

            viewModel.stopHandler();

            if (thumbScrolling) {
              expect(viewModel.stopScrolling).toHaveBeenCalledTimes(1);
            } else {
              expect(viewModel.stopScrolling).not.toBeCalled();
            }

            expect(viewModel.thumbScrolling).toEqual(false);
            expect(viewModel.crossThumbScrolling).toEqual(false);
          });

          each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
            each([{ x: 30, y: 35 }, { x: 10, y: 40 }]).describe('Event.Delta: %o', (delta) => {
              each([0, 0.2, 0.5, 1]).describe('containerToContentRatio: %o', (containerToContentRatio) => {
                it('moveHandler(event.delta)', () => {
                  const viewModel = new Scrollbar({
                    direction,
                    scrollByThumb,
                  } as ScrollbarPropsType);

                  mount(ScrollbarComponent(viewModel as any));

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
          viewModel.pendingInertiaAnimator = false;

          viewModel.onInertiaAnimatorStart(velocity);

          expect(viewModel.pendingInertiaAnimator).toEqual(true);
          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith('inertia', 0.15, true, false);
          }
        });

        it('onBounceAnimatorStart()', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar: 'always', onAnimatorStart: actionHandler });

          viewModel.pendingBounceAnimator = false;

          viewModel.onBounceAnimatorStart();

          expect(viewModel.pendingBounceAnimator).toEqual(true);

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
            expect(actionHandler).toHaveBeenCalledWith('bounce');
          }
        });

        it('onAnimatorCancel()', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar: 'always', onAnimatorCancel: actionHandler });
          viewModel.pendingBounceAnimator = true;
          viewModel.pendingBounceAnimator = true;

          viewModel.onAnimatorCancel();

          viewModel.pendingBounceAnimator = false;
          viewModel.pendingBounceAnimator = false;

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

        it('startRefreshing()', () => {
          const viewModel = new Scrollbar({
            showScrollbar: 'always',
            direction,
            onPullDown: actionHandler,
          } as ScrollbarPropsType) as any;

          viewModel.startRefreshing();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
          }
        });

        it('startLoading()', () => {
          const viewModel = new Scrollbar({
            showScrollbar: 'always',
            direction,
            onReachBottom: actionHandler,
          } as ScrollbarPropsType) as any;

          viewModel.startLoading();

          if (actionHandler) {
            expect(actionHandler).toHaveBeenCalledTimes(1);
          }
        });
      });
    });
  });
});
