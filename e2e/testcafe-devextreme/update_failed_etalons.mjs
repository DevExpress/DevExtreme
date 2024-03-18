import {
  readdirSync, lstatSync, existsSync, copyFileSync,
} from 'fs';
import { join, resolve, basename } from 'path';
import { argv } from 'process';

const PATH_TO_CURRENT_ETALONS = argv[2];
const PATH_TO_TESTCAFE_TESTS = './';
const NEW_ETALON_FILE_NAME_PATTERN = /^(?!.*(?:_mask|_diff|_etalon)\.png$).*\.png$/i;
const ETALONS_FOLDER_NAME = 'etalons';

const getAllEtalonsNames = () => {
  const newEtalons = new Map();
  const allFileNames = readdirSync(PATH_TO_CURRENT_ETALONS);

  allFileNames.forEach((name) => {
    if (NEW_ETALON_FILE_NAME_PATTERN.test(name)) {
      newEtalons.set(name, true);
    }
  });

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

  for (let currentFileName of allFiles) {
    const hasFile = allEtalons.has(currentFileName);

    if (hasFile) {
      const dstFileName = join(etalonFolderPath, currentFileName);
      const srcFileName = join(PATH_TO_CURRENT_ETALONS, currentFileName);

      copyFileSync(srcFileName, dstFileName);
      allEtalons.delete(currentFileName);

      if (allEtalons.size === 0) {
        return false;
      }
    }
  }

  return allEtalons.size !== 0;
}

function processFolder(currentDir, allEtalons) {
  const currentDirrectoryFolders = getAllDirs(currentDir);

  for (let dir of currentDirrectoryFolders) {
    const folderName = basename(dir);
    const continueProcessFolders = folderName === ETALONS_FOLDER_NAME
      ? processEtalonFolder(dir, allEtalons)
      : processFolder(dir, allEtalons);

    if (continueProcessFolders === false) {
      return false;
    }
  }

  return true;
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

function checkFilesAfterCopy(allEtalonsMap) {
  if (allEtalonsMap.size === 0) {
    console.log('all screenshots were moved');
  } else {
    console.log(`${allEtalonsMap.size} etalons were not copied`);
    allEtalonsMap.forEach((value, key) => {
      console.log(`File "${key}" is not copied`);
    });
  }
}

(() => {
  if (foldersWithScreenshotsExist()) {
    const allEtalons = getAllEtalonsNames();
    console.log(`${allEtalons.size} new screenshots are found`);
    const absPathToTests = resolve(PATH_TO_TESTCAFE_TESTS);

    processFolder(absPathToTests, allEtalons);

    checkFilesAfterCopy(allEtalons);
  }
})();
