import { join, resolve, dirname } from 'path';
import { promises } from 'fs';

import MetadataCollector from '../../src/metadata/collector';

const rootDir = join(__dirname, '..', '..');
const scssDir = join(rootDir, 'tests', 'data', 'scss');

describe('MetadataCollector', () => {
  const expectedFileList: Array<string> = [
    join('bundles', 'dx.light.scss'),
    join('widgets', 'generic', 'accordion', '_colors.scss'),
    join('widgets', 'generic', 'accordion', '_index.scss'),
    join('widgets', 'generic', 'accordion', '_sizes.scss'),
    join('widgets', 'generic', '_colors.scss'),
    join('widgets', 'generic', '_index.scss'),
    join('widgets', 'generic', '_sizes.scss'),
  ];

  promises.mkdir = jest.fn();
  promises.writeFile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getFileList', async () => {
    const collector = new MetadataCollector();
    const fileList = await collector.getFileList(join(rootDir, 'tests', 'data', 'scss'));
    const expectedFullPaths = expectedFileList.map((file) => join(scssDir, file));

    expect(fileList.length).toBe(expectedFullPaths.length);

    fileList.forEach((file) => expect(expectedFullPaths).toContain(file));
  });

  test('readFiles', async () => {
    const collector = new MetadataCollector();
    const handler = (content: string): string => content;
    const filesInfo = await collector.readFiles(join(rootDir, 'tests', 'data', 'scss'), handler);

    expect(filesInfo.length).toBe(expectedFileList.length);

    filesInfo.forEach((file) => {
      expect(expectedFileList).toContain(file.path);
      expect(typeof file.content).toBe('string');
      expect(file.content.length).toBeGreaterThan(0);
    });
  });

  test('readFiles handle files with additional handler', async () => {
    const collector = new MetadataCollector();
    const handler = (content: string): string => `123${content}`;
    const fileList = await collector.readFiles(join(rootDir, 'tests', 'data', 'scss'), handler);

    fileList.forEach((file) => expect(file.content.slice(0, 3)).toBe('123'));
  });

  test('saveScssFile', async () => {
    const relativePath = join('path', 'filePath.scss');
    const fileContent = 'file content';
    const destinationPath = './scss';
    const expectedDestinationPath = resolve(join(destinationPath, relativePath));
    const expectedDestinationDir = dirname(expectedDestinationPath);

    async function getTestFiles(): Promise<Array<FileInfo>> {
      return [{ path: relativePath, content: fileContent }];
    }

    await MetadataCollector.saveScssFiles(getTestFiles(), destinationPath);

    expect(promises.mkdir).toHaveBeenCalledTimes(1);
    expect(promises.mkdir).toHaveBeenCalledWith(expectedDestinationDir, { recursive: true });
    expect(promises.writeFile).toHaveBeenCalledTimes(1);
    expect(promises.writeFile).toHaveBeenCalledWith(expectedDestinationPath, fileContent);
  });

  test('saveMetadata', async () => {
    const collector = new MetadataCollector();
    const version = '1.1.1';
    const fileName = join('metadata', 'dx-theme-builder-metadata.ts');
    const expectedFileName = resolve(fileName);
    const expectedDirName = dirname(expectedFileName);

    collector.generator.metadata = [{ Key: '$var', Value: '\'ON\'' }];

    let metaContent = 'export const metadata: Array<MetaItem> = [{\'Key\':\'$var\',\'Value\':\'"ON"\'}];\n';
    metaContent += `export const version: string = '${version}';\n`;

    await collector.saveMetadata(fileName, version);

    expect(promises.mkdir).toHaveBeenCalledTimes(1);
    expect(promises.mkdir).toHaveBeenCalledWith(expectedDirName, { recursive: true });
    expect(promises.writeFile).toHaveBeenCalledTimes(1);
    expect(promises.writeFile).toHaveBeenCalledWith(expectedFileName, metaContent);
  });
});
