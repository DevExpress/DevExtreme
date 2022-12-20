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

export const setAttribute = ClientFunction((selector, attribute, value) => {
  const element = document.querySelector(selector);

  element.setAttribute(attribute, value);
});

export const removeAttribute = ClientFunction((selector, attribute) => {
  const element = document.querySelector(selector);

  element.removeAttribute(attribute);
});

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

export const getClassAttribute = ClientFunction((selector) => {
  const element = selector();
  return element.getAttribute('class');
});

export const setClassAttribute = ClientFunction((selector, styleValue) => {
  const element = selector();

  const styles = element.getAttribute('class') || '';
  const updatedClasses = `${styles} ${styleValue}`;

  element.setAttribute('class', updatedClasses);
});

export const removeClassAttribute = ClientFunction((selector, styleValue) => {
  const element = selector();

  const styles = element.getAttribute('class') || '';
  const updatedClasses = `${styles.replace(styleValue, '')}`;

  element.setAttribute('class', updatedClasses);
});

export const appendElementTo = ClientFunction((
  containerSelector: string,
  tagName: string,
  id,
  style?: Partial<CSSStyleDeclaration>,
) => {
  const containerElement = document.querySelector(containerSelector);
  const element = createElement(tagName, id, style ?? {});

  containerElement?.appendChild(element);
}, { dependencies: { createElement } });

export const insertStylesheetRule = ClientFunction((
  rule: string,
  index: number,
): void => {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', `styleElement_${index}`);
  document.head.appendChild(styleEl);

  styleEl.sheet!.insertRule(rule, index);
}, { dependencies: { } });

export const deleteStylesheetRule = ClientFunction((
  index: number,
): void => {
  const styleElement = document.getElementById(`styleElement_${index}`);
  (styleElement as HTMLStyleElement).sheet!.deleteRule(index);

  styleElement?.remove();
}, { dependencies: { } });
