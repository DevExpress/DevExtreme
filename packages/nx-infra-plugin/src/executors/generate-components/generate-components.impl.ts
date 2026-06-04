import { logger } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { createExecutor } from '../../utils/create-executor';
import { getErrorMessage } from '../../utils/error-handler';
import { GenerateReactComponentsExecutorSchema, Framework } from './schema';
import { getFrameworkHandler, GenerationConfig } from './framework-handlers';

const DEFAULT_COMPONENTS_DIR = './src';
const DEFAULT_INDEX_FILE_NAME = './src/index.ts';
const CORE_DIR = 'core';

const TOOLS_DIR = 'tools';
const GENERATORS_CONFIG_FILE = 'generators-config.js';
const METADATA_PACKAGE = 'devextreme-metadata';
const METADATA_FILE = 'integration-data.json';
const INTERNAL_TOOLS_PACKAGE = 'devextreme-internal-tools';

const DEFAULT_BASE_COMPONENT = './core/component';
const DEFAULT_EXTENSION_COMPONENT = './core/extension-component';
const DEFAULT_CONFIG_COMPONENT = './core/nested-option';

const WIDGETS_PACKAGE = 'devextreme';

const MSG_LOADING_METADATA = '📋 Loading metadata';
const MSG_GENERATORS_CONFIG_NOT_FOUND =
  '⚠️  generators-config.js not found, proceeding without unifiedConfig';
const MSG_GENERATION_COMPLETED = '✓ Component generation completed';

const ERROR_METADATA_NOT_FOUND =
  'Could not find devextreme-metadata/integration-data.json. Please ensure devextreme-metadata is installed or provide a metadataPath option.';

const PARENT_DIR_PREFIX = '../';
const DOT_SLASH_PREFIX = './';

const ENCODING_UTF8 = 'utf-8';

const EXPORT_PATTERN = /export \{/g;

interface FrameworkMessages {
  loadedConfig: string;
  generating: string;
  generationSuccess: string;
  starting: string;
  generationFailed: string;
}

function createMessages(framework: Framework): FrameworkMessages {
  const frameworkName = framework.charAt(0).toUpperCase() + framework.slice(1);
  return {
    loadedConfig: `✓ Loaded ${frameworkName} configuration from generators-config.js`,
    generating: `⚙️  Generating ${frameworkName} components`,
    generationSuccess: `✨ ${frameworkName} component generation successful!`,
    starting: `🔧 Starting ${frameworkName} component generation`,
    generationFailed: `❌ ${frameworkName} component generation failed`,
  };
}

function resolveDefaultMetadataPath(): string {
  try {
    return require.resolve(`${METADATA_PACKAGE}/${METADATA_FILE}`);
  } catch {
    throw new Error(ERROR_METADATA_NOT_FOUND);
  }
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

function loadMetadata(metadataPath: string): any {
  logger.verbose(MSG_LOADING_METADATA);
  logger.verbose(`   Path: ${metadataPath}`);

  if (!fs.existsSync(metadataPath)) {
    throw new Error(`Metadata file not found: ${metadataPath}`);
  }

  const metadataContent = fs.readFileSync(metadataPath, ENCODING_UTF8);
  const metaData = JSON.parse(metadataContent);

  const widgetCount = Object.keys(metaData.Widgets || {}).length;
  logger.verbose(`✓ Loaded ${widgetCount} widget definitions`);

  return metaData;
}

function loadConfigFromFile(projectRoot: string, configPath: string, framework: Framework): any {
  const absoluteConfigPath = path.resolve(projectRoot, configPath);

  if (!fs.existsSync(absoluteConfigPath)) {
    logger.warn(`⚠️  Configuration file not found: ${configPath}`);
    return undefined;
  }

  try {
    delete require.cache[require.resolve(absoluteConfigPath)];
    const config = require(absoluteConfigPath);

    const frameworkName = framework.charAt(0).toUpperCase() + framework.slice(1);
    logger.verbose(`✓ Loaded ${frameworkName} configuration from ${configPath}`);
    return config;
  } catch (error) {
    logger.warn(`⚠️  Could not load configuration from ${configPath}: ${getErrorMessage(error)}`);
    return undefined;
  }
}

function loadConfigFromGeneratorsFile(
  workspaceRoot: string,
  configName: string,
  framework: Framework,
): any {
  const generatorsConfigPath = path.join(workspaceRoot, TOOLS_DIR, GENERATORS_CONFIG_FILE);

  if (!fs.existsSync(generatorsConfigPath)) {
    logger.warn(MSG_GENERATORS_CONFIG_NOT_FOUND);
    return undefined;
  }

  try {
    const generatorsConfig = require(generatorsConfigPath);
    const config = generatorsConfig[configName];

    if (!config) {
      logger.warn(`⚠️  Configuration '${configName}' not found in generators-config.js`);
      return undefined;
    }

    const messages = createMessages(framework);
    logger.verbose(messages.loadedConfig);
    return config;
  } catch (error) {
    logger.warn(`⚠️  Could not load generators-config.js: ${getErrorMessage(error)}`);
    return undefined;
  }
}

function loadFrameworkConfig(
  workspaceRoot: string,
  projectRoot: string,
  configName: string,
  framework: Framework,
): any {
  const isFilePath =
    configName.startsWith(DOT_SLASH_PREFIX) || configName.startsWith(PARENT_DIR_PREFIX);

  if (isFilePath) {
    return loadConfigFromFile(projectRoot, configName, framework);
  }

  return loadConfigFromGeneratorsFile(workspaceRoot, configName, framework);
}

function loadGenerationFunction(framework: Framework): any {
  if (framework === 'angular') {
    return null;
  }

  const handler = getFrameworkHandler(framework);
  const functionName = handler.getDefaults().generationFunctionName;

  try {
    const internalTools = require(INTERNAL_TOOLS_PACKAGE);
    const generationFunction = internalTools[functionName];

    if (!generationFunction) {
      throw new Error(
        `Generation function '${functionName}' not found in ${INTERNAL_TOOLS_PACKAGE}`,
      );
    }

    return generationFunction;
  } catch (error) {
    throw new Error(
      `Could not load ${functionName} from devextreme-internal-tools. Please ensure devextreme-internal-tools is installed as a dependency. Error: ${getErrorMessage(
        error,
      )}`,
    );
  }
}

function buildGenerationConfig(
  options: GenerateReactComponentsExecutorSchema,
  componentsDir: string,
  indexFileName: string,
  frameworkConfig: any,
): GenerationConfig {
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
      generateReexports: true,
      generateCustomTypes: true,
    },
    templatingOptions: {
      quotes: options.quotes ?? 'double',
      excplicitIndexInImports: options.explicitIndexInImports ?? true,
    },
    unifiedConfig: frameworkConfig,
    componentGeneratorTplConfig: options.componentGeneratorTplConfig,
  };
}

