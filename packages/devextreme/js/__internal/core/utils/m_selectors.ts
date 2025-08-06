import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';

const focusableFn = (element, tabIndex) => {
  if (!visible(element)) {
    return false;
  }
  const nodeName = element.nodeName.toLowerCase();
  const isTabIndexNotNaN = !isNaN(tabIndex);
  const isDisabled = element.disabled;
  const isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
  const isHyperlink = nodeName === 'a';
  let isFocusable;
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

function visible(element) {
  const $element = $(element);
  return $element.is(':visible') && $element.css('visibility') !== 'hidden' && $element.parents().css('visibility') !== 'hidden';
}

export const focusable = (index, element) => focusableFn(element, $(element).attr('tabIndex'));
export const tabbable = (index, element) => {
  const tabIndex = $(element).attr('tabIndex');
  // @ts-expect-error
  return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex);
};
// note: use this method instead of is(":focus")
export const focused = ($element) => {
  const element = $($element).get(0);
  // @ts-expect-error
  return domAdapter.getActiveElement(element) === element;
};

export default { focusable, tabbable, focused };
