import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import { sessionStorage } from '@ts/core/utils/m_storage';

describe('Storage utils', () => {
  describe('sessionStorage', () => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'sessionStorage');

    afterEach(() => {
      if (originalDescriptor) {
        Object.defineProperty(window, 'sessionStorage', originalDescriptor);
      } else {
        // @ts-expect-error the test removes the stub it has defined
        delete window.sessionStorage;
      }
    });

    it('should return the session storage of the window', () => {
      expect(sessionStorage()).toBe(window.sessionStorage);
    });

    it('should return undefined when the browser denies the access', () => {
      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        get() {
          throw new Error('denied');
        },
      });

      expect(sessionStorage()).toBeUndefined();
    });
  });
});
