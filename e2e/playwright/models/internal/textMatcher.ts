const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The TestCafe "withText" matched a case-sensitive substring; a plain string in "hasText" ignores
// the case.
export const textMatcher = (text: string): RegExp => new RegExp(escapeRegExp(text));
