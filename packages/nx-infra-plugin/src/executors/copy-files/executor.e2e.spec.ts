import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { CopyFilesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

describe('CopyFilesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  beforeEach(async () => {
    tempDir = createTempDir('nx-copy-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    fs.mkdirSync(projectDir, { recursive: true });
    await writeFileText(path.join(projectDir, 'README.md'), '# Test Package\n\nThis is a test.');
    await writeFileText(path.join(projectDir, 'LICENSE'), 'MIT License\n\nCopyright...');
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'test-package',
      version: '1.0.0',
    });

    fs.mkdirSync(path.join(projectDir, 'docs'), { recursive: true });
    await writeFileText(path.join(projectDir, 'docs', 'guide.md'), '# Guide\n\nHow to use...');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe('Basic functionality', () => {
    it('should copy multiple files', async () => {
      const options: CopyFilesExecutorSchema = {
        files: [
          { from: './README.md', to: './npm/README.md' },
          { from: './LICENSE', to: './npm/LICENSE' },
          { from: './package.json', to: './npm/package.json' },
        ],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const npmDir = path.join(projectDir, 'npm');

      expect(fs.existsSync(path.join(npmDir, 'README.md'))).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'LICENSE'))).toBe(true);
      expect(fs.existsSync(path.join(npmDir, 'package.json'))).toBe(true);
    });

    it('should preserve file content', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const originalContent = await readFileText(path.join(projectDir, 'README.md'));

      const options: CopyFilesExecutorSchema = {
        files: [{ from: './README.md', to: './dist/README.md' }],
      };

      await executor(options, context);

      const copiedContent = await readFileText(path.join(projectDir, 'dist', 'README.md'));

      expect(copiedContent).toBe(originalContent);
    });

    it('should create destination directories if they do not exist', async () => {
      const options: CopyFilesExecutorSchema = {
        files: [{ from: './README.md', to: './output/nested/deep/README.md' }],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const destPath = path.join(projectDir, 'output', 'nested', 'deep', 'README.md');

      expect(fs.existsSync(destPath)).toBe(true);
    });
  });

  describe('File overwriting', () => {
    it('should overwrite existing destination files', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const distDir = path.join(projectDir, 'dist');
      fs.mkdirSync(distDir);

      await writeFileText(path.join(distDir, 'README.md'), 'Old content');

      const options: CopyFilesExecutorSchema = {
        files: [{ from: './README.md', to: './dist/README.md' }],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const content = await readFileText(path.join(distDir, 'README.md'));
      expect(content).toBe('# Test Package\n\nThis is a test.');
      expect(content).not.toBe('Old content');
    });
  });
});
