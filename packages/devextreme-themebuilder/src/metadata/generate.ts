/* eslint no-console: 0 */
import * as path from 'path';
import MetadataCollector from './collector';
import DependencyCollector from './dependency-collector';
import { version } from '../../../devextreme/build/gulp/context';
import { resolveDataUri } from '../../../devextreme-scss/build/gulp-data-uri';
import { browserslist } from '../../../devextreme/package.json';

const stylesDirectory = path.resolve(__dirname, '../../../devextreme-scss/scss');
const stylesDestinationDirectory = './src/data/scss';
const metadataDestinationFile = './src/data/metadata/dx-theme-builder-metadata.ts';
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

const sourceHandler = (content: string): string => resolveDataUri(content.replace(commentsRegex, '')) as string;

const generate = async (): Promise<void> => {
  const collector = new MetadataCollector();
  const dependencyCollector = new DependencyCollector();
  const sourceFiles = collector.readFiles(stylesDirectory, sourceHandler);
  await MetadataCollector.saveScssFiles(sourceFiles, stylesDestinationDirectory);

  dependencyCollector.collect();

  await collector.saveMetadata(
    metadataDestinationFile,
    version,
    browserslist,
    dependencyCollector.flatStylesDependencyTree,
  );
};

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
