import devices from '@js/core/devices';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';

export interface CaretRange { start: number; end: number }

const {
  ios,
  // @ts-expect-error
  mac,
} = devices.real();
// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
const isFocusingOnCaretChange = ios || mac;

const getCaret = (input: HTMLInputElement): CaretRange => {
  let range;

  try {
    range = {
      start: input.selectionStart,
      end: input.selectionEnd,
    };
  } catch (e) {
    range = {
      start: 0,
      end: 0,
    };
  }

  return range;
};

/**
 * вторая часть выражения была добавлена во время поддержки ShodowDOM
 * первая часть выражения судя по-всему была добавлена для того,
 * чтобы запревентить input === undefined, НО
 * input может существовать, но не быть приаттаченным к DOM
 * да даже если input не принадлежит к этому body, то какая может быть опасность?
 */

export const setCaret = (input, position) => {
  // const body = domAdapter.getBody();
  // if (!body.contains(input) && !body.contains(input.getRootNode().host)) {
  //   return;
  // }

  // try {
  input.selectionStart = position.start;
  input.selectionEnd = position.end;
  // } catch (e) { /* empty */ }
};
// @ts-expect-error

const caret = (input, position?: any, force = false): CaretRange | undefined => {
  input = $(input).get(0);

  if (!isDefined(position)) {
    return getCaret(input);
  }

  // NOTE: AppleWebKit-based browsers focuses element input after caret position has changed
  if (!force && isFocusingOnCaretChange && domAdapter.getActiveElement(input) !== input) {
    return;
  }

  setCaret(input, position);
};

export default caret;
