import type { Page } from '@playwright/test';

export async function createWidget(
  page: Page,
  widgetName: string,
  widgetOptions: Record<string, unknown> | (() => Record<string, unknown>),
  selector = '#container',
  disableFxAnimation = true,
): Promise<void> {
  await page.evaluate(({ name, opts, sel, disableFx }) => {
    (window as any).DevExpress.fx.off = disableFx;
    const options = typeof opts === 'function' ? opts() : opts;
    ($(sel) as any)[name](options);
  }, { name: widgetName, opts: widgetOptions, sel: selector, disableFx: disableFxAnimation });
}
