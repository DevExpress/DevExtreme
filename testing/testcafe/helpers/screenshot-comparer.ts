/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
import * as LooksSame from 'looks-same';
import * as path from 'path';
import * as fs from 'fs';
import { PNG } from 'pngjs';

const screenshotComparerDefault = {
  highlightColor: { r: 0xff, g: 0, b: 0xff },
  maskRadius: 5,
  attempts: 3,
  attemptTimeout: 500,
  looksSameComparisonOptions: {
    strict: false,
    tolerance: 5,
    // eslint-disable-next-line spellcheck/spell-checker
    ignoreAntialiasing: true,
    // eslint-disable-next-line spellcheck/spell-checker
    antialiasingTolerance: 5,
    ignoreCaret: true,
  },
};
interface ComparerOptions {
  path?: string;
  highlightColor: {
    r: number;
    g: number;
    b: number;
  };
  attempts: number;
  attemptTimeout: number;
  maskRadius?: number;
  looksSameComparisonOptions: Parameters<typeof LooksSame.createDiff>[0];
}

function ensureArtifactsPath(artifactsPath: string): void {
  if (!fs.existsSync(artifactsPath)) {
    fs.mkdirSync(artifactsPath, { recursive: true });
  }
}

function saveArtifacts({
  artifactsPath, screenshotFileName, etalonFileName,
}: Record<'artifactsPath' | 'screenshotFileName' | 'etalonFileName', string>): void {
  function copyToArtifacts(sourcePath: string, postfix = ''): void {
    const fileName = path.basename(sourcePath, '.png');
    const targetPath = path.join(artifactsPath, `${fileName}${postfix}.png`);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }

  copyToArtifacts(screenshotFileName);
  copyToArtifacts(etalonFileName, '_etalon');
}

export async function looksSame({ etalonFileName, screenshotBuffer, comparisonOptions }:
{ etalonFileName: string; screenshotBuffer: Buffer; comparisonOptions: ComparerOptions['looksSameComparisonOptions'] }):
  Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    (LooksSame as any)(etalonFileName, screenshotBuffer, comparisonOptions,
      (_error, result) => {
        if (_error) {
          reject(_error);
        } else {
          resolve(result.equal);
        }
      });
  });
}

interface Image { width: number; height: number; data: number[] }

function getMaskedScreenshotBuffer({
  screenshotName, screenshotFileName, etalonFileName, maskFileName,
}: Record<'screenshotName' | 'screenshotFileName' | 'etalonFileName' | 'maskFileName', string>): Buffer {
  function isSizeEqual(image1: Image, image2: Image): boolean {
    return image1.height === image2.height && image1.width === image2.width;
  }
  function getImage(imagePath: string): Image {
    const imageData = fs.readFileSync(imagePath);
    return PNG.sync.read(imageData, { filterType: -1 });
  }
  function applyMask(etalonImg: Image, screenshotImg: Image, maskImg: Image): Buffer {
    for (let y = 0; y < screenshotImg.height; y += 1) {
      for (let x = 0; x < screenshotImg.width; x += 1) {
        const index = (screenshotImg.width * y + x) << 2;
        if (maskImg.data[index + 0] < 255
          && maskImg.data[index + 1] < 255
          && maskImg.data[index + 2] < 255) {
          screenshotImg.data[index + 0] = etalonImg.data[index + 0];
          screenshotImg.data[index + 1] = etalonImg.data[index + 1];
          screenshotImg.data[index + 2] = etalonImg.data[index + 2];
          screenshotImg.data[index + 3] = etalonImg.data[index + 3];
        }
      }
    }
    return PNG.sync.write(screenshotImg);
  }
  if (!fs.existsSync(etalonFileName)) {
    throw new Error(`Etalon file not found: ${etalonFileName}`);
  }
  const etalonImg = getImage(etalonFileName);
  const screenshotImg = getImage(screenshotFileName);
  if (!isSizeEqual(etalonImg, screenshotImg)) {
    throw new Error(`The screenshot size (W:${screenshotImg.width}, H:${screenshotImg.height}) does not match the etalon size (W:${etalonImg.width}, H:${etalonImg.height}) for: ${screenshotName}`);
  }

  if (!fs.existsSync(maskFileName)) {
    return fs.readFileSync(screenshotFileName);
  }
  const maskImg = getImage(maskFileName);
  if (!isSizeEqual(etalonImg, maskImg)) {
    throw new Error(`Mask size does not match etalon size for screenshort: ${screenshotName}`);
  }
  const targetImageBuffer = applyMask(etalonImg, screenshotImg, maskImg);
  return targetImageBuffer;
}

