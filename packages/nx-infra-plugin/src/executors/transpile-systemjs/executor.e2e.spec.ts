import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { TranspileSystemjsExecutorSchema } from './schema';
import { writeFileText, cleanupTempDir, createTempDir, createMockContext } from '../../utils';

const PROJECT_ROOT = 'packages/test-lib';
const BUILDER_REL_PATH = './testing/systemjs-builder.js';

// A stub builder that records the --transpile=<mode> it was invoked with by
// writing an output file named after the mode. Lets us assert every mode ran.
const STUB_BUILDER = `
const fs = require('fs');
const path = require('path');
const mode = (process.argv.find((a) => a.startsWith('--transpile=')) || '').split('=')[1];
const outDir = path.join(__dirname, '..', 'out');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, mode + '.txt'), mode);
`;

// A stub builder that always fails, to verify non-zero exit codes fail the executor.
const FAILING_BUILDER = `process.exit(1);`;

async function writeBuilder(projectDir: string, source: string): Promise<void> {
  const builderPath = path.join(projectDir, BUILDER_REL_PATH);
  fs.mkdirSync(path.dirname(builderPath), { recursive: true });
  await writeFileText(builderPath, source);
}

describe('TranspileSystemjsExecutor E2E', () => {
  let tempDir: string;
  let projectDir: string;
  let context = createMockContext();

  beforeEach(() => {
    tempDir = createTempDir('nx-transpile-systemjs-e2e-');
    projectDir = path.join(tempDir, PROJECT_ROOT);
    context = createMockContext({ root: tempDir, projectRoot: PROJECT_ROOT });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('runs the builder once per mode in parallel', async () => {
    await writeBuilder(projectDir, STUB_BUILDER);

    const options: TranspileSystemjsExecutorSchema = {
      modes: ['modules', 'testing', 'css', 'js-vendors'],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const outDir = path.join(projectDir, 'out');
    expect(fs.readdirSync(outDir).sort()).toEqual([
      'css.txt',
      'js-vendors.txt',
      'modules.txt',
      'testing.txt',
    ]);
  });

  it('fails when the builder exits with a non-zero code', async () => {
    await writeBuilder(projectDir, FAILING_BUILDER);

    const result = await executor({ modes: ['modules'] }, context);

    expect(result.success).toBe(false);
  });
});
