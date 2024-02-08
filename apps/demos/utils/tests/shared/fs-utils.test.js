const fs = require('fs');
const fileSystemExtra = require('fs-extra');
const path = require('path');
const fileSystemUtils = require('../../shared/fs-utils');

jest.mock('fs');
jest.mock('fs-extra');

describe('common functions', () => {
  beforeEach(() => {
    fs.writeFileSync.mockClear();
    fs.existsSync.mockClear();
    fs.lstatSync.mockClear();
    fs.readdirSync.mockClear();
  });

  test('saveMetaDataFile', () => {
    const testJson = {
      test: 'test',
    };

    fileSystemUtils.saveMetaDataFile('./test.json', testJson);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './test.json',
      JSON.stringify(testJson, null, 2),
    );
  });

  test('isValidDirectory', () => {
    const directoryName = 'directory';
    const fileName = 'file';
    const nonExistentFile = 'non-existent-file';
    fs.existsSync.mockImplementation(
      (directory) => directory === directoryName || directory === fileName,
    );
    fs.lstatSync.mockImplementation((directory) => ({
      isDirectory: () => directory === directoryName,
    }));

    expect(fileSystemUtils.isValidDirectory(directoryName)).toBe(true);
    expect(fileSystemUtils.isValidDirectory(fileName)).toBe(false);
    expect(fileSystemUtils.isValidDirectory(nonExistentFile)).toBe(false);
  });

  test('getApproachesList', () => {
    const directoryName = 'directory';
    const nonExistentDirectory = 'non-existent-directory';
    const descriptionFileName = 'description.md';
    const fileSystemEntities = ['jQuery', 'Angular', descriptionFileName];

    fs.existsSync.mockImplementation((directory) => directory === directoryName);
    fs.readdirSync.mockImplementation(() => fileSystemEntities.map((entity) => ({
      isDirectory: () => entity !== descriptionFileName,
      name: entity,
    })));

    expect(() => fileSystemUtils.getApproachesList(nonExistentDirectory))
      .toThrow(`Directory does not exist: ${nonExistentDirectory}`);

    expect(fileSystemUtils.getApproachesList(directoryName))
      .toEqual(['jQuery', 'Angular']);
  });

  test('getMissingApproaches', () => {
    const directoryName = 'directory';
    const descriptionFileName = 'description.md';
    const fileSystemEntities = ['jQuery', 'Angular', descriptionFileName];

    fs.existsSync.mockImplementation((directory) => directory === directoryName);
    fs.readdirSync.mockImplementation(() => fileSystemEntities.map((entity) => ({
      isDirectory: () => entity !== descriptionFileName,
      name: entity,
    })));

    expect(fileSystemUtils.getMissingApproaches(directoryName, ['jQuery', 'Angular', 'Vue']))
      .toEqual(['Vue']);
  });

  test('getWidgets', () => {
    const garbageFileName = 'garbage.txt';
    const fileSystemEntities = ['Accordion', 'Button', garbageFileName];

    fs.readdirSync.mockImplementation(() => fileSystemEntities.map((entity) => ({
      isDirectory: () => entity !== garbageFileName,
      name: entity,
    })));

    expect(fileSystemUtils.getWidgets('someDir'))
      .toEqual([{ title: 'Accordion' }, { title: 'Button' }]);

    expect(fileSystemUtils.getWidgets('someDir', 'someNewWidget'))
      .toEqual([{ title: 'someNewWidget', value: 'new' }, { title: 'Accordion' }, { title: 'Button' }]);
  });

  test('getDemoPathByMeta', () => {
    const categoryName = 'Category1';
    const groupName = 'Group1';
    const demoName = 'Demo2';
    const baseDemosDir = 'dir';
    const menuMetaData = [{
      Name: 'Category1',
      Groups: [{
        Name: 'Group1',
        Demos: [{
          Name: 'Demo1',
        }, {
          Name: 'Demo2',
          Widget: 'Widget2',
        }],
      }, {
        Name: 'Group2',
      }],
    }, {
      Name: 'Category2',
    }];

    const expectedPath = path.join(baseDemosDir, 'Widget2', demoName);

    expect(fileSystemUtils.getDemoPathByMeta(
      categoryName,
      groupName,
      demoName,
      baseDemosDir,
      menuMetaData,
    )).toBe(expectedPath);
  });
});

