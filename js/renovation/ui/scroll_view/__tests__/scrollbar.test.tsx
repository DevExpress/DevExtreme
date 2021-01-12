import each from 'jest-each';

import {
  clear as clearEventHandlers, emit, getEventHandlers,
} from '../../../test_utils/events_mock';

import {
  Scrollbar,
} from '../scrollbar';

import { DisposeEffectReturn } from '../../../utils/effect_return.d';

const THUMB_MIN_SIZE = 15;

describe('TopPocket', () => {
  describe('Styles', () => {
    each(['horizontal', 'vertical', 'both', null, undefined]).describe('Direction: %o', (direction) => {
      each(['never', 'always', 'onScroll', 'onHover', null, undefined]).describe('ShowScrollbar: %o', (visibilityMode) => {
        it('Should assign styles', () => {
          const scrollbar = new Scrollbar({ visibilityMode, direction });
          expect((scrollbar as any).styles).toEqual({
            display: visibilityMode === 'never' ? 'none' : '',
            [`${direction === 'horizontal' || direction === 'both' ? 'width' : 'height'}`]: THUMB_MIN_SIZE,
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
