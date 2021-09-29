import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';

import { RefObject } from '@devextreme-generator/declarations';
import {
  clear as clearEventHandlers, emit, defaultEvent,
} from '../../../../test_utils/events_mock';

import {
  Scrollbar,
  ScrollbarPropsType,
  viewFunction as ScrollbarComponent,
  THUMB_MIN_SIZE,
} from '../scrollbar';

import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, ShowScrollbarMode } from '../../common/consts';

import {
  optionValues,
  getPermutations,
} from '../../__tests__/utils';
import { ScrollbarProps } from '../../common/scrollbar_props';
import { inRange } from '../../../../../core/utils/math';

interface Mock extends jest.Mock {}

jest.mock('../../../../../core/utils/math', () => ({
  ...jest.requireActual('../../../../../core/utils/math'),
  inRange: jest.fn(() => true),
}));

describe('Scrollbar', () => {
  it('render scrollbar with defaults', () => {
    const props = new ScrollbarProps();
    const viewModel = mount<Scrollbar>(<Scrollbar {...props} />);

    expect({ ...viewModel.props() }).toEqual({
      direction: 'vertical',
      containerHasSizes: false,
      containerSize: 0,
      contentSize: 0,
      visible: false,
      maxOffset: 0,
      minOffset: 0,
      scrollLocation: 0,
    });
  });

  describe('Classes', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      each(optionValues.showScrollbar).describe('ShowScrollbar: %o', (showScrollbar) => {
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

            let expectedThumbTransform = '';

            if (showScrollbar === 'never') {
              expectedThumbTransform = 'none';
            } else {
              if (direction === DIRECTION_HORIZONTAL) {
                expectedThumbTransform = `translate(${expectedTranslate}px, 0px)`;
              }
              if (direction === DIRECTION_VERTICAL) {
                expectedThumbTransform = `translate(0px, ${expectedTranslate}px)`;
              }
            }

            const thumbElement = scrollbar.find('.dx-scrollable-scroll');

            expect(thumbElement.prop('style')).toHaveProperty('transform', expectedThumbTransform);
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
              expect(viewModel.scrollbarClasses).toEqual(expect.stringMatching('dx-scrollbar-hoverable'));
              expect(scrollbar.find('.dx-scrollbar-hoverable').length).toBe(1);
            } else {
              expect(viewModel.scrollbarClasses).toEqual(expect.not.stringMatching('dx-scrollbar-hoverable'));
              expect(scrollbar.find('.dx-scrollbar-hoverable').length).toBe(0);
            }
          });
        });

        each([0, -100]).describe('maxOffset: %o', (maxOffset) => {
          each([10, 15, 20]).describe('containerSize: %o', (containerSize) => {
            each([true, false]).describe('visible: %o', (visible) => {
              each([true, false]).describe('hovered: %o', (hovered) => {
                each([true, false]).describe('pendingPointerUp: %o', (pendingPointerUp) => {
                  it('scroll visibility', () => {
                    const viewModel = new Scrollbar({
                      direction,
                      showScrollbar,
                      visible,
                      containerSize,
                      maxOffset,
                    });

                    viewModel.hovered = hovered;
                    viewModel.pendingPointerUp = pendingPointerUp;

                    const isScrollbarVisible = showScrollbar !== 'never' && maxOffset !== 0 && containerSize >= 15;

                    expect(viewModel.hidden).toEqual(!isScrollbarVisible);

                    let expectedThumbVisibility: boolean | undefined = undefined;

                    if (!isScrollbarVisible) {
                      expectedThumbVisibility = false;
                    } else if (showScrollbar === 'onHover') {
                      expectedThumbVisibility = visible || hovered || pendingPointerUp;
                    } else if (showScrollbar === 'always') {
                      expectedThumbVisibility = true;
                    } else {
                      expectedThumbVisibility = visible;
                    }

                    expect(viewModel.thumbClasses).toEqual(expectedThumbVisibility
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
      scrollbar.thumbRef = { current: {} as HTMLElement } as RefObject;
      scrollbar.expanded = false;
      scrollbar.pendingPointerUp = false;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.expanded).toEqual(true);
      expect(scrollbar.pendingPointerUp).toEqual(true);
    });

    it('Down & Up effects should add & remove scroll active class', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.thumbRef = { current: {} as HTMLElement } as RefObject;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.expanded).toEqual(true);
      expect(scrollbar.pendingPointerUp).toEqual(true);
      expect(scrollbar.scrollbarClasses).toEqual(expect.stringMatching('dx-scrollable-scrollbar-active'));

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.expanded).toEqual(false);
      expect(scrollbar.pendingPointerUp).toEqual(false);
      expect(scrollbar.scrollbarClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbar-active'));
    });

    it('should subscribe to pointerUp event', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.expanded = true;

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.expanded).toEqual(false);
    });

    it('should subscribe to mouseenter event if showScrollbar mode is onHover', () => {
      const viewModel = new Scrollbar({
        direction: 'vertical',
        showScrollbar: 'onHover',
      });
      viewModel.scrollbarRef = { current: {} } as RefObject;
      viewModel.hovered = false;

      viewModel.mouseEnterEffect();
      emit('mouseenter');

      expect(viewModel.hovered).toEqual(true);
    });

    each([ShowScrollbarMode.SCROLL, ShowScrollbarMode.NEVER, ShowScrollbarMode.ALWAYS]).describe('ShowScrollbar: %o', (showScrollbar) => {
      it(`should not subscribe to mouseenter event if showScrollbar mode is ${showScrollbar}`, () => {
        const viewModel = new Scrollbar({
          direction: 'vertical',
          showScrollbar,
        });
        viewModel.scrollbarRef = { current: {} } as RefObject;
        viewModel.hovered = false;

        viewModel.mouseEnterEffect();
        emit('mouseenter');

        expect(viewModel.hovered).toEqual(false);
      });
    });

    it('should subscribe to mouseleave event if showScrollbar mode is onHover', () => {
      const viewModel = new Scrollbar({
        direction: 'vertical',
        showScrollbar: 'onHover',
      });
      viewModel.scrollbarRef = { current: {} } as RefObject;
      viewModel.hovered = true;

      viewModel.mouseLeaveEffect();
      emit('mouseleave');

      expect(viewModel.hovered).toEqual(false);
    });

    each([ShowScrollbarMode.SCROLL, ShowScrollbarMode.NEVER, ShowScrollbarMode.ALWAYS]).describe('ShowScrollbar: %o', (showScrollbar) => {
      it(`should not subscribe to mouseleave event if showScrollbar mode is ${showScrollbar}`, () => {
        const viewModel = new Scrollbar({
          direction: 'vertical',
          showScrollbar,
        });
        viewModel.scrollbarRef = { current: {} } as RefObject;
        viewModel.hovered = true;

        viewModel.mouseLeaveEffect();
        emit('mouseleave');

        expect(viewModel.hovered).toEqual(true);
      });
    });
  });

  each([DIRECTION_VERTICAL, DIRECTION_HORIZONTAL]).describe('direction: %o', (direction) => {
    each(optionValues.rtlEnabled).describe('rtlEnabled: %o', (rtlEnabled) => {
      each([-600, -500, -100, -50, 0, 50, 100]).describe('scrollLocation: %o', (scrollLocation) => {
        each([true, false]).describe('containerHasSizes: %o', (containerHasSizes) => {
          each([0, -300]).describe('maxOffset: %o', (maxOffset) => {
            it('syncScrollLocation() should call moveTo(location)', () => {
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
                viewModel.prevScrollLocation = -100;

                viewModel.syncScrollLocation();

                let expectedRightScrollLocation = rightScrollLocation;
                if (containerHasSizes) {
                  let expectedLocation = scrollLocation;

                  if (direction === 'horizontal' && rtlEnabled) {
                    if (maxOffset === 0) {
                      expectedRightScrollLocation = 0;
                    }

                    expectedLocation = maxOffset - expectedRightScrollLocation;
                  }

                  if (expectedLocation === -100 /* prev location */) {
                    expect(viewModel.moveTo).not.toBeCalled();
                  } else {
                    expect(viewModel.moveTo).toHaveBeenCalledTimes(1);
                    expect(viewModel.moveTo).toHaveBeenCalledWith(expectedLocation);
                  }
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

          viewModel.moveToMouseLocation(testData.eventData, 40);

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
        [true, false],
        optionValues.scrollByThumb,
        ['dx-scrollable-scroll', 'dx-scrollable-scrollbar'],
        optionValues.showScrollbar,
      ]))('initHandler(event, thumbScrolling, offset), isDxWheelEvent: %o, thumbScrolling: %o, scrollByThumb: %o, targetClass: %, showScrollbar: %o',
        (thumbScrolling, scrollByThumb, targetClass, showScrollbar) => {
          const event = { ...defaultEvent, originalEvent: {} } as any;

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

          if (isScrollbarClicked) {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(1);
            expect(viewModel.moveToMouseLocation).toHaveBeenCalledWith(event, 30);
          } else {
            expect(viewModel.moveToMouseLocation).toBeCalledTimes(0);
          }

          expect(viewModel.expanded).toEqual(!!thumbScrolling);
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
