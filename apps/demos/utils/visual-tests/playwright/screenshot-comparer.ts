import { copyFileSync, existsSync, readFileSync } from 'fs';
import { basename, extname, join } from 'path';
import looksSame from 'looks-same';
import { Image } from 'devextreme-screenshot-comparer/build/src/image-utils';
import type { Page } from '@playwright/test';

import { DEMOS_ROOT, ensureDir, THEME } from './common-screenshots-utils';

interface LooksSameOptions {
  strict?: boolean;
  tolerance?: number;
  ignoreAntialiasing?: boolean;
  antialiasingTolerance?: number;
  ignoreCaret?: boolean;
}

interface ScreenshotComparerOptions {
  ignoreSizeDifference?: boolean;
  attempts?: number;
  attemptTimeout?: number;
  looksSameComparisonOptions?: LooksSameOptions;
}

interface ScreenshotComparisonResult {
  isValid: boolean;
  errorMessage: string;
}

const DEFAULT_OPTIONS: Required<ScreenshotComparerOptions> = {
  ignoreSizeDifference: false,
  attempts: 2,
  attemptTimeout: 500,
  looksSameComparisonOptions: {
    strict: false,
    tolerance: 5,
    ignoreAntialiasing: true,
    antialiasingTolerance: 5,
    ignoreCaret: true,
  },
};

function getNameWithSuffix(source: string, suffix: string): string {
  const ext = extname(source);
  return `${source.slice(0, -ext.length)}${suffix}${ext}`;
}

function getScreenshotName(baseName: string, theme = THEME.fluent): string {
  const themePostfix = ` (${theme})`;
  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
}

function mergeOptions(options?: ScreenshotComparerOptions): Required<ScreenshotComparerOptions> {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    looksSameComparisonOptions: {
      ...DEFAULT_OPTIONS.looksSameComparisonOptions,
      ...options?.looksSameComparisonOptions,
    },
  };
}

function compareImages(
  etalon: Buffer,
  actual: Buffer,
  options: LooksSameOptions,
): Promise<{ equal?: boolean }> {
  return new Promise((resolvePromise, reject) => {
    looksSame(etalon, actual, options, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolvePromise(result);
      }
    });
  });
}

function createDiff(
  etalon: Buffer,
  actual: Buffer,
  diffPath: string,
  options: LooksSameOptions,
): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    looksSame.createDiff({
      reference: etalon,
      current: actual,
      diff: diffPath,
      highlightColor: '#ff00ff',
      ...options,
    }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolvePromise();
      }
    });
  });
}

function patchScreenshotByMask(
  etalonPath: string,
  actualPath: string,
  maskPath: string,
  ignoreSizeDifference: boolean,
): Buffer {
  const etalon = new Image(readFileSync(etalonPath), { ignoreSizeDifference });
  const actual = new Image(readFileSync(actualPath), { ignoreSizeDifference });
  const mask = existsSync(maskPath)
    ? new Image(readFileSync(maskPath), { ignoreSizeDifference })
    : undefined;

  return actual.as((image) => image.replace(etalon, mask)).getBuffer();
}

async function takeScreenshot(page: Page, filePath: string): Promise<void> {
  await page.screenshot({
    path: filePath,
    fullPage: false,
  });
}

function copyFailureArtifacts(
  actualPath: string,
  etalonPath: string,
  artifactPath: string,
  diffPath?: string,
): void {
  ensureDir(artifactPath);

  const actualArtifactPath = join(artifactPath, basename(actualPath));
  copyFileSync(actualPath, actualArtifactPath);
  copyFileSync(etalonPath, getNameWithSuffix(actualArtifactPath, '_etalon'));

  if (diffPath && existsSync(diffPath)) {
    copyFileSync(diffPath, getNameWithSuffix(actualArtifactPath, '_diff'));
  }
}

export async function compareDemoScreenshot(
  page: Page,
  screenshotName: string,
  comparisonOptions?: ScreenshotComparerOptions,
): Promise<ScreenshotComparisonResult> {
  const finalScreenshotName = getScreenshotName(screenshotName, process.env.THEME || THEME.fluent);
  const options = mergeOptions({
    ...comparisonOptions,
    looksSameComparisonOptions: {
      tolerance: 20,
      antialiasingTolerance: 20,
    },
  });

  const etalonPath = join(DEMOS_ROOT, 'testing/etalons', finalScreenshotName);
  const actualPath = join(DEMOS_ROOT, 'testing/screenshots', finalScreenshotName);
  const artifactPath = join(DEMOS_ROOT, 'testing/artifacts/compared-screenshots');
  const maskPath = getNameWithSuffix(etalonPath, '_mask');
  const diffPath = getNameWithSuffix(actualPath, '_diff');

  ensureDir(join(DEMOS_ROOT, 'testing/screenshots'));
  ensureDir(artifactPath);

  if (!existsSync(etalonPath)) {
    await takeScreenshot(page, actualPath);

    return {
      isValid: false,
      errorMessage: `Etalon file not found: ${etalonPath}`,
    };
  }

  let lastActualBuffer: Buffer | null = null;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < options.attempts; attempt += 1) {
    await takeScreenshot(page, actualPath);

    try {
      lastActualBuffer = patchScreenshotByMask(
        etalonPath,
        actualPath,
        maskPath,
        options.ignoreSizeDifference,
      );

      const result = await compareImages(
        readFileSync(etalonPath),
        lastActualBuffer,
        options.looksSameComparisonOptions,
      );

      if (result.equal) {
        return {
          isValid: true,
          errorMessage: '',
        };
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < options.attempts - 1) {
      await page.waitForTimeout(options.attemptTimeout);
    }
  }

  if (lastActualBuffer) {
    await createDiff(
      readFileSync(etalonPath),
      lastActualBuffer,
      diffPath,
      options.looksSameComparisonOptions,
    );
  }
  copyFailureArtifacts(actualPath, etalonPath, artifactPath, diffPath);

  return {
    isValid: false,
    errorMessage: lastError
      ? `Screenshot '${finalScreenshotName}' invalid, internalError: ${lastError.message}`
      : `Screenshot '${finalScreenshotName}' invalid`,
  };
}
