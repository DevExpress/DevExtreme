import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { GenerateComponentNamesExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { ensureDir } from '../../utils/file-operations';

const DEFAULT_COMPONENT_FILES_PATH = './src/ui/';
const DEFAULT_OUTPUT_FILE_NAME = './tests/src/server/component-names.ts';
const DEFAULT_EXCLUDED_FILE_NAMES = [];

const MSG_GENERATING = 'Generating component-names.ts...';
const MSG_GENERATED = '✓ Generated component-names.ts';
const ERROR_GENERATION_FAILED = 'Component names generation failed';

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
): Record<string, unknown> {
  const componentFilesPath = options.componentFilesPath || DEFAULT_COMPONENT_FILES_PATH;
  const outputFileName = options.outputFileName || DEFAULT_OUTPUT_FILE_NAME;
  const excludedFileNames = options.excludedFileNames || DEFAULT_EXCLUDED_FILE_NAMES;

  return {
    componentFilesPath: path.resolve(projectRoot, componentFilesPath),
    excludedFileNames,
    outputFileName: path.resolve(projectRoot, outputFileName),
  };
}

const runExecutor: PromiseExecutor<GenerateComponentNamesExecutorSchema> = async (
  options,
  context,
) => {
  const projectRoot = resolveProjectPath(context);

  try {
    logger.verbose(MSG_GENERATING);

    validateDependencies();

    const config = buildGeneratorConfig(options, projectRoot);

    const outputDir = path.dirname(config.outputFileName as string);
    await ensureDir(outputDir);

    const { AngularComponentNamesGenerator } = require('devextreme-internal-tools');

    const generator = new AngularComponentNamesGenerator(config);
    generator.generate();

    logger.verbose(MSG_GENERATED);
    return { success: true };
  } catch (error) {
    logError(ERROR_GENERATION_FAILED, error);
    return { success: false };
  }
};

export default runExecutor;
