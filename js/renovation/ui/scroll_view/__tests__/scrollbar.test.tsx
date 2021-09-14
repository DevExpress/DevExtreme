import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';

import { RefObject } from '@devextreme-generator/declarations';
import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../test_utils/events_mock';

import {
  Scrollbar,
  ScrollbarPropsType,
  viewFunction as ScrollbarComponent,
  THUMB_MIN_SIZE,
} from '../scrollbar';

import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../common/consts';

import {
  optionValues,
  getPermutations,
} from './utils';
import { ScrollbarProps } from '../common/scrollbar_props';
import { inRange } from '../../../../core/utils/math';

interface Mock extends jest.Mock {}

jest.mock('../../../../core/utils/math', () => ({
  ...jest.requireActual('../../../../core/utils/math'),
  inRange: jest.fn(() => true),
}));

describe('Scrollbar', () => {
  it('render scrollbar with defaults', () => {
    const props = new ScrollbarProps();
    const viewModel = mount<Scrollbar>(<Scrollbar {...props} />);

    expect({ ...viewModel.props() }).toEqual({
      activeStateEnabled: false,
      containerHasSizes: false,
      containerSize: 0,
      contentSize: 0,
      forceVisibility: false,
      isScrollableHovered: false,
      maxOffset: 0,
      minOffset: 0,
      scrollLocation: 0,
    });
  });

  describe('Classes', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
        it('hoverStart, hoverEnd handlers should update hovered state only for onHover mode', () => {
          const viewModel = new Scrollbar({ direction, showScrollbar }) as any;

          expect(viewModel.hovered).toBe(false);

          viewModel.hoverInHandler();
          expect(viewModel.hovered).toBe(showScrollbar === 'onHover');

          viewModel.hoverOutHandler();
          expect(viewModel.hovered).toBe(false);
        });

        each([
          { scrollLocation: 50.145623, expectedTranslate: -25.0728115 },
          { scrollLocation: 0, expectedTranslate: 0 },
          { scrollLocation: -50, expectedTranslate: 25 },
          { scrollLocation: -100, expectedTranslate: 50 },
          { scrollLocation: -150, expectedTranslate: 75 },
        ]).describe('testData: %o', ({ scrollLocation, expectedTranslate }) => {
          it('thumb styles, containerSize: 100, contentSize: 200, maxOffset: -100', () => {
            const viewModel = new Scrollbar({
              direction,
              showScrollbar,
              containerSize: 100,
              contentSize: 200,
              maxOffset: -100,
              scrollLocation,
            });

            const scrollbar = mount(ScrollbarComponent(viewModel));

            let expectedScrollTransform = '';

            if (showScrollbar === 'never') {
              expectedScrollTransform = 'none';
            } else {
              if (direction === DIRECTION_HORIZONTAL) {
                expectedScrollTransform = `translate(${expectedTranslate}px, 0px)`;
              }
              if (direction === DIRECTION_VERTICAL) {
                expectedScrollTransform = `translate(0px, ${expectedTranslate}px)`;
              }
            }

            const thumbElement = scrollbar.find('.dx-scrollable-scroll');

            expect(thumbElement.prop('style')).toHaveProperty('transform', expectedScrollTransform);
            expect(thumbElement.prop('style')).toHaveProperty(direction === 'vertical' ? 'height' : 'width', 50);
            expect(thumbElement.prop('style')).not.toHaveProperty(direction === 'vertical' ? 'width' : 'height');
          });
        });

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

        each([10, 0, -100]).describe('containerToContentRatio: %o', (maxOffset) => {
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
                        maxOffset,
                      });

                      viewModel.visibility = visibility;
                      viewModel.showOnScrollByWheel = showOnScrollByWheel;
                      viewModel.hovered = hovered;

                      const expectedScrollbarVisibility = showScrollbar !== 'never' && -maxOffset > 0 && containerSize > 15;

                      expect(viewModel.isVisible).toEqual(expectedScrollbarVisibility);

                      let expectedScrollVisibility: boolean | undefined = undefined;

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
      scrollbar.scrollRef = { current: {} as HTMLElement } as RefObject;
      scrollbar.expand = jest.fn();

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.expand).toHaveBeenCalledTimes(1);
    });

    it('Down & Up effects should add & remove scroll active class', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.scrollRef = { current: {} as HTMLElement } as RefObject;

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
  });

  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL]).describe('direction: %o', (direction) => {
    each(optionValues.rtlEnabled).describe('rtlEnabled: %o', (rtlEnabled) => {
      each([-600, -500, -100, -50, 0, 50, 100]).describe('scrollLocation: %o', (scrollLocation) => {
        each([true, false]).describe('containerHasSizes: %o', (containerHasSizes) => {
          it('syncScrollLocation() should call moveTo(location)', () => {
            const maxOffset = -300;

            const viewModel = new Scrollbar({
              showScrollbar: 'always',
              direction,
              rtlEnabled,
              scrollLocation,
              containerHasSizes,
              maxOffset,
            });

            [0, -50, -100, -250, -400].forEach((rightScrollLocation) => {
              viewModel.moveTo = jest.fn();

              viewModel.rightScrollLocation = rightScrollLocation;

              viewModel.syncScrollLocation();

              let expectedRightScrollLocation = rightScrollLocation;
              if (containerHasSizes) {
                let expectedLocation = scrollLocation;

                expect(viewModel.moveTo).toHaveBeenCalledTimes(1);

                if (direction === 'horizontal' && rtlEnabled) {
                  expectedLocation = maxOffset - rightScrollLocation;

                  if (expectedLocation >= 0) {
                    expectedLocation = 0;
                    expectedRightScrollLocation = 0;
                    expect(viewModel.moveTo).toHaveBeenCalledWith(expectedLocation);
                  }
                }

                expect(viewModel.moveTo).toHaveBeenCalledWith(expectedLocation);
              } else {
                expect(viewModel.moveTo).not.toBeCalled();
              }
              expect(viewModel.rightScrollLocation).toEqual(expectedRightScrollLocation);
            });
          });
        });
      });
    });
  });

  describe('Methods', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      it('moveTo(), should not raise any errors when scrollLocationChange events not defined', () => {
        const viewModel = new Scrollbar({
          showScrollbar: 'always',
          direction,
          scrollLocationChange: undefined,
        });

        viewModel.prevScrollLocation = -99;

        expect(() => { viewModel.moveTo(-100); }).not.toThrow();
      });

      each([
        { eventData: { pageX: 50, pageY: 50 }, scrollLocation: 0, expected: 10 },
        { eventData: { pageX: 50, pageY: 50 }, scrollLocation: -150, expected: 10 },
        { eventData: { pageX: 50, pageY: 50 }, scrollLocation: -300, expected: 10 },
        { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: 0, expected: -52 },
        { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: -150, expected: -52 },
        { eventData: { pageX: 65.5, pageY: 65.5 }, scrollLocation: -300, expected: -52 },
        { eventData: { pageX: 87, pageY: 87 }, scrollLocation: 0, expected: -138 },
        { eventData: { pageX: 87, pageY: 87 }, scrollLocation: -150, expected: -138 },
        { eventData: { pageX: 87, pageY: 87 }, scrollLocation: -300, expected: -138 },
        { eventData: { pageX: 139, pageY: 139 }, scrollLocation: 0, expected: -346 },
        { eventData: { pageX: 139, pageY: 139 }, scrollLocation: -150, expected: -346 },
        { eventData: { pageX: 139, pageY: 139 }, scrollLocation: -300, expected: -346 },
      ]).describe('testData: %o', (testData) => {
        it('moveToMouseLocation(event)', () => {
          const viewModel = new Scrollbar({
            direction,
            containerSize: 100,
            contentSize: 400,
            maxOffset: -300,
            scrollLocation: testData.scrollLocation,
          });

          viewModel.moveTo = jest.fn();
          viewModel.visibility = false;

          viewModel.moveToMouseLocation(testData.eventData, 40);

          expect(viewModel.visibility).toEqual(true);
          expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
          expect(viewModel.moveTo).toHaveBeenCalledWith(testData.expected);
        });
      });

      each([-500.25, -400, -100.25, -55.75, 0.25, 100.25, 500.25]).describe('scrollLocation: %o', (scrollLocation) => {
        it('moveTo(location) should pass to scrollable correct newScrollLocation with delta', () => {
          const scrollLocationChange = jest.fn();

          const viewModel = new Scrollbar({
            direction,
            scrollLocationChange,
            scrollLocation,
          });

          const prevScrollLocation = Math.floor(Math.random() * 10) - 5;
          viewModel.prevScrollLocation = prevScrollLocation;

          viewModel.moveTo(scrollLocation);

          expect(scrollLocationChange).toHaveBeenCalledTimes(1);
          expect(scrollLocationChange).toHaveBeenCalledWith(
            viewModel.fullScrollProp,
            -scrollLocation,
            Math.abs(prevScrollLocation - scrollLocation) >= 1,
          );
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
          firstViewModel.scrollbarRef = { current: firstScrollbar.getDOMNode() };

          const secondScrollbar = mount(ScrollbarComponent(secondViewModel));

          expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scroll', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
          viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

          expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(true);
        });

        it('isThumb(element), element is element other scrollbar', () => {
          const firstViewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const invertedDirection = direction === 'vertical' ? 'horizontal' : 'vertical';
          const secondViewModel = new Scrollbar({
            showScrollbar, direction: invertedDirection,
          } as ScrollbarPropsType) as any;

          const firstScrollbar = mount(ScrollbarComponent(firstViewModel));
          firstViewModel.scrollbarRef = { current: firstScrollbar.getDOMNode() };

          const secondScrollbar = mount(ScrollbarComponent(secondViewModel));

          expect(firstViewModel.isThumb(secondScrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(false);
        });

        it('isThumb(element), element is scrollbar element', () => {
          const viewModel = new Scrollbar({
            showScrollbar, direction,
          } as ScrollbarPropsType) as any;

          const scrollbar = mount(ScrollbarComponent(viewModel));
          viewModel.scrollbarRef = { current: scrollbar.getDOMNode() };

          expect(viewModel.isThumb(scrollbar.getDOMNode())).toBe(false);
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
      test.each(getPermutations([
        optionValues.isDxWheelEvent,
        [true, false],
        optionValues.scrollByThumb,
        ['dx-scrollable-scroll', 'dx-scrollable-scrollbar'],
        optionValues.showScrollbar,
      ]))('initHandler(event, thumbScrolling, offset), isDxWheelEvent: %o, thumbScrolling: %o, scrollByThumb: %o, targetClass: %, showScrollbar: %o',
        (isDxWheelEvent, thumbScrolling, scrollByThumb, targetClass, showScrollbar) => {
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

          viewModel.moveToMouseLocation = jest.fn();
          event.originalEvent.target = scrollbar.find(`.${targetClass}`).getDOMNode();
          (viewModel as any).scrollbarRef = { current: scrollbar.getDOMNode() };
          viewModel.expanded = false;

          viewModel.initHandler(event, thumbScrolling, 30);

          const isScrollbarClicked = targetClass !== 'dx-scrollable-scroll' && scrollByThumb;

          let expectedShowOnScrollByWheel: boolean | undefined = undefined;
          let expectedExpandedValue = false;

          if (isDxWheelEvent || !isScrollbarClicked) {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
          } else {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(1);
            expect(viewModel.moveToMouseLocation).toHaveBeenCalledWith(event, 30);
          }

          if (isDxWheelEvent) {
            if (showScrollbar === 'onScroll') {
              expectedShowOnScrollByWheel = true;
            }
          } else {
            expectedShowOnScrollByWheel = undefined;
            if (thumbScrolling) {
              expectedExpandedValue = true;
            }
          }

          expect(viewModel.showOnScrollByWheel).toEqual(expectedShowOnScrollByWheel);
          expect(viewModel.expanded).toEqual(expectedExpandedValue);
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

      each([true, false]).describe('thumbScrolling: %o', (thumbScrolling) => {
        each([true, false]).describe('inRange: %o', (inRangeMockValue) => {
          each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
            each([80, 10, 0, -50, -90, -100, -140]).describe('scrollLocation: %o', (scrollLocation) => {
              each([10, 30, 40]).describe('Delta: %o', (delta) => {
                each([0.2, 1, 1.5]).describe('containerToContentRatio: %o', (containerToContentRatio) => {
                  afterEach(() => {
                    jest.clearAllMocks();
                  });

                  it('moveHandler(delta, min, max), thumbScrolling: false', () => {
                    (inRange as Mock).mockReturnValue(inRangeMockValue);
                    const OUT_BOUNDS_ACCELERATION = 0.5;

                    const viewModel = new Scrollbar({
                      direction,
                      bounceEnabled,
                      scrollLocation,
                    } as ScrollbarPropsType);

                    viewModel.moveTo = jest.fn();

                    Object.defineProperties(viewModel, {
                      containerToContentRatio: { get() { return containerToContentRatio; } },
                    });

                    viewModel.moveHandler(delta, 0, -100, thumbScrolling);

                    let resultDelta = delta;

                    if (thumbScrolling) {
                      resultDelta = -Math.round(delta / containerToContentRatio);
                    }

                    const isOutBounds = !inRangeMockValue;
                    if (isOutBounds) {
                      resultDelta *= OUT_BOUNDS_ACCELERATION;
                    }

                    resultDelta = (resultDelta as number) + (scrollLocation as number);

                    if (!bounceEnabled) {
                      if (resultDelta >= 0) {
                        resultDelta = 0;
                      } else if (resultDelta <= -100) {
                        resultDelta = -100;
                      }
                    }

                    expect(viewModel.moveTo).toBeCalledTimes(1);
                    expect(viewModel.moveTo).toHaveBeenCalledWith(resultDelta);
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
