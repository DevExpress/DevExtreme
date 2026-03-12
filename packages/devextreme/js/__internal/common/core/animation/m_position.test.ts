import {
  describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import positionUtils from './m_position';

describe('position (setup)', () => {
  describe('when called with an element that does not exist in the DOM', () => {
    it('should return undefined without throwing for a selector that matches nothing', () => {
      const result = positionUtils.setup('#non-existent-element-that-was-unmounted');

      expect(result).toBeUndefined();
    });

    it('should return undefined without throwing for an empty jQuery object', () => {
      const $emptyElement = $([]);

      const result = positionUtils.setup($emptyElement);

      expect(result).toBeUndefined();
    });
  });

  describe('when called with an existing element as a getter (no options)', () => {
    it('should return the offset of the element', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      const result = positionUtils.setup(el);

      expect(result).toBeDefined();

      document.body.removeChild(el);
    });
  });
});
