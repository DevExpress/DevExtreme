const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const textMatcher = (text: string): RegExp => new RegExp(escapeRegExp(text));

export const exactTextMatcher = (text: string): RegExp => new RegExp(`^${escapeRegExp(text)}$`);
