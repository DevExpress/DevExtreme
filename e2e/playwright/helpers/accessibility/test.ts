import type { Page } from '@playwright/test';
import { expect, GOOGLE_FONTS, test as base } from '../../fixtures';
import type { WidgetName } from '../../models/types';
import { DEFAULT_SELECTOR, TEST_PAGE_URL } from '../const';
import { createWidget } from '../createWidget';
import { generateOptionMatrix, type Options } from '../generateOptionMatrix';
import { changeTheme, resetPageState } from '../testPageUtils';
import { getThemeName } from '../themeUtils';
import {
  a11yCheck,
  applyViewportEnvironment,
  clearContainerPage,
  openContainerPage,
  type A11yCheckOptions,
  type A11yContext,
} from './utils';

interface A11yOptions {
  containerUrl: string;
}

interface A11yWorkerFixtures {
  sharedPage: Page;
}

// One page per worker, cleared between tests, the way the TestCafe fixtures kept their page:
// loading dx.all.js again for each of the ~2400 tests made a run too long for its CI job.
export const test = base.extend<A11yOptions, A11yWorkerFixtures>({
  containerUrl: [TEST_PAGE_URL, { option: true }],

  sharedPage: [async ({ browser }, use, workerInfo) => {
    const { baseURL, timezoneId } = workerInfo.project.use;
    const context = await browser.newContext({ baseURL, timezoneId });

    await context.route(GOOGLE_FONTS, (route) => route.fulfill({ contentType: 'text/css' }));
    await use(await context.newPage());
    await context.close();
  }, { scope: 'worker' }],

  page: async ({
    sharedPage: page, theme, browserSize, containerUrl,
  }, use) => {
    const [width, height] = browserSize;
    const pageErrors: string[] = [];
    const onPageError = (error: Error): void => { pageErrors.push(error.stack ?? error.message); };

    page.on('pageerror', onPageError);

    await page.setViewportSize({ width, height });

    if (page.url() === 'about:blank' || new URL(page.url()).pathname !== containerUrl) {
      await openContainerPage(page, containerUrl);
    } else {
      await clearContainerPage(page);
    }

    await changeTheme(page, theme);
    await applyViewportEnvironment(page);
    await resetPageState(page);
    await page.mouse.up();

    await use(page);

    page.off('pageerror', onPageError);
    expect(pageErrors, 'uncaught errors in the page').toEqual([]);
  },
});

export { expect };

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
