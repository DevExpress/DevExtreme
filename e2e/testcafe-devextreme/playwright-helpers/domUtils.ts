import type { Page } from '@playwright/test';

export async function setAttribute(
  page: Page,
  selector: string,
  attribute: string,
  value: string,
): Promise<void> {
  await page.evaluate(({ sel, attr, val }) => {
    document.querySelector(sel)?.setAttribute(attr, val);
  }, { sel: selector, attr: attribute, val: value });
}

export async function getStyleAttribute(page: Page, selector: string): Promise<string> {
  return page.evaluate(
    (sel) => document.querySelector(sel)?.getAttribute('style') ?? '',
    selector,
  );
}

export async function setStyleAttribute(
  page: Page,
  selector: string,
  styleValue: string,
): Promise<void> {
  await page.evaluate(({ sel, style }) => {
    const element = document.querySelector(sel);
    const styles = element?.getAttribute('style') ?? '';
    element?.setAttribute('style', `${styles} ${style}`);
  }, { sel: selector, style: styleValue });
}

export async function insertStylesheetRulesToPage(
  page: Page,
  rules: string,
): Promise<void> {
  await page.evaluate((css) => {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-playwright-style', 'true');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  }, rules);
}

export async function removeStylesheetRulesFromPage(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.querySelectorAll('style[data-playwright-style]').forEach((el) => el.remove());
  });
}

export async function appendElementTo(
  page: Page,
  parentSelector: string,
  childSelector: string,
  attrs?: Record<string, string>,
): Promise<void> {
  await page.evaluate(({ parent, tag, attributes }) => {
    const el = document.createElement(tag);
    if (attributes) {
      Object.entries(attributes).forEach(([key, val]) => el.setAttribute(key, val));
    }
    document.querySelector(parent)?.appendChild(el);
  }, { parent: parentSelector, tag: childSelector, attributes: attrs });
}

export async function setClassAttribute(
  page: Page,
  selector: string,
  className: string,
): Promise<void> {
  await page.evaluate(({ sel, cls }) => {
    document.querySelector(sel)?.setAttribute('class', cls);
  }, { sel: selector, cls: className });
}