async function executeGeneration(
  generateComponents: any,
  config: GenerationConfig,
  metaData: any,
  componentsDir: string,
  indexFileName: string,
  framework: Framework,
): Promise<void> {
  const messages = createMessages(framework);
  const handler = getFrameworkHandler(framework);

  logger.verbose(messages.generating);

  await handler.executeGeneration(generateComponents, config, metaData);

  logger.verbose(MSG_GENERATION_COMPLETED);

  if (fs.existsSync(indexFileName)) {
    const indexContent = fs.readFileSync(indexFileName, ENCODING_UTF8);
    const exportCount = (indexContent.match(EXPORT_PATTERN) || []).length;
    logger.verbose(`   Exports: ${exportCount}`);
  }

  if (fs.existsSync(componentsDir)) {
    const dirCount = fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name !== CORE_DIR).length;
    logger.verbose(`   Component Directories: ${dirCount}`);
  }

  logger.verbose(messages.generationSuccess);
}

interface ResolvedGenerateComponents {
  projectRoot: string;
  workspaceRoot: string;
  framework: Framework;
  componentsDir: string;
  indexFileName: string;
  metadataPath: string;
  configName: string;
}

export default createExecutor<GenerateReactComponentsExecutorSchema, ResolvedGenerateComponents>({
  name: 'GenerateComponents',
  resolve: (options, { projectRoot, context }) => {
    const workspaceRoot = context.root;
    const framework: Framework = options.framework || 'react';
    const messages = createMessages(framework);

    logger.verbose(messages.starting);
    const projectRelativePath = path.relative(workspaceRoot, projectRoot) || DOT_SLASH_PREFIX;
    logger.verbose(`   Project root: ${projectRelativePath}`);
    logger.verbose(`   Framework: ${framework}`);

    const componentsDir = path.resolve(
      projectRoot,
      options.componentsDir || DEFAULT_COMPONENTS_DIR,
    );
    const indexFileName = path.resolve(
      projectRoot,
      options.indexFileName || DEFAULT_INDEX_FILE_NAME,
    );

    const metadataPath = resolveMetadataPath(options, projectRoot, workspaceRoot);

    const handler = getFrameworkHandler(framework);
    const configName = options.generatorConfig || handler.getDefaults().configName;

    return {
      projectRoot,
      workspaceRoot,
      framework,
      componentsDir,
      indexFileName,
      metadataPath,
      configName,
    };
  },
  run: async (resolved, options) => {
    const metaData = loadMetadata(resolved.metadataPath);

    const frameworkConfig = loadFrameworkConfig(
      resolved.workspaceRoot,
      resolved.projectRoot,
      resolved.configName,
      resolved.framework,
    );

    const generateComponents = loadGenerationFunction(resolved.framework);

    const config = buildGenerationConfig(
      options,
      resolved.componentsDir,
      resolved.indexFileName,
      frameworkConfig,
    );

    await executeGeneration(
      generateComponents,
      config,
      metaData,
      resolved.componentsDir,
      resolved.indexFileName,
      resolved.framework,
    );
  },
});
