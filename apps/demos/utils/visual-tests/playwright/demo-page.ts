import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { Page, Request } from '@playwright/test';
import { applyTheme } from '../matrix-test-core';

interface ConsoleMessage {
  level: 'error' | 'warn';
  text: string;
}

interface WidgetClass {
  defaultOptions: (rule: { options: Record<string, unknown> }) => void;
}

declare global {
  interface Window {
    DevExpress?: { viz?: Record<string, WidgetClass | undefined> };
    demoConsoleMessages: ConsoleMessage[];
    demoSettled: () => Promise<void>;
    dxTestDisableVizAnimation: (widget: WidgetClass | undefined, name: string) => void;
  }
}

const INJECT_DIR = join(__dirname, '..', 'inject');

const MOCKDATE_SOURCE = readFileSync(require.resolve('mockdate'), 'utf8');
const TEST_UTILS_SOURCE = readFileSync(join(INJECT_DIR, 'test-utils.js'), 'utf8');
const TEST_STYLES = readFileSync(join(INJECT_DIR, 'test-styles.css'), 'utf8');

// Adds a style to <head> as soon as it exists, before the parser adds the stylesheets of the demo.
// The test styles go first, so the styles of a demo still override them; a style for one demo
// comes before the stylesheets too, so it takes !important to override them.
export const addStyles = (css: string, position: 'prepend' | 'append'): void => {
  const add = (): void => {
    const style = document.createElement('style');

    style.textContent = css;
    document.head[position](style);
  };

  if (document.head) {
    add();
    return;
  }

  const observer = new MutationObserver(() => {
    if (document.head) {
      observer.disconnect();
      add();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
};

const collectConsoleMessages = (): void => {
  window.demoConsoleMessages = [];

  (['error', 'warn'] as const).forEach((level) => {
    const original = console[level];

    console[level] = (...args: unknown[]): void => {
      window.demoConsoleMessages.push({ level, text: args.map(String).join(' ') });
      original.apply(console, args);
    };
  });

  window.addEventListener('error', (e) => {
    console.error(e.message);
  });
};

// The widgets whose start-up animation the tests switch off, by the file of their public module.
const VIZ_WIDGETS: Record<string, string> = {
  chart: 'dxChart',
  pie_chart: 'dxPieChart',
  polar_chart: 'dxPolarChart',
  circular_gauge: 'dxCircularGauge',
  linear_gauge: 'dxLinearGauge',
  bar_gauge: 'dxBarGauge',
  range_selector: 'dxRangeSelector',
};

interface VendorVizWidgets {
  globalVar: string;
  // [key of the module in the vendor global, widget name]
  widgets: [string, string][];
}

// React and Vue demos take devextreme from a vendor bundle shared by all demos. Its global holds
// every module of the bundle under the key its manifest lists, so the widget classes the demo will
// use are reachable without window.DevExpress.
export function getVendorVizWidgets(framework: string): VendorVizWidgets | null {
  const manifestPath = join(__dirname, '..', '..', '..', 'bundles', 'vendor', `${framework.toLowerCase()}.manifest.json`);

  if (!existsSync(manifestPath)) {
    return null;
  }

  const { globalVar, coverage } = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    globalVar: string;
    coverage: [string, string][];
  };
  const widgets = coverage.flatMap(([file, key]): [string, string][] => {
    const name = /[\\/]esm[\\/]viz[\\/](\w+)\.js$/.exec(file)?.[1];

    return name && VIZ_WIDGETS[name] ? [[key, VIZ_WIDGETS[name]]] : [];
  });

  return { globalVar, widgets };
}

// Charts, gauges and range selectors animate their first render in script. The edges of a shape
// drawn that way come out a few colour levels apart from run to run, so the tests switch the
// animation off: the widget is drawn once, in its final state. The hooks are installed before any
// page script runs, so they take effect ahead of the demo code.
const disableVizAnimation = (vendor: VendorVizWidgets | null, names: string[]): void => {
  const disable = (widget: WidgetClass | undefined, name: string): void => {
    widget?.defaultOptions({
      options: name === 'dxRangeSelector'
        ? { behavior: { animationEnabled: false } }
        : { animation: { enabled: false } },
    });
  };

  // An Angular demo bundle calls it for the widgets it uses before the demo renders.
  window.dxTestDisableVizAnimation = disable;

  // The vendor script assigns its global before the demo bundle runs.
  if (vendor) {
    let modules: Record<string, { default?: WidgetClass } | undefined> | undefined;

    Object.defineProperty(window, vendor.globalVar, {
      configurable: true,
      get: () => modules,
      set: (value: typeof modules) => {
        modules = value;
        vendor.widgets.forEach(([key, name]) => disable(modules?.[key]?.default, name));
      },
    });
  }

  // A jQuery demo takes the widgets from dx.all.js, which exposes them on window.DevExpress.
  document.addEventListener('DOMContentLoaded', () => {
    names.forEach((name) => disable(window.DevExpress?.viz?.[name], name));
  });
};

// A script animation asks for a frame for as long as it runs, and a grid keeps its load panel on
// screen for a while after the data has come. Two frames in a row with neither mean that the page
// has settled.
const trackPageSettling = (): void => {
  const pending = new Set<number>();
  const request = window.requestAnimationFrame.bind(window);
  const cancel = window.cancelAnimationFrame.bind(window);

  window.requestAnimationFrame = (callback): number => {
    const id = request((time) => {
      pending.delete(id);
      callback(time);
    });

    pending.add(id);

    return id;
  };

  window.cancelAnimationFrame = (id): void => {
    pending.delete(id);
    cancel(id);
  };

  const isLoadPanelVisible = (): boolean => Array
    .from(document.querySelectorAll('.dx-loadpanel-content'))
    .some((panel) => panel.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }));

  window.demoSettled = (): Promise<void> => new Promise((resolve) => {
    let idleFrames = 0;

    const check = (): void => {
      idleFrames = pending.size === 0 && !isLoadPanelVisible() ? idleFrames + 1 : 0;

      if (idleFrames === 2) {
        resolve();
      } else {
        request(check);
      }
    };

    request(check);
  });
};

