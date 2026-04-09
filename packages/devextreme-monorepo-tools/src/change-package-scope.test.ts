import fs from 'fs';
import sh from 'shelljs';
import { changePackageScope } from './change-package-scope';
import { npm } from './npm-utils';
import { ensureEmptyDir } from './fs-utils';

jest.mock('fs');
jest.mock('tar-fs');
jest.mock('zlib');
jest.mock('shelljs', () => ({
  __esModule: true,
  default: {
    pushd: jest.fn(),
    popd: jest.fn(),
    rm: jest.fn(),
    mkdir: jest.fn(),
    exec: jest.fn(),
  },
}));
jest.mock('./npm-utils', () => ({
  npm: {
    pkg: {
      get: jest.fn(),
      set: jest.fn(),
    },
  },
}));
jest.mock('./fs-utils');

describe('changePackageScope', () => {
  const tgzPath = '/some/path/my-package.tgz';
  const dirName = 'my-package';

  let finishHandler: () => void;
  let errorHandler: () => void;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockEventEmitter = {
      on: jest.fn().mockImplementation(function (this: unknown, event: string, handler: () => void) {
        if (event === 'finish') finishHandler = handler;
        if (event === 'error') errorHandler = handler;
        return this;
      }),
    };
    const mockIntermediate = { pipe: jest.fn().mockReturnValue(mockEventEmitter) };
    const mockReadStream = { pipe: jest.fn().mockReturnValue(mockIntermediate) };
    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);

    (npm.pkg.get as jest.Mock).mockImplementation((key: string): string | undefined => {
      if (key === 'name') return '@old-scope/my-package';
      if (key === 'version') return '1.0.0';
      return undefined;
    });

    (fs.existsSync as jest.Mock).mockReturnValue(false);
  });

  test('adds a scope to the package name', async () => {
    const promise = changePackageScope({ tgz: tgzPath, scope: 'new-scope' });
    finishHandler();
    const result = await promise;

    expect(ensureEmptyDir).toHaveBeenCalledWith(dirName);
    expect(sh.pushd).toHaveBeenCalledWith(dirName);
    expect(npm.pkg.set).toHaveBeenCalledWith({ name: '@new-scope/my-package' });
    expect(fs.renameSync).toHaveBeenCalledWith(dirName, 'new-scope-my-package-1.0.0');
    expect(result).toBe('new-scope-my-package-1.0.0');
  });

  test('removes scope from the package name', async () => {
    const promise = changePackageScope({ tgz: tgzPath, removeScope: true });
    finishHandler();
    const result = await promise;

    expect(npm.pkg.set).toHaveBeenCalledWith({ name: 'my-package' });
    expect(fs.renameSync).toHaveBeenCalledWith(dirName, 'my-package-1.0.0');
    expect(result).toBe('my-package-1.0.0');
  });

  test('returns original dir name when neither scope nor removeScope is specified', async () => {
    const promise = changePackageScope({ tgz: tgzPath });
    finishHandler();
    const result = await promise;

    expect(npm.pkg.set).not.toHaveBeenCalled();
    expect(fs.renameSync).not.toHaveBeenCalled();
    expect(result).toBe(dirName);
  });

  test('handles unscoped package name when adding a scope', async () => {
    (npm.pkg.get as jest.Mock).mockImplementation((key: string): string | undefined => {
      if (key === 'name') return 'my-package';
      if (key === 'version') return '2.3.4';
      return undefined;
    });
    const promise = changePackageScope({ tgz: tgzPath, scope: 'some-scope' });
    finishHandler();
    const result = await promise;

    expect(npm.pkg.set).toHaveBeenCalledWith({ name: '@some-scope/my-package' });
    expect(result).toBe('some-scope-my-package-2.3.4');
  });

  test('removes existing target dir before renaming', async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const promise = changePackageScope({ tgz: tgzPath, scope: 'new-scope' });
    finishHandler();
    await promise;

    expect(fs.rmSync).toHaveBeenCalledWith('new-scope-my-package-1.0.0', { force: true, recursive: true });
    expect(fs.renameSync).toHaveBeenCalledWith(dirName, 'new-scope-my-package-1.0.0');
  });

  test('rejects when package name cannot be retrieved', async () => {
    (npm.pkg.get as jest.Mock).mockReturnValue(undefined);
    const promise = changePackageScope({ tgz: tgzPath, scope: 'new-scope' });
    finishHandler();

    await expect(promise).rejects.toThrow('Unable to get package name');
  });

  test('rejects when package version cannot be retrieved', async () => {
    (npm.pkg.get as jest.Mock).mockImplementation((key: string): string | undefined => {
      if (key === 'name') return 'my-package';
      return undefined;
    });
    const promise = changePackageScope({ tgz: tgzPath, scope: 'new-scope' });
    finishHandler();

    await expect(promise).rejects.toThrow('Unable to get package version');
  });

  test('rejects on extraction error', async () => {
    const promise = changePackageScope({ tgz: tgzPath });
    errorHandler();

    await expect(promise).rejects.toThrow(
      `Unexpected error occurred during extracting from archive: ${tgzPath}`,
    );
  });
});
