import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import executor from './executor';
import { buildJqueryCheckContent, widgetNameByPath } from './declaration-check-content';
import { toTripleSlashReferencePath } from './check-declarations.impl';
import { CheckDeclarationsExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText } from '../../utils';

describe('declaration-check-content', () => {
  it('should resolve widget name from global path', () => {
    expect(widgetNameByPath('ui.dxButton')).toBe('dxButton');
    expect(widgetNameByPath('ui.dxDataGrid.extra')).toBe('');
  });

  it('should compute triple-slash path relative to entry directory', () => {
    const projectRoot = path.join('C:', 'proj');
    const entryDir = path.join(projectRoot, 'artifacts');
    const bundleFile = path.join(projectRoot, 'artifacts', 'ts', 'dx.all.d.ts');

    expect(toTripleSlashReferencePath(entryDir, bundleFile)).toBe('./ts/dx.all.d.ts');
  });

  it('should emit jquery widget usage for public widget exports', () => {
    const content = buildJqueryCheckContent('./ts/dx.all.d.ts', [
      {
        name: 'ui/button',
        exports: { default: { path: 'ui.dxButton', isWidget: true } },
      },
      {
        name: 'internal',
        isInternal: true,
        exports: { default: { path: 'ui.dxInternal', isWidget: true } },
      },
    ]);

    expect(content).toContain("/// <reference path='./ts/dx.all.d.ts' />");
    expect(content).toContain('$().dxButton();');
    expect(content).not.toContain('dxInternal');
  });
});

const PLUGIN_TYPESCRIPT = path.dirname(
  require.resolve('typescript/package.json', { paths: [__dirname] }),
);

describe('CheckDeclarationsExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    tempDir = createTempDir('nx-check-declarations-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(path.join(projectDir, 'js'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'node_modules', '@types', 'jquery'), { recursive: true });
    fs.writeFileSync(
      path.join(projectDir, 'node_modules', '@types', 'jquery', 'index.d.ts'),
      'interface JQuery { empty(): JQuery; }\ninterface JQueryStatic { (selector: string): JQuery; }\ndeclare const $: JQueryStatic;\nexport = $;\n',
    );
    errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
    cleanupTempDir(tempDir);
  });

  it('should pass modules mode for valid declaration files', async () => {
    await writeFileText(
      path.join(projectDir, 'js', 'sample.d.ts'),
      'declare namespace DevExpress { export interface Sample { value: number; } }\n',
    );

    const options: CheckDeclarationsExecutorSchema = {
      mode: 'modules',
      modulesPattern: './js/**/*.d.ts',
      typescriptModule: PLUGIN_TYPESCRIPT,
      compilerOptions: { types: [] },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);
  });

  it('should fail modules mode when declarations contain type errors', async () => {
    await writeFileText(
      path.join(projectDir, 'js', 'broken.d.ts'),
      'declare const broken: UnknownType;\n',
    );

    const options: CheckDeclarationsExecutorSchema = {
      mode: 'modules',
      modulesPattern: './js/**/*.d.ts',
      typescriptModule: PLUGIN_TYPESCRIPT,
    };

    const result = await executor(options, context);
    expect(result.success).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
  });
});
