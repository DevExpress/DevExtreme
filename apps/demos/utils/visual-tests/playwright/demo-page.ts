import { readFileSync } from 'fs';
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
  }
}

const INJECT_DIR = join(__dirname, '..', 'inject');

const MOCKDATE_SOURCE = readFileSync(require.resolve('mockdate'), 'utf8');
const TEST_UTILS_SOURCE = readFileSync(join(INJECT_DIR, 'test-utils.js'), 'utf8');
const TEST_STYLES = readFileSync(join(INJECT_DIR, 'test-styles.css'), 'utf8');

// The test styles go first in <head>, so the styles of a demo still override them.
const addTestStyles = (css: string): void => {
  const add = (): void => {
    const style = document.createElement('style');

    style.textContent = css;
    document.head.prepend(style);
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

// Charts, gauges and range selectors animate their first render in script. The edges of a shape
// drawn that way come out a few colour levels apart from run to run, so the tests switch the
// animation off: the widget is drawn once, in its final state. The listener is added before jQuery
// loads, so it runs ahead of the demo code.
const disableVizAnimation = (): void => {
  document.addEventListener('DOMContentLoaded', () => {
    const viz = window.DevExpress?.viz;

    ['dxChart', 'dxPieChart', 'dxPolarChart', 'dxCircularGauge', 'dxLinearGauge', 'dxBarGauge'].forEach((name) => {
      viz?.[name]?.defaultOptions({ options: { animation: { enabled: false } } });
    });

    viz?.dxRangeSelector?.defaultOptions({ options: { behavior: { animationEnabled: false } } });
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

// One script instead of several: a demo script may use MockDate and testUtils, and the order of
// separate init scripts is not guaranteed.
const getInitScript = (clientScript: string | null): string => [
  `(function () { ${MOCKDATE_SOURCE} }).call(window);`,
  `(function () { ${TEST_UTILS_SOURCE} })();`,
  `(${addTestStyles.toString()})(${JSON.stringify(TEST_STYLES)});`,
  `(${collectConsoleMessages.toString()})();`,
  `(${trackPageSettling.toString()})();`,
  `(${disableVizAnimation.toString()})();`,
  clientScript ?? '',
].join('\n');

export async function prepareDemoPage(
  page: Page,
  url: string,
  theme: string,
  clientScript: string | null,
): Promise<void> {
  await page.addInitScript({ content: getInitScript(clientScript) });

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

export async function openDemo(
  page: Page,
  url: string,
  waitForIdle: () => Promise<void>,
): Promise<void> {
  await page.goto(url);
  await waitForIdle();

  // A screenshot taken before <link rel="stylesheet"> resolves gets unstyled, default-browser layout.
  await page.waitForFunction(() => Array
    .from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .every((link) => link.sheet !== null));
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
