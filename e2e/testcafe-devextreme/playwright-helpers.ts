import { Page, expect, Locator } from '@playwright/test';

export async function createWidget(
  page: Page,
  widgetName: string,
  options: Record<string, unknown>,
  selector = '#container',
): Promise<void> {
  await page.evaluate(
    ({ widgetName: wn, options: opts, selector: sel }) => {
      const $element = (window as any).$(sel);
      $element[wn](opts);
    },
    { widgetName, options: JSON.parse(JSON.stringify(options)), selector },
  );
}

export async function testScreenshot(
  page: Page,
  screenshotName: string,
  options?: { element?: Locator },
): Promise<void> {
  const target = options?.element ?? page;
  await expect(target).toHaveScreenshot(screenshotName);
}

export async function changeTheme(page: Page, theme: string): Promise<void> {
  await page.evaluate(
    (t) =>
      new Promise<void>((resolve) => {
        (window as any).DevExpress.ui.themes.ready(resolve);
        (window as any).DevExpress.ui.themes.current(t);
      }),
    theme,
  );
}

export async function insertStylesheetRulesToPage(
  page: Page,
  cssRules: string,
): Promise<void> {
  await page.evaluate((rules) => {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = rules;
    document.head.appendChild(style);
  }, cssRules);
}

export async function setStyleAttribute(
  page: Page,
  locator: Locator,
  styleValue: string,
): Promise<void> {
  await locator.evaluate((el, sv) => {
    (el as HTMLElement).style.cssText = sv;
  }, styleValue);
}

export async function getStyleAttribute(
  page: Page,
  locator: Locator,
): Promise<string> {
  return locator.evaluate((el) => (el as HTMLElement).style.cssText);
}
