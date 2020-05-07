import { join, resolve, dirname } from 'path';
import { promises } from 'fs';

import { MetadataCollector, FileInfo } from '../../src/metadata/collector';

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
        join('widgets', 'generic', '_sizes.scss')
    ];

    promises.mkdir = jest.fn();
    promises.writeFile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('getFileList', async () => {
        const collector = new MetadataCollector();
        const iterator = collector.getFileList(join(rootDir, 'tests', 'data', 'scss'));
        const fileList: Array<string> = [];

        for await(const file of iterator) {
            fileList.push(file);
        }

        expect(fileList).toEqual(expectedFileList.map(file => join(scssDir, file)));
    });

    test('readFiles', async () => {
        const collector = new MetadataCollector();
        const handler = (content: string) => content;
        const iterator = collector.readFiles(join(rootDir, 'tests', 'data', 'scss'), handler);
        const filesInfo: Array<FileInfo> = [];

        for await(const file of iterator) {
            filesInfo.push(file);
        }

        expect(filesInfo.map(file => file.path)).toEqual(expectedFileList);

        filesInfo.forEach(file => {
            expect(file.content).not.toBeFalsy();
            expect(file.content.length > 0).toBeTruthy();
        });
    });

    test('readFiles handle files with additional handler', async () => {
        const collector = new MetadataCollector();
        const handler = (content: string) => '123' + content;
        const iterator = collector.readFiles(join(rootDir, 'tests', 'data', 'scss'), handler);

        for await(const file of iterator) {
            expect(file.content.slice(0, 3)).toBe('123');
        }
    });

    test('saveScssFile', async () => {
        const collector = new MetadataCollector();
        const relativePath = join('path', 'filePath.scss');
        const fileContent = 'file content';
        const destinationPath = './scss';
        const expectedDestinationPath = resolve(join(destinationPath, relativePath));
        const expectedDestinationDir = dirname(expectedDestinationPath);

        async function* getTestFiles(): AsyncGenerator<FileInfo> {
            yield new FileInfo(relativePath, fileContent);
        }

        await collector.saveScssFiles(getTestFiles(), destinationPath);

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
        let metaContent = 'export const metadata: Array<MetaItem> = ' + JSON.stringify([]) + ';\n';
        metaContent += `export const version: string = '${version}';\n`;

        await collector.saveMetadata(fileName, version);

        expect(promises.mkdir).toHaveBeenCalledTimes(1);
        expect(promises.mkdir).toHaveBeenCalledWith(expectedDirName, { recursive: true });
        expect(promises.writeFile).toHaveBeenCalledTimes(1);
        expect(promises.writeFile).toHaveBeenCalledWith(expectedFileName, metaContent);
    });
});