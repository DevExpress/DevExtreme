import { readFileSync } from 'fs';
import { join } from 'path';
import type { Page } from '@playwright/test';
import { applyTheme } from '../matrix-test-core';

interface ConsoleMessage {
  level: 'error' | 'warn';
  text: string;
}

declare global {
  interface Window {
    demoConsoleMessages: ConsoleMessage[];
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

// One script instead of several: a demo script may use MockDate and testUtils, and the order of
// separate init scripts is not guaranteed.
const getInitScript = (clientScript: string | null): string => [
  `(function () { ${MOCKDATE_SOURCE} }).call(window);`,
  `(function () { ${TEST_UTILS_SOURCE} })();`,
  `(${addTestStyles.toString()})(${JSON.stringify(TEST_STYLES)});`,
  `(${collectConsoleMessages.toString()})();`,
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

export async function openDemo(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'networkidle' });

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
