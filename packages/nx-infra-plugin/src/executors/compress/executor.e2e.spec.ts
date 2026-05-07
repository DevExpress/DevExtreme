import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { CompressExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

const LICENSE_HEADER = `/*!
* DevExtreme (test.js)
* Version: 99.0.0
*/
`;

const SAMPLE_CODE = `${LICENSE_HEADER}"use strict";

function hello(name) {
    //#DEBUG
    console.log("debug only");
    //#ENDDEBUG
    var unused = 42;
    return "Hello, " + name;
}

exports.hello = hello;
`;

describe('CompressExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-compress-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should minify and strip debug blocks', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'minify',
      removeDebug: true,
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).toContain('/*!');
    expect(output).toContain('DevExtreme');

    expect(output).not.toContain('debug only');
    expect(output).not.toContain('#DEBUG');

    expect(output.length).toBeLessThan(SAMPLE_CODE.length);
  });

  it('should minify but keep debug blocks', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'minify',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).toContain('debug only');
  });

  it('should beautify with selective compression and preserve license comments', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'beautify',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).toContain('/*!');

    expect(output.split('\n').length).toBeGreaterThan(5);

    expect(output).not.toContain('unused');
  });
});
