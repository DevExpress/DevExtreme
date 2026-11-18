import type { Page } from '@playwright/test';
import { test as base } from '../../fixtures';
import type { WidgetName } from '../../models/types';
import { DEFAULT_SELECTOR } from '../const';
import { createWidget } from '../createWidget';
import { generateOptionMatrix, type Options } from '../generateOptionMatrix';
import { getThemeName } from '../themeUtils';
import {
  a11yCheck, applyViewportEnvironment, type A11yCheckOptions, type A11yContext,
} from './utils';

export const test = base.extend<{ a11yEnvironment: undefined }>({
  a11yEnvironment: [async ({ page }, use) => {
    await applyViewportEnvironment(page);
    await use(undefined);
  }, { auto: true }],
});

export { expect } from '../../fixtures';

export interface Configuration<TComponentOptions = unknown> {
  component: WidgetName;
  // Tells apart the tests of one component when a file declares several configurations.
  name?: string;
  options?: Options<TComponentOptions>;
  a11yCheckConfig?: A11yCheckOptions | ((theme: string) => A11yCheckOptions);
  selector?: A11yContext;
  created?: (page: Page, optionConfiguration: TComponentOptions) => Promise<void>;
}

export const defaultSelector = DEFAULT_SELECTOR;

export const getDefaultA11yCheckConfig = (theme: string): A11yCheckOptions => (
  getThemeName(theme) === 'fluent' ? {} : { runOnly: 'color-contrast' }
);

const FUNCTION_KEY = '__a11yFunction';

// "page.evaluate" drops functions, so templates and callbacks travel as source text and are
// rebuilt in the page. Like a TestCafe ClientFunction dependency, they must not use closures.
const serializeFunctions = (value: unknown): unknown => {
  if (typeof value === 'function') {
    return { [FUNCTION_KEY]: value.toString() };
  }

  if (Array.isArray(value)) {
    return value.map(serializeFunctions);
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeFunctions(item)]),
    );
  }

  return value;
};

const restoreFunctions = (serialized: unknown): any => {
  const key = '__a11yFunction';

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const build = (code: string): unknown => new Function(`return (${code});`)();

  const restore = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(restore);
    }

    if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
      const source = (value as Record<string, unknown>)[key];

      if (typeof source === 'string') {
        try {
          return build(source);
        } catch {
          // Method shorthand ("name() {}") is not an expression on its own.
          return build(source.replace(/^(async\s+)?/, '$1function '));
        }
      }

      return Object.fromEntries(
        Object.entries(value).map(([name, item]) => [name, restore(item)]),
      );
    }

    return value;
  };

  return restore(serialized);
};

const getOptionConfigurations = <TComponentOptions>(
  options: Options<TComponentOptions> | undefined,
): TComponentOptions[] => {
  if (!(options && Object.keys(options).length)) {
    return [{} as TComponentOptions];
  }

  return generateOptionMatrix(options);
};

export const testAccessibility = <TComponentOptions = unknown>(
  configuration: Configuration<TComponentOptions>,
): void => {
  const {
    component,
    name,
    options,
    selector = defaultSelector,
    a11yCheckConfig,
    created,
  } = configuration;

  getOptionConfigurations(options).forEach((optionConfiguration, index) => {
    const title = `${component}${name ? ` ${name}` : ''}: test with axe #${index}`;

    test(title, async ({ page, theme }) => {
      await createWidget(page, component, restoreFunctions as any, DEFAULT_SELECTOR, {
        arg: serializeFunctions(optionConfiguration),
      });

      await created?.(page, optionConfiguration);

      const checkConfig = typeof a11yCheckConfig === 'function'
        ? a11yCheckConfig(theme)
        : a11yCheckConfig ?? getDefaultA11yCheckConfig(theme);

      await a11yCheck(page, checkConfig, selector, optionConfiguration);
    });
  });
};
