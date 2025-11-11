import { PromiseExecutor, logger, ExecutorContext } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { GenerateReactComponentsExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError, getErrorMessage } from '../../utils/error-handler';
import cleanExecutor from '../clean/executor';
import { CleanExecutorSchema } from '../clean/schema';

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
const MSG_GENERATORS_CONFIG_NOT_FOUND =
  '⚠️  generators-config.js not found, proceeding without unifiedConfig';
const MSG_LOADED_REACT_CONFIG = '✓ Loaded React configuration from generators-config.js';
const MSG_GENERATING = '⚙️  Generating React components';
const MSG_GENERATION_COMPLETED = '✓ Component generation completed';
const MSG_GENERATION_SUCCESS = '✨ React component generation successful!';
const MSG_STARTING = '🔧 Starting React component generation';
const MSG_GENERATION_FAILED = '❌ Component generation failed';

const ERROR_METADATA_NOT_FOUND =
  'Could not find devextreme-metadata/integration-data.json. Please ensure devextreme-metadata is installed or provide a metadataPath option.';
const ERROR_CLEAN_FAILED = 'Failed to clean components directory';

const PARENT_DIR_PREFIX = '../';
const DOT_SLASH_PREFIX = './';

const ENCODING_UTF8 = 'utf-8';

const GENERATE_REEXPORTS = 'generateReexports';
const GENERATE_CUSTOM_TYPES = 'generateCustomTypes';
const QUOTES_DOUBLE = 'double';
const EXPLICIT_INDEX_IN_IMPORTS = 'excplicitIndexInImports';

const EXPORT_PATTERN = /export \{/g;

async function cleanComponentsDirectory(
  absoluteComponentsDir: string,
  preservePaths: string[],
  context: ExecutorContext,
): Promise<void> {
  logger.info(MSG_CLEANING);

  const absoluteProjectRoot = resolveProjectPath(context);

  const relativeComponentsDir = path.relative(absoluteProjectRoot, absoluteComponentsDir);

  const cleanOptions: CleanExecutorSchema = {
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

  const result = await cleanExecutor(cleanOptions, context);

  if (result.success) {
    logger.info(MSG_CLEANED);
  } else {
    throw new Error(ERROR_CLEAN_FAILED);
  }
}

function resolveMetadataPath(
  options: GenerateReactComponentsExecutorSchema,
  absoluteProjectRoot: string,
  workspaceRoot: string,
): string {
  if (options.metadataPath) {
    return resolveCustomMetadataPath(options.metadataPath, absoluteProjectRoot, workspaceRoot);
  }

  return resolveDefaultMetadataPath();
}

function resolveCustomMetadataPath(
  metadataPath: string,
  absoluteProjectRoot: string,
  workspaceRoot: string,
): string {
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

function resolveDefaultMetadataPath(): string {
  try {
    return require.resolve(`${METADATA_PACKAGE}/${METADATA_FILE}`);
  } catch (error) {
    throw new Error(ERROR_METADATA_NOT_FOUND);
  }
}

function loadMetadata(metadataPath: string): any {
  logger.info(MSG_LOADING_METADATA);
  logger.info(`   Path: ${metadataPath}`);

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`Metadata file not found: ${metadataPath}`);
  }

  const metadataContent = fs.readFileSync(metadataPath, ENCODING_UTF8);
  const metaData = JSON.parse(metadataContent);

  const widgetCount = Object.keys(metaData.Widgets || {}).length;
  logger.info(`✓ Loaded ${widgetCount} widget definitions`);

  return metaData;
}

function loadReactConfig(workspaceRoot: string): any {
  const generatorsConfigPath = path.join(workspaceRoot, TOOLS_DIR, GENERATORS_CONFIG_FILE);

  if (!fs.existsSync(generatorsConfigPath)) {
    logger.warn(MSG_GENERATORS_CONFIG_NOT_FOUND);
    return undefined;
  }

  try {
    const generatorsConfig = require(generatorsConfigPath);
    logger.info(MSG_LOADED_REACT_CONFIG);
    return generatorsConfig.reactConfig;
  } catch (error) {
    logger.warn(`⚠️  Could not load generators-config.js: ${getErrorMessage(error)}`);
    return undefined;
  }
}

function loadGenerationFunction(): any {
  try {
    const internalTools = require(INTERNAL_TOOLS_PACKAGE);
    return internalTools[GENERATION_FUNCTION];
  } catch (error) {
    throw new Error(
      `Could not load devextreme-internal-tools. Please ensure devextreme-internal-tools is installed as a dependency. Error: ${getErrorMessage(
        error,
      )}`,
    );
  }
}

function buildGenerationConfig(
  options: GenerateReactComponentsExecutorSchema,
  componentsDir: string,
  indexFileName: string,
  reactConfig: any,
): any {
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

async function executeGeneration(
  generateReactComponents: any,
  config: any,
  metaData: any,
  componentsDir: string,
  indexFileName: string,
): Promise<void> {
  logger.info(MSG_GENERATING);

  config.metaData = metaData;
  await generateReactComponents(config);

  logger.info(MSG_GENERATION_COMPLETED);

  if (fs.existsSync(indexFileName)) {
    const indexContent = fs.readFileSync(indexFileName, ENCODING_UTF8);
    const exportCount = (indexContent.match(EXPORT_PATTERN) || []).length;
    logger.info(`   Exports: ${exportCount}`);
  }

  if (fs.existsSync(componentsDir)) {
    const dirCount = fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== CORE_DIR).length;
    logger.info(`   Component Directories: ${dirCount}`);
  }

  logger.info(MSG_GENERATION_SUCCESS);
}

const runExecutor: PromiseExecutor<GenerateReactComponentsExecutorSchema> = async (
  options,
  context,
) => {
  const absoluteProjectRoot = resolveProjectPath(context);
  const workspaceRoot = context.root;

  logger.info(MSG_STARTING);
  const projectRelativePath = path.relative(workspaceRoot, absoluteProjectRoot) || DOT_SLASH_PREFIX;
  logger.info(`   Project root: ${projectRelativePath}`);

  try {
    const componentsDir = path.resolve(
      absoluteProjectRoot,
      options.componentsDir || DEFAULT_COMPONENTS_DIR,
    );
    const indexFileName = path.resolve(
      absoluteProjectRoot,
      options.indexFileName || DEFAULT_INDEX_FILE_NAME,
    );

    const coreDir = path.join(componentsDir, CORE_DIR);
    const commonDir = path.join(componentsDir, COMMON_DIR);
    await cleanComponentsDirectory(componentsDir, [coreDir, commonDir, indexFileName], context);

    const metadataPath = resolveMetadataPath(options, absoluteProjectRoot, workspaceRoot);
    const metaData = loadMetadata(metadataPath);

    const reactConfig = loadReactConfig(workspaceRoot);

    const generateReactComponents = loadGenerationFunction();

    const config = buildGenerationConfig(options, componentsDir, indexFileName, reactConfig);
    await executeGeneration(
      generateReactComponents,
      config,
      metaData,
      componentsDir,
      indexFileName,
    );

    return { success: true };
  } catch (error) {
    logError(MSG_GENERATION_FAILED, error);
    return { success: false };
  }
};

export default runExecutor;
