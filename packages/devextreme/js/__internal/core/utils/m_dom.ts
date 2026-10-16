import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import {
  isDefined, isRenderer, isString, isWindow,
} from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

interface ClipboardEventLike {
  originalEvent?: { clipboardData?: DataTransfer | null };
}

interface TextCopyOptions {
  includePaddings?: boolean;
}

const window = getWindow();

const getRootNodeHost = (element: Node): Element | undefined => {
  if (!element.getRootNode) {
    return undefined;
  }

  const { host } = element.getRootNode() as { host?: Element | string };

  // NOTE: getRootNode().host can return a string if element is detached "a" element
  if (isString(host)) {
    return undefined;
  }

  return host;
};

// Returns the parent node, stepping from a shadow root to its host so callers can
// walk out of a shadow tree (T1329805).
export const getParentNode = (
  node: Node,
): Node | null => node.parentNode ?? getRootNodeHost(node) ?? null;

export const resetActiveElement = (): void => {
  const activeElement = domAdapter.getActiveElement();

  if (activeElement && activeElement !== domAdapter.getBody()) {
    activeElement.blur?.();
  }
};

export const clearSelection = (): void => {
  const selection = window.getSelection();
  if (!selection) return;
  if (selection.type === 'Caret') return;

  if (selection.empty) {
    selection.empty();
  } else if (selection.removeAllRanges) {
    // T522811
    try {
      selection.removeAllRanges();
    } catch (e) { /* empty */ }
  }
};

export const closestCommonParent = (
  startTarget: Element | dxElementWrapper | null | undefined,
  endTarget: Element | dxElementWrapper | null | undefined,
): Element | undefined => {
  const $startTarget = $(startTarget);
  const $endTarget = $(endTarget);
  const startElement: Element = $startTarget[0];
  const endElement: Element = $endTarget[0];

  if (startElement === endElement) {
    return startElement;
  }

  const $startParents = $startTarget.parents();
  const $endParents = $endTarget.parents();
  const startingParent = Math.min($startParents.length, $endParents.length);

  for (let i = -startingParent; i < 0; i += 1) {
    if ($startParents.get(i) === $endParents.get(i)) {
      return $startParents.get(i);
    }
  }

  return undefined;
};

export const extractTemplateMarkup = (element: Element | dxElementWrapper): string => {
  const $element = $(element);

  const templateTag = $element.length
    // @ts-expect-error filter() is typed for selectors only
    && $element.filter(function isNotExecutableScript(this: Element) {
      const $node = $(this);
      // @ts-expect-error
      return $node.is('script[type]') && !$node.attr('type').includes('script');
    });

  if (templateTag && templateTag.length) {
    // @ts-expect-error html() without a value returns the markup
    const templateMarkup: string = templateTag.eq(0).html();
    return templateMarkup;
  }
  // @ts-expect-error html() without a value returns the markup
  const markup: string = $('<div>').append($element).html();
  return markup;
};

export const normalizeTemplateElement = (element: unknown): dxElementWrapper => {
  let $element = $();

  if (isDefined(element) && ((element as Partial<Node>).nodeType || isRenderer(element))) {
    // @ts-expect-error a node or a renderer
    $element = $(element);
  } else if (typeof element !== 'object') {
    // @ts-expect-error a primitive is rendered as markup
    $element = $('<div>').html(element).contents();
  }

  if ($element.length === 1) {
    if ($element.is('script')) {
      // @ts-expect-error html() without a value returns the markup
      const markup: string = $element.html();
      $element = normalizeTemplateElement(markup.trim());
    } else if ($element.is('table')) {
      $element = $element.children('tbody').contents();
    }
  }

  return $element;
};

export const clipboardText = (
  event: ClipboardEventLike,
  text?: string,
): string | null | undefined => {
  const clipboard: DataTransfer | null | undefined = event.originalEvent?.clipboardData
    // @ts-expect-error clipboardData doesn't exist in window type
    ?? window.clipboardData;
  if (!text) {
    return clipboard && clipboard.getData('Text');
  }

  if (clipboard) {
    clipboard.setData('Text', text);
  }
  return undefined;
};

