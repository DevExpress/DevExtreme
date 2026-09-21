/*
 * The value a check has already established is there.
 *
 * `findings.filter((f) => f.rung).map((f) => f.rung!.state)` loses the narrowing across the two
 * calls, and the `!` that papers over it also throws away the name of what went missing: a
 * finding without its `rung` reports "cannot read properties of undefined" and nothing else.
 */
export const required = <T>(value: T | null | undefined, what: string): T => {
  if (value === null || value === undefined) throw new Error(`${what} is missing`);
  return value;
};
