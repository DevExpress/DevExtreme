import * as path from 'path';
import { resolveOptionPaths } from './path-resolver';

describe('resolveOptionPaths', () => {
  const projectRoot = path.resolve('/workspace/packages/my-project');

  it('resolves each listed key from options', () => {
    const result = resolveOptionPaths({ outDir: './dist', cacheDir: './.cache' }, projectRoot, [
      'outDir',
      'cacheDir',
    ] as const);

    expect(result).toEqual({
      outDir: path.resolve(projectRoot, './dist'),
      cacheDir: path.resolve(projectRoot, './.cache'),
    });
  });

  it('uses defaults when an option is omitted', () => {
    const result = resolveOptionPaths(
      { outDir: './custom' },
      projectRoot,
      ['outDir', 'cacheDir'] as const,
      { cacheDir: './.cache' },
    );

    expect(result.outDir).toBe(path.resolve(projectRoot, './custom'));
    expect(result.cacheDir).toBe(path.resolve(projectRoot, './.cache'));
  });

  it('prefers options over defaults', () => {
    const result = resolveOptionPaths(
      { outDir: './from-options' },
      projectRoot,
      ['outDir'] as const,
      { outDir: './from-defaults' },
    );

    expect(result.outDir).toBe(path.resolve(projectRoot, './from-options'));
  });

  it('throws when a listed key has no option or default', () => {
    expect(() =>
      resolveOptionPaths({ outDir: './dist' }, projectRoot, ['outDir', 'cacheDir'] as const),
    ).toThrow('Missing path option "cacheDir"');
  });
});
