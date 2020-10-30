/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as LooksSame from 'looks-same';
import * as path from 'path';
import * as fs from 'fs';
import { PNG } from 'pngjs';

const testRoot = './testing/testcafe/';
const screenshotsPath = path.join(testRoot, '/screenshots');
const artifactsPath = path.join(testRoot, '/artifacts');

const screenshotComparerDefault = {
  highlightColor: { r: 0xff, g: 0, b: 0xff },
  attempt: 3,
  attemptTimeout: 500,
  comparisonOptions: {
    strict: false,
    tolerance: 30,
    // eslint-disable-next-line spellcheck/spell-checker
    ignoreAntialiasing: true,
    // eslint-disable-next-line spellcheck/spell-checker
    antialiasingTolerance: 10,
    ignoreCaret: true,
  },
};

function ensureArtifactsPath() {
  if (!fs.existsSync(artifactsPath)) {
    fs.mkdirSync(artifactsPath, { recursive: true });
  }
}

function saveArtifacts({
  screenshotFileName, etalonFileName,
}) {
  function copyToArtifacts(sourcePath: string, postfix = '') {
    const fileName = path.basename(sourcePath, '.png');
    const targetPath = path.join(artifactsPath, `${fileName}${postfix}.png`);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }

  copyToArtifacts(screenshotFileName);
  copyToArtifacts(etalonFileName, '_ethalon');
}

export async function looksSame({ etalonFileName, screenshotBuffer, comparisonOptions }):
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

async function getMaskedScreenshotBuffer({
  screenshotFileName, etalonFileName, maskFileName,
}) {
  function isSizeEqual(image1, image2): boolean {
    return image1.height === image2.height && image1.width === image2.width;
  }
  function getImage(imagePath: string): { width; height} | undefined {
    if (!fs.existsSync(imagePath)) {
      return undefined;
    }
    const imageData = fs.readFileSync(imagePath);
    return PNG.sync.read(imageData, { filterType: -1 });
  }
  function applyMask({ etalonImg, screenshotImg, maskImg }) {
    for (let y = 0; y < screenshotImg.height; y += 1) {
      for (let x = 0; x < screenshotImg.width; x += 1) {
        const idx = (screenshotImg.width * y + x) << 2;
        if (maskImg.data[idx + 0] < 255
          && maskImg.data[idx + 1] < 255
          && maskImg.data[idx + 2] < 255) {
          screenshotImg.data[idx + 0] = etalonImg.data[idx + 0];
          screenshotImg.data[idx + 1] = etalonImg.data[idx + 1];
          screenshotImg.data[idx + 2] = etalonImg.data[idx + 2];
          screenshotImg.data[idx + 3] = etalonImg.data[idx + 3];
        }
      }
    }
    return PNG.sync.write(screenshotImg);
  }

  const etalonImg = getImage(etalonFileName);
  const screenshotImg = getImage(screenshotFileName);
  const maskImg = getImage(maskFileName);

  if (!fs.existsSync(etalonFileName)) {
    throw new Error(`Etalon file not found: ${etalonFileName}`);
  }

  if (!isSizeEqual(etalonImg, screenshotImg)) {
    throw new Error('Screenshot size does not match etalon size');
  }

  if (!maskImg) {
    return fs.readFileSync(screenshotFileName);
  }
  if (!isSizeEqual(etalonImg, maskImg)) {
    throw new Error('Mask size does not match etalon size');
  }
  const targetImageBuffer = applyMask({ etalonImg, screenshotImg, maskImg });
  return targetImageBuffer;
}

