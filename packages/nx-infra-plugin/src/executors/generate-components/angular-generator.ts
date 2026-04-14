import * as path from 'path';
import { logger } from '@nx/devkit';
import normalizePath from 'normalize-path';
import { GenerationConfig } from './framework-handlers';

export async function generateAngularComponents(
  config: GenerationConfig,
  metaData: any,
): Promise<void> {
  let internalTools;
  try {
    internalTools = require('devextreme-internal-tools');
  } catch (error: any) {
    throw new Error(
      'devextreme-internal-tools not found.\n'
        + 'Run "pnpm install --frozen-lockfile" from the repository root to install dependencies.\n'
        + `Original error: ${error.message}`,
    );
  }

  const {
    AngularMetadataGenerator,
    AngularDotGenerator,
    AngularModuleFacadeGenerator,
    AngularFacadeGenerator,
    AngularCommonReexportsGenerator,
  } = internalTools;

  const componentsDir = normalizePath(config.out.componentsDir);
  const indexFileName = normalizePath(config.out.indexFileName);

  const metadataDir = normalizePath(
    path.join(path.dirname(componentsDir), 'metadata', 'generated'),
  );

  logger.info('📝 Generating Angular-specific metadata...');
  const metadataGenerator = new AngularMetadataGenerator();
  metadataGenerator.generate({
    outputFolderPath: metadataDir,
    nestedPathPart: 'nested',
    basePathPart: 'base',
    widgetPackageName: config.widgetsPackage,
    wrapperPackageName: 'devextreme-angular',
    generateReexports: config.typeGenerationOptions.generateReexports,
    unifiedConfig: config.unifiedConfig,
    sourceMetadataFilePath: require.resolve('devextreme-metadata/NGMetaData.json'),
    imdMetadataFilePath: require.resolve('devextreme-metadata/integration-data.json'),
  });
  logger.info('✓ Metadata generation completed');

  logger.info('🔨 Generating component TypeScript files...');
  const componentGenerator = new AngularDotGenerator();
  componentGenerator.generate({
    metadataFolderPath: metadataDir,
    outputFolderPath: componentsDir,
    entryFileNames: {
      popup: 'component.ts',
    },
    nestedPathPart: 'nested',
    basePathPart: 'base',
  });
  logger.info('✓ Component files generated');

  logger.info('📦 Generating module facades...');
  const moduleFacadeGenerator = new AngularModuleFacadeGenerator();
  moduleFacadeGenerator.generate({
    moduleFacades: {
      [`${componentsDir}/all.ts`]: {
        sourceComponentDirectories: [componentsDir],
        additionalImports: {
          DxTemplateModule: "import { DxTemplateModule } from 'devextreme-angular/core'",
        },
      },
    },
  });
  logger.info('✓ Module facades generated');

  logger.info('📋 Generating index facades...');
  const facadeGenerator = new AngularFacadeGenerator();
  facadeGenerator.generate({
    facades: {
      [indexFileName]: {
        sourceDirectories: [metadataDir],
      },
    },
    commonImports: ['./common', './common/grids', './common/charts'],
    templatingOptions: config.templatingOptions,
  });
  logger.info('✓ Index facades generated');

  logger.info('🔗 Generating common reexports...');
  AngularCommonReexportsGenerator.generate({
    outputPath: path.dirname(componentsDir),
    metadata: metaData,
    templatingOptions: config.templatingOptions,
  });
  logger.info('✓ Common reexports generated');
}
