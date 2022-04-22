import { ClientFunction } from 'testcafe';

function createElement(
  tagName: string,
  id: string,
  style: Partial<CSSStyleDeclaration>,
): HTMLElement {
  const el = document.createElement(tagName);

  el.setAttribute('id', id);
  Object.keys(style).forEach((key) => { el.style[key] = style[key]; });

  return el;
}

export const appendElementTo = ClientFunction((
  containerSelector: string,
  tagName: string,
  id,
  style: Partial<CSSStyleDeclaration>,
) => {
  const containerElement = document.querySelector(containerSelector);
  const element = createElement(tagName, id, style);

  containerElement?.appendChild(element);
}, { dependencies: { createElement } });

export const insertElementBefore = ClientFunction((
  containerSelector: string,
  referenceSelector: string,
  tagName: string,
  id: string,
  style: Partial<CSSStyleDeclaration>,
) => {
  const containerElement = document.querySelector(containerSelector);
  const element = createElement(tagName, id, style);

  containerElement?.insertBefore(element, document.querySelector(referenceSelector));
}, { dependencies: { createElement } });

export const insertStylesheetRule = ClientFunction((
  rule: string,
  index: number,
): CSSStyleSheet => {
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  styleEl.sheet!.insertRule(rule, index);

  return styleEl.sheet!;
}, { dependencies: { } });

export const deleteStylesheetRule = ClientFunction((
  stylesheet: CSSStyleSheet,
  index: number,
) => {
  stylesheet.deleteRule(index);
}, { dependencies: { } });