async function getDiff({
  etalonFileName, screenshotBuffer, options,
}: { etalonFileName; screenshotBuffer; options: typeof screenshotComparerDefault}) {
  function colorToString(color: typeof options.highlightColor) {
    return `#${Object.values(color).map((n) => n.toString(16).padStart(2, '0')).join('')}`;
  }
  const highlightColor = colorToString(options.highlightColor);
  return new Promise((resolve, reject) => {
    const diffOptions = {
      reference: etalonFileName,
      current: screenshotBuffer,
      highlightColor,
      ...options.comparisonOptions,
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

function getMask(diffBuffer, options: typeof screenshotComparerDefault) {
  function makeTransparentExceptColor(image, { r, g, b }) {
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const idx = (image.width * y + x) << 2;
        const isHighlighted = (
          image.data[idx + 0] === r
          && image.data[idx + 1] === g
          && image.data[idx + 2] === b);
        Array.from({ length: 3 }).forEach((_, i) => {
          image.data[idx + i] = isHighlighted ? 0 : 255;
        });
      }
    }
  }
  const image = PNG.sync.read(diffBuffer);
  makeTransparentExceptColor(image, options.highlightColor);
  return PNG.sync.write(image);
}
async function tryGetValidScreenshot({
  element, t, screenshotFileName, etalonFileName, maskFileName, options,
}: { element: string | Selector | null;
  t: TestController;
  screenshotFileName: string;
  etalonFileName: string;
  maskFileName: string;
  options: typeof screenshotComparerDefault; }) {
  let equal = false;
  let attemptCount = options.attempt;
  let screenshotBuffer;
  while (!equal && attemptCount > 0) {
    attemptCount -= 1;
    await (element
      ? t.takeElementScreenshot(element, screenshotFileName)
      : t.takeScreenshot(screenshotFileName));
    screenshotBuffer = await getMaskedScreenshotBuffer({
      screenshotFileName, etalonFileName, maskFileName,
    });
    equal = await looksSame({
      etalonFileName,
      screenshotBuffer,
      comparisonOptions: options.comparisonOptions,
    });
    if (attemptCount > 1) {
      await t.wait(options.attemptTimeout);
    }
  }
  return { equal, screenshotBuffer };
}
export async function compareScreenshot(
  t: TestController,
  screenshotName: string,
  element: Selector | string | null = null,
  comparisonOptions?: Partial<typeof screenshotComparerDefault>,
) {
  const screenshotFileName = path.join(screenshotsPath, screenshotName);
  const etalonsPath = path.join(path.dirname((t as any).testRun.test.testFile.filename), 'etalons');
  const etalonFileName = path.join(etalonsPath, screenshotName);
  const maskFileName = path.join(etalonsPath, screenshotName.replace('.png', '_mask.png'));
  const options = {
    ...screenshotComparerDefault,
    ...(comparisonOptions || {}),
  } as typeof screenshotComparerDefault;
  try {
    ensureArtifactsPath();
    const { equal, screenshotBuffer } = await tryGetValidScreenshot({
      t, element, screenshotFileName, etalonFileName, maskFileName, options,
    });
    if (!equal) {
      const diffFileName = path.join(artifactsPath, screenshotName.replace('.png', '_diff.png'));
      const diffMaskFileName = path.join(artifactsPath, screenshotName.replace('.png', '_mask.png'));
      const diffBuffer = await getDiff({
        etalonFileName, screenshotBuffer, options,
      });
      const maskBuffer = getMask(diffBuffer, options);
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
export function createScreenshotsComparer(t: TestController) {
  const errorMessages: string[] = [];
  return {
    takeScreenshot: async (screenshotName: string,
      element: Selector | string | null = null,
      comparisonOptions?: Partial<typeof screenshotComparerDefault>,
    ) => {
      try {
        const isValid = await compareScreenshot(t, screenshotName, element, comparisonOptions);
        if (!isValid) {
          errorMessages.push(`Screenshort:'${screenshotName}' isn't valid`);
        }
      } catch (e) {
        errorMessages.push(`Screenshort:'${screenshotName}' isn't valid, internalError: ${e.message}`);
      }
      return true;
    },
    compareResults: {
      isValid: () => errorMessages.length === 0,
      errorMessages: () => errorMessages.join('\r\n'),
    },
  };
}
