import type { Page } from '@playwright/test';

const STYLESHEET_RULES_ID = 'stylesheetRules';

export const setAttribute = async (
  page: Page,
  selector: string,
  attribute: string,
  value: string,
): Promise<void> => page.evaluate(
  ({ elementSelector, name, attributeValue }) => {
    document.querySelector(elementSelector)?.setAttribute(name, attributeValue);
  },
  { elementSelector: selector, name: attribute, attributeValue: value },
);

export const removeAttribute = async (
  page: Page,
  selector: string,
  attribute: string,
): Promise<void> => page.evaluate(
  ({ elementSelector, name }) => {
    document.querySelector(elementSelector)?.removeAttribute(name);
  },
  { elementSelector: selector, name: attribute },
);

export const appendAttributeValue = async (
  page: Page,
  selector: string,
  attribute: string,
  value: string,
): Promise<void> => page.evaluate(
  ({ elementSelector, name, attributeValue }) => {
    const element = document.querySelector(elementSelector);
    const current = element?.getAttribute(name) ?? '';

    element?.setAttribute(name, `${current} ${attributeValue}`);
  },
  { elementSelector: selector, name: attribute, attributeValue: value },
);

export const setStyleAttribute = async (
  page: Page,
  selector: string,
  value: string,
): Promise<void> => appendAttributeValue(page, selector, 'style', value);

export const setClassAttribute = async (
  page: Page,
  selector: string,
  value: string,
): Promise<void> => appendAttributeValue(page, selector, 'class', value);

export const removeClassAttribute = async (
  page: Page,
  selector: string,
  value: string,
): Promise<void> => page.evaluate(
  ({ elementSelector, className }) => {
    const element = document.querySelector(elementSelector);
    const classes = element?.getAttribute('class') ?? '';

    element?.setAttribute('class', classes.replace(className, ''));
  },
  { elementSelector: selector, className: value },
);

export const appendElementTo = async (
  page: Page,
  parentSelector: string,
  tagName: string,
  id: string,
  style: Record<string, string> = {},
): Promise<void> => page.evaluate(
  ({
    parent, tag, elementId, elementStyle,
  }) => {
    const element = document.createElement(tag);

    element.setAttribute('id', elementId);
    Object.entries(elementStyle).forEach(([key, value]) => { element.style[key] = value; });

    document.querySelector(parent)?.appendChild(element);
  },
  {
    parent: parentSelector, tag: tagName, elementId: id, elementStyle: style,
  },
);

export const addCaptionTo = async (
  page: Page,
  parentSelector: string,
  caption: string,
): Promise<void> => page.evaluate(
  ({ parent, text }) => {
    const element = document.createElement('div');

    element.textContent = text;
    document.querySelector(parent)?.appendChild(element);
  },
  { parent: parentSelector, text: caption },
);

export const insertStylesheetRulesToPage = async (
  page: Page,
  rules: string,
): Promise<void> => page.evaluate(
  ({ stylesheetId, cssRules }) => {
    let style = document.getElementById(stylesheetId) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement('style');
      style.id = stylesheetId;
      document.head.appendChild(style);
    }

    style.sheet?.insertRule(cssRules, style.sheet.cssRules.length);
  },
  { stylesheetId: STYLESHEET_RULES_ID, cssRules: rules },
);

export const removeStylesheetRulesFromPage = async (page: Page): Promise<void> => page.evaluate(
  (stylesheetId) => { document.getElementById(stylesheetId)?.remove(); },
  STYLESHEET_RULES_ID,
);

export const blurActiveElement = async (page: Page): Promise<void> => page.evaluate(() => {
  (document.activeElement as HTMLElement | null)?.blur();
});
