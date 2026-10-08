import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';

const notInert = ':not([inert]):not([inert] *)';
const notNegTabIndex = ':not([tabindex^="-"])';
const notDisabled = ':not(:disabled)';

export const ALL_FOCUSABLE_ELEMENTS_SELECTOR = [
  `a[href]${notInert}${notNegTabIndex}`,
  `area[href]${notInert}${notNegTabIndex}`,
  `input:not([type="hidden"]):not([type="radio"])${notInert}${notNegTabIndex}${notDisabled}`,
  `input[type="radio"]${notInert}${notNegTabIndex}${notDisabled}`,
  `select${notInert}${notNegTabIndex}${notDisabled}`,
  `textarea${notInert}${notNegTabIndex}${notDisabled}`,
  `button${notInert}${notNegTabIndex}${notDisabled}`,
  `details${notInert} > summary:first-of-type${notNegTabIndex}`,
  `iframe${notInert}${notNegTabIndex}`,
  `audio[controls]${notInert}${notNegTabIndex}`,
  `video[controls]${notInert}${notNegTabIndex}`,
  `[contenteditable]${notInert}${notNegTabIndex}`,
  `[tabindex]${notInert}${notNegTabIndex}`,
].join(',');

function visible(element: Element): boolean {
  const $element = $(element);
  return $element.is(':visible') && $element.css('visibility') !== 'hidden' && $element.parents().css('visibility') !== 'hidden';
}

const focusableFn = (element, tabIndex): boolean | string => {
  if (!visible(element)) {
    return false;
  }
  const nodeName = element.nodeName.toLowerCase();
  const isTabIndexNotNaN = !isNaN(tabIndex);
  const isDisabled = element.disabled;
  const isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
  const isHyperlink = nodeName === 'a';
  // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the branches
  let isFocusable: boolean | string;
  const { isContentEditable } = element;

  if (isDefaultFocus || isContentEditable) {
    isFocusable = !isDisabled;
  } else if (isHyperlink) {
    isFocusable = element.href || isTabIndexNotNaN;
  } else {
    isFocusable = isTabIndexNotNaN;
  }

  return isFocusable;
};

export const isElementVisible = (element: Element): boolean => visible(element);

export const focusable = (
  index: number,
  element: Element,
): boolean | string => focusableFn(element, $(element).attr('tabIndex'));
export const tabbable = (index: number, element: Element): boolean | string => {
  const tabIndex = $(element).attr('tabIndex');
  // @ts-expect-error attr() returns a string, isNaN and >= expect a number
  return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex);
};
// note: use this method instead of is(":focus")
export const focused = ($element: Parameters<typeof $>[0]): boolean => {
  const element = $($element).get(0);
  // @ts-expect-error get(0) returns Element, getActiveElement expects HTMLElement
  return domAdapter.getActiveElement(element) === element;
};

export default {
  focusable, tabbable, focused, isElementVisible, ALL_FOCUSABLE_ELEMENTS_SELECTOR,
};
