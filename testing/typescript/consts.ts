/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-type-alias */
export const ANY = undefined as any;
export interface SomeType {
  // eslint-disable-next-line spellcheck/spell-checker
  f4jvK3WOB0qV9C5de78Wlg: any;
}
export interface AnotherType {
  // eslint-disable-next-line spellcheck/spell-checker
  cxL0AirnXku3C1OAt0nIKw: any;
}

export function notAny<T>(x: 0 extends (1 & T) ? never : T): void {}

export function notNever<T>(t: T, ...args: NeverSwitch<T, ['unexpected never'], []>) {}
type NeverSwitch<T, TNever, TNotNever> = 2 extends (T extends never ? 1 : 2) ? TNotNever : TNever;

export function assertType<T>(actual: TypeAssertion<T>): void { return ANY; }
export function toAssertion<T>(t?: T): T extends never ? 123: TypeAssertion<T> { return ANY; }
export interface TypeAssertion<T> {
  type: T;
  required: Required<T>;
}
