import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export interface A11yCheckOptions {
  runOnly?: string;
  rules?: Record<string, { enabled: boolean }>;
}

async function injectAxeIfNeeded(page: Page): Promise<void> {
  const axeLoaded = await page.evaluate(() => !!(window as any).axe);
  if (!axeLoaded) {
    const axePath = require.resolve('axe-core');
    await page.addScriptTag({ path: axePath });
    await page.waitForFunction(() => !!(window as any).axe);
  }
}

export async function a11yCheck(
  page: Page,
  options: A11yCheckOptions = {},
  selector?: string,
): Promise<void> {
  await injectAxeIfNeeded(page);

  const results = await page.evaluate(
    ({ opts, sel }) => {
      const axeOptions: any = { rules: {} };
      if (opts.rules) {
        Object.entries(opts.rules).forEach(([rule, config]) => {
          axeOptions.rules[rule] = config;
        });
      }
      if (opts.runOnly) {
        axeOptions.runOnly = opts.runOnly;
      }
      const context = sel || document;
      return (window as any).axe.run(context, axeOptions);
    },
    { opts: options, sel: selector },
  );

  const violations = results.violations as any[];

  if (violations.length > 0) {
    const report = violations
      .map((v: any) => {
        const nodes = v.nodes
          .map((n: any) => `  - ${n.html}`)
          .join('\n');
        return `${v.id} (${v.impact}): ${v.description}\n${nodes}`;
      })
      .join('\n\n');

    expect(violations.length, `Accessibility violations found:\n${report}`).toBe(0);
  }
}

export interface TestAccessibilityConfig {
  widgetName: string;
  widgetOptions?: Record<string, unknown>;
  a11yCheckConfig?: A11yCheckOptions;
  selector?: string;
}

export async function testAccessibility(
  page: Page,
  config: TestAccessibilityConfig,
): Promise<void> {
  const {
    widgetName,
    widgetOptions = {},
    a11yCheckConfig = {},
    selector = '#container',
  } = config;

  await page.evaluate(({ name, opts, sel }) => {
    (window as any).DevExpress.fx.off = true;
    const options = typeof opts === 'function' ? opts() : opts;
    ($(sel) as any)[name](options);
  }, { name: widgetName, opts: widgetOptions, sel: selector });

  await a11yCheck(page, a11yCheckConfig, selector);
}
