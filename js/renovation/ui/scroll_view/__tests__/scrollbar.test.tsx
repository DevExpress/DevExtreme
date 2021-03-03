import each from 'jest-each';
import { mount } from 'enzyme';

import { RefObject } from 'devextreme-generator/component_declaration/common';
import {
  clear as clearEventHandlers, emit, getEventHandlers, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  Scrollbar,
  viewFunction as ScrollbarComponent,
} from '../scrollbar';

import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../scrollable_utils';
import { ScrollbarProps } from '../scrollbar_props';

describe('TopPocket', () => {
  describe('Styles', () => {
    each(['horizontal', 'vertical']).describe('Direction: %o', (direction) => {
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

              const { styles } = scrollbar as any;

              const expectedSize = contentSize
                ? containerSize * (containerSize / contentSize)
                : containerSize * containerSize;
              expect(styles).toHaveProperty(direction === 'vertical' ? 'height' : 'width', expectedSize);
              expect(styles).toHaveProperty(direction === 'vertical' ? 'width' : 'height', undefined);
            });
          });
        });
      });
    });
  });

  describe('Classes', () => {
    each(['horizontal', 'vertical']).describe('Direction: %o', (direction) => {
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

          viewModel.onHoverStartHandler();
          expect(viewModel.hovered).toBe(showScrollbar === 'onHover');

          viewModel.onHoverEndHandler();
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
      const feedbackOn = jest.fn();
      (scrollbar as any).feedbackOn = feedbackOn;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(feedbackOn).toHaveBeenCalledTimes(1);
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

      expect(scrollbar.active).toEqual(true);
      expect(scrollbar.cssClasses).toEqual(expect.stringMatching('dx-scrollable-scrollbar-active'));

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.active).toEqual(false);
      expect(scrollbar.cssClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbar-active'));
    });

    it('should subscribe to pointerUp event', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      const feedbackOff = jest.fn();
      (scrollbar as any).feedbackOff = feedbackOff;

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(feedbackOff).toHaveBeenCalledTimes(1);
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
    each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (showScrollbar) => {
      each([1, 0.5]).describe('ScaleRatio: %o', (scaleRatio) => {
        it('move(location) call should set correct location & scrollLocation values', () => {
          const viewModel = new Scrollbar({
            showScrollbar,
            direction,
            scaleRatio,
            containerSize: 100,
            contentSize: 500,
          });

          const location = -100;

          viewModel.moveContent = jest.fn();
          viewModel.move(location);

          const expectedLocation = location * scaleRatio;
          expect(viewModel.location).toEqual(expectedLocation);
          expect(viewModel.scrollLocation).toEqual(expectedLocation);
        });

        it('move() call should set correct location & scrollLocation values', () => {
          const viewModel = new Scrollbar({
            showScrollbar,
            direction,
            scaleRatio,
            containerSize: 100,
            contentSize: 500,
          });

          viewModel.location = -20;

          viewModel.moveContent = jest.fn();
          viewModel.move();

          const expectedLocation = -20;
          expect(viewModel.location).toEqual(expectedLocation);
          expect(viewModel.scrollLocation).toEqual(expectedLocation);
        });

        each([-500.25, -400, -100.25, 0.25, 100.25, 500.25]).describe('Location: %o', (location) => {
          afterEach(() => {
            jest.clearAllMocks();
          });

          each([undefined, jest.fn()]).describe('contentPositionChange: %o', (contentPositionChange) => {
            each([undefined, jest.fn()]).describe('contentTranslateOffsetChange: %o', (contentTranslateOffsetChange) => {
              it('moveContent() call should change position of content and scroll', () => {
                const viewModel = new Scrollbar({
                  showScrollbar, // TODO: we don't need check it
                  direction,
                  scaleRatio,
                  contentPositionChange,
                  contentTranslateOffsetChange,
                });

                const minOffset = -400;
                Object.defineProperties(viewModel, {
                  minOffset: { get() { return minOffset; } },
                });
                viewModel.location = location;

                viewModel.moveContent();

                if (contentPositionChange) {
                  expect(contentPositionChange).toHaveBeenCalledTimes(1);
                  expect(contentPositionChange)
                    .toHaveBeenCalledWith(viewModel.fullScrollProp, location, scaleRatio);
                }

                if (contentTranslateOffsetChange) {
                  let expectedContentTranslate = 0;
                  if (location > 0) {
                    expectedContentTranslate = location;
                  } else if (location <= minOffset) {
                    expectedContentTranslate = location - minOffset;
                  } else {
                    expectedContentTranslate = location % 1;
                  }

                  expect(contentTranslateOffsetChange).toHaveBeenCalledTimes(1);
                  expect(contentTranslateOffsetChange)
                    .toHaveBeenCalledWith({ [viewModel.scrollProp]: expectedContentTranslate });
                }
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

    it('set/get Location(location)', () => {
      const viewModel = new Scrollbar({ direction });

      viewModel.setLocation(100);

      expect(viewModel.getLocation()).toBe(100);
    });

    it('get axis()', () => {
      const viewModel = new Scrollbar({ direction });

      expect((viewModel as any).axis).toBe(direction === 'horizontal' ? 'x' : 'y');
    });

    it('get prop()', () => {
      const viewModel = new Scrollbar({ direction });

      expect((viewModel as any).scrollProp).toBe(direction === 'horizontal' ? 'left' : 'top');
    });

    each([1, 0.5]).describe('ScaleRatio: %o', (scaleRatio) => {
      it('move()', () => {
        const viewModel = new Scrollbar({ direction, scaleRatio }) as any;
        viewModel.location = 40;

        viewModel.moveContent = jest.fn();
        viewModel.moveTo = jest.fn();
        viewModel.move();

        expect(viewModel.getLocation()).toBe(40);
      });

      it('move(50)', () => {
        const viewModel = new Scrollbar({ direction, scaleRatio }) as any;
        viewModel.location = 40;

        viewModel.moveContent = jest.fn();
        viewModel.moveTo = jest.fn();
        viewModel.move(50);

        expect(viewModel.getLocation()).toBe(50 * scaleRatio);
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

            viewModel.location = location;
            viewModel.scrollStep = jest.fn();

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
  each(['horizontal', 'vertical']).describe('Direction: %o', (direction) => {
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
      each([undefined, jest.fn()]).describe('onAnimatorCancel: %o', (onAnimatorCancelHandler) => {
        it('should stop animator on init', () => {
          const e = { ...defaultEvent };
          const viewModel = new Scrollbar({ direction, onAnimatorCancel: onAnimatorCancelHandler });

          viewModel.prepareThumbScrolling = jest.fn();

          viewModel.initHandler(e, true);

          if (onAnimatorCancelHandler) {
            expect(onAnimatorCancelHandler).toHaveBeenCalledTimes(1);
          }

          expect(viewModel.visibility).toEqual(false);
        });
      });

      each([true, false]).describe('ScrollByThumb: %o', (scrollByThumb) => {
        each([true, false]).describe('IsDxWheelEvent: %o', (isDxWheelEvent) => {
          each(['dx-scrollable-scroll', 'dx-scrollable-scrollbar']).describe('Event target: %o', (targetClass) => {
            each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (showScrollbar) => {
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
          afterEach(() => {
            jest.clearAllMocks();
          });

          each([undefined, jest.fn()]).describe('BounceAnimatorStart: %o', (animatorStartHandler) => {
            it('scrollByHandler(delta)', () => {
              const delta = { x: 50, y: 70 };
              const viewModel = new Scrollbar({
                direction,
                onAnimatorStart: animatorStartHandler,
              } as ScrollbarProps);

              (viewModel as any).scrollBy = jest.fn();
              (viewModel as any).inBounds = () => inBounds;

              viewModel.scrollByHandler(delta);

              expect((viewModel as any).scrollBy).toBeCalledTimes(1);
              expect((viewModel as any).scrollBy).toHaveBeenCalledWith(delta);
              if (inBounds) {
                if (animatorStartHandler) {
                  expect(animatorStartHandler).toHaveBeenCalledTimes(0);
                }
              } else if (animatorStartHandler) {
                expect(animatorStartHandler).toHaveBeenCalledTimes(1);
                expect(animatorStartHandler).toHaveBeenCalledWith('bounce');
              }
            });
          });

          each([true, false]).describe('ThumbScrolling: %o', (thumbScrolling) => {
            each([undefined, jest.fn()]).describe('BounceAnimatorStart: %o', (onBounceAnimatorStartHandler) => {
              it('stopHandler()', () => {
                const viewModel = new Scrollbar({
                  direction,
                  onAnimatorStart: onBounceAnimatorStartHandler,
                } as ScrollbarProps);

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
                (viewModel as any).containerToContentRatio = () => containerToContentRatio;

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
