import { existsSync, mkdirSync } from 'fs';
import { createRequire } from 'module';
import { join, resolve } from 'path';
import { glob } from 'glob';
import type { Page } from '@playwright/test';

import {
  changeTheme,
  createMatrixTestSettings,
  FRAMEWORKS,
  getDemoParts as getMatrixDemoParts,
  globalReadFrom,
  injectStyle,
  shouldRunFramework as shouldRunMatrixFramework,
  shouldRunTestAtIndex as shouldRunMatrixTestAtIndex,
  shouldRunTestExplicitly as shouldRunMatrixTestExplicitly,
  shouldSkipDemo as shouldSkipMatrixDemo,
  THEME,
  updateMatrixTestSettings,
  type Framework,
} from '../matrix-test-helper-core';
import { gitHubIgnored } from '../github-ignored-list';
import { skippedTests } from '../../../testing/skipped-tests';

const nodeRequire = createRequire(__filename);

export const DEMOS_ROOT = resolve(__dirname, '../../..');
export {
  changeTheme,
  FRAMEWORKS,
  globalReadFrom,
  injectStyle,
  THEME,
};

const settings = createMatrixTestSettings();

export function updateConfig(): void {
  updateMatrixTestSettings(settings);
}

export function shouldRunFramework(currentFramework: Framework): boolean {
  return shouldRunMatrixFramework(settings, currentFramework);
}

export function shouldRunTestAtIndex(testIndex: number): boolean {
  return shouldRunMatrixTestAtIndex(settings, testIndex);
}

export function shouldRunTestExplicitly(demoUrl: string): boolean {
  return shouldRunMatrixTestExplicitly(settings, demoUrl);
}

export function shouldSkipDemo(framework: Framework, component: string, demoName: string): boolean {
  return shouldSkipMatrixDemo(framework, component, demoName, skippedTests);
}

export function isAccessibilityStrategy(): boolean {
  return process.env.STRATEGY === 'accessibility';
}

export function isCspStrategy(): boolean {
  return process.env.STRATEGY === 'csp';
}

export function getDemoPaths(platform: Framework): string[] {
  return glob.sync('Demos/*/*', { cwd: DEMOS_ROOT })
    .map((path) => join(path, platform));
}

interface ClientScript {
  module?: string;
  path?: string;
  content?: string;
}

function getClientScripts(): (ClientScript | string)[] {
  const testStyles = globalReadFrom(
    DEMOS_ROOT,
    'utils/visual-tests/inject/test-styles.css',
    (x) => x,
  ) || '';

  const scripts: (ClientScript | string)[] = [
    { module: 'mockdate' },
  ];

  if (isAccessibilityStrategy()) {
    scripts.push({ module: 'axe-core/axe.min.js' });
  }

  if (isCspStrategy()) {
    scripts.push(join(DEMOS_ROOT, 'utils/visual-tests/inject/csp-listener.js'));
  }

  scripts.push(
    join(DEMOS_ROOT, 'utils/visual-tests/inject/test-utils.js'),
    {
      content: injectStyle(testStyles),
    },
    {
      content: injectStyle(`
        html {
          overflow: clip;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
      `),
    },
    {
      content: `
        window.addEventListener('error', function (e) {
          console.error(e.message);
        });`,
    },
  );

  return scripts;
}

export async function addClientScripts(
  page: Page,
  scripts: (ClientScript | string)[],
): Promise<void> {
  for (const script of scripts) {
    if (typeof script === 'string') {
      await page.addInitScript({ path: script });
    } else if (script.module) {
      await page.addInitScript({ path: nodeRequire.resolve(script.module, { paths: [DEMOS_ROOT] }) });
    } else if (script.path) {
      await page.addInitScript({ path: script.path });
    } else if (script.content) {
      await page.addInitScript(script.content);
    }
  }
}

export async function addCommonClientScripts(
  page: Page,
  demoClientScripts: ClientScript[],
): Promise<void> {
  await addClientScripts(page, [
    ...getClientScripts(),
    ...demoClientScripts,
  ]);
}

export async function execCode(page: Page, code: string): Promise<void> {
  await page.evaluate(async (source) => {
    // eslint-disable-next-line no-eval
    const result = eval(source);
    if (result && typeof result.then === 'function') {
      await Promise.race([
        result,
        new Promise((resolvePromise) => { setTimeout(resolvePromise, 60000); }),
      ]);
    }
  }, code);
}

export async function execTestCafeCode(page: Page, code: string): Promise<void> {
  // eslint-disable-next-line no-eval
  const testCafeFunction = eval(code);
  await testCafeFunction({
    click: (selector: string) => page.locator(selector).click(),
  });
}

export async function waitForAngularLoading(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const demoApp = document.querySelector('demo-app');
    return demoApp && (demoApp as HTMLElement).innerText !== 'Loading...';
  }, undefined, { timeout: 120000 }).catch(() => {});
  await page.waitForTimeout(500);
}

export async function resetPageState(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }
    window.getSelection()?.removeAllRanges();
  });

  await page.locator('html').hover({ position: { x: 1, y: 1 } });
}

export async function waitForStableRendering(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;

    if (fonts?.ready) {
      await Promise.race([
        fonts.ready,
        new Promise((resolve) => { setTimeout(resolve, 5000); }),
      ]);
    }

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  });
}

export function ensureDir(path: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function getDemosBaseUrl(): string {
  return (process.env.PLAYWRIGHT_DEMOS_BASE_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');
}

export function getPageUrl(widgetName: string, demoName: string, approach: Framework): string | null {
  const isGitHubDemos = process.env.ISGITHUBDEMOS;
  const theme = (process.env.THEME || THEME.generic).replace('generic.', '');
  const baseUrl = getDemosBaseUrl();

  if (isGitHubDemos) {
    if (widgetName !== 'DataGrid' || gitHubIgnored.includes(demoName)) {
      return null;
    }

    return `${baseUrl}/Demos/${widgetName}/${demoName}/${approach}/?theme=dx.${theme}`;
  }

  return `${baseUrl}/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;
}

export function prepareDemoPage(widgetName: string, demoName: string, approach: Framework): void {
  if (!process.env.ISGITHUBDEMOS) {
    changeTheme(DEMOS_ROOT, `Demos/${widgetName}/${demoName}/${approach}/index.html`, process.env.THEME);
  }
}

export function getDemoParts(demoPath: string): {
  widgetName: string;
  demoName: string;
  testName: string;
} {
  return getMatrixDemoParts(demoPath);
}

export function readDemoFile<T = string>(
  demoPath: string,
  relativePath: string,
  mapCallback?: (data: string) => T,
): T | string | null {
  return globalReadFrom(join(DEMOS_ROOT, demoPath), relativePath, mapCallback);
}
