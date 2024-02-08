/* eslint-disable import/no-extraneous-dependencies */
import cps from 'child_process';
import path from 'path';
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { copy, emptyDir, remove } from 'fs-extra';
import { promisify } from 'util';
import _ from 'lodash';
import os from 'os';

import { Logger, PathResolver, PathResolvers } from './types';

let platformGlob = glob;
const makePathArrayPosix = (pathArray) => pathArray.map(
  (pathElem) => pathElem.split(path.sep).join(path.posix.sep),
);

function isWindows() {
  return os.platform() === 'win32';
}

const exec = promisify(cps.exec);

const tsConfigFileName = 'converter.tsconfig.json';

const bundleAssets = [
  'static/**/*',
  './**/*.md',
  './**/*.vue',
  './**/*.css',
  './**/*.html',
];

const redundantAssets = ['*tsconfig*', 'types.js'];

const makeConfig = (
  resolve: PathResolvers,
  include: string[],
  exclude: string[],
  types: string[],
  module = 'ES2015',
) => ({
  include: makePathArrayPosix(include),
  exclude: makePathArrayPosix(exclude),
  compilerOptions: {
    outDir: resolve.out('./'),
    rootDir: resolve.source('./'),
    module,
    moduleResolution: 'node',
    esModuleInterop: false,
    sourceMap: false,
    jsx: 'react-native',
    allowJs: true,
    target: 'ES2020',
    lib: ['ES2020', 'dom'],
    types,
    noEmit: false,
    skipLibCheck: true,
    allowSyntheticDefaultImports: true,
    resolveJsonModule: true,
  },
});

const pipeSource = async (
  resolve: PathResolvers,
  assets: string[],
  processor: (source: string, target: string) => Promise<void>,
): Promise<void> => {
  await Promise.all(assets.map(async (asset) => {
    const files = await platformGlob(resolve.source(asset));
    await Promise.all(files.map(async (file) => {
      await processor(
        resolve.source(file),
        resolve.out(`.${file.substring(resolve.source('./').length)}`),
      );
    }));
  }));
};

const execTsc = async (directory: string, args: string): Promise<string> => new Promise((resolve, reject) => {
  cps.exec(`tsc ${args}`, (error, stdout, stderr) => {
    if (error != null) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject(`${error}\n${stderr}\n${stdout}`);
    }
    return resolve(stdout);
  });
});

const compile = async (resolve: PathResolvers, log: Logger) => {
  log.debug('compiling sources and unit tests');

  const tsconfigFile = resolve.out(tsConfigFileName);

  log.debug(`writing ${tsconfigFile}`);

  await writeFile(
    tsconfigFile,
    JSON.stringify(
      makeConfig(
        resolve,
        [resolve.source('./**/*')],
        [resolve.source('./test/e2e*'), resolve.source('./jest.config.ts')],
        ['node', 'jest'],
      ),
      null,
      2,
    ),
  );

  await execTsc(resolve.source('./'), `--build ${tsconfigFile}`);
};

const copyAssets = async (resolve: PathResolvers, log: Logger) => {
  log.debug('copying assets:');
  await pipeSource(resolve, bundleAssets, async (source, target) => {
    log.debug(`${source} -> ${target}`);
    await copy(source, target);
  });
};

const copyEverything = async (resolve: PathResolvers, log: Logger) => {
  log.debug('copying everything:');
  await pipeSource(resolve, ['*.*'], async (source, target) => {
    log.debug(`${source} -> ${target}`);
    await copy(source, target);
  });
};

const strip = async (resolve: PathResolvers, log: Logger) => {
  log.debug('stripping JS example');

  await redundantAssets.map(async (asset) => {
    const files = await platformGlob(resolve.out(asset));
    await files.map(async (file) => {
      log.debug(`! ${file}`);
      await remove(file);
    });
  });
};

const replaceInFiles = async (filenamePatterns: string[], replacementCallback: (string) => string, resolvePath: (string) => string, log: Logger) => (
  Promise.all(
    filenamePatterns.map(async (pattern) => {
      const files = await platformGlob(resolvePath(pattern));
      log.debug(files.join('\r\n'));
      return Promise.all(
        files.map(async (file) => {
          log.debug(`patching ${file}`);
          const fileContents = replacementCallback(
            (await readFile(file)).toString(),
          );
          return writeFile(file, fileContents);
        }),
      );
    }),
  )
);

const temporaryImportFixMark = '\'; /* temporary import fix */';

const patchImportsPreCompile = async (resolve: PathResolvers, log: Logger) => {
  const filenamePatterns = ['./*.ts', './*.tsx'];

  const replaceFileExtensions = (input) => input
    .replace(/(\.tsx?';)/g, temporaryImportFixMark);

  await replaceInFiles(filenamePatterns, replaceFileExtensions, resolve.source, log);
  log.debug('imports patching done');
};

const patchImports = async (resolve: PathResolvers, log: Logger) => {
  const filenamePatterns = ['./*.jsx', './*.js', './*.html'];

  const replaceFileExtensions = (input) => input
    .replace(/(\.tsx?)/g, '.js')
    .replaceAll(temporaryImportFixMark, '.js\';');

  await replaceInFiles(filenamePatterns, replaceFileExtensions, resolve.out, log);
  log.debug('imports patching done');
};

const prettify = async (resolve: PathResolvers, log: Logger) => {
  log.debug('running Prettier');
  await exec(`prettier --write "${resolve.out('')}${path.sep}!(*.{css,json})" --single-attribute-per-line --print-width 100`, {
    cwd: resolve.out(''),
  });
  await exec(`eslint --fix "${resolve.out('')}" --ignore-pattern "config.js"`, {
    cwd: resolve.out(''),
  });
};

const hasTypescriptFiles = async (resolve: PathResolver) => {
  const filenamePatterns = ['./*.ts', './*.tsx'];
  const files = (await Promise.all(filenamePatterns.map((pattern) => platformGlob(resolve(pattern))))).flat(1);
  return files.length > 0;
};

export const converter = async (
  sourceDir: string,
  outDir: string,
  log: Logger,
): Promise<void> => {
  log.debug('TS to JS example converter starting');
  log.debug(`sourceDir: ${sourceDir}`);
  log.debug(`outDir: ${outDir}`);

  if (isWindows()) {
    platformGlob = _.partial(glob, _, { windowsPathsNoEscape: true }) as any;
  }

  const tempDir = path.join(sourceDir, '../_temp');
  const sourceDirResolver = _.partial(path.resolve, sourceDir);
  const tempDirResolver = _.partial(path.resolve, tempDir);

  if (!await hasTypescriptFiles(sourceDirResolver)) {
    log.info(`No TypeScript files found in ${sourceDir}. Skipping...`);
    return;
  }

  log.debug(`touching ${outDir}`);
  await emptyDir(outDir);
  log.debug(`touching ${tempDir}`);
  await emptyDir(tempDir);

  await copyEverything({ source: sourceDirResolver, out: tempDirResolver }, log);

  const resolve = {
    source: tempDirResolver,
    out: _.partial(path.resolve, outDir),
  };

  try {
    await patchImportsPreCompile(resolve, log);
    await compile(resolve, log);
    await copyAssets(resolve, log);
    await patchImports(resolve, log);
    await prettify(resolve, log);
    await strip(resolve, log);
  } catch (error) {
    log.error(error);
    return;
  } finally {
    log.debug(`removing temp directory: ${tempDir}`);
    await remove(tempDir);
  }
};
