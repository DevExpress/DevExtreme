import { ClientFunction } from 'testcafe';

function createElement(
  tagName: string,
  id: string,
  style: Partial<CSSStyleDeclaration>,
): HTMLElement {
  const element = document.createElement(tagName);

  element.setAttribute('id', id);
  Object.keys(style).forEach((key) => { element.style[key] = style[key]; });

  return element;
}

export const getStyleAttribute = ClientFunction((selector) => {
  const element = selector();
  return element.getAttribute('style');
});

export const setStyleAttribute = ClientFunction((selector, styleValue) => {
  const element = selector();

  const styles = element.getAttribute('style') || '';
  const updatedStyles = `${styles} ${styleValue}`;

  element.setAttribute('style', updatedStyles);
});

export const insertStylesheetRulesToPage = ClientFunction((
  rule: string,
): void => {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', 'customStylesheetRules');

  styleEl.innerHTML = rule;

  document.head.appendChild(styleEl);
});

export const appendElementTo = ClientFunction((
  targetContainerSelector: string,
  tagName: string,
  elementId,
  additionalStyles?: Partial<CSSStyleDeclaration>,
) => {
  const containerElement = document.querySelector(targetContainerSelector);
  const element = createElement(tagName, elementId, additionalStyles ?? {});

  containerElement?.appendChild(element);
}, { dependencies: { createElement } });
