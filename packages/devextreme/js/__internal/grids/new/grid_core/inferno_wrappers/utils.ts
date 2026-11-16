/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { dxElementWrapper } from '@js/core/renderer';
import type { RefObject } from 'inferno';

/**
 * Wraps inferno's ref into jquery object
 *
 * @remarks
 * Be careful using this as wrapper does not cover all dxElementWrapper functionality.
 * Careful testing will be needed after using this utility.
 */
export function wrapRef(ref: RefObject<HTMLElement>): dxElementWrapper {
  return {
    dxRenderer: true,
    get 0() {
      return ref.current!;
    },
    // @ts-expect-error a mock can't implement the generic get<T>(); it returns the ref element
    get() {
      return ref.current!;
    },
    length: 1,
  };
}
