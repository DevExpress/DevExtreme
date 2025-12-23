import { KarmaMultiEnvExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeJson, writeFileText } from '../../utils';

describe('KarmaMultiEnvExecutor', () => {
  let tempProjectRoot: string;
  let mockContext: any;

  beforeEach(() => {
    jest.resetModules();
    tempProjectRoot = createTempDir('karma-executor-test-');
    mockContext = createMockContext({
      root: tempProjectRoot,
      projectName: 'test-project',
      projectRoot: '.',
    });
  });

  afterEach(async () => {
    cleanupTempDir(tempProjectRoot);
  });

  it('should successfully execute karma tests with real file system integration', async () => {
    await writeJson(`${tempProjectRoot}/package.json`, {
      name: 'test-project',
      version: '0.0.0',
      devDependencies: {
        karma: '^6.4.0',
        'karma-jasmine': '^5.1.0',
        'karma-chrome-launcher': '^3.1.1',
        'karma-jasmine-html-reporter': '^2.0.0',
        'karma-coverage': '^2.2.0',
      },
    });

    await writeFileText(
      `${tempProjectRoot}/karma.conf.js`,
      'module.exports = { frameworks: ["jasmine"], files: [] };',
    );

    await writeFileText(`${tempProjectRoot}/karma.test.shim.js`, '// Client test shim');
    await writeFileText(`${tempProjectRoot}/karma.server.test.shim.js`, '// Server test shim');
    await writeFileText(
      `${tempProjectRoot}/karma.hydration.test.shim.js`,
      '// Hydration test shim',
    );

    const options: KarmaMultiEnvExecutorSchema = {
      karmaConfig: 'karma.conf.js',
      environments: ['client'],
      watch: false,
    };

    const mockKarmaServer = {
      on: jest.fn(),
      start: jest.fn(),
    };

    jest.doMock('karma', () => ({
      Server: jest
        .fn()
        .mockImplementation((_config: any, callback?: (exitCode: number) => void) => {
          if (callback) {
            process.nextTick(() => callback(0));
          }
          return mockKarmaServer;
        }),
      config: {
        parseConfig: jest.fn().mockResolvedValue({
          frameworks: ['jasmine'],
          files: [],
          basePath: tempProjectRoot,
        }),
      },
    }));

    const { default: runExecutor } = await import('./executor');

    const result = await runExecutor(options, mockContext);

    expect(result.success).toBe(true);
    expect(mockKarmaServer.start).toHaveBeenCalled();
  });

  it('should execute environments sequentially and stop on first failure', async () => {
    await writeFileText(
      `${tempProjectRoot}/karma.conf.js`,
      'module.exports = { frameworks: ["jasmine"], files: [] };',
    );
    await writeFileText(`${tempProjectRoot}/karma.test.shim.js`, '// Client test shim');
    await writeFileText(`${tempProjectRoot}/karma.server.test.shim.js`, '// Server test shim');
    await writeFileText(
      `${tempProjectRoot}/karma.hydration.test.shim.js`,
      '// Hydration test shim',
    );

    const options: KarmaMultiEnvExecutorSchema = {
      karmaConfig: 'karma.conf.js',
      environments: ['client', 'server', 'hydration'],
      watch: false,
    };

    const mockKarmaServers: any[] = [];
    let callCount = 0;

    jest.doMock('karma', () => {
      let localCallCount = 0;
      return {
        Server: jest
          .fn()
          .mockImplementation((_config: any, callback?: (exitCode: number) => void) => {
            const mockServer = {
              on: jest.fn(),
              start: jest.fn(),
              stop: jest.fn(),
            };
            mockKarmaServers.push(mockServer);

            localCallCount++;
            callCount++;
            const exitCode = localCallCount === 1 ? 0 : 1;

            if (callback) {
              process.nextTick(() => {
                callback(exitCode);
              });
            }
            return mockServer;
          }),
        config: {
          parseConfig: jest.fn().mockResolvedValue({
            frameworks: ['jasmine'],
            files: [],
            basePath: tempProjectRoot,
          }),
        },
      };
    });

    const { default: runExecutor } = await import('./executor');

    const result = await runExecutor(options, mockContext);

    expect(result.success).toBe(false);
    expect(callCount).toBe(2);
    expect(mockKarmaServers[0].stop).toHaveBeenCalled();
    expect(mockKarmaServers[1].stop).toHaveBeenCalled();
  });

  it('should use timeout configuration', async () => {
    await writeFileText(
      `${tempProjectRoot}/karma.conf.js`,
      'module.exports = { frameworks: ["jasmine"], files: [] };',
    );
    await writeFileText(`${tempProjectRoot}/karma.test.shim.js`, '// Client test shim');

    const options: KarmaMultiEnvExecutorSchema = {
      karmaConfig: 'karma.conf.js',
      environments: ['client'],
      watch: false,
      timeout: 10000,
    };

    jest.doMock('karma', () => ({
      Server: jest
        .fn()
        .mockImplementation((_config: any, callback?: (exitCode: number) => void) => {
          const mockServer = {
            on: jest.fn().mockImplementation((event: string, cb: Function) => {
              if (event === 'browsers_ready') {
                process.nextTick(cb);
              }
            }),
            start: jest.fn(),
            stop: jest.fn(),
          };

          if (callback) {
            process.nextTick(() => callback(0));
          }
          return mockServer;
        }),
      config: {
        parseConfig: jest.fn().mockResolvedValue({
          frameworks: ['jasmine'],
          files: [],
          basePath: tempProjectRoot,
        }),
      },
    }));

    const { default: runExecutor } = await import('./executor');

    const result = await runExecutor(options, mockContext);

    expect(result.success).toBe(true);

    const karmaMock = require('karma');
    expect(karmaMock.Server).toHaveBeenCalled();
    const createdServer = karmaMock.Server.mock.results[0].value;
    expect(createdServer.on).toHaveBeenCalledWith('browsers_ready', expect.any(Function));
  });
});
