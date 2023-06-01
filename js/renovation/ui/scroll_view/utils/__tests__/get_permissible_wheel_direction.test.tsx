import each from 'jest-each';
import { DIRECTION_BOTH, DIRECTION_HORIZONTAL, DIRECTION_VERTICAL } from '../../common/consts';
import { permissibleWheelDirection } from '../get_permissible_wheel_direction';

describe('permissibleWheelDirection()', () => {
  each([true, false]).describe('shiftKey: %o', (shiftKey) => {
    it(`direction: ${DIRECTION_VERTICAL}, maxTopOffset > 0`, () => {
      expect(permissibleWheelDirection(DIRECTION_VERTICAL, shiftKey)).toEqual('vertical');
    });

    it(`direction: ${DIRECTION_HORIZONTAL}, maxTopOffset > 0`, () => {
      expect(permissibleWheelDirection(DIRECTION_HORIZONTAL, shiftKey)).toEqual('horizontal');
    });

    it(`direction: ${DIRECTION_BOTH}, maxTopOffset > 0`, () => {
      expect(permissibleWheelDirection(DIRECTION_BOTH, shiftKey)).toEqual(shiftKey ? 'horizontal' : 'vertical');
    });
  });
});
