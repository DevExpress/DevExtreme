"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const fs = __importStar(require("fs/promises"));
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const file_operations_1 = require("../../utils/file-operations");
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
const ERROR_PREPARE_SUBMODULES = 'Failed to prepare submodules';
const INDEX_FILE_NAME = 'index.js';
const PACKAGE_JSON_FILE = 'package.json';
const PATH_SLASH = '/';
const RELATIVE_DIR_PREFIX = '../';
const DEFAULT_SUBMODULE_FOLDERS = [
    ['common'],
    ['core', ['template', 'config', 'nested-option', 'component', 'extension-component']],
    ['common/core'],
    ['common/data'],
    ['common/export'],
];
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const distDirectory = path.join(absoluteProjectRoot, options.distDirectory || DEFAULT_DIST_DIR);
    try {
        devkit_1.logger.info(MSG_PREPARING);
        const packParamsForFolders = options.submoduleFolders || DEFAULT_SUBMODULE_FOLDERS;
        const esmIndexPath = path.join(distDirectory, ESM_DIR, 'index.js');
        let modulesImportsFromIndex = '';
        if (fsSync.existsSync(esmIndexPath)) {
            modulesImportsFromIndex = await fs.readFile(esmIndexPath, ENCODING_UTF8);
        }
        const modulesPaths = modulesImportsFromIndex.matchAll(REGEX_IMPORTS);
        const packParamsForModules = Array.from(modulesPaths).map(([, modulePath]) => {
            const match = modulePath.match(REGEX_PARSE_MODULE) || [];
            const moduleFilePath = match[2];
            const moduleFileName = match[3];
            return ['', moduleFileName ? [moduleFileName] : undefined, moduleFilePath];
        });
        const allModuleParams = [...packParamsForModules, ...packParamsForFolders];
        devkit_1.logger.info(`Processing ${allModuleParams.length} submodules...`);
        await Promise.all(allModuleParams.map(([folder, moduleFileNames, moduleFilePath]) => makeModule(distDirectory, folder, moduleFileNames, moduleFilePath)));
        devkit_1.logger.info(MSG_SUCCESS);
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(ERROR_PREPARE_SUBMODULES, error);
        return { success: false };
    }
};
async function makeModule(distFolder, folder, moduleFileNames, moduleFilePath) {
    const distModuleFolder = path.join(distFolder, folder);
    const distEsmFolder = path.join(distFolder, ESM_DIR, folder);
    const moduleNames = moduleFileNames || (await findJsModuleFileNamesInFolder(distEsmFolder));
    try {
        await (0, file_operations_1.ensureDir)(distModuleFolder);
        if (folder && fsSync.existsSync(path.join(distEsmFolder, 'index.js'))) {
            await generatePackageJsonFile(distFolder, folder, undefined, folder);
        }
        await Promise.all(moduleNames.map(async (moduleFileName) => {
            const moduleDir = path.join(distModuleFolder, moduleFileName);
            await (0, file_operations_1.ensureDir)(moduleDir);
            await generatePackageJsonFile(distFolder, folder, moduleFileName, moduleFilePath || folder);
        }));
    }
    catch (error) {
        throw new Error(`Exception while makeModule(${folder}): ${(0, error_handler_1.getErrorMessage)(error)}`);
    }
}
async function generatePackageJsonFile(distFolder, folder, moduleFileName, filePath) {
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
    await (0, file_operations_1.ensureDir)(absoluteModulePath);
    await (0, file_operations_1.writeJson)(path.join(absoluteModulePath, PACKAGE_JSON_FILE), packageJson);
}
async function findJsModuleFileNamesInFolder(dir) {
    if (!fsSync.existsSync(dir)) {
        return [];
    }
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries.filter(isJsModule).map((entry) => path.parse(entry.name).name);
}
function isJsModule(entry) {
    return (!entry.isDirectory() && entry.name.endsWith(JS_EXTENSION) && entry.name !== INDEX_FILE_NAME);
}
exports.default = runExecutor;
