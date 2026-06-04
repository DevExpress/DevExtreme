import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { ensureDir } from '../../utils/file-operations';
import { GenerateComponentNamesExecutorSchema } from './schema';

const DEFAULT_COMPONENT_FILES_PATH = './src/ui/';
const DEFAULT_OUTPUT_FILE_NAME = './tests/src/server/component-names.ts';
const DEFAULT_EXCLUDED_FILE_NAMES: string[] = [];

const MSG_GENERATING = 'Generating component-names.ts...';
const MSG_GENERATED = '✓ Generated component-names.ts';

interface GeneratorConfig {
  componentFilesPath: string;
  excludedFileNames: string[];
  outputFileName: string;
}

function validateDependencies(): void {
  try {
    require.resolve('devextreme-internal-tools');
  } catch (error) {
    throw new Error(
      'devextreme-internal-tools package not found. Please ensure it is installed as a dependency.',
    );
  }
}

function buildGeneratorConfig(
  options: GenerateComponentNamesExecutorSchema,
  projectRoot: string,
): GeneratorConfig {
  const componentFilesPath = options.componentFilesPath || DEFAULT_COMPONENT_FILES_PATH;
  const outputFileName = options.outputFileName || DEFAULT_OUTPUT_FILE_NAME;
  const excludedFileNames = options.excludedFileNames || DEFAULT_EXCLUDED_FILE_NAMES;

  return {
    componentFilesPath: path.resolve(projectRoot, componentFilesPath),
    excludedFileNames,
    outputFileName: path.resolve(projectRoot, outputFileName),
  };
}

interface ResolvedGenerateComponentNames {
  config: GeneratorConfig;
}

export default createExecutor<GenerateComponentNamesExecutorSchema, ResolvedGenerateComponentNames>(
  {
    name: 'GenerateComponentNames',
    resolve: (options, { projectRoot }) => {
      const config = buildGeneratorConfig(options, projectRoot);
      return { config };
    },
    run: async ({ config }) => {
      logger.verbose(MSG_GENERATING);

      validateDependencies();

      const outputDir = path.dirname(config.outputFileName);
      await ensureDir(outputDir);

      const { AngularComponentNamesGenerator } = require('devextreme-internal-tools');

      const generator = new AngularComponentNamesGenerator(config);
      generator.generate();

      logger.verbose(MSG_GENERATED);
    },
  },
);
