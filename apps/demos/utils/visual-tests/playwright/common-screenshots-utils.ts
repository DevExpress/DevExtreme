import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { join, resolve } from 'path';
import { glob } from 'glob';
import type { Page } from '@playwright/test';

import { gitHubIgnored } from '../github-ignored-list';
import { skippedTests } from '../../../testing/skipped-tests';

const nodeRequire = createRequire(__filename);

export const DEMOS_ROOT = resolve(__dirname, '../../..');

export const FRAMEWORKS = {
  jquery: 'jQuery',
  react: 'React',
  vue: 'Vue',
  angular: 'Angular',
};

export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  material: 'material.blue.light',
};

type Framework = typeof FRAMEWORKS[keyof typeof FRAMEWORKS];

interface ExplicitTests {
  masks: {
    product: RegExp;
    demo: RegExp;
    framework: RegExp;
  }[];
}

const settings: {
  targetFramework?: string;
  total?: number;
  current?: number;
  explicitTests?: ExplicitTests;
  ignoreChangesPathPatterns: RegExp[];
} = {
  ignoreChangesPathPatterns: [
    /mvcdemos.*/i,
    /netcoredemos.*/i,
    /menumeta.json/i,
    /.*.md/i,
  ],
};

export function globalReadFrom<T = string>(
  basePath: string,
  relativePath: string,
  mapCallback?: (data: string) => T,
): T | string | null {
  const absolute = join(basePath, relativePath);
  if (existsSync(absolute)) {
    const result = readFileSync(absolute, 'utf8');
    return (mapCallback && result && mapCallback(result)) || result;
  }
  return null;
}

export function injectStyle(style: string): string {
  return `
    var style = document.createElement('style');
    style.innerHTML = \`${style}\`;
    document.getElementsByTagName('head')[0].appendChild(style);
  `;
}

export function changeTheme(dirName: string, demoPath: string, theme?: string): void {
  if (!theme || theme === THEME.generic) {
    return;
  }

  const updatedContent = globalReadFrom(dirName, demoPath, (data) => {
    let result = data.replace(/data-theme="[^"]+"/g, `data-theme="${theme}"`);

    result = result.replace(/dx\.[^"]+\.css/g, `dx.${theme}.css`);

    return result;
  });

  const indexFilePath = join(dirName, demoPath);

  if (existsSync(indexFilePath) && typeof updatedContent === 'string') {
    writeFileSync(indexFilePath, updatedContent, 'utf8');
  }
}

function patternGroupFromValues(product?: string, demo?: string, framework?: string) {
  const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
  const wrap = (value?: string): RegExp => RegExp(value ? escapeRegExp(value) : '.*', 'i');

  return {
    product: wrap(product),
    demo: wrap(demo),
    framework: wrap(framework),
  };
}

function getChangedFiles(): { filename: string }[] | undefined {
  const changedFilesPath = process.env.CHANGEDFILEINFOSPATH;

  return changedFilesPath
    && existsSync(changedFilesPath)
    && JSON.parse(readFileSync(changedFilesPath, 'utf8'));
}

function getExplicitTestsFromChangedFiles(): ExplicitTests | undefined {
  const changedFiles = getChangedFiles();
  if (!changedFiles) {
    return undefined;
  }
  if (!Array.isArray(changedFiles)) {
    console.log('Running all tests. Changed files are not iterable: ', JSON.stringify(changedFiles));
    return undefined;
  }

  const result: ExplicitTests = { masks: [] };

  for (const changedFile of changedFiles) {
    const fileName = changedFile.filename;

    if (!settings.ignoreChangesPathPatterns.some((pattern) => pattern.test(fileName))) {
      const parseResult = /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<framework>angular|jquery|react|vue)\/.*/i.exec(fileName)
        || /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<data>.*)/i.exec(fileName)
        || /testing\/etalons\/(?<product>\w+)-(?<demo>\w+)(?<suffix>.*).png/i.exec(fileName);

      if (!parseResult) {
        console.log('Unable to parse changed file, running all tests: ', fileName);
        return undefined;
      }

      const groups = parseResult.groups || {};
      result.masks.push(patternGroupFromValues(
        groups.product,
        groups.demo,
        groups.framework,
      ));
    }
  }

  return result.masks.length ? result : undefined;
}

export function updateConfig(): void {
  if (process.env.CONSTEL) {
    const match = process.env.CONSTEL.match(/(?<name>\w+)(?<parallel>\((?<current>\d+)\/(?<total>\d+)\))?/);
    if (match?.groups) {
      settings.targetFramework = match.groups.name;
      if (match.groups.parallel) {
        settings.total = Number(match.groups.total);
        settings.current = Number(match.groups.current);
      }
    }
  }

  settings.explicitTests = getExplicitTestsFromChangedFiles();
}

export function shouldRunFramework(currentFramework: Framework): boolean {
  return !settings.targetFramework
    || currentFramework.toLowerCase() === settings.targetFramework.toLowerCase();
}

export function shouldRunTestAtIndex(testIndex: number): boolean {
  if (!settings.total || !settings.current) {
    return true;
  }

  const part = testIndex % settings.total;
  const currentPart = settings.current - 1;

  return part === currentPart;
}

export function shouldRunTestExplicitly(demoUrl: string): boolean {
  if (!settings.explicitTests) {
    return true;
  }

  const parts = demoUrl.split('/').filter((x) => x?.length);
  const framework = parts[parts.length - 1];
  const product = parts[parts.length - 3];
  const demo = parts[parts.length - 2];

  return settings.explicitTests.masks.some((mask) => mask.framework.test(framework)
    && mask.demo.test(demo)
    && mask.product.test(product));
}

export function shouldSkipDemo(framework: Framework, component: string, demoName: string): boolean {
  const frameworkTests = skippedTests[framework];
  if (!frameworkTests) {
    return false;
  }

  const componentTests = frameworkTests[component];
  if (!componentTests) {
    return false;
  }

  for (const test of componentTests) {
    if (typeof test === 'string' && test === demoName) {
      return true;
    }
    if (test.demo === demoName
      && test.themes.includes(process.env.THEME || THEME.generic)) {
      return true;
    }
  }

  return false;
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

  return [
    { module: 'mockdate' },
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
  ];
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
  const testParts = demoPath.split(/[/\\]/);
  const widgetName = testParts[1];
  const demoName = testParts[2];

  return {
    widgetName,
    demoName,
    testName: `${widgetName}-${demoName}`,
  };
}

export function readDemoFile<T = string>(
  demoPath: string,
  relativePath: string,
  mapCallback?: (data: string) => T,
): T | string | null {
  return globalReadFrom(join(DEMOS_ROOT, demoPath), relativePath, mapCallback);
}
