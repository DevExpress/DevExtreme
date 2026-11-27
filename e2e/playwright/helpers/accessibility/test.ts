import type { JSHandle, Page } from '@playwright/test';
import { expect, GOOGLE_FONTS, test as base } from '../../fixtures';
import type { WidgetName } from '../../models/types';
import { DEFAULT_SELECTOR } from '../const';
import { createWidget } from '../createWidget';
import { generateOptionMatrix, type Options } from '../generateOptionMatrix';
import { changeTheme, resetPageState } from '../testPageUtils';
import { getThemeName } from '../themeUtils';
import {
  a11yCheck,
  clearContainerPage,
  openContainerPage,
  type A11yCheckOptions,
  type A11yContext,
} from './utils';

interface A11yWorkerFixtures {
  sharedPage: Page;
}

// One page per worker, cleared between tests, the way the TestCafe fixtures kept their page:
// loading dx.all.js again for each of the ~2400 tests made a run too long for its CI job.
export const test = base.extend<object, A11yWorkerFixtures>({
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

const toPageFunction = async (page: Page, source: string): Promise<JSHandle> => {
  try {
    return await page.evaluateHandle(`(${source})`);
  } catch {
    // Method shorthand ("name() {}") is not an expression on its own.
    return page.evaluateHandle(`(${source.replace(/^(async\s+)?/, '$1function ')})`);
  }
};

// "page.evaluate" drops functions, so templates and callbacks travel as source text: Playwright
// compiles each one in the page and the options carry its handle instead. Like a TestCafe
// ClientFunction dependency, they must not use closures.
const toPageOptions = async (
  page: Page,
  value: unknown,
  handles: JSHandle[],
): Promise<unknown> => {
  if (typeof value === 'function') {
    const handle = await toPageFunction(page, value.toString());

    handles.push(handle);

    return handle;
  }

  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => toPageOptions(page, item, handles)));
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const entries = await Promise.all(Object.entries(value).map(
      async ([key, item]) => [key, await toPageOptions(page, item, handles)],
    ));

    return Object.fromEntries(entries);
  }

  return value;
};

const getOptionConfigurations = <TComponentOptions>(
  options: Options<TComponentOptions> | undefined,
): TComponentOptions[] => {
  if (!(options && Object.keys(options).length)) {
    return [{} as TComponentOptions];
  }

  return generateOptionMatrix(options);
};

// Disabled states of these components do not reach the AA contrast ratio in this release.
const componentsWithDisabledColorContrastIssues: WidgetName[] = ['dxTagBox', 'dxFileUploader', 'dxDateRangeBox'];

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
      const handles: JSHandle[] = [];
      const widgetOptions = await toPageOptions(page, optionConfiguration, handles);

      await createWidget(page, component, widgetOptions as any);
      await Promise.all(handles.map((handle) => handle.dispose()));

      await created?.(page, optionConfiguration);

      let checkConfig = typeof a11yCheckConfig === 'function'
        ? a11yCheckConfig(theme)
        : a11yCheckConfig ?? getDefaultA11yCheckConfig(theme);

      const isComponentDisabled = (optionConfiguration as Record<string, unknown>).disabled;

      if (componentsWithDisabledColorContrastIssues.includes(component) && isComponentDisabled) {
        if (checkConfig.runOnly === 'color-contrast') {
          return;
        }

        checkConfig = {
          ...checkConfig,
          rules: { ...checkConfig.rules, 'color-contrast': { enabled: false } },
        };
      }

      await a11yCheck(page, checkConfig, selector, optionConfiguration);
    });
  });
};
