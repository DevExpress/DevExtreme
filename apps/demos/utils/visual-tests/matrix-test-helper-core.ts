import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const FRAMEWORKS = {
  jquery: 'jQuery',
  react: 'React',
  vue: 'Vue',
  angular: 'Angular',
} as const;

export const THEME = {
  generic: 'generic.light',
  fluent: 'fluent.blue.light',
  material: 'material.blue.light',
} as const;

export type Framework = typeof FRAMEWORKS[keyof typeof FRAMEWORKS];

interface ExplicitTests {
  masks: {
    product: RegExp;
    demo: RegExp;
    framework: RegExp;
  }[];
}

export interface MatrixTestSettings {
  targetFramework?: string;
  total?: number;
  current?: number;
  explicitTests?: ExplicitTests;
  ignoreChangesPathPatterns: RegExp[];
  changedFilePatterns: RegExp[];
}

export function createMatrixTestSettings(
  options: { includeManualTests?: boolean } = {},
): MatrixTestSettings {
  const changedFilePatterns = [
    /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<framework>[Aa]ngular|[Jj][Qq]uery|[Rr]eact|[Vv]ue)\/.*/,
    /Demos\/(?<product>\w+)\/(?<demo>\w+)\/(?<data>.*)/,
    /testing\/etalons\/(?<product>\w+)-(?<demo>\w+)(?<suffix>.*).png/i,
  ];

  if (options.includeManualTests) {
    changedFilePatterns.push(/testing\/widgets\/(?<product>\w+)\/.*/i);
  }

  return {
    ignoreChangesPathPatterns: [
      /mvcdemos.*/i,
      /netcoredemos.*/i,
      /menumeta.json/i,
      /.*.md/i,
    ],
    changedFilePatterns,
  };
}

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

function getExplicitTestsFromChangedFiles(settings: MatrixTestSettings): ExplicitTests | undefined {
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
      const parseResult = settings.changedFilePatterns
        .map((pattern) => pattern.exec(fileName))
        .find((result) => result);

      if (!parseResult) {
        console.log('Unable to parse changed file, running all tests: ', fileName);
        return undefined;
      }

      const groups = parseResult.groups || {};
      result.masks.push(patternGroupFromValues(
        groups.product,
        groups.demo,
        undefined,
      ));
    }
  }

  return result;
}

export function updateMatrixTestSettings(settings: MatrixTestSettings): void {
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

  settings.explicitTests = getExplicitTestsFromChangedFiles(settings);
}

export function shouldRunFramework(settings: MatrixTestSettings, currentFramework: Framework): boolean {
  return !settings.targetFramework
    || currentFramework.toLowerCase() === settings.targetFramework.toLowerCase();
}

export function shouldRunTestAtIndex(settings: MatrixTestSettings, testIndex: number): boolean {
  if (!settings.total || !settings.current) {
    return true;
  }

  const part = testIndex % settings.total;
  const currentPart = settings.current - 1;

  return part === currentPart;
}

export function shouldRunTestExplicitly(settings: MatrixTestSettings, demoUrl: string): boolean {
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

export function shouldSkipDemo(
  framework: Framework,
  component: string,
  demoName: string,
  skippedTests: Record<string, Record<string, (string | { demo: string; themes: string[] })[]>>,
  theme = process.env.THEME || THEME.generic,
): boolean {
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
    if (typeof test !== 'string'
      && test.demo === demoName
      && test.themes.includes(theme)) {
      return true;
    }
  }

  return false;
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