export const contains = (
  container: Node | (Window & typeof globalThis),
  element: Node | null | undefined,
): boolean => {
  if (!element) {
    return false;
  }
  if (isWindow(container)) {
    return contains(container.document, element);
  }
  return container.contains(element) || contains(container, getRootNodeHost(element));
};

export const createTextElementHiddenCopy = (
  element: Element | dxElementWrapper,
  text: string,
  options?: TextCopyOptions,
): dxElementWrapper => {
  const elementStyles = window.getComputedStyle($(element).get(0));
  const includePaddings = options?.includePaddings;

  return $('<div>').text(text).css({
    fontStyle: elementStyles.fontStyle,
    fontVariant: elementStyles.fontVariant,
    fontWeight: elementStyles.fontWeight,
    fontSize: elementStyles.fontSize,
    fontFamily: elementStyles.fontFamily,
    letterSpacing: elementStyles.letterSpacing,
    border: elementStyles.border,
    paddingTop: includePaddings ? elementStyles.paddingTop : '',
    paddingRight: includePaddings ? elementStyles.paddingRight : '',
    paddingBottom: includePaddings ? elementStyles.paddingBottom : '',
    paddingLeft: includePaddings ? elementStyles.paddingLeft : '',
    visibility: 'hidden',
    whiteSpace: 'pre',
    position: 'absolute',
    float: 'left',
  });
};

export const insertBefore = (element: Element, newElement?: Node | null): Element => {
  if (newElement) {
    // @ts-expect-error insertElement moves any nodes
    domAdapter.insertElement(element.parentNode, newElement, element);
  }
  return element;
};

export const replaceWith = (
  element: dxElementWrapper,
  newElement: dxElementWrapper | null | undefined,
): dxElementWrapper | undefined => {
  if (!newElement?.[0]) return undefined;
  if (newElement.is(element)) return element;

  each(newElement, (_, currentElement) => {
    insertBefore(element[0], currentElement);
  });
  element.remove();

  return newElement;
};

export const isElementInDom = ($element?: dxElementWrapper): boolean => {
  const element = $element?.get(0);
  const shadowHost = (element?.getRootNode() as { host?: Element | string } | undefined)?.host;

  return !!$(shadowHost || element).closest(getWindow().document).length;
};

const ARIA_DESCRIBEDBY_ATTRIBUTE = 'aria-describedby';

export const getAriaDescriptionIds = (element: Element): string[] => (element.getAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE) ?? '').split(/\s+/).filter(Boolean);

export const setAriaDescriptionIds = (element: Element, ids: string[]): void => {
  const value = ids.join(' ');

  if (!value) {
    element.removeAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE);
  } else if (element.getAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE) !== value) {
    element.setAttribute(ARIA_DESCRIBEDBY_ATTRIBUTE, value);
  }
};

// Adds the id to the element's aria-describedby list, preserving ids from other
// owners. Returns true when the id was actually added (was not present yet).
export const addAriaDescriptionId = (element: Element, id: string): boolean => {
  const ids = getAriaDescriptionIds(element);

  if (ids.includes(id)) {
    return false;
  }

  ids.push(id);
  setAriaDescriptionIds(element, ids);

  return true;
};

// Removes the id from the element's aria-describedby list, keeping ids from other owners.
export const removeAriaDescriptionId = (element: Element, id: string): void => {
  const ids = getAriaDescriptionIds(element);
  const restIds = ids.filter((token) => token !== id);

  if (restIds.length !== ids.length) {
    setAriaDescriptionIds(element, restIds);
  }
};

export default {
  resetActiveElement,
  clearSelection,
  closestCommonParent,
  extractTemplateMarkup,
  normalizeTemplateElement,
  clipboardText,
  contains,
  getParentNode,
  createTextElementHiddenCopy,
  insertBefore,
  replaceWith,
  isElementInDom,
  addAriaDescriptionId,
  removeAriaDescriptionId,
};
