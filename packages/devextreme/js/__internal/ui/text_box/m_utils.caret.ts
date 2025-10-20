import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

export interface CaretRange {
  start: number;
  end: number;
}

const {
  ios,
  // @ts-expect-error Device type doesn't contain mac
  mac,
} = devices.real();

// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const isFocusingOnCaretChange = ios || mac;

const getCaret = (input: HTMLInputElement): CaretRange => {
  let range: CaretRange = {
    start: 0,
    end: 0,
  };

  try {
    range = {
      start: input.selectionStart ?? 0,
      end: input.selectionEnd ?? 0,
    };
  } catch (e) {
    range = {
      start: 0,
      end: 0,
    };
  }

  return range;
};

export const setCaret = (
  input: HTMLInputElement,
  selection: CaretRange,
): void => {
  try {
    input.selectionStart = selection.start;
    input.selectionEnd = selection.end;
  } catch { /** empty */ }
};

const caret = (
  input: HTMLInputElement | dxElementWrapper,
  selection?: CaretRange,
  force = false,
): CaretRange | undefined => {
  const inputElement = $(input).get(0) as HTMLInputElement;

  if (!isDefined(selection)) {
    return getCaret(inputElement);
  }

  // NOTE: AppleWebKit-based browsers focuses element input after caret position has changed
  if (
    !force
    && isFocusingOnCaretChange
    && domAdapter.getActiveElement(inputElement) !== inputElement
  ) {
    return undefined;
  }

  setCaret(inputElement, selection);

  return undefined;
};

export default caret;
