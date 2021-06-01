/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
import * as LooksSame from 'looks-same';
import * as path from 'path';
import * as fs from 'fs';
import { PNG } from 'pngjs';

const testRoot = './testing/testcafe/';
const screenshotsPath = path.join(testRoot, '/screenshots');
const artifactsPath = path.join(testRoot, '/artifacts/compared-screenshots');

const screenshotComparerDefault = {
  highlightColor: { r: 0xff, g: 0, b: 0xff },
  attempts: 3,
  attemptTimeout: 500,
  looksSameComparisonOptions: {
    strict: false,
    tolerance: 30,
    // eslint-disable-next-line spellcheck/spell-checker
    ignoreAntialiasing: true,
    // eslint-disable-next-line spellcheck/spell-checker
    antialiasingTolerance: 10,
    ignoreCaret: true,
  },
};
interface ComparerOptions {
  highlightColor: {
    r: number;
    g: number;
    b: number;
  };
  attempts: number;
  attemptTimeout: number;
  looksSameComparisonOptions: Parameters<typeof LooksSame.createDiff>[0];
}

function ensureArtifactsPath(): void {
  if (!fs.existsSync(artifactsPath)) {
    fs.mkdirSync(artifactsPath, { recursive: true });
  }
}

function saveArtifacts({
  screenshotFileName, etalonFileName,
}: Record<'screenshotFileName' | 'etalonFileName', string>): void {
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
      async (_error, result) => {
        if (_error) {
          reject(_error);
        } else {
          resolve(result.equal);
        }
      });
  });
}

interface Image { width: number; height: number; data: number[] }

async function getMaskedScreenshotBuffer({
  screenshotName, screenshotFileName, etalonFileName, maskFileName,
}: Record<'screenshotName' | 'screenshotFileName' | 'etalonFileName' | 'maskFileName', string>): Promise<Buffer> {
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
  function makeTransparentExceptColor(image: Image, maskImage: Image, { r, g, b }: ComparerOptions['highlightColor']): void {
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const index = (image.width * y + x) << 2;
        const isHighlighted = (
          image.data[index + 0] === r
          && image.data[index + 1] === g
          && image.data[index + 2] === b) || (maskImage && maskImage.data[index] === 0);
        for (let i = 0; i < 3; i++) {
          image.data[index + i] = isHighlighted ? 0 : 255;
        }
      }
    }
  }
  const image = PNG.sync.read(diffBuffer);
  const maskBuffer = fs.existsSync(maskFileName) && fs.readFileSync(maskFileName);
  const maskImage = maskBuffer && PNG.sync.read(maskBuffer);

  makeTransparentExceptColor(image, maskImage, options.highlightColor);
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
    screenshotBuffer = await getMaskedScreenshotBuffer({
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
  const screenshotFileName = path.join(screenshotsPath, screenshotName);
  const etalonsPath = path.join(path.dirname((t as unknown as { testRun }).testRun.test.testFile.filename), 'etalons');
  const etalonFileName = path.join(etalonsPath, screenshotName);
  const maskFileName = path.join(etalonsPath, screenshotName.replace('.png', '_mask.png'));
  const options = {
    ...screenshotComparerDefault,
    ...comparisonOptions || {},
  } as ComparerOptions;
  try {
    ensureArtifactsPath();
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
      saveArtifacts({ screenshotFileName, etalonFileName });
      return false;
    }
    return true;
  } catch (e) {
    saveArtifacts({ screenshotFileName, etalonFileName });
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
