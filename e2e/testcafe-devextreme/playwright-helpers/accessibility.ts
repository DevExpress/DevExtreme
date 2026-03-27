import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { generateOptionMatrix } from './generateOptionMatrix';
import { createWidget } from './createWidget';

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

type OptionMatrix<T> = { [K in keyof T]: T[K][] };

export interface MatrixAccessibilityConfig<TOptions = Record<string, unknown>> {
  component: string;
  options?: OptionMatrix<TOptions>;
  a11yCheckConfig?: A11yCheckOptions;
  selector?: string;
  containerUrl: string;
  created?: (page: Page, optionConfiguration: TOptions) => Promise<void>;
}

const componentsWithDisabledColorContrastIssues = ['dxTagBox', 'dxFileUploader', 'dxDateRangeBox'];

export function testAccessibilityMatrix<TOptions extends Record<string, unknown> = Record<string, unknown>>(
  config: MatrixAccessibilityConfig<TOptions>,
): void {
  const {
    component,
    options,
    selector = '#container',
    a11yCheckConfig = {},
    containerUrl,
    created,
  } = config;

  const optionConfigurations: TOptions[] = options && Object.keys(options).length
    ? generateOptionMatrix(options as OptionMatrix<TOptions>)
    : [{} as TOptions];

  optionConfigurations.forEach((optionConfiguration, index) => {
    test(`${component}: test with axe #${index}`, async ({ page }) => {
      await page.goto(containerUrl);
      await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
      await page.evaluate((theme) => new Promise<void>((resolve) => {
        (window as any).DevExpress.ui.themes.ready(resolve);
        (window as any).DevExpress.ui.themes.current(theme);
      }), process.env.THEME || 'fluent.blue.light');

      const currentA11yCheckConfig = { ...a11yCheckConfig } as A11yCheckOptions;
      const isComponentDisabled = (optionConfiguration as Record<string, unknown>).disabled;
      const shouldIgnoreColorContrast = componentsWithDisabledColorContrastIssues
        .includes(component) && isComponentDisabled;

      if (shouldIgnoreColorContrast) {
        if (currentA11yCheckConfig.runOnly === 'color-contrast') {
          return;
        }
        currentA11yCheckConfig.rules = {
          ...currentA11yCheckConfig.rules,
          'color-contrast': { enabled: false },
        };
      }

      await createWidget(page, component, optionConfiguration as Record<string, unknown>, selector);

      if (created) {
        await created(page, optionConfiguration);
      }

      await a11yCheck(page, currentA11yCheckConfig, selector);
    });
  });
}
