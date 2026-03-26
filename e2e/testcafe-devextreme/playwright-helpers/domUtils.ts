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
  await page.evaluate(({ sel, style }) => new Promise<void>((resolve) => {
    const element = document.querySelector(sel);
    const styles = element?.getAttribute('style') ?? '';
    element?.setAttribute('style', `${styles} ${style}`);
    window.dispatchEvent(new Event('resize'));
    requestAnimationFrame(() => resolve());
  }), { sel: selector, style: styleValue });
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
  idOrStyles?: string | Record<string, string>,
  additionalStyles?: Record<string, string>,
): Promise<void> {
  const id = typeof idOrStyles === 'string' ? idOrStyles : undefined;
  const styles = additionalStyles ?? (typeof idOrStyles === 'object' ? idOrStyles : undefined);
  await page.evaluate(({ parent, tag, elemId, elemStyles }) => {
    const el = document.createElement(tag);
    if (elemId) el.setAttribute('id', elemId);
    if (elemStyles) {
      Object.entries(elemStyles).forEach(([key, val]) => {
        if (key === 'id') {
          el.setAttribute('id', val as string);
        } else {
          (el.style as any)[key] = val;
        }
      });
    }
    document.querySelector(parent)?.appendChild(el);
  }, {
    parent: parentSelector,
    tag: childSelector,
    elemId: id,
    elemStyles: styles,
  });
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

export async function removeAttribute(
  page: Page,
  selector: string,
  attribute: string,
): Promise<void> {
  await page.evaluate(({ sel, attr }) => {
    document.querySelector(sel)?.removeAttribute(attr);
  }, { sel: selector, attr: attribute });
}

export async function addFocusableElementBefore(
  page: Page,
  targetSelector: string,
  elementId = 'focusable-start',
): Promise<void> {
  await page.evaluate(({ target, id }) => {
    const existing = document.getElementById(id);
    existing?.remove();
    const targetEl = document.querySelector(target);
    const button = document.createElement('button');
    button.id = id;
    button.textContent = 'Start';
    button.style.position = 'fixed';
    button.style.top = '0';
    button.style.left = '0';
    button.style.zIndex = '-1';
    button.style.opacity = '0';
    targetEl?.parentElement?.insertBefore(button, targetEl);
  }, { target: targetSelector, id: elementId });
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
