import React from 'react';
import each from 'jest-each';
import { mount } from 'enzyme';
import { isNumeric } from '../../../../core/utils/type';

import {
  clear as clearEventHandlers, emit, getEventHandlers,
} from '../../../test_utils/events_mock';

import {
  Scrollbar,
  viewFunction,
} from '../scrollbar';

import { DisposeEffectReturn } from '../../../utils/effect_return.d';
import { DIRECTION_HORIZONTAL } from '../scrollable_utils';
import { ScrollbarProps } from '../scrollbar_props';

const THUMB_MIN_SIZE = 15;

describe('TopPocket', () => {
  describe('Styles', () => {
    each(['horizontal', 'vertical']).describe('Direction: %o', (direction) => {
      each([true, false]).describe('needScrollbar: %o', (needScrollbar) => {
        each(['never', 'always', 'onScroll', 'onHover', null, undefined]).describe('ShowScrollbar: %o', (visibilityMode) => {
          each(['width', 'height']).describe('Dimension: %o', (dimension) => {
            it('Should assign styles', () => {
              const scrollbar = new Scrollbar({
                visibilityMode,
                direction,
                needScrollbar,
                [dimension]: THUMB_MIN_SIZE,
              });

              const { styles } = scrollbar as any;
              expect(styles).toHaveProperty('display', needScrollbar ? '' : 'none');
              expect(styles).toHaveProperty(dimension, THUMB_MIN_SIZE);
              expect(styles).toHaveProperty(dimension === 'width' ? 'height' : 'width', undefined);
            });
          });
        });
      });
    });
  });

  describe('Classes', () => {
    each(['horizontal', 'vertical']).describe('Direction: %o', (direction) => {
      each(['never', 'always', 'onScroll', 'onHover', null, undefined]).describe('ShowScrollbar: %o', (visibilityMode) => {
        each([true, false]).describe('Expandable: %o', (expandable) => {
          it('should add scroll hoverable class', () => {
            const viewModel = new Scrollbar({ direction, expandable, visibilityMode });

            const needHoverableClass = (visibilityMode === 'onHover' || visibilityMode === 'always') && expandable;

            const scroll = mount(viewFunction(viewModel) as JSX.Element);

            if (needHoverableClass) {
              expect(viewModel.cssClasses).toEqual(expect.stringMatching('dx-scrollbar-hoverable'));
              expect(scroll.find('.dx-scrollbar-hoverable').length).toBe(1);
            } else {
              expect(viewModel.cssClasses).toEqual(expect.not.stringMatching('dx-scrollbar-hoverable'));
              expect(scroll.find('.dx-scrollbar-hoverable').length).toBe(0);
            }
          });
        });
      });
    });
  });

  describe('Effects', () => {
    beforeEach(clearEventHandlers);

    it('should subscribe to pointerDown event', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });
      const feedbackOn = jest.fn();
      (scrollbar as any).feedbackOn = feedbackOn;

      scrollbar.pointerDownEffect();
      emit('dxpointerdown');

      expect(feedbackOn).toHaveBeenCalledTimes(1);
    });

    it('pointerDownEffect should return unsubscribe callback', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });

      const detach = scrollbar.pointerDownEffect() as DisposeEffectReturn;

      expect(getEventHandlers('dxpointerdown').length).toBe(1);
      detach();
      expect(getEventHandlers('dxpointerdown').length).toBe(0);
    });

    it('Down & Up effects should add & remove scroll active class', () => {
      const scrollbar = new Scrollbar({ direction: 'vertical' });

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

      const detach = scrollbar.pointerUpEffect() as DisposeEffectReturn;

      expect(getEventHandlers('dxpointerup').length).toBe(1);
      detach();
      expect(getEventHandlers('dxpointerup').length).toBe(0);
    });
  });
});

describe('Methods', () => {
  each(['horizontal', 'vertical']).describe('Direction: %o', (direction) => {
    it('getDirection()', () => {
      const viewModel = new Scrollbar({ direction } as ScrollbarProps);
      expect(viewModel.getDirection()).toBe(direction);
    });

    each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (visibilityMode) => {
      each([0.5, 1, 2]).describe('thumbRatio: %o', (thumbRatio) => {
        each([{ top: -100, left: -100 }, { top: -100 }, { left: -100 }, -100]).describe('Location: %o', (location) => {
          it('moveTo()', () => {
            const scrollRef = React.createRef();
            const viewModel = new Scrollbar({
              visibilityMode, direction, thumbRatio, needScrollbar: true,
            });
            (viewModel as any).scrollRef = scrollRef;

            mount(viewFunction(viewModel as any) as JSX.Element);
            (viewModel as any).scrollRef = (viewModel as any).scrollRef.current;

            viewModel.moveTo(location);

            const scrollbarStyle = window.getComputedStyle((viewModel as any).scrollRef);
            if (visibilityMode === 'never') {
              expect(scrollbarStyle.transform).toEqual('');
              return;
            }

            let expectedValue = 0;
            if (isNumeric(location)) {
              expectedValue = -location * thumbRatio;
            } else {
              expectedValue = -(location[direction === DIRECTION_HORIZONTAL ? 'left' : 'top'] || 0) * thumbRatio;
            }

            expect(scrollbarStyle).toHaveProperty('transform', direction === DIRECTION_HORIZONTAL ? `translate(${expectedValue}px, 0px)` : `translate(0px, ${expectedValue}px)`);
          });
        });
      });

      it('isScrollbar(element), element is scrollbar element', () => {
        const scrollbarRef = {} as HTMLDivElement;
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);
        (viewModel as any).scrollbarRef = scrollbarRef;

        mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isScrollbar(scrollbarRef)).toBe(true);
      });

      it('isScrollbar(element), element is not scrollbar element', () => {
        const scrollbarRef = {} as HTMLDivElement;
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);
        (viewModel as any).scrollbarRef = scrollbarRef;

        mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isScrollbar({} as HTMLDivElement)).toBe(false);
      });

      it('isThumb(element), element is scrollable scroll element', () => {
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);

        const scrollbar = mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(true);
      });

      it('isThumb(element), element is scrollable content element', () => {
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);

        const scrollbar = mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isThumb(scrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(true);
      });

      it('isThumb(element), element is scrollbar element', () => {
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);

        const scrollbar = mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isThumb(scrollbar.getDOMNode())).toBe(false);
      });

      it('isContent(element), element is scrollable scroll element', () => {
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);

        const scrollbar = mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isContent(scrollbar.find('.dx-scrollable-scroll').getDOMNode())).toBe(true);
      });

      it('isContent(element), element is scrollable content element', () => {
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);

        const scrollbar = mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isContent(scrollbar.find('.dx-scrollable-scroll-content').getDOMNode())).toBe(true);
      });

      it('isContent(element), element is scrollbar element', () => {
        const viewModel = new Scrollbar({
          visibilityMode, direction, needScrollbar: true,
        } as ScrollbarProps);

        const scrollbar = mount(viewFunction(viewModel as any) as JSX.Element);
        expect(viewModel.isContent(scrollbar.getDOMNode())).toBe(true);
      });
    });
  });
});
