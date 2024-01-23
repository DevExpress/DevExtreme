import {
  readdirSync, lstatSync, existsSync, copyFileSync,
} from 'fs';
import { join, resolve } from 'path';
import { argv } from 'process';

const PATH_TO_CURRENT_ETALONS = argv[2];
const PATH_TO_TESTCAFE_TESTS = './testing/testcafe/tests';
const NEW_ETALON_FILE_NAME_PATTERN = /^(?!.*(?:_mask|_diff|_etalon)\.png$).*\.png$/i;
const ETALONS_FOLDER_NAME = 'etalons';

const getAllEtalonsNames = () => {
  const allFileNames = readdirSync(PATH_TO_CURRENT_ETALONS);
  const newEtalons = allFileNames.filter((name) => NEW_ETALON_FILE_NAME_PATTERN.test(name));

  return newEtalons;
};

const isDirectory = (fileName) => lstatSync(fileName).isDirectory();

function getAllDirs(path) {
  return readdirSync(path)
    .map((fileName) => join(path, fileName))
    .filter(isDirectory);
}

function processEtalonFolder(etalonFolderPath, allEtalons) {
  const allFiles = readdirSync(etalonFolderPath);

  return allFiles.some((currentFileName) => {
    const etalonIndex = allEtalons.indexOf(currentFileName);

    if (etalonIndex >= 0) {
      const dstFileName = join(etalonFolderPath, currentFileName);
      const srcFileName = join(PATH_TO_CURRENT_ETALONS, currentFileName);

      copyFileSync(srcFileName, dstFileName);
      allEtalons.splice(etalonIndex, 1);
    }

    return allEtalons.length === 0;
  });
}

function processFolder(currentDir, allEtalons) {
  const dirs = getAllDirs(currentDir);

  return dirs.some((dir) => {
    const folderName = dir.split('/').at(-1);

    if (folderName === ETALONS_FOLDER_NAME) {
      return processEtalonFolder(dir, allEtalons);
    }
    return processFolder(dir, allEtalons);
  });
}

function foldersWithScreenshotsExist() {
  let result = true;
  const pathsToCheck = {
   'path to testcafe tests': PATH_TO_TESTCAFE_TESTS,
   'path to compared screenshots': PATH_TO_CURRENT_ETALONS
  };

  Object.keys(pathsToCheck).forEach((pathName) => {
    const path = pathsToCheck[pathName];

    if (!existsSync(path)) {
      console.log(`wrong ${pathName}`);
      result = false;
    }
  });

  return result;
}

function checkFilesAfterCopy(allEtalons) {
  allEtalons.forEach((f) => {
    console.log(`File "${f}" is not copied`);
  });
}

(() => {
  if (foldersWithScreenshotsExist()) {
    const allEtalons = getAllEtalonsNames();
    const absPathToTests = resolve(PATH_TO_TESTCAFE_TESTS);
    processFolder(absPathToTests, allEtalons);

    checkFilesAfterCopy(allEtalons);
  }
})();
