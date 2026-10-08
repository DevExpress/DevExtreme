import number from '@js/common/core/localization/number';
import { escapeRegExp } from '@js/core/utils/common';
import { fitIntoRange } from '@js/core/utils/math';
import type { Format } from '@js/localization';
import type { CaretRange } from '@ts/ui/text_box/utils.caret';

import { getNthOccurrence, getRealSeparatorIndex, splitByIndex } from './utils';

export interface CaretBoundaries {
  start: number;
  end: number;
}

export type CaretPosition = number | CaretRange;

const mockEscapedStubs = (format: string): string => format.replace(
  /'([^']*)'/g,
  (stub) => stub.split('').map(() => ' ').join('').substr(2),
);

const getDigitCountBeforeIndex = (index: number, text: string): number => {
  const decimalSeparator: string = number.getDecimalSeparator();
  const regExp = new RegExp(`[^0-9${escapeRegExp(decimalSeparator)}]`, 'g');
  const textBeforePosition = text.slice(0, index);

  return textBeforePosition.replace(regExp, '').length;
};

const reverseText = (text: string): string => text.split('').reverse().join('');

const getDigitPositionByIndex = (digitIndex: number, text: string): number => {
  if (!digitIndex) {
    return -1;
  }

  const regExp = /[0-9]/g;
  let counter = 1;
  let index: number | null = null;
  let result = regExp.exec(text);

  while (result) {
    index = result.index;
    if (counter >= digitIndex) {
      return index;
    }
    counter += 1;
    result = regExp.exec(text);
  }

  return index ?? text.length;
};

const trimNonNumericCharsFromEnd = (text: string): string => text.replace(/[^0-9e]+$/, '');

const isSeparatorBasedString = (text: string): boolean => text.length === 1
  && !!text.match(/^[,.][0-9]*$/g);

export const getCaretBoundaries = (text: string, format: Format): CaretBoundaries => {
  if (typeof format === 'string') {
    const signParts = format.split(';');
    const sign = number.getSign(text, format);

    signParts[1] = signParts[1] || `-${signParts[0]}`;

    const signFormat = mockEscapedStubs(signParts[sign < 0 ? 1 : 0]);

    const prefixStubLength = /^[^#0.,]*/.exec(signFormat)?.[0].length ?? 0;
    const postfixStubLength = /[^#0.,]*$/.exec(signFormat)?.[0].length ?? 0;

    return {
      start: prefixStubLength,
      end: text.length - postfixStubLength,
    };
  }
  return { start: 0, end: text.length };
};

export const getCaretWithOffset = (
  caret: CaretPosition,
  offset: number,
): CaretBoundaries => {
  const range = typeof caret === 'number' ? { start: caret, end: caret } : caret;

  return {
    start: (range.start ?? 0) + offset,
    end: (range.end ?? 0) + offset,
  };
};

export const getCaretInBoundaries = (
  caret: CaretPosition,
  text: string,
  format: Format,
): CaretBoundaries => {
  const normalizedCaret = getCaretWithOffset(caret, 0);
  const boundaries = getCaretBoundaries(text, format);

  return {
    start: fitIntoRange(normalizedCaret.start, boundaries.start, boundaries.end),
    end: fitIntoRange(normalizedCaret.end, boundaries.start, boundaries.end),
  };
};

export const getCaretAfterFormat = (
  text: string,
  formatted: string,
  caret: CaretPosition,
  format: Format,
): CaretBoundaries => {
  const normalizedCaret = getCaretWithOffset(caret, 0);

  const point: string = number.getDecimalSeparator();
  const realSeparatorOccurrenceIndex = getRealSeparatorIndex(format).occurrence;
  const pointPosition = isSeparatorBasedString(text)
    ? 0
    : getNthOccurrence(text, point, realSeparatorOccurrenceIndex);
  const newPointPosition = getNthOccurrence(formatted, point, realSeparatorOccurrenceIndex);
  const textParts = splitByIndex(text, pointPosition);
  const formattedParts = splitByIndex(formatted, newPointPosition);
  const isCaretOnFloat = pointPosition !== -1 && normalizedCaret.start > pointPosition;

  if (isCaretOnFloat) {
    const relativeIndex = normalizedCaret.start - pointPosition - 1;
    const digitsBefore = getDigitCountBeforeIndex(relativeIndex, textParts[1]);
    const newPosition = formattedParts[1]
      ? newPointPosition + 1 + getDigitPositionByIndex(digitsBefore, formattedParts[1]) + 1
      : formatted.length;

    return getCaretInBoundaries(newPosition, formatted, format);
  }

  const formattedIntPart = trimNonNumericCharsFromEnd(formattedParts[0]);
  const positionFromEnd = textParts[0].length - normalizedCaret.start;
  const digitsFromEnd = getDigitCountBeforeIndex(positionFromEnd, reverseText(textParts[0]));
  const newPositionFromEnd = getDigitPositionByIndex(digitsFromEnd, reverseText(formattedIntPart));
  const newPositionFromBegin = formattedIntPart.length - (newPositionFromEnd + 1);

  return getCaretInBoundaries(newPositionFromBegin, formatted, format);
};

export const isCaretInBoundaries = (
  caret: CaretPosition,
  text: string,
  format: Format,
): boolean => {
  const normalizedCaret = getCaretWithOffset(caret, 0);
  const boundaries = getCaretInBoundaries(normalizedCaret, text, format);

  return normalizedCaret.start >= boundaries.start && normalizedCaret.end <= boundaries.end;
};

export const getCaretOffset = (
  previousText: string,
  newText: string,
  format: Format,
): number => {
  const previousBoundaries = getCaretBoundaries(previousText, format);
  const newBoundaries = getCaretBoundaries(newText, format);

  return newBoundaries.start - previousBoundaries.start;
};
