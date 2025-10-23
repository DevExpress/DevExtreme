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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const rimraf = __importStar(require("rimraf"));
const glob_1 = require("glob");
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const CLEAN_MODE_SIMPLE = 'simple';
const CLEAN_MODE_SHALLOW = 'shallow';
const CLEAN_MODE_RECURSIVE = 'recursive';
const DEFAULT_TARGET_DIR = './src';
const DEFAULT_CLEAN_MODE = CLEAN_MODE_SIMPLE;
const GLOB_ALL_FILES = '**/*';
function resolveExcludePaths(patterns, absoluteProjectRoot) {
    return patterns.map((pattern) => path.isAbsolute(pattern) ? pattern : path.join(absoluteProjectRoot, pattern));
}
function shouldPreservePath(filePath, excludePaths, exactMatch) {
    const normalized = path.normalize(filePath);
    return excludePaths.some((excludePath) => {
        const normalizedExclude = path.normalize(excludePath);
        return exactMatch ? normalized === normalizedExclude : normalized.startsWith(normalizedExclude);
    });
}
function cleanSimple(targetDirectory) {
    if (fs.existsSync(targetDirectory)) {
        fs.rmSync(targetDirectory, { recursive: true, force: true });
    }
}
function cleanShallow(targetDirectory, absoluteExcludePaths) {
    if (!fs.existsSync(targetDirectory)) {
        return;
    }
    const entries = fs.readdirSync(targetDirectory, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(targetDirectory, entry.name);
        if (!shouldPreservePath(fullPath, absoluteExcludePaths, true)) {
            fs.rmSync(fullPath, { recursive: true, force: true });
        }
    }
}
async function cleanRecursive(targetDirectory, absoluteExcludePaths) {
    const filesToDelete = await (0, glob_1.glob)(GLOB_ALL_FILES, {
        cwd: targetDirectory,
        dot: true,
        absolute: true,
    });
    const filteredFiles = filesToDelete.filter((file) => !shouldPreservePath(file, absoluteExcludePaths, false));
    for (const file of filteredFiles) {
        rimraf.sync(file);
    }
}
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const targetDirectory = path.join(absoluteProjectRoot, options.targetDirectory || DEFAULT_TARGET_DIR);
    const mode = options.mode || DEFAULT_CLEAN_MODE;
    const excludePatterns = options.excludePatterns || [];
    devkit_1.logger.info(`Cleaning ${targetDirectory} in ${mode} mode...`);
    if (excludePatterns.length > 0) {
        devkit_1.logger.info(`Excluding patterns: ${excludePatterns.join(', ')}`);
    }
    try {
        const absoluteExcludePaths = resolveExcludePaths(excludePatterns, absoluteProjectRoot);
        switch (mode) {
            case CLEAN_MODE_SIMPLE:
                cleanSimple(targetDirectory);
                break;
            case CLEAN_MODE_SHALLOW:
                cleanShallow(targetDirectory, absoluteExcludePaths);
                break;
            case CLEAN_MODE_RECURSIVE:
                await cleanRecursive(targetDirectory, absoluteExcludePaths);
                break;
        }
        devkit_1.logger.info(`Successfully cleaned ${targetDirectory}`);
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(`Failed to clean ${targetDirectory}`, error);
        return { success: false };
    }
};
exports.default = runExecutor;
