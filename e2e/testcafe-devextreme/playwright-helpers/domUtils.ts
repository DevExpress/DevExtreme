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
  idOrAttrs?: string | Record<string, string>,
): Promise<void> {
  const attrs: Record<string, string> | undefined = typeof idOrAttrs === 'string'
    ? { id: idOrAttrs }
    : idOrAttrs;
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
    const el = document.querySelector(sel);
    if (el) {
      const existing = el.getAttribute('class') ?? '';
      el.setAttribute('class', `${existing} ${cls}`.trim());
    }
  }, { sel: selector, cls: className });
}

export async function addCaptionTo(
  page: Page,
  selector: string,
  caption: string,
  where: InsertPosition = 'beforebegin',
): Promise<void> {
  await page.evaluate(({ sel, cap, pos }) => {
    const element = document.querySelector(sel);
    element?.insertAdjacentText(pos as InsertPosition, cap);
  }, { sel: selector, cap: caption, pos: where });
}