async function getDiff({
  etalonFileName, screenshotBuffer, options,
}: { etalonFileName; screenshotBuffer; options: ComparerOptions }):
  Promise<Buffer> {
  function colorToString(color: typeof options.highlightColor): string {
    return `#${Object.values(color).map((n) => n.toString(16).padStart(2, '0')).join('')}`;
  }
  const highlightColor = colorToString(options.highlightColor);
  return new Promise((resolve, reject) => {
    const diffOptions = {
      ...options.looksSameComparisonOptions,
      reference: etalonFileName,
      current: screenshotBuffer,
      highlightColor,
    };
    LooksSame.createDiff(diffOptions, (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer);
      }
    });
  });
}

function getMask(diffBuffer: Buffer, maskFileName: string, options: ComparerOptions): Buffer {
  function transformImage(image, func) {
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < image.width; x += 1) {
        const index = (image.width * y + x) << 2;
        func(image.data, index, x, y);
      }
    }
  }

  function makeTransparentExceptColor(image, { r, g, b }) {
    transformImage(image, (data, index: number) => {
      const isHighlighted = data[index + 0] === r
        && data[index + 1] === g
        && data[index + 2] === b;
      const color = isHighlighted ? 0 : 255;

      data[index + 0] = color;
      data[index + 1] = color;
      data[index + 2] = color;
    });
  }

  function applyMaskRadius(image, maskRadius: number) {
    const aroundColor = 7;
    transformImage(image, (data, index: number, x: number, y: number) => {
      const isHighlighted = data[index] === 0;

      if (isHighlighted) {
        const yBegin = Math.max(0, y - maskRadius);
        const xBegin = Math.max(0, x - maskRadius);
        const yEnd = Math.min(image.height, y + maskRadius);
        const xEnd = Math.min(image.width, x + maskRadius);

        for (let ry = yBegin; ry < yEnd; ry += 1) {
          for (let rx = xBegin; rx < xEnd; rx += 1) {
            const roundIndex = (image.width * ry + rx) << 2;
            if (data[roundIndex] === 255) {
              data[roundIndex] = aroundColor;
            }
          }
        }
      }
    });

    transformImage(image, (data, index: number) => {
      if (data[index] === aroundColor) {
        data[index + 0] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
      }
    });
  }

  function applyPrevMask(image, prevMaskImage) {
    transformImage(image, (data, index: number) => {
      const isPrevHighlighted = prevMaskImage.data[index] === 0;

      if (isPrevHighlighted) {
        data[index + 0] = 0;
        data[index + 1] = 0;
        data[index + 2] = 0;
      }
    });
  }

  const image = PNG.sync.read(diffBuffer);
  const maskBuffer = fs.existsSync(maskFileName) && fs.readFileSync(maskFileName);
  const maskImg = maskBuffer && PNG.sync.read(maskBuffer);
  makeTransparentExceptColor(image, options.highlightColor);
  if (options.maskRadius) {
    applyMaskRadius(image, options.maskRadius);
  }
  if (maskImg) {
    applyPrevMask(image, maskImg);
  }

  return PNG.sync.write(image);
}

type SelectorType = Selector | string | null;

