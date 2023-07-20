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

/**
 * Checks that the value type is not `any`.
 * Otherwise compilation is broken by requiring argument of the `never` type.
 */
export function notAny<T>(x: 0 extends (1 & T) ? never : T): void {}

/**
 * Checks that the value type is not `never`.
 * Otherwise compilation is broken by requiring second argument that should never be passed.
 */
export function notNever<T>(t: T, ...args: NeverSwitch<T, ['unexpected never'], []>) {}
type NeverSwitch<T, TNever, TNotNever> = 2 extends (T extends never ? 1 : 2) ? TNotNever : TNever;

/**
 * Checks that the value can be used as the expected type.
 * Ensures that actual type has all required props and all optional props of expected type.
 *
 * Use {@link toAssertion} to use value as an argument
 */
export function assertType<ExpectedType>(actual: TypeAssertion<ExpectedType>): void { return ANY; }
export function toAssertion<T>(t?: T): TypeAssertion<T> { return ANY; }
export interface TypeAssertion<T> {
  type: T;
  required: Required<T>;
}
