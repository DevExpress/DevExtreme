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

const THUMB_MIN_SIZE = 15;

describe('TopPocket', () => {
  describe('Styles', () => {
    each(['horizontal', 'vertical', 'both', null, undefined]).describe('Direction: %o', (direction) => {
      each([true, false]).describe('needScrollbar: %o', (needScrollbar) => {
        each(['never', 'always', 'onScroll', 'onHover', null, undefined]).describe('ShowScrollbar: %o', (visibilityMode) => {
          it('Should assign styles', () => {
            const scrollbar = new Scrollbar({ visibilityMode, direction, needScrollbar });
            expect((scrollbar as any).styles).toEqual({
              display: needScrollbar ? '' : 'none',
              [`${direction === 'horizontal' || direction === 'both' ? 'width' : 'height'}`]: THUMB_MIN_SIZE,
            });
          });
        });
      });
    });
  });

  describe('Classes', () => {
    each(['horizontal', 'vertical', 'both', null, undefined]).describe('Direction: %o', (direction) => {
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
  each(['horizontal', 'vertical', 'both']).describe('Direction: %o', (direction) => {
    each(['never', 'always', 'onScroll', 'onHover']).describe('ShowScrollbar: %o', (visibilityMode) => {
      each([{ top: -100, left: -100 }, { top: -100 }, { left: -100 }, -100]).describe('Location: %o', (location) => {
        it('moveTo()', () => {
          const scrollRef = React.createRef();
          const viewModel = new Scrollbar({ visibilityMode, direction, needScrollbar: true });
          (viewModel as any).scrollRef = scrollRef;

          mount(viewFunction(viewModel as any) as JSX.Element);
          (viewModel as any).scrollRef = (viewModel as any).scrollRef.current;

          viewModel.moveTo(location);

          const scrollbarStyle = window.getComputedStyle((viewModel as any).scrollRef);
          if (visibilityMode === 'never') {
            expect(scrollbarStyle.transform).toEqual('');
            return;
          }

          if (direction === DIRECTION_HORIZONTAL) {
            // eslint-disable-next-line no-nested-ternary
            expect(scrollbarStyle.transform).toEqual(`translate(${isNumeric(location) ? 100 : (location.left ? 100 : 0)}px, 0px)`);
          } else {
            // eslint-disable-next-line no-nested-ternary
            expect(scrollbarStyle.transform).toEqual(`translate(0px, ${isNumeric(location) ? 100 : (location.top ? 100 : 0)}px)`);
          }
        });
      });
    });
  });
});
