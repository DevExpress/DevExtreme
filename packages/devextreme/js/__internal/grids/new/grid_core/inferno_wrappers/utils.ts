/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { dxElementWrapper } from '@js/core/renderer';
import type { RefObject } from 'inferno';

export function wrapRef(ref: RefObject<HTMLElement>): dxElementWrapper {
  return {
    // @ts-expect-error
    dxRenderer: true,
    get 0() {
      return ref.current!;
    },
    get() {
      return ref.current!;
    },
    length: 1,
  };
}
