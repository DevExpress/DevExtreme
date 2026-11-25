import type { Locator, Page } from '@playwright/test';
import { expect } from '../fixtures';

const STYLESHEET_RULES_ID = 'stylesheetRules';

const toLocator = (page: Page, target: Locator | string): Locator => (
  typeof target === 'string' ? page.locator(target).first() : target
);

export const setAttribute = async (
  page: Page,
  target: Locator | string,
  attribute: string,
  value: string,
): Promise<void> => toLocator(page, target).evaluate(
  (element, { name, attributeValue }) => {
    element.setAttribute(name, attributeValue);
  },
  { name: attribute, attributeValue: value },
);

export const appendAttributeValue = async (
  page: Page,
  target: Locator | string,
  attribute: string,
  value: string,
): Promise<void> => toLocator(page, target).evaluate(
  (element, { name, attributeValue }) => {
    element.setAttribute(name, `${element.getAttribute(name) ?? ''} ${attributeValue}`);
  },
  { name: attribute, attributeValue: value },
);

export const setStyleAttribute = async (
  page: Page,
  target: Locator | string,
  value: string,
): Promise<void> => appendAttributeValue(page, target, 'style', value);

export const setClassAttribute = async (
  page: Page,
  target: Locator | string,
  value: string,
): Promise<void> => appendAttributeValue(page, target, 'class', value);

export const removeClassAttribute = async (
  page: Page,
  target: Locator | string,
  value: string,
): Promise<void> => toLocator(page, target).evaluate(
  (element, className) => { element.classList.remove(className); },
  value,
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
  elementSelector: string,
  caption: string,
  where: InsertPosition = 'beforebegin',
): Promise<void> => page.evaluate(
  ({ selector, text, position }) => {
    document.querySelector(selector)?.insertAdjacentText(position, text);
  },
  { selector: elementSelector, text: caption, position: where },
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

    style.appendChild(document.createTextNode(cssRules));
  },
  { stylesheetId: STYLESHEET_RULES_ID, cssRules: rules },
);

export const removeStylesheetRulesFromPage = async (page: Page): Promise<void> => page.evaluate(
  (stylesheetId) => { document.getElementById(stylesheetId)?.remove(); },
  STYLESHEET_RULES_ID,
);

export const hasHorizontalScroll = async (
  locator: Locator,
): Promise<boolean> => locator.evaluate((element) => element.scrollWidth > element.clientWidth);

export const getDocumentScrollTop = async (
  page: Page,
): Promise<number> => page.evaluate(() => document.documentElement.scrollTop);

export const addFocusableElementBefore = async (
  page: Page,
  targetSelector: string,
  elementId = 'focusable-start',
): Promise<string> => page.evaluate(
  ({ selector, id }) => {
    document.getElementById(id)?.remove();

    const target = document.querySelector(selector);
    const button = document.createElement('button');

    button.id = id;
    button.textContent = 'Start';
    Object.assign(button.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '1px',
      height: '1px',
      padding: '0',
      border: '0',
      overflow: 'hidden',
      opacity: '0',
    });
    target?.parentElement?.insertBefore(button, target);

    return button.id;
  },
  { selector: targetSelector, id: elementId },
);

export const addFocusableElementAfter = async (
  page: Page,
  targetSelector: string,
  elementId = 'focusable-end',
): Promise<string> => page.evaluate(
  ({ selector, id }) => {
    document.getElementById(id)?.remove();

    const target = document.querySelector(selector);
    const button = document.createElement('button');

    button.id = id;
    button.textContent = 'End';
    target?.parentElement?.insertBefore(button, target.nextElementSibling);

    return button.id;
  },
  { selector: targetSelector, id: elementId },
);

export const expectImagesLoaded = async (container: Locator, count: number): Promise<void> => {
  const images = container.locator('img');

  await expect(images).toHaveCount(count);
  await expect.poll(() => images.evaluateAll((elements: HTMLImageElement[]) => elements
    .every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
};
