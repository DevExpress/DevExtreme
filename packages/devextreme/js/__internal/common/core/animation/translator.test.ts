import {
  describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import { resetPosition } from './translator';

describe('resetPosition', () => {
  describe('when called with an empty jQuery wrapper and finishTransition=true', () => {
    it('should not throw when element does not exist in the DOM', () => {
      const $emptyElement = $([]);

      expect(() => resetPosition($emptyElement, true)).not.toThrow();
    });

    it('should not throw when element selector matches nothing', () => {
      const $missingElement = $('#non-existent-element-that-was-unmounted');

      expect(() => resetPosition($missingElement, true)).not.toThrow();
    });
  });

  describe('when called with a real DOM element and finishTransition=true', () => {
    it('should not throw and should reset position', () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      const $el = $(el);

      expect(() => resetPosition($el, true)).not.toThrow();

      document.body.removeChild(el);
    });
  });
});
