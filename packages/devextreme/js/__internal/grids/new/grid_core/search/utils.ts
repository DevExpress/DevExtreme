import type { HighlightedTextItem, HighlightTextOptions } from './types';

const HIGHLIGHT_SPLIT_SEPARATOR = '<--|-->';

export const compareTextPart = (
  textPart: string,
  searchStr: string,
  caseSensitive?: boolean,
): boolean => (
  caseSensitive
    ? textPart === searchStr
    : textPart.toLowerCase() === searchStr.toLowerCase()
);

export const splitHighlightedText = (
  text: string,
  {
    enabled,
    searchStr,
    caseSensitive,
  }: HighlightTextOptions,
): HighlightedTextItem[] | null => {
  if (!enabled || !searchStr) {
    return null;
  }

  // NOTE: backslash special characters for correct regexp matches
  const normalizedSearchStr = searchStr.replace(/\W|_/g, (match) => `\\${match}`);

  const regExp = new RegExp(normalizedSearchStr, `g${caseSensitive ? '' : 'i'}`);

  if (!text.match(regExp)?.length) {
    return null;
  }

  return text
    .replace(regExp, (match) => `${HIGHLIGHT_SPLIT_SEPARATOR}${match}${HIGHLIGHT_SPLIT_SEPARATOR}`)
    .split(HIGHLIGHT_SPLIT_SEPARATOR)
    .filter((textPart) => !!textPart)
    .map((textPart) => ({
      type: compareTextPart(textPart, searchStr, caseSensitive)
        ? 'highlighted'
        : 'usual',
      text: textPart,
    }));
};
