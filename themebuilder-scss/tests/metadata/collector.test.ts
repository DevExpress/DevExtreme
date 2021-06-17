import { join, resolve, dirname } from 'path';
import { promises } from 'fs';

import MetadataCollector from '../../src/metadata/collector';

const rootDir = join(__dirname, '..', '..');
const scssDir = join(rootDir, 'tests', 'data', 'scss');

describe('MetadataCollector', () => {
  const expectedFileList: string[] = [
    join('bundles', 'dx.light.scss'),
    join('bundles', 'dx.material.blue.light.scss'),
    join('widgets', 'generic', 'accordion', '_colors.scss'),
    join('widgets', 'generic', 'accordion', '_index.scss'),
    join('widgets', 'generic', 'accordion', '_sizes.scss'),
    join('widgets', 'generic', 'dateBox', '_index.scss'),
    join('widgets', 'generic', '_colors.scss'),
    join('widgets', 'generic', '_index.scss'),
    join('widgets', 'generic', '_sizes.scss'),
    join('widgets', 'generic', '_variables.scss'),
    join('widgets', 'material', '_index.scss'),
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

    function getTestFiles(): FileInfo[] {
      return [{ path: relativePath, content: fileContent }];
    }

    await MetadataCollector.saveScssFiles(Promise.resolve(getTestFiles()), destinationPath);

    expect(promises.mkdir).toHaveBeenCalledTimes(1);
    expect(promises.mkdir).toHaveBeenCalledWith(expectedDestinationDir, { recursive: true });
    expect(promises.writeFile).toHaveBeenCalledTimes(1);
    expect(promises.writeFile).toHaveBeenCalledWith(expectedDestinationPath, fileContent);
  });

  test('saveMetadata', async () => {
    const collector = new MetadataCollector();
    const version = '1.1.1';
    const fileName = join('metadata', 'dx-theme-builder-metadata.ts');
    const jsonFileName = join('metadata', 'dx-theme-builder-metadata.json');
    const expectedFileName = resolve(fileName);
    const expectedJsonFileName = resolve(jsonFileName);
    const expectedDirName = dirname(expectedFileName);
    const meta: ThemesMetadata = { generic: [{ Key: '$var', Value: '\'ON\'' }], material: [] };

    collector.generator.metadata = meta;

    let metaContent = 'export const metadata: ThemesMetadata = {\'generic\':[{\'Key\':\'$var\',\'Value\':\'"ON"\'}],\'material\':[]};\n';
    metaContent += `export const version: string = '${version}';\n`;
    metaContent += 'export const browsersList: Array<string> = [];\n';
    metaContent += 'export const dependencies: FlatStylesDependencies = {};\n';

    const jsonMetaContent = JSON.stringify(meta);

    await collector.saveMetadata(fileName, jsonFileName, version, [], {});

    expect(promises.mkdir).toHaveBeenCalledTimes(2);
    expect(promises.mkdir).toHaveBeenCalledWith(expectedDirName, { recursive: true });
    expect(promises.writeFile).toHaveBeenCalledTimes(2);
    expect(promises.writeFile).toHaveBeenCalledWith(expectedFileName, metaContent);
    expect(promises.writeFile).toHaveBeenCalledWith(expectedJsonFileName, jsonMetaContent);
  });
});
