declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * To use this matchers import extender from 'jest-matchers'
       *
       * See `toBe` matcher description
       */
      toBeWithMessage<E = any>(expected: E, message: string): R;
    }
  }
}

export const { };
