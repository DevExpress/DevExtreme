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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const devkit_1 = require("@nx/devkit");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const path_resolver_1 = require("../../utils/path-resolver");
const error_handler_1 = require("../../utils/error-handler");
const executor_1 = __importDefault(require("../clean/executor"));
const DEFAULT_COMPONENTS_DIR = './src';
const DEFAULT_INDEX_FILE_NAME = './src/index.ts';
const CORE_DIR = 'core';
const COMMON_DIR = 'common';
const TOOLS_DIR = 'tools';
const GENERATORS_CONFIG_FILE = 'generators-config.js';
const METADATA_PACKAGE = 'devextreme-metadata';
const METADATA_FILE = 'integration-data.json';
const INTERNAL_TOOLS_PACKAGE = 'devextreme-internal-tools';
const GENERATION_FUNCTION = 'generateReactComponents';
const DEFAULT_BASE_COMPONENT = './core/component';
const DEFAULT_EXTENSION_COMPONENT = './core/extension-component';
const DEFAULT_CONFIG_COMPONENT = './core/nested-option';
const WIDGETS_PACKAGE = 'devextreme';
const CLEAN_MODE = 'shallow';
const MSG_CLEANING = '🧹 Cleaning generated components';
const MSG_CLEANED = '✓ Successfully cleaned components directory';
const MSG_LOADING_METADATA = '📋 Loading metadata';
const MSG_GENERATORS_CONFIG_NOT_FOUND = '⚠️  generators-config.js not found, proceeding without unifiedConfig';
const MSG_LOADED_REACT_CONFIG = '✓ Loaded React configuration from generators-config.js';
const MSG_GENERATING = '⚙️  Generating React components';
const MSG_GENERATION_COMPLETED = '✓ Component generation completed';
const MSG_GENERATION_SUCCESS = '✨ React component generation successful!';
const MSG_STARTING = '🔧 Starting React component generation';
const MSG_GENERATION_FAILED = '❌ Component generation failed';
const ERROR_METADATA_NOT_FOUND = 'Could not find devextreme-metadata/integration-data.json. Please ensure devextreme-metadata is installed or provide a metadataPath option.';
const ERROR_CLEAN_FAILED = 'Failed to clean components directory';
const PARENT_DIR_PREFIX = '../';
const DOT_SLASH_PREFIX = './';
const ENCODING_UTF8 = 'utf-8';
const GENERATE_REEXPORTS = 'generateReexports';
const GENERATE_CUSTOM_TYPES = 'generateCustomTypes';
const QUOTES_DOUBLE = 'double';
const EXPLICIT_INDEX_IN_IMPORTS = 'excplicitIndexInImports';
const EXPORT_PATTERN = /export \{/g;
async function cleanComponentsDirectory(absoluteComponentsDir, preservePaths, context) {
    devkit_1.logger.info(MSG_CLEANING);
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const relativeComponentsDir = path.relative(absoluteProjectRoot, absoluteComponentsDir);
    const cleanOptions = {
        targetDirectory: DOT_SLASH_PREFIX + relativeComponentsDir,
        excludePatterns: preservePaths.map((currentPath) => {
            if (path.isAbsolute(currentPath)) {
                const relative = path.relative(absoluteProjectRoot, currentPath);
                return DOT_SLASH_PREFIX + relative;
            }
            return currentPath;
        }),
        mode: CLEAN_MODE,
    };
    const result = await (0, executor_1.default)(cleanOptions, context);
    if (result.success) {
        devkit_1.logger.info(MSG_CLEANED);
    }
    else {
        throw new Error(ERROR_CLEAN_FAILED);
    }
}
function resolveMetadataPath(options, absoluteProjectRoot, workspaceRoot) {
    if (options.metadataPath) {
        return resolveCustomMetadataPath(options.metadataPath, absoluteProjectRoot, workspaceRoot);
    }
    return resolveDefaultMetadataPath();
}
function resolveCustomMetadataPath(metadataPath, absoluteProjectRoot, workspaceRoot) {
    const relativeToProject = path.resolve(absoluteProjectRoot, metadataPath);
    if (fs.existsSync(relativeToProject)) {
        return relativeToProject;
    }
    const relativeToWorkspace = path.resolve(workspaceRoot, metadataPath);
    if (fs.existsSync(relativeToWorkspace)) {
        return relativeToWorkspace;
    }
    if (metadataPath.startsWith(PARENT_DIR_PREFIX)) {
        return path.resolve(workspaceRoot, metadataPath);
    }
    return relativeToProject;
}
function resolveDefaultMetadataPath() {
    try {
        return require.resolve(`${METADATA_PACKAGE}/${METADATA_FILE}`);
    }
    catch (error) {
        throw new Error(ERROR_METADATA_NOT_FOUND);
    }
}
function loadMetadata(metadataPath) {
    devkit_1.logger.info(MSG_LOADING_METADATA);
    devkit_1.logger.info(`   Path: ${metadataPath}`);
    if (!fs.existsSync(metadataPath)) {
        throw new Error(`Metadata file not found: ${metadataPath}`);
    }
    const metadataContent = fs.readFileSync(metadataPath, ENCODING_UTF8);
    const metaData = JSON.parse(metadataContent);
    const widgetCount = Object.keys(metaData.Widgets || {}).length;
    devkit_1.logger.info(`✓ Loaded ${widgetCount} widget definitions`);
    return metaData;
}
function loadReactConfig(workspaceRoot) {
    const generatorsConfigPath = path.join(workspaceRoot, TOOLS_DIR, GENERATORS_CONFIG_FILE);
    if (!fs.existsSync(generatorsConfigPath)) {
        devkit_1.logger.warn(MSG_GENERATORS_CONFIG_NOT_FOUND);
        return undefined;
    }
    try {
        const generatorsConfig = require(generatorsConfigPath);
        devkit_1.logger.info(MSG_LOADED_REACT_CONFIG);
        return generatorsConfig.reactConfig;
    }
    catch (error) {
        devkit_1.logger.warn(`⚠️  Could not load generators-config.js: ${(0, error_handler_1.getErrorMessage)(error)}`);
        return undefined;
    }
}
function loadGenerationFunction() {
    try {
        const internalTools = require(INTERNAL_TOOLS_PACKAGE);
        return internalTools[GENERATION_FUNCTION];
    }
    catch (error) {
        throw new Error(`Could not load devextreme-internal-tools. Please ensure devextreme-internal-tools is installed as a dependency. Error: ${(0, error_handler_1.getErrorMessage)(error)}`);
    }
}
function buildGenerationConfig(options, componentsDir, indexFileName, reactConfig) {
    return {
        metaData: undefined,
        components: {
            baseComponent: options.baseComponent || DEFAULT_BASE_COMPONENT,
            extensionComponent: options.extensionComponent || DEFAULT_EXTENSION_COMPONENT,
            configComponent: options.configComponent || DEFAULT_CONFIG_COMPONENT,
        },
        out: {
            componentsDir,
            indexFileName,
        },
        widgetsPackage: WIDGETS_PACKAGE,
        typeGenerationOptions: {
            [GENERATE_REEXPORTS]: true,
            [GENERATE_CUSTOM_TYPES]: true,
        },
        templatingOptions: {
            quotes: QUOTES_DOUBLE,
            [EXPLICIT_INDEX_IN_IMPORTS]: true,
        },
        unifiedConfig: reactConfig,
    };
}
async function executeGeneration(generateReactComponents, config, metaData, componentsDir, indexFileName) {
    devkit_1.logger.info(MSG_GENERATING);
    config.metaData = metaData;
    await generateReactComponents(config);
    devkit_1.logger.info(MSG_GENERATION_COMPLETED);
    if (fs.existsSync(indexFileName)) {
        const indexContent = fs.readFileSync(indexFileName, ENCODING_UTF8);
        const exportCount = (indexContent.match(EXPORT_PATTERN) || []).length;
        devkit_1.logger.info(`   Exports: ${exportCount}`);
    }
    if (fs.existsSync(componentsDir)) {
        const dirCount = fs
            .readdirSync(componentsDir, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && entry.name !== CORE_DIR).length;
        devkit_1.logger.info(`   Component Directories: ${dirCount}`);
    }
    devkit_1.logger.info(MSG_GENERATION_SUCCESS);
}
const runExecutor = async (options, context) => {
    const absoluteProjectRoot = (0, path_resolver_1.resolveProjectPath)(context);
    const workspaceRoot = context.root;
    devkit_1.logger.info(MSG_STARTING);
    const projectRelativePath = path.relative(workspaceRoot, absoluteProjectRoot) || DOT_SLASH_PREFIX;
    devkit_1.logger.info(`   Project root: ${projectRelativePath}`);
    try {
        const componentsDir = path.resolve(absoluteProjectRoot, options.componentsDir || DEFAULT_COMPONENTS_DIR);
        const indexFileName = path.resolve(absoluteProjectRoot, options.indexFileName || DEFAULT_INDEX_FILE_NAME);
        const coreDir = path.join(componentsDir, CORE_DIR);
        const commonDir = path.join(componentsDir, COMMON_DIR);
        await cleanComponentsDirectory(componentsDir, [coreDir, commonDir, indexFileName], context);
        const metadataPath = resolveMetadataPath(options, absoluteProjectRoot, workspaceRoot);
        const metaData = loadMetadata(metadataPath);
        const reactConfig = loadReactConfig(workspaceRoot);
        const generateReactComponents = loadGenerationFunction();
        const config = buildGenerationConfig(options, componentsDir, indexFileName, reactConfig);
        await executeGeneration(generateReactComponents, config, metaData, componentsDir, indexFileName);
        return { success: true };
    }
    catch (error) {
        (0, error_handler_1.logError)(MSG_GENERATION_FAILED, error);
        return { success: false };
    }
};
exports.default = runExecutor;
