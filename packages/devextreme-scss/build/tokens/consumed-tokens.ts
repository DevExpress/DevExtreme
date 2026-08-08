/*
 * Pure half of the consumed-token check driven by build-tokens.mjs: everything here is a plain
 * transformation, so tests/consumed-tokens.test.ts can exercise it without running a build.
 */

/*
 * Commented-out declarations still spell out token names (stepper/_colors.scss parks a few), so
 * comments are stripped before scanning — a dead reference must not fail the build.
 *
 * Line comments go first, so a `/* … *\/` nested in one disappears with it. The cost is that a `//`
 * inside a string or a url() swallows the rest of its line: a reference sharing that line would go
 * uncounted. That under-reports rather than failing wrongly, no theme stylesheet does it today, and
 * fluent-next-naming.test.ts strips comments the same way.
 */
export const stripScssComments = (content: string): string => content
  .replace(/\/\/[^\n\r]*/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

/*
 * The charset is wider than the kebab-case the generator emits, so a malformed name is captured
 * whole and fails the check. Matching only [a-z0-9-] would truncate `ds.$spacing-40_typo` to the
 * valid `spacing-40` and report the stylesheet as verified.
 */
export const collectTokenReferences = (content: string): string[] => [
  ...stripScssComments(content).matchAll(/\bds\.\$([\w-]+)/g),
].map(([, name]) => name);

/*
 * Nothing forces a stylesheet through the bridge — `var(--dxds-…)` written by hand compiles to
 * whatever the browser resolves, so a dropped token would degrade silently. No theme stylesheet
 * does it today; collecting the form keeps it that way. devextreme-vnext documents the same escape
 * hatch as an open gap (VNEXT_DESIGN_TOKENS.md, "Known gaps").
 */
export const collectCustomPropertyReferences = (content: string): string[] => [
  ...stripScssComments(content).matchAll(/var\(\s*--dxds-([\w-]+)/g),
].map(([, name]) => name);

/*
 * tokens.flat.json spans every design system, and 128 of the names fluent-next uses also exist
 * under material — so the lookup is narrowed to the source files the bridge is generated from.
 */
export const buildAvailableNames = (
  flatTokenKeys: Iterable<string>,
  consumedSourceFiles: ReadonlySet<string>,
): Set<string> => new Set(
  [...flatTokenKeys]
    .map((key) => key.split(':'))
    .filter(([sourceFile]) => consumedSourceFiles.has(sourceFile))
    .map(([, tokenPath]) => tokenPath.replace(/\//g, '-')),
);
