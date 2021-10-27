import { getOverflowIndicatorStyles } from '../utils';

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
      } as any);

      expect(styles)
        .toEqual({
          left: '123px',
          top: '234px',
          width: '345px',
          height: '456px',
        });
    });
  });
});
