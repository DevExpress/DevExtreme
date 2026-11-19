import { readFileSync } from 'fs';
import { join } from 'path';
import type { Page, Request } from '@playwright/test';
import { applyTheme } from '../matrix-test-core';

interface ConsoleMessage {
  level: 'error' | 'warn';
  text: string;
}

declare global {
  interface Window {
    demoConsoleMessages: ConsoleMessage[];
    demoAnimationsFinished: () => Promise<void>;
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

// A script animation asks for a frame for as long as it runs, so two frames in a row with no
// request pending mean that nothing is animating.
const trackAnimationFrames = (): void => {
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

  window.demoAnimationsFinished = (): Promise<void> => new Promise((resolve) => {
    let idleFrames = 0;

    const check = (): void => {
      idleFrames = pending.size === 0 ? idleFrames + 1 : 0;

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
  `(${trackAnimationFrames.toString()})();`,
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
      await page.evaluate(() => window.demoAnimationsFinished());
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

  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }

    window.getSelection()?.removeAllRanges();
  });

  await page.mouse.move(1, 1);

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
