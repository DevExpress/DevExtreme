/* eslint no-console: 0 */
import MetadataCollector from './collector';
import DependencyCollector from './dependency-collector';
import { version } from '../../../build/gulp/context';
import { resolveDataUri } from '../../../build/gulp/gulp-data-uri';
import { browserslist } from '../../../package.json';

const stylesDirectory = '../scss';
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
    version.package,
    browserslist,
    dependencyCollector.flatStylesDependencyTree,
  );
};

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