async function tryGetValidScreenshot({
  t, screenshotName, element, screenshotFileName, etalonFileName, maskFileName, options,
}: {
  t: TestController;
  screenshotName: string;
  element: SelectorType;
  screenshotFileName: string;
  etalonFileName: string;
  maskFileName: string;
  options: ComparerOptions;
}): Promise<{ equal: boolean; screenshotBuffer: Buffer | null }> {
  let equal = false;
  let attempt = 0;
  let screenshotBuffer: Buffer | null = null;
  while (!equal && attempt < options.attempts) {
    attempt += 1;
    if (attempt > 1) {
      fs.unlinkSync(screenshotFileName);
    }
    await (element
      ? t.takeElementScreenshot(element, screenshotFileName)
      : t.takeScreenshot(screenshotFileName));
    screenshotBuffer = getMaskedScreenshotBuffer({
      screenshotName, screenshotFileName, etalonFileName, maskFileName,
    });
    equal = await looksSame({
      etalonFileName,
      screenshotBuffer,
      comparisonOptions: options.looksSameComparisonOptions,
    });
    if (attempt < options.attempts) {
      await t.wait(options.attemptTimeout);
    }
  }
  return { equal, screenshotBuffer };
}

export async function compareScreenshot(
  t: TestController,
  screenshotName: string,
  element: SelectorType = null,
  comparisonOptions?: Partial<ComparerOptions>,
): Promise<boolean> {
  const { path: rootPath, ...configOptions } = (t as unknown as { testRun }).testRun.opts['screenshots-comparer'] as ComparerOptions;
  const testRoot = rootPath ?? './testing';
  const screenshotsPath = path.join(testRoot, '/screenshots');
  const artifactsPath = path.join(testRoot, '/artifacts/compared-screenshots');

  const screenshotFileName = path.join(screenshotsPath, screenshotName.endsWith('.png') ? screenshotName : `${screenshotName}.png`);
  const etalonsPath = path.join(path.dirname((t as unknown as { testRun }).testRun.test.testFile.filename), 'etalons');
  const etalonFileName = path.join(etalonsPath, screenshotName);
  const maskFileName = path.join(etalonsPath, screenshotName.replace('.png', '_mask.png'));
  const options = {
    ...screenshotComparerDefault,
    ...configOptions,
    ...comparisonOptions ?? {},
  } as ComparerOptions;
  try {
    ensureArtifactsPath(artifactsPath);
    const { equal, screenshotBuffer } = await tryGetValidScreenshot({
      t, screenshotName, element, screenshotFileName, etalonFileName, maskFileName, options,
    });
    if (!equal) {
      const diffFileName = path.join(artifactsPath, screenshotName.replace('.png', '_diff.png'));
      const diffMaskFileName = path.join(artifactsPath, screenshotName.replace('.png', '_mask.png'));
      const diffBuffer = await getDiff({
        etalonFileName, screenshotBuffer, options,
      });
      const maskBuffer = getMask(diffBuffer, maskFileName, options);
      fs.writeFileSync(diffFileName, diffBuffer);
      fs.writeFileSync(diffMaskFileName, maskBuffer);
      saveArtifacts({ artifactsPath, screenshotFileName, etalonFileName });
      return false;
    }
    return true;
  } catch (e) {
    saveArtifacts({ artifactsPath, screenshotFileName, etalonFileName });
    throw e;
  }
}

export interface ScreenshotsComparer {
  takeScreenshot: (screenshotName: string,
    element?: SelectorType, comparisonOptions?:
    Partial<ComparerOptions> | undefined) => Promise<boolean>;
  compareResults: {
    isValid: () => boolean;
    errorMessages: () => string;
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createScreenshotsComparer(t: TestController): ScreenshotsComparer {
  const errorMessages: string[] = [];
  const takeScreenshot = async (
    screenshotName: string,
    element: SelectorType = null,
    comparisonOptions?: Partial<ComparerOptions>,
  ): Promise<boolean> => {
    try {
      const isValid = await compareScreenshot(t, screenshotName, element, comparisonOptions);
      if (!isValid) {
        errorMessages.push(`Screenshot:'${screenshotName}' invalid`);
      }
    } catch (e) {
      errorMessages.push(`Screenshot:'${screenshotName}' invalid, internalError: ${e.message}`);
    }
    return true;
  };
  return {
    takeScreenshot,
    compareResults: {
      isValid: (): boolean => errorMessages.length === 0,
      errorMessages: (): string => errorMessages.join('\r\n'),
    },
  };
}
