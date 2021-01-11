import each from 'jest-each';
import {
  Scrollbar,
} from '../scrollbar';

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
});
