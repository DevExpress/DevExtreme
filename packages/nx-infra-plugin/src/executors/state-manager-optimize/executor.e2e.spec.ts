import * as fs from 'fs';
import * as path from 'path';
import { logger } from '@nx/devkit';
import executor from './executor';
import { StateManagerOptimizeExecutorSchema } from './schema';
import {
  createTempDir,
  cleanupTempDir,
  createMockContext,
  findWorkspaceRoot,
} from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

const WORKSPACE_ROOT = findWorkspaceRoot();

const INDEX_DEV_CONTENT = `export { setupStateManager, signal } from './dev/index';\n`;
const INDEX_PROD_CONTENT = `export * from './prod/index';`;
const DEV_FILE_CONTENT = `export const devOnly = () => {};\n`;
const PROD_FILE_CONTENT = `export const prodOnly = () => {};\n`;
const TOP_LEVEL_NON_INDEX_CONTENT = `export const topLevelNonIndex = () => {};\n`;
const FILE_OUTSIDE_STATE_MANAGER_CONTENT = `console.log("file outside of state manager");`;

const TRANSPILED_DIR = './artifacts/transpiled-test';
const STATE_MANAGER_RELATIVE_PATH = path.join('__internal', 'core', 'state_manager');

const VARIANTS = ['esm', 'cjs'] as const;
type Variant = (typeof VARIANTS)[number];

describe('StateManagerOptimizeExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;
  let savedCwd: string;

  const stateManagerAbsoluteFor = (variant: Variant): string =>
    path.join(projectDir, TRANSPILED_DIR, variant, STATE_MANAGER_RELATIVE_PATH);

  const indexPathFor = (variant: Variant): string =>
    path.join(stateManagerAbsoluteFor(variant), 'index.js');

  const runOptimize = async (): Promise<{ success: boolean }> => {
    const options: StateManagerOptimizeExecutorSchema = { transpiledDirs: [TRANSPILED_DIR] };
    return executor(options, context);
  };

  beforeEach(async () => {
    savedCwd = process.cwd();
    tempDir = createTempDir('nx-state-manager-optimize-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });

    const infraPluginNodeModules = path.join(
      WORKSPACE_ROOT,
      'packages',
      'nx-infra-plugin',
      'node_modules',
    );
    fs.symlinkSync(infraPluginNodeModules, path.join(projectDir, 'node_modules'), 'junction');

    process.chdir(projectDir);

    for (const variant of VARIANTS) {
      const dir = stateManagerAbsoluteFor(variant);
      await writeFileText(indexPathFor(variant), INDEX_DEV_CONTENT);
      await writeFileText(path.join(dir, 'state_manager.test.js'), TOP_LEVEL_NON_INDEX_CONTENT);
      await writeFileText(path.join(dir, 'dev', 'index.js'), DEV_FILE_CONTENT);
      await writeFileText(path.join(dir, 'prod', 'index.js'), PROD_FILE_CONTENT);
    }

    await writeFileText(path.join(projectDir, 'other_file.js'), FILE_OUTSIDE_STATE_MANAGER_CONTENT);
  });

  afterEach(() => {
    process.chdir(savedCwd);
    cleanupTempDir(tempDir);
  });

  it('should remove development modules', async () => {
    await runOptimize();

    const esmDir = stateManagerAbsoluteFor('esm');
    expect(fs.existsSync(path.join(esmDir, 'dev'))).toBe(false);
    expect(fs.existsSync(path.join(esmDir, 'state_manager.test.js'))).toBe(false);
  }, 30000);

  it('should not remove modules unrelated to state_manager', async () => {
    await runOptimize();

    const outsidePath = path.join(projectDir, 'other_file.js');
    expect(await readFileText(outsidePath)).toBe(FILE_OUTSIDE_STATE_MANAGER_CONTENT);
  }, 30000);

  it('should replace index.js content with re-export from prod', async () => {
    await runOptimize();

    expect(await readFileText(indexPathFor('esm'))).toBe(INDEX_PROD_CONTENT);

    const cjsIndexContent = await readFileText(indexPathFor('cjs'));
    expect(cjsIndexContent).toContain('require("./prod/index")');
  }, 30000);

  it('should optimize index.js when state_manager lives at flat root layout (no cjs/esm variant subdir)', async () => {
    const flatStateManagerDir = path.join(projectDir, TRANSPILED_DIR, STATE_MANAGER_RELATIVE_PATH);
    await writeFileText(path.join(flatStateManagerDir, 'index.js'), INDEX_DEV_CONTENT);
    await writeFileText(path.join(flatStateManagerDir, 'dev', 'index.js'), DEV_FILE_CONTENT);
    await writeFileText(path.join(flatStateManagerDir, 'prod', 'index.js'), PROD_FILE_CONTENT);
    await writeFileText(
      path.join(flatStateManagerDir, 'state_manager.test.js'),
      TOP_LEVEL_NON_INDEX_CONTENT,
    );

    await runOptimize();

    expect(await readFileText(path.join(flatStateManagerDir, 'index.js'))).toBe(INDEX_PROD_CONTENT);
    expect(fs.existsSync(path.join(flatStateManagerDir, 'dev'))).toBe(false);
    expect(fs.existsSync(path.join(flatStateManagerDir, 'state_manager.test.js'))).toBe(false);
    expect(await readFileText(path.join(flatStateManagerDir, 'prod', 'index.js'))).toBe(
      PROD_FILE_CONTENT,
    );
  }, 30000);

  it('should optimize state_manager at any depth (mixed flat + nested in same tree)', async () => {
    const flatStateManagerDir = path.join(projectDir, TRANSPILED_DIR, STATE_MANAGER_RELATIVE_PATH);
    await writeFileText(path.join(flatStateManagerDir, 'index.js'), INDEX_DEV_CONTENT);
    await writeFileText(path.join(flatStateManagerDir, 'dev', 'index.js'), DEV_FILE_CONTENT);
    await writeFileText(path.join(flatStateManagerDir, 'prod', 'index.js'), PROD_FILE_CONTENT);

    await runOptimize();

    expect(await readFileText(path.join(flatStateManagerDir, 'index.js'))).toBe(INDEX_PROD_CONTENT);
    expect(await readFileText(indexPathFor('cjs'))).toContain('require("./prod/index")');
  }, 30000);

  it('should throw when no state_manager directories are found in any transpiledDir', async () => {
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined);

    const options: StateManagerOptimizeExecutorSchema = {
      transpiledDirs: ['./artifacts/transpiled-no-state-manager'],
    };
    const result = await executor(options, context);

    expect(result.success).toBe(false);
    const errorMessage = String(errorSpy.mock.calls[0][0]);
    expect(errorMessage).toContain('No state_manager/index.js');

    errorSpy.mockRestore();
  }, 30000);
});
