import domAdapter from '@js/core/dom_adapter';
import { toComparable } from '@js/core/utils/data';
import { isRenderer } from '@js/core/utils/type';

const hasNegation = function (oldValue: number, newValue: number): boolean {
  return (1 / oldValue) === (1 / newValue);
};

export const equals = function (oldValue: unknown, newValue: unknown): boolean {
  const oldComparable = toComparable(oldValue, true);
  const newComparable = toComparable(newValue, true);

  if (oldComparable && newComparable && isRenderer(oldComparable) && isRenderer(newComparable)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- toComparable() is typed any
    return newComparable.is(oldComparable);
  }

  const oldValueIsNaN = Number.isNaN(oldComparable);
  const newValueIsNaN = Number.isNaN(newComparable);
  if (oldValueIsNaN && newValueIsNaN) {
    return true;
  }

  if (oldComparable === 0 && newComparable === 0) {
    return hasNegation(oldComparable, newComparable);
  }

  if (oldComparable === null || typeof oldComparable !== 'object' || domAdapter.isElementNode(oldComparable)) {
    return oldComparable === newComparable;
  }

  return false;
};
