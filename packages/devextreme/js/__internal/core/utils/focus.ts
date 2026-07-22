import domAdapter from '@js/core/dom_adapter';
import { ALL_FOCUSABLE_ELEMENTS_SELECTOR, isElementVisible } from '@ts/core/utils/m_selectors';

const DOCUMENT_POSITION_PRECEDING = 2;
const DOCUMENT_POSITION_FOLLOWING = 4;

export function getFirstFocusableElement(
  root: HTMLElement | null | undefined,
): HTMLElement | null {
  if (!root) {
    return null;
  }

  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR),
  );

  return candidates.find((candidate) => isElementVisible(candidate)) ?? null;
}

function getFocusableElementsOutside(
  containerNode: HTMLElement,
  doc: Document,
): HTMLElement[] {
  return Array.from(
    doc.querySelectorAll<HTMLElement>(ALL_FOCUSABLE_ELEMENTS_SELECTOR),
  ).filter((element) => !containerNode.contains(element) && isElementVisible(element));
}

export function getNextFocusableElement(
  containerNode: HTMLElement,
  doc: Document = domAdapter.getDocument(),
): HTMLElement | null {
  return getFocusableElementsOutside(containerNode, doc)
    .find((element) => {
      const position = containerNode.compareDocumentPosition(element);
      // eslint-disable-next-line no-bitwise
      return Boolean(position & DOCUMENT_POSITION_FOLLOWING);
    }) ?? null;
}

export function getPreviousFocusableElement(
  containerNode: HTMLElement,
  doc: Document = domAdapter.getDocument(),
): HTMLElement | null {
  const precedingElements = getFocusableElementsOutside(containerNode, doc)
    .filter((element) => {
      const position = containerNode.compareDocumentPosition(element);
      // eslint-disable-next-line no-bitwise
      return Boolean(position & DOCUMENT_POSITION_PRECEDING);
    });

  return precedingElements[precedingElements.length - 1] ?? null;
}