describe('Hi-level copy functions', () => {
  const approaches = ['Angular', 'Vue'];
  const demoPath = 'demoPath';
  const existingDemoPath = 'existingDemoPath';
  const origGetDemoPathByMeta = fileSystemUtils.getDemoPathByMeta;

  beforeEach(() => {
    fileSystemUtils.getDemoPathByMeta = jest.fn().mockImplementation(() => existingDemoPath);
  });

  afterEach(() => {
    fileSystemUtils.getDemoPathByMeta.mockClear();
    fileSystemUtils.getDemoPathByMeta = origGetDemoPathByMeta;

    fs.existsSync.mockClear();
    fs.mkdirSync.mockClear();
    fs.writeFileSync.mockClear();
    fileSystemExtra.copySync.mockClear();
  });

  test('copyFilesFromBlankDemos', () => {
    fs.writeFileSync.mockImplementation((f1, f2, callback) => callback());
    fileSystemUtils.copyFilesFromBlankDemos(approaches, demoPath);

    const demosPathPrefix = path.join('utils', 'templates');
    const expectedCopySyncCalls = approaches.map((approach) => [
      path.join(demosPathPrefix, approach),
      path.join(demoPath, approach),
    ]);

    expect(fileSystemExtra.copySync.mock.calls).toEqual(expectedCopySyncCalls);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync.mock.calls[0][0]).toBe(path.join(demoPath, 'description.md'));
    expect(fs.writeFileSync.mock.calls[0][1]).toBe('');
  });

  test('copyFilesFromBlankDemos (unable to copy description)', () => {
    const errorMessage = 'unable to copy description';
    fs.writeFileSync.mockImplementation((f1, f2, callback) => callback(errorMessage));
    expect(() => fileSystemUtils.copyFilesFromBlankDemos(approaches, demoPath))
      .toThrow(errorMessage);
  });

  test('copyFilesFromExistingDemos (destination exists)', () => {
    fs.existsSync.mockImplementation(() => true);
    fileSystemUtils.copyFilesFromExistingDemos(approaches, demoPath, {}, {}, '');

    const expectedCopySyncCalls = approaches.map((approach) => [
      path.join(existingDemoPath, approach),
      path.join(demoPath, approach),
    ]);

    expect(fileSystemExtra.copySync.mock.calls).toEqual(expectedCopySyncCalls);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(0);
  });

  test('copyFilesFromExistingDemos (destination does not exists)', () => {
    fs.existsSync.mockImplementation(() => false);
    fileSystemUtils.copyFilesFromExistingDemos(approaches, demoPath, {}, {}, '');

    const expectedCopySyncCalls = approaches.map((approach) => [
      path.join(existingDemoPath, approach),
      path.join(demoPath, approach),
    ]);

    expect(fileSystemExtra.copySync.mock.calls).toEqual(expectedCopySyncCalls);

    expect(fs.mkdirSync).toHaveBeenCalledTimes(approaches.length);
    approaches.forEach((approach, index) => {
      expect(fs.mkdirSync.mock.calls[index][0]).toBe(path.join(demoPath, approach));
    });
  });

  test('copyDemos (new demo)', () => {
    const origCopyFilesFromBlankDemos = fileSystemUtils.copyFilesFromBlankDemos;
    fileSystemUtils.copyFilesFromBlankDemos = jest.fn().mockImplementation(() => {});

    fileSystemUtils.copyDemos(demoPath, approaches, { choice: 'new' }, {}, '');

    expect(fileSystemUtils.copyFilesFromBlankDemos).toHaveBeenCalledTimes(1);
    expect(fileSystemUtils.copyFilesFromBlankDemos.mock.calls[0])
      .toEqual([approaches, demoPath]);

    fileSystemUtils.copyFilesFromBlankDemos = origCopyFilesFromBlankDemos;
  });

  test('copyDemos (existing demo)', () => {
    const origCopyFilesFromExistingDemos = fileSystemUtils.copyFilesFromExistingDemos;
    fileSystemUtils.copyFilesFromExistingDemos = jest.fn().mockImplementation(() => {});

    fileSystemUtils.copyDemos(demoPath, approaches, { choice: 'existing' }, {}, '');

    expect(fileSystemUtils.copyFilesFromExistingDemos).toHaveBeenCalledTimes(1);
    expect(fileSystemUtils.copyFilesFromExistingDemos.mock.calls[0])
      .toEqual([approaches, demoPath, { choice: 'existing' }, {}, '']);

    fileSystemUtils.copyFilesFromExistingDemos = origCopyFilesFromExistingDemos;
  });
});
