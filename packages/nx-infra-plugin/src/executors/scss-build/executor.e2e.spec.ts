import { spawnSync } from 'child_process';
import executor from './executor';
import { ScssBuildExecutorSchema } from './schema';
import { createMockContext } from '../../utils/test-utils';

jest.mock('child_process', () => ({
  spawnSync: jest.fn(),
}));

describe('ScssBuildExecutor E2E', () => {
  const mockedSpawnSync = spawnSync as jest.MockedFunction<typeof spawnSync>;

  beforeEach(() => {
    mockedSpawnSync.mockReset();
  });

  it('runs full themes task in all mode', async () => {
    mockedSpawnSync.mockReturnValue({
      pid: 123,
      output: [],
      stdout: null,
      stderr: null,
      status: 0,
      signal: null,
    } as unknown as ReturnType<typeof spawnSync>);

    const context = createMockContext();
    const options: ScssBuildExecutorSchema = { mode: 'all' };

    const result = await executor(options, context);

    expect(result.success).toBe(true);
    expect(mockedSpawnSync).toHaveBeenCalledWith(
      'pnpm',
      ['exec', 'gulp', 'style-compiler-themes'],
      expect.objectContaining({
        cwd: expect.stringContaining('packages'),
      }),
    );
  });

  it('runs reduced themes task in ci mode', async () => {
    mockedSpawnSync.mockReturnValue({
      pid: 456,
      output: [],
      stdout: null,
      stderr: null,
      status: 0,
      signal: null,
    } as unknown as ReturnType<typeof spawnSync>);

    const context = createMockContext();
    const options: ScssBuildExecutorSchema = { mode: 'ci' };

    const result = await executor(options, context);

    expect(result.success).toBe(true);
    expect(mockedSpawnSync).toHaveBeenCalledWith(
      'pnpm',
      ['exec', 'gulp', 'style-compiler-themes-ci'],
      expect.any(Object),
    );
  });

  it('returns false when gulp task fails', async () => {
    mockedSpawnSync.mockReturnValue({
      pid: 789,
      output: [],
      stdout: null,
      stderr: null,
      status: 1,
      signal: null,
    } as unknown as ReturnType<typeof spawnSync>);

    const context = createMockContext();
    const options: ScssBuildExecutorSchema = { mode: 'all' };

    const result = await executor(options, context);

    expect(result.success).toBe(false);
  });
});
