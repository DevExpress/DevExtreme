import { ClientFunction } from 'testcafe';

const STYLESHEET_RULES_ID = 'stylesheetRules';

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

export const insertStylesheetRulesToPage = ClientFunction((
  rule: string,
): void => {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', STYLESHEET_RULES_ID);

  styleEl.innerHTML = rule;

  document.head.appendChild(styleEl);
}, { dependencies: { STYLESHEET_RULES_ID } });

export const removeStylesheetRulesFromPage = ClientFunction((): void => {
  const stylesheetRulesEl = document.querySelector(`#${STYLESHEET_RULES_ID}`);
  stylesheetRulesEl?.remove();
}, { dependencies: { STYLESHEET_RULES_ID } });

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

export const getComputedPropertyValue = ClientFunction((selector, property) => {
  const element = document.querySelector(selector);

  return window.getComputedStyle(element).getPropertyValue(property);
});

export const getDocumentScrollTop = ClientFunction(() => document.documentElement.scrollTop);

export const setStylePropertyValue = ClientFunction((selector, property, value) => {
  const element = document.querySelector(selector);

  element.style[property] = value;
});
