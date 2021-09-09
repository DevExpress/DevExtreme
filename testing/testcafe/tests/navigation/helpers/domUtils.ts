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
