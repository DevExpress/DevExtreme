import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';

import { RefObject } from '@devextreme-generator/declarations';
import {
  clear as clearEventHandlers, emit,
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
} from '../../__tests__/utils';
import { ScrollbarProps } from '../../common/scrollbar_props';

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
          {
            contentSize: 300,
            scrollLocation: 50.145623,
            expected: { translate: -33.430415333333336, height: 33 },
          },
          {
            contentSize: 200,
            scrollLocation: 50.145623,
            expected: { translate: -25.0728115, height: 50 },
          },
          { contentSize: 200, scrollLocation: 0, expected: { translate: 0, height: 50 } },
          { contentSize: 200, scrollLocation: -50, expected: { translate: 25, height: 50 } },
          { contentSize: 200, scrollLocation: -100, expected: { translate: 50, height: 50 } },
          { contentSize: 200, scrollLocation: -150, expected: { translate: 75, height: 50 } },
        ]).describe('testData: %o', ({ contentSize, scrollLocation, expected }) => {
          it(`thumb styles, containerSize: 100, contentSize: ${contentSize}, maxOffset: -100`, () => {
            const viewModel = new Scrollbar({
              direction,
              showScrollbar,
              containerSize: 100,
              contentSize,
              maxOffset: -100,
              scrollLocation,
            });

            const scrollbar = mount(ScrollbarComponent(viewModel));

            let expectedThumbTransform = '';

            if (showScrollbar === 'never') {
              expectedThumbTransform = 'none';
            } else {
              if (direction === DIRECTION_HORIZONTAL) {
                expectedThumbTransform = `translate(${expected.translate}px, 0px)`;
              }
              if (direction === DIRECTION_VERTICAL) {
                expectedThumbTransform = `translate(0px, ${expected.translate}px)`;
              }
            }

            const thumbElement = scrollbar.find('.dx-scrollable-scroll');

            expect(thumbElement.prop('style')).toHaveProperty('transform', expectedThumbTransform);
            expect(thumbElement.prop('style')).toHaveProperty(direction === 'vertical' ? 'height' : 'width', expected.height);
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
                each([true, false]).describe('active: %o', (active) => {
                  it('scroll visibility', () => {
                    const viewModel = new Scrollbar({
                      direction,
                      showScrollbar,
                      visible,
                      containerSize,
                      maxOffset,
                    });

                    viewModel.hovered = hovered;
                    viewModel.active = active;

                    const isScrollbarVisible = showScrollbar !== 'never' && maxOffset !== 0 && containerSize >= 15;

                    expect(viewModel.hidden).toEqual(!isScrollbarVisible);

                    let expectedThumbVisibility: boolean | undefined;

                    if (!isScrollbarVisible) {
                      expectedThumbVisibility = false;
                    } else if (showScrollbar === 'onHover') {
                      expectedThumbVisibility = visible || hovered || active;
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
      scrollbar.active = false;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.active).toEqual(true);
    });

    it('Down & Up effects should add & remove scroll active class', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.thumbRef = { current: {} as HTMLElement } as RefObject;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(scrollbar.active).toEqual(true);
      expect(scrollbar.scrollbarClasses).toEqual(expect.stringMatching('dx-scrollable-scrollbar-active'));

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.active).toEqual(false);
      expect(scrollbar.scrollbarClasses).toEqual(expect.not.stringMatching('dx-scrollable-scrollbar-active'));
    });

    it('should subscribe to pointerUp event', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      scrollbar.active = true;

      scrollbar.pointerUpEffect();
      emit('dxpointerup');

      expect(scrollbar.active).toEqual(false);
    });

    each(optionValues.scrollByThumb).describe('scrollByThumb: %o', (scrollByThumb) => {
      each([ShowScrollbarMode.HOVER, ShowScrollbarMode.ALWAYS]).describe('ShowScrollbar: %o', (showScrollbar) => {
        it(`should subscribe to mouseenter event if ${JSON.stringify({ showScrollbar, scrollByThumb })}`, () => {
          const viewModel = new Scrollbar({
            direction: 'vertical',
            showScrollbar,
            scrollByThumb,
          });
          viewModel.scrollbarRef = { current: {} } as RefObject;
          viewModel.hovered = false;

          viewModel.mouseEnterEffect();
          emit('mouseenter');

          expect(viewModel.hovered).toEqual(scrollByThumb);
        });

        it(`should subscribe to mouseleave event if ${JSON.stringify({ showScrollbar, scrollByThumb })}`, () => {
          const viewModel = new Scrollbar({
            direction: 'vertical',
            showScrollbar,
            scrollByThumb,
          });
          viewModel.scrollbarRef = { current: {} } as RefObject;
          viewModel.hovered = true;

          viewModel.mouseLeaveEffect();
          emit('mouseleave');

          expect(viewModel.hovered).toEqual(!scrollByThumb);
        });
      });

      each([ShowScrollbarMode.SCROLL, ShowScrollbarMode.NEVER]).describe('ShowScrollbar: %o', (showScrollbar) => {
        it(`should not subscribe to mouseenter event if ${JSON.stringify({ showScrollbar, scrollByThumb })}`, () => {
          const viewModel = new Scrollbar({
            direction: 'vertical',
            showScrollbar,
            scrollByThumb,
          });
          viewModel.scrollbarRef = { current: {} } as RefObject;
          viewModel.hovered = false;

          viewModel.mouseEnterEffect();
          emit('mouseenter');

          expect(viewModel.hovered).toEqual(false);
        });

        it(`should not subscribe to mouseleave event if ${JSON.stringify({ showScrollbar, scrollByThumb })}`, () => {
          const viewModel = new Scrollbar({
            direction: 'vertical',
            showScrollbar,
            scrollByThumb,
          });
          viewModel.scrollbarRef = { current: {} } as RefObject;
          viewModel.hovered = true;

          viewModel.mouseLeaveEffect();
          emit('mouseleave');

          expect(viewModel.hovered).toEqual(true);
        });
      });
    });
  });

  describe('Methods', () => {
    each([DIRECTION_HORIZONTAL, DIRECTION_VERTICAL]).describe('Direction: %o', (direction) => {
      it('setActiveState()', () => {
        const viewModel = new Scrollbar({
          direction,
        });

        viewModel.active = false;

        viewModel.setActiveState();

        expect(viewModel.active).toEqual(true);
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
});
