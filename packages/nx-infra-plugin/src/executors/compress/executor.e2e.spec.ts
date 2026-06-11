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

  it('should minify and preserve license comments', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'minify',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).toContain('/*!');
    expect(output).toContain('DevExtreme');

    expect(output).not.toContain('#DEBUG');
    expect(output).not.toContain('debug only');

    expect(output.length).toBeLessThan(SAMPLE_CODE.length);
  });

  it('should apply normalize: normalize line endings to platform EOL, ensure trailing newline, preserve debug blocks', async () => {
    const filePath = path.join(projectDir, 'test.js');
    const crlfContent = SAMPLE_CODE.replace(/\n/g, '\r\n');
    await writeFileText(filePath, crlfContent);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'normalize',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    if (require('os').EOL === '\n') {
      expect(output).not.toContain('\r\n');
    }
    expect(output.endsWith(require('os').EOL)).toBe(true);
    expect(output).toContain('#DEBUG');
    expect(output).toContain('debug only');
  });

  it('should beautify with selective compression, preserve license comments, and preserve debug blocks', async () => {
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

    expect(output).toContain('debug only');
  });

  it('should apply strip-debug: remove debug blocks only, no minification', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).not.toContain('#DEBUG');
    expect(output).not.toContain('debug only');

    expect(output).toContain('function hello');
    expect(output.split('\n').length).toBeGreaterThan(3);
  });

  it('should expand glob patterns in files array', async () => {
    const fileNames = ['alpha.js', 'beta.js', 'gamma.js'];
    for (const name of fileNames) {
      await writeFileText(path.join(projectDir, name), SAMPLE_CODE);
    }

    const options: CompressExecutorSchema = {
      files: ['./*.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    for (const name of fileNames) {
      const output = await readFileText(path.join(projectDir, name));
      expect(output).not.toContain('#DEBUG');
      expect(output).not.toContain('debug only');
      expect(output).toContain('function hello');
    }
  });

  it('should accept object-form mode and preserve eulaUrl-bearing comments', async () => {
    const filePath = path.join(projectDir, 'test.js');
    const codeWithEulaComment = `/* https://js.devexpress.com/Licensing/ */\n"use strict";\nvar a = 1;\n`;
    await writeFileText(filePath, codeWithEulaComment);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: { name: 'minify', eulaUrl: 'https://js.devexpress.com/Licensing/' },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);
    expect(output).toContain('https://js.devexpress.com/Licensing/');
  });

  it('should not append trailing newline when mode.trailingNewline is false', async () => {
    const filePath = path.join(projectDir, 'no-trailing.js');
    await writeFileText(filePath, 'const a = 1;');

    const options: CompressExecutorSchema = {
      files: ['./no-trailing.js'],
      mode: { name: 'normalize', trailingNewline: false },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);
    expect(output).toBe('const a = 1;');
    expect(output.endsWith('\n')).toBe(false);
  });

  it('should respect exclude patterns and leave excluded files untouched', async () => {
    await writeFileText(path.join(projectDir, 'keep.js'), SAMPLE_CODE);
    await writeFileText(path.join(projectDir, 'skip.js'), SAMPLE_CODE);
    await writeFileText(path.join(projectDir, 'also-skip.js'), SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./*.js'],
      exclude: ['./skip.js', './also-*.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const keepOutput = await readFileText(path.join(projectDir, 'keep.js'));
    const skipOutput = await readFileText(path.join(projectDir, 'skip.js'));
    const alsoSkipOutput = await readFileText(path.join(projectDir, 'also-skip.js'));

    expect(keepOutput).not.toContain('#DEBUG');
    expect(skipOutput).toContain('#DEBUG');
    expect(skipOutput).toBe(SAMPLE_CODE);
    expect(alsoSkipOutput).toContain('#DEBUG');
    expect(alsoSkipOutput).toBe(SAMPLE_CODE);
  });

  it('should respect exclude patterns when files are concrete paths (no glob)', async () => {
    await writeFileText(path.join(projectDir, 'keep.js'), SAMPLE_CODE);
    await writeFileText(path.join(projectDir, 'skip.js'), SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./keep.js', './skip.js'],
      exclude: ['./skip.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const keepOutput = await readFileText(path.join(projectDir, 'keep.js'));
    const skipOutput = await readFileText(path.join(projectDir, 'skip.js'));

    expect(keepOutput).not.toContain('#DEBUG');
    expect(skipOutput).toBe(SAMPLE_CODE);
  });

  it('should preserve debug blocks in beautify mode', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'beautify',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).toContain('debug only');
  });

  it('should apply strip-debug: remove debug blocks only, no minification', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);

    expect(output).not.toContain('#DEBUG');
    expect(output).not.toContain('debug only');

    expect(output).toContain('function hello');
    expect(output.split('\n').length).toBeGreaterThan(3);
  });

  it('should expand glob patterns in files array', async () => {
    const fileNames = ['alpha.js', 'beta.js', 'gamma.js'];
    for (const name of fileNames) {
      await writeFileText(path.join(projectDir, name), SAMPLE_CODE);
    }

    const options: CompressExecutorSchema = {
      files: ['./*.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    for (const name of fileNames) {
      const output = await readFileText(path.join(projectDir, name));
      expect(output).not.toContain('#DEBUG');
      expect(output).not.toContain('debug only');
      expect(output).toContain('function hello');
    }
  });

  it('should accept object-form mode and preserve eulaUrl-bearing comments', async () => {
    const filePath = path.join(projectDir, 'test.js');
    const codeWithEulaComment = `/* https://js.devexpress.com/Licensing/ */\n"use strict";\nvar a = 1;\n`;
    await writeFileText(filePath, codeWithEulaComment);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: { name: 'minify', eulaUrl: 'https://js.devexpress.com/Licensing/' },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);
    expect(output).toContain('https://js.devexpress.com/Licensing/');
  });

  it('should not append trailing newline when mode.trailingNewline is false', async () => {
    const filePath = path.join(projectDir, 'no-trailing.js');
    await writeFileText(filePath, 'const a = 1;');

    const options: CompressExecutorSchema = {
      files: ['./no-trailing.js'],
      mode: { name: 'normalize', trailingNewline: false },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);
    expect(output).toBe('const a = 1;');
    expect(output.endsWith('\n')).toBe(false);
  });

  it('should skip trailing newline in minify mode (compress:bundles:prod -c production parity)', async () => {
    const filePath = path.join(projectDir, 'test.js');
    await writeFileText(filePath, SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./test.js'],
      mode: { name: 'minify', trailingNewline: false },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const output = await readFileText(filePath);
    expect(output.endsWith('\n')).toBe(false);
    expect(output).not.toContain('debug only');
  });

  it('should respect exclude patterns and leave excluded files untouched', async () => {
    await writeFileText(path.join(projectDir, 'keep.js'), SAMPLE_CODE);
    await writeFileText(path.join(projectDir, 'skip.js'), SAMPLE_CODE);
    await writeFileText(path.join(projectDir, 'also-skip.js'), SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./*.js'],
      exclude: ['./skip.js', './also-*.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const keepOutput = await readFileText(path.join(projectDir, 'keep.js'));
    const skipOutput = await readFileText(path.join(projectDir, 'skip.js'));
    const alsoSkipOutput = await readFileText(path.join(projectDir, 'also-skip.js'));

    expect(keepOutput).not.toContain('#DEBUG');
    expect(skipOutput).toContain('#DEBUG');
    expect(skipOutput).toBe(SAMPLE_CODE);
    expect(alsoSkipOutput).toContain('#DEBUG');
    expect(alsoSkipOutput).toBe(SAMPLE_CODE);
  });

  it('should respect exclude patterns when files are concrete paths (no glob)', async () => {
    await writeFileText(path.join(projectDir, 'keep.js'), SAMPLE_CODE);
    await writeFileText(path.join(projectDir, 'skip.js'), SAMPLE_CODE);

    const options: CompressExecutorSchema = {
      files: ['./keep.js', './skip.js'],
      exclude: ['./skip.js'],
      mode: 'strip-debug',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const keepOutput = await readFileText(path.join(projectDir, 'keep.js'));
    const skipOutput = await readFileText(path.join(projectDir, 'skip.js'));

    expect(keepOutput).not.toContain('#DEBUG');
    expect(skipOutput).toBe(SAMPLE_CODE);
  });
});
