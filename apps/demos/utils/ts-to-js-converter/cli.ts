/* eslint-disable import/no-extraneous-dependencies */
import minimist from 'minimist';
import path from 'path';
import { glob } from 'glob';
import { consola } from 'consola';
import fs from 'fs';

import { converter, prettifyOutputs, splitArrayIntoSubarrays } from './converter';
import { ActionConverterEntry } from './types';

const defaultConversionConcurrency = 8;

const logger = {
  warning: consola.warn,
  error: consola.error,
  debug: consola.debug,
  info: consola.info,
  start: consola.start,
  success: consola.success,
};

function findFoldersWithTsxFiles(directory) {
  const foldersWithTsxFiles = [];
  const filesAndFolders = fs.readdirSync(directory);

  for (const item of filesAndFolders) {
    const itemPath = path.join(directory, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      const subfolderContainsTsxFiles = findFoldersWithTsxFiles(itemPath);

      if (subfolderContainsTsxFiles.length > 0) {
        foldersWithTsxFiles.push(...subfolderContainsTsxFiles);
      }
    } else if (stats.isFile() && itemPath.endsWith('.tsx')) {
      foldersWithTsxFiles.push(directory);
      break;
    }
  }

  return foldersWithTsxFiles;
}

const getPatterns = () => {
  const CONSTEL = process.env.CONSTEL;
  const userArgs = process.argv.slice(2);

  if (userArgs.length > 0 && userArgs[0] !== 'split') {
    return userArgs;
  }

  if (CONSTEL == null) {
    return ['Demos/**/React'];
  }

  const [current, total] = CONSTEL.split('/').map(Number);

  // When all React TS demos merged, change to just folders
  const convertedDemos = findFoldersWithTsxFiles('Demos');
  const filteredDemos = convertedDemos.filter((_, index) => index % total === current - 1);

  return filteredDemos.map((demoName) => demoName.split(path.sep).join(path.posix.sep));
};

const performConversion = async (patterns, conversionConcurrency) => {
  const args = minimist(patterns);

  const sourceDirs = args._ || [process.cwd()];
  const outDirPostfix = 'Js';

  const entries = (await Promise.all(
    sourceDirs.map(async (sourceDir) => {
      const sources = await glob(sourceDir);
      return sources.map((source) => ({
        source: path.resolve(process.cwd(), source),
        out: path.resolve(
          process.cwd(),
          path.resolve(process.cwd(), source),
          `../${path.basename(source)}${outDirPostfix}`,
        ),
      }));
    }),
  // @ts-ignore
  )).flat(1);

  const outDirs: (string | null)[] = [];
  let failedCount = 0;
  const entryBatches = splitArrayIntoSubarrays<ActionConverterEntry>(
    entries,
    conversionConcurrency,
  );

  for (const entryBatch of entryBatches) {
    outDirs.push(...await Promise.all(
      entryBatch.map(async ({ source, out }) => {
        logger.start(`converting ${source}`);
        try {
          const converted = await converter(source, out, logger);
          if (converted) {
            logger.success(`${source} complete`);
          }
          return converted ? out : null;
        } catch {
          logger.error(`failed converting ${source}`);
          failedCount += 1;
          return null;
        }
      }),
    ));
  }

  return {
    outDirs: outDirs.filter((outDir): outDir is string => outDir != null),
    failedCount,
  };
};

function getConversionConcurrency() {
  const rawValue = process.env.CONVERT_TO_JS_CONCURRENCY;
  const parsedValue = rawValue == null ? defaultConversionConcurrency : Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`CONVERT_TO_JS_CONCURRENCY must be a positive integer. Received: ${rawValue}`);
  }

  return parsedValue;
}

async function startScript() {
  const userFlags = process.argv.slice(2);
  const parts = userFlags[0] === 'split' ? ['1/4', '2/4', '3/4', '4/4'] : [null];
  let failedCount = 0;

  for (const part of parts) {
    if (part != null) {
      process.env.CONSTEL = part;
      consola.log('Start converting Part', process.env.CONSTEL);
    }
    failedCount += await batchPatternsAndConvert();
  }

  return failedCount;
}

async function batchPatternsAndConvert() {
  const allPatterns = getPatterns();
  const conversionConcurrency = getConversionConcurrency();
  const { outDirs, failedCount } = await performConversion(allPatterns, conversionConcurrency);

  await prettifyOutputs(outDirs, process.cwd(), logger);

  return failedCount;
}

startScript()
  .then((failedCount) => {
    if (failedCount > 0) {
      process.exit(1);
    }
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
