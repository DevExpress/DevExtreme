import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';

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

export const focusable = (
  index: number,
  element: Element,
): boolean | string => focusableFn(element, $(element).attr('tabIndex'));
export const tabbable = (index: number, element: Element): boolean | string => {
  const tabIndex = $(element).attr('tabIndex');
  // @ts-expect-error
  return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex);
};
// note: use this method instead of is(":focus")
export const focused = ($element: Parameters<typeof $>[0]): boolean => {
  const element = $($element).get(0);
  // @ts-expect-error
  return domAdapter.getActiveElement(element) === element;
};

export default { focusable, tabbable, focused };
