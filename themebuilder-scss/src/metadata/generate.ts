/* eslint no-console: 0 */
import MetadataCollector from './collector';
import { version } from '../../../build/gulp/context';
import { resolveDataUri } from '../../../build/gulp/gulp-data-uri';

const stylesDirectory = '../scss';
const stylesDestinationDirectory = './src/data/scss';
const metadataDestinationFile = './src/data/metadata/dx-theme-builder-metadata.ts';
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

const sourceHandler = (content: string): string => resolveDataUri(content.replace(commentsRegex, ''));

const generate = async (): Promise<void> => {
  try {
    const collector = new MetadataCollector();
    const sourceFiles = collector.readFiles(stylesDirectory, sourceHandler);
    await MetadataCollector.saveScssFiles(sourceFiles, stylesDestinationDirectory);
    await collector.saveMetadata(metadataDestinationFile, version.package);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

generate();
