import { getOverflowIndicatorStyles, getOverflowIndicatorColor } from '../utils';

describe('Compact appointment utils', () => {
  describe('getOverflowIndicatorStyles', () => {
    it('should return correct styles', () => {
      const styles = getOverflowIndicatorStyles({
        geometry: {
          left: 123,
          top: 234,
          width: 345,
          height: 456,
        },
        color: '#ffeeaa',
      } as any);

      expect(styles)
        .toEqual({
          left: '123px',
          top: '234px',
          width: '345px',
          height: '456px',
          backgroundColor: '#ffeeaa',
          boxShadow: 'inset 345px 0 0 0 rgba(0, 0, 0, 0.3)',
        });
    });
  });

  describe('getOverflowIndicatorColor', () => {
    it('should return correct color for empty colors', () => {
      expect(getOverflowIndicatorColor('#aabbcc', []))
        .toBe('#aabbcc');
    });

    it('should return correct color for different colors', () => {
      expect(getOverflowIndicatorColor('#aabbcc', ['#aabbcc', '#aabbee']))
        .toBe(undefined);
    });

    it('should return correct color', () => {
      expect(getOverflowIndicatorColor('#aabbcc', ['#aabbcc', '#aabbcc', '#aabbcc']))
        .toBe('#aabbcc');
    });
  });
});
