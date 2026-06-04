import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import type { Dirent } from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { getErrorMessage } from '../../utils/error-handler';
import { ensureDir, writeJson } from '../../utils/file-operations';
import { PackParam } from '../../utils/types';
import { PrepareSubmodulesExecutorSchema } from './schema';

const DEFAULT_DIST_DIR = './npm';
const ESM_DIR = 'esm';
const CJS_DIR = 'cjs';

const ENCODING_UTF8 = 'utf8';

const JS_EXTENSION = '.js';
const DTS_EXTENSION = '.d.ts';

const REGEX_IMPORTS = /from "\.\/([^;]+)";/g;
const REGEX_PARSE_MODULE = /((.*)\/)?([^/]+$)/;

const MSG_PREPARING = '📦 Preparing submodules';
const MSG_SUCCESS = '✓ Submodules prepared successfully';

const INDEX_FILE_NAME = 'index.js';
const PACKAGE_JSON_FILE = 'package.json';

const PATH_SLASH = '/';
const RELATIVE_DIR_PREFIX = '../';

const DEFAULT_SUBMODULE_FOLDERS: PackParam[] = [
  ['common'],
  ['core', ['template', 'config', 'nested-option', 'component', 'extension-component']],
  ['common/core'],
  ['common/data'],
  ['common/export'],
];

function isJsModule(entry: Dirent): boolean {
  return (
    !entry.isDirectory() && entry.name.endsWith(JS_EXTENSION) && entry.name !== INDEX_FILE_NAME
  );
}

async function findJsModuleFileNamesInFolder(dir: string): Promise<string[]> {
  if (!fsSync.existsSync(dir)) {
    return [];
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  return entries.filter(isJsModule).map((entry) => path.parse(entry.name).name);
}

async function generatePackageJsonFile(
  distFolder: string,
  folder: string,
  moduleFileName?: string,
  filePath?: string,
): Promise<void> {
  const moduleName = moduleFileName || '';
  const absoluteModulePath = path.join(distFolder, folder, moduleName);
  const moduleFilePathResolved = (filePath ? filePath + PATH_SLASH : '') + (moduleName || 'index');
  const esmFilePath = path.join(distFolder, ESM_DIR, moduleFilePathResolved + JS_EXTENSION);
  const relativePath = path.relative(absoluteModulePath, esmFilePath);

  const relativeBase = RELATIVE_DIR_PREFIX.repeat(relativePath.split('..').length - 1);

  const packageJson = {
    sideEffects: false,
    main: `${relativeBase}${CJS_DIR}/${moduleFilePathResolved}${JS_EXTENSION}`,
    module: `${relativeBase}${ESM_DIR}/${moduleFilePathResolved}${JS_EXTENSION}`,
    typings: `${relativeBase}${CJS_DIR}/${moduleFilePathResolved}${DTS_EXTENSION}`,
  };

  await ensureDir(absoluteModulePath);
  await writeJson(path.join(absoluteModulePath, PACKAGE_JSON_FILE), packageJson);
}

async function makeModule(
  distFolder: string,
  folder: string,
  moduleFileNames?: string[],
  moduleFilePath?: string,
): Promise<void> {
  const distModuleFolder = path.join(distFolder, folder);
  const distEsmFolder = path.join(distFolder, ESM_DIR, folder);
  const moduleNames = moduleFileNames || (await findJsModuleFileNamesInFolder(distEsmFolder));

  try {
    await ensureDir(distModuleFolder);

    if (folder && fsSync.existsSync(path.join(distEsmFolder, 'index.js'))) {
      await generatePackageJsonFile(distFolder, folder, undefined, folder);
    }

    await Promise.all(
      moduleNames.map(async (moduleFileName) => {
        const moduleDir = path.join(distModuleFolder, moduleFileName);
        await ensureDir(moduleDir);

        await generatePackageJsonFile(distFolder, folder, moduleFileName, moduleFilePath || folder);
      }),
    );
  } catch (error) {
    throw new Error(`Exception while makeModule(${folder}): ${getErrorMessage(error)}`);
  }
}

interface ResolvedPrepareSubmodules {
  distDirectory: string;
  packParamsForFolders: PackParam[];
  customSubmoduleFoldersProvided: boolean;
}

export default createExecutor<PrepareSubmodulesExecutorSchema, ResolvedPrepareSubmodules>({
  name: 'PrepareSubmodules',
  resolve: (options, { projectRoot }) => {
    const distDirectory = path.join(projectRoot, options.distDirectory || DEFAULT_DIST_DIR);
    const packParamsForFolders = options.submoduleFolders || DEFAULT_SUBMODULE_FOLDERS;
    const customSubmoduleFoldersProvided = options.submoduleFolders !== undefined;
    return { distDirectory, packParamsForFolders, customSubmoduleFoldersProvided };
  },
  run: async (resolved, options) => {
    logger.verbose(MSG_PREPARING);

    if (resolved.customSubmoduleFoldersProvided) {
      logger.verbose(
        `Using custom submoduleFolders: ${JSON.stringify(options.submoduleFolders, null, 2)}`,
      );
    }

    const esmIndexPath = path.join(resolved.distDirectory, ESM_DIR, 'index.js');
    let modulesImportsFromIndex = '';

    if (fsSync.existsSync(esmIndexPath)) {
      modulesImportsFromIndex = await fs.readFile(esmIndexPath, ENCODING_UTF8);
    }

    const modulesPaths = modulesImportsFromIndex.matchAll(REGEX_IMPORTS);
    const packParamsForModules: PackParam[] = Array.from(modulesPaths).map(([, modulePath]) => {
      const match = modulePath.match(REGEX_PARSE_MODULE) || [];
      const moduleFilePath = match[2] as string | undefined;
      const moduleFileName = match[3] as string | undefined;

      return ['', moduleFileName ? [moduleFileName] : undefined, moduleFilePath];
    });

    const allModuleParams: PackParam[] = [
      ...packParamsForModules,
      ...resolved.packParamsForFolders,
    ];

    logger.verbose(`Processing ${allModuleParams.length} submodules...`);

    await Promise.all(
      allModuleParams.map(([folder, moduleFileNames, moduleFilePath]) =>
        makeModule(resolved.distDirectory, folder, moduleFileNames, moduleFilePath),
      ),
    );

    logger.verbose(MSG_SUCCESS);
  },
});