// Demos that generate their data with Math.random() draw the same picture only if they get the
// same numbers. The seeded random of Chrome gives a sequence, but which numbers a demo gets depends
// on how many calls the framework and DevExtreme (guids) made before it, and that differs between
// frameworks. So every call site gets its own counter, and its n-th call returns the n-th number.
const makeRandomDeterministic = (): void => {
  const calls = new Map<string, number>();

  Math.random = (): number => {
    const site = new Error().stack?.split('\n')[2] ?? '';
    const index = calls.get(site) ?? 0;

    calls.set(site, index + 1);

    // A 32-bit integer hash of the index (mulberry32), scaled to [0, 1).
    let t = (index + 0x6D2B79F5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// One script instead of several: a demo script may use MockDate and testUtils, and the order of
// separate init scripts is not guaranteed.
const getInitScript = (
  clientScript: string | null,
  testGlobals: string | null,
  vendor: VendorVizWidgets | null,
): string => [
  `(${makeRandomDeterministic.toString()})();`,
  `(function () { ${MOCKDATE_SOURCE} }).call(window);`,
  testGlobals ?? '',
  `(function () { ${TEST_UTILS_SOURCE} })();`,
  `(${addStyles.toString()})(${JSON.stringify(TEST_STYLES)}, 'prepend');`,
  `(${collectConsoleMessages.toString()})();`,
  `(${trackPageSettling.toString()})();`,
  `(${disableVizAnimation.toString()})(${JSON.stringify(vendor)}, ${JSON.stringify(Object.values(VIZ_WIDGETS))});`,
  clientScript ?? '',
].join('\n');

export async function prepareDemoPage(
  page: Page,
  url: string,
  theme: string,
  clientScript: string | null,
  testGlobals: string | null = null,
  vendor: VendorVizWidgets | null = null,
): Promise<void> {
  await page.addInitScript({ content: getInitScript(clientScript, testGlobals, vendor) });

  await page.route((requestUrl) => requestUrl.href === url, async (route) => {
    const response = await route.fetch();

    await route.fulfill({ response, body: applyTheme(await response.text(), theme) });
  });
}

// The "networkidle" load state cannot do this job: it is reported once per navigation, and a long
// script keeps the network quiet enough for it to come before the page has finished loading.
export function trackPageActivity(page: Page): () => Promise<void> {
  const pending = new Set<Request>();
  let onIdle: (() => void) | null = null;

  const release = (request: Request): void => {
    pending.delete(request);

    if (pending.size === 0) {
      onIdle?.();
    }
  };

  page.on('request', (request) => pending.add(request));
  page.on('requestfinished', release);
  page.on('requestfailed', release);

  return async (): Promise<void> => {
    do {
      if (pending.size > 0) {
        await new Promise<void>((resolve) => { onIdle = resolve; });
        onIdle = null;
      }

      // A request the page sends in reply to a response is in the set by the time this resolves.
      await page.evaluate(() => window.demoSettled());
    } while (pending.size > 0);
  };
}

// Waits until a demo that has just loaded is ready for a screenshot.
export async function waitForDemo(page: Page, waitForIdle: () => Promise<void>): Promise<void> {
  await waitForIdle();

  // A screenshot taken before <link rel="stylesheet"> resolves gets unstyled, default-browser layout.
  await page.waitForFunction(() => Array
    .from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .every((link) => link.sheet !== null));

  // An Angular demo shows "Loading..." in <demo-app> until the application has bootstrapped.
  if (await page.locator('demo-app').count()) {
    await page.waitForFunction(() => document.querySelector<HTMLElement>('demo-app')?.innerText !== 'Loading...');
    await waitForIdle();
  }
}

export async function openDemo(
  page: Page,
  url: string,
  waitForIdle: () => Promise<void>,
): Promise<void> {
  await page.goto(url);
  await waitForDemo(page, waitForIdle);
}

export async function runTestCode(page: Page, code: string): Promise<void> {
  await page.evaluate(async (source) => {
    // eslint-disable-next-line no-eval
    await eval(source);
  }, code);
}

export async function getConsoleMessages(page: Page): Promise<string[]> {
  const messages = await page.evaluate(() => window.demoConsoleMessages);

  return [
    ...messages.filter(({ level }) => level === 'error'),
    ...messages.filter(({ level }) => level === 'warn'),
  ].map(({ text }) => text);
}
