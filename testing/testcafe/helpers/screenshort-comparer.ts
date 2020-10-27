/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable spellcheck/spell-checker */
import * as LooksSame from 'looks-same';
import * as path from 'path';
import * as fs from 'fs';
import { PNG } from 'pngjs';

const testRoot = './testing/testcafe/';

const screenshotValidator = {
  etalonsPath: path.join(process.cwd(), testRoot, '/etalons'),
  screenshotsPath: path.join(process.cwd(), testRoot, '/screenshots'),
  artifactsPath: path.join(process.cwd(), testRoot, '/artifacts'),
};

function ensureArtifactsPath() {
  if (!fs.existsSync(screenshotValidator.artifactsPath)) {
    fs.mkdirSync(screenshotValidator.artifactsPath, { recursive: true });
  }
}

function submitResult({
  screenshotFileName, etalonFileName,
}) {
  function copyToArtifacts(sourcePath: string, postfix = '') {
    const fileName = path.basename(sourcePath, '.png');
    const targetPath = path.join(screenshotValidator.artifactsPath, `${fileName}${postfix}.png`);
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
    LooksSame(etalonFileName, screenshotBuffer, comparisonOptions, async (_error, result) => {
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
  function getImage(imagePath: string): { width; height} {
    if (!fs.existsSync(imagePath)) {
      return null;
    }
    const imageData = fs.readFileSync(imagePath);
    return PNG.sync.read(imageData, { filterType: -1 });
  }
  function applyMask({ etalonImage, screenshotImage, maskImagе }) {
    for (let y = 0; y < screenshotImage.height; y += 1) {
      for (let x = 0; x < screenshotImage.width; x += 1) {
        // eslint-disable-next-line no-bitwise
        const idx = (screenshotImage.width * y + x) << 2;
        if (maskImagе.data[idx + 0] < 255
          && maskImagе.data[idx + 1] < 255
          && maskImagе.data[idx + 2] < 255) {
          screenshotImage.data[idx + 0] = etalonImage.data[idx + 0];
          screenshotImage.data[idx + 1] = etalonImage.data[idx + 1];
          screenshotImage.data[idx + 2] = etalonImage.data[idx + 2];
          screenshotImage.data[idx + 3] = etalonImage.data[idx + 3];
        }
      }
    }
    return PNG.sync.write(screenshotImage);
  }

  const etalonImage = getImage(etalonFileName);
  const screenshotImage = getImage(screenshotFileName);
  const maskImagе = getImage(maskFileName);

  if (!isSizeEqual(etalonImage, screenshotImage)) {
    throw new Error('Screenshot size does not match etalon size');
  }

  if (!maskImagе) {
    return fs.readFileSync(screenshotFileName);
  }
  if (!isSizeEqual(etalonImage, maskImagе)) {
    throw new Error('Mask size does not match etalon size');
  }
  const targetImageBuffer = applyMask({ etalonImage, screenshotImage, maskImagе });
  return targetImageBuffer;
}

async function createDiff({
  etalonFileName, screenshotBuffer, diffFileName, comparisonOptions,
}) {
  const highlightColor = '#ff00ff';
  return new Promise((resolve, reject) => {
    const diffOptions = {
      reference: etalonFileName,
      current: screenshotBuffer,
      highlightColor,
      ...comparisonOptions,
    };
    LooksSame.createDiff(diffOptions, (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        fs.writeFileSync(diffFileName, buffer);
      }
      resolve();
    });
  });
}

export async function validate(screenshotName: string, comparisonOptions = {
  strict: false,
  tolerance: 30,
  // eslint-disable-next-line spellcheck/spell-checker
  ignoreAntialiasing: true,
  // eslint-disable-next-line spellcheck/spell-checker
  antialiasingTolerance: 10,
  ignoreCaret: true,
}) {
  const screenshotFileName = path.join(screenshotValidator.screenshotsPath, screenshotName);
  const etalonFileName = path.join(screenshotValidator.etalonsPath, screenshotName);
  const maskFileName = path.join(screenshotValidator.etalonsPath, screenshotName.replace('.png', '_mask.png'));
  try {
    ensureArtifactsPath();
    if (!fs.existsSync(etalonFileName)) {
      throw new Error(`Etalon file for screenshot '${screenshotName}' isnt found: ${etalonFileName}`);
    }
    const screenshotBuffer = await getMaskedScreenshotBuffer({
      screenshotFileName, etalonFileName, maskFileName,
    });
    const equal = await looksSame({ etalonFileName, screenshotBuffer, comparisonOptions });
    if (!equal) {
      const diffFileName = path.join(screenshotValidator.artifactsPath, screenshotName.replace('.png', '_diff.png'));
      await createDiff({
        etalonFileName, screenshotBuffer, diffFileName, comparisonOptions,
      });
      submitResult({ screenshotFileName, etalonFileName });
      return false;
    }
    return true;
  } catch (e) {
    submitResult({ screenshotFileName, etalonFileName });
    throw e;
  }
}
