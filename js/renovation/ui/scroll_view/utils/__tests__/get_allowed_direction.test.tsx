import each from 'jest-each';
import { DIRECTION_BOTH, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../../common/consts';
import { allowedDirection } from '../get_allowed_direction';

describe('allowedDirection()', () => {
  each([true, false]).describe('bounceEnabled: %o', (bounceEnabled) => {
    it(`direction: ${DIRECTION_VERTICAL}, maxTopOffset > 0`, () => {
      const scrollTopMax = 200;
      const scrollLeftMax = 0;

      expect(allowedDirection(DIRECTION_VERTICAL, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual('vertical');
    });

    it(`direction: ${DIRECTION_VERTICAL}, maxTopOffset = 0`, () => {
      const scrollTopMax = 0;
      const scrollLeftMax = 0;

      expect(allowedDirection(DIRECTION_VERTICAL, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual(bounceEnabled ? 'vertical' : undefined);
    });

    it(`direction: ${DIRECTION_HORIZONTAL}, maxLeftOffset > 0`, () => {
      const scrollTopMax = 0;
      const scrollLeftMax = 200;

      expect(allowedDirection(DIRECTION_HORIZONTAL, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual('horizontal');
    });

    it(`direction: ${DIRECTION_HORIZONTAL},  maxLeftOffset = 0`, () => {
      const scrollTopMax = 0;
      const scrollLeftMax = 0;

      expect(allowedDirection(DIRECTION_HORIZONTAL, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual(bounceEnabled ? 'horizontal' : undefined);
    });

    it(`direction: ${DIRECTION_BOTH}, maxTopOffset > 0, maxLeftOffset > 0`, () => {
      const scrollTopMax = 200;
      const scrollLeftMax = 200;

      expect(allowedDirection(DIRECTION_BOTH, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual('both');
    });

    it(`direction: ${DIRECTION_BOTH}, maxTopOffset = 0, maxLeftOffset > 0`, () => {
      const scrollTopMax = 0;
      const scrollLeftMax = 200;

      expect(allowedDirection(DIRECTION_BOTH, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual(bounceEnabled ? 'both' : 'horizontal');
    });

    it(`direction: ${DIRECTION_BOTH}, maxTopOffset > 0, maxLeftOffset = 0`, () => {
      const scrollTopMax = 200;
      const scrollLeftMax = 0;

      expect(allowedDirection(DIRECTION_BOTH, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual(bounceEnabled ? 'both' : 'vertical');
    });

    it(`direction: ${DIRECTION_BOTH}, maxTopOffset = 0, maxLeftOffset = 0`, () => {
      const scrollTopMax = 0;
      const scrollLeftMax = 0;

      expect(allowedDirection(DIRECTION_BOTH, scrollTopMax, scrollLeftMax, bounceEnabled)).toEqual(bounceEnabled ? 'both' : undefined);
    });
  });
});
