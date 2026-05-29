import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { CopyFilesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

describe('CopyFilesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  async function setupExcludePatternsFixture(): Promise<void> {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const srcDir = path.join(projectDir, 'src');
    const testDir = path.join(srcDir, 'test');

    fs.mkdirSync(testDir, { recursive: true });

    await writeFileText(path.join(srcDir, 'app.js'), 'export const app = true;');
    await writeFileText(path.join(srcDir, 'utils.js'), 'export const utils = true;');
    await writeFileText(path.join(srcDir, 'helper.spec.js'), 'test("helper", () => {});');
    await writeFileText(path.join(testDir, 'app.spec.js'), 'test("app", () => {});');
    await writeFileText(path.join(testDir, 'utils.spec.js'), 'test("utils", () => {});');
  }

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

  describe('Glob patterns', () => {
    it('should copy files using glob pattern', async () => {
      const projectDir = path.join(tempDir, 'packages', 'test-lib');
      const srcDir = path.join(projectDir, 'src');
      fs.mkdirSync(srcDir, { recursive: true });

      await writeFileText(path.join(srcDir, 'file1.ts'), 'export const a = 1;');
      await writeFileText(path.join(srcDir, 'file2.ts'), 'export const b = 2;');
      await writeFileText(path.join(srcDir, 'other.js'), 'module.exports = {};');

      const options: CopyFilesExecutorSchema = {
        files: [{ from: './src/*.ts', to: './dist' }],
      };

      const result = await executor(options, context);

      expect(result.success).toBe(true);

      const distDir = path.join(projectDir, 'dist');
      expect(fs.existsSync(path.join(distDir, 'file1.ts'))).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'file2.ts'))).toBe(true);
      expect(fs.existsSync(path.join(distDir, 'other.js'))).toBe(false);
    });
  });

  it('should exclude files matching excludePatterns from glob copy', async () => {
    await setupExcludePatternsFixture();

    const options: CopyFilesExecutorSchema = {
      files: [
        {
          from: './src/**/*.js',
          to: './dist',
          excludePatterns: ['**/test/**', '**/*.spec.js'],
        },
      ],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distDir = path.join(projectDir, 'dist');

    expect(fs.existsSync(path.join(distDir, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'utils.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'helper.spec.js'))).toBe(false);
    expect(fs.existsSync(path.join(distDir, 'app.spec.js'))).toBe(false);
    expect(fs.existsSync(path.join(distDir, 'utils.spec.js'))).toBe(false);
  });

  it('should copy all files when excludePatterns is omitted', async () => {
    await setupExcludePatternsFixture();

    const options: CopyFilesExecutorSchema = {
      files: [{ from: './src/**/*.js', to: './dist2' }],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distDir = path.join(projectDir, 'dist2');

    expect(fs.existsSync(path.join(distDir, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'helper.spec.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'utils.spec.js'))).toBe(true);
  });

  it('should copy all files when excludePatterns is an empty array', async () => {
    await setupExcludePatternsFixture();

    const options: CopyFilesExecutorSchema = {
      files: [{ from: './src/**/*.js', to: './dist3', excludePatterns: [] }],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const distDir = path.join(projectDir, 'dist3');

    expect(fs.existsSync(path.join(distDir, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'helper.spec.js'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'utils.spec.js'))).toBe(true);
  });

  it('should apply different excludePatterns independently per file entry', async () => {
    await setupExcludePatternsFixture();

    const options: CopyFilesExecutorSchema = {
      files: [
        { from: './src/**/*.js', to: './out-a', excludePatterns: ['**/*.spec.js'] },
        { from: './src/**/*.js', to: './out-b', excludePatterns: ['**/test/**'] },
      ],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    const outA = path.join(projectDir, 'out-a');
    expect(fs.existsSync(path.join(outA, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(outA, 'helper.spec.js'))).toBe(false);
    expect(fs.existsSync(path.join(outA, 'utils.spec.js'))).toBe(false);

    const outB = path.join(projectDir, 'out-b');
    expect(fs.existsSync(path.join(outB, 'app.js'))).toBe(true);
    expect(fs.existsSync(path.join(outB, 'helper.spec.js'))).toBe(true);
    expect(fs.existsSync(path.join(outB, 'utils.spec.js'))).toBe(false);
  });

  it('should not error when excludePatterns is specified alongside a direct file path', async () => {
    await setupExcludePatternsFixture();

    const options: CopyFilesExecutorSchema = {
      files: [{ from: './README.md', to: './dist-direct/README.md', excludePatterns: ['**/*.md'] }],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    expect(fs.existsSync(path.join(projectDir, 'dist-direct', 'README.md'))).toBe(true);
  });

  it('should forward applyLicenseHeaders option to license header pipeline', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const buildDir = path.join(projectDir, 'build', 'gulp');
    fs.mkdirSync(buildDir, { recursive: true });
    await writeFileText(
      path.join(buildDir, 'license-header.txt'),
      `/*<%= commentType %>\n* DevExtreme (<%= file.relative %>)\n*/\n`,
    );
    await writeFileText(
      path.join(projectDir, 'aspnet-source.js'),
      'module.exports = function aspnet() {};\n',
    );

    const options: CopyFilesExecutorSchema = {
      files: [{ from: './aspnet-source.js', to: './artifacts/js/dx.aspnet.mvc.js' }],
      applyLicenseHeaders: {
        licenseTemplateFile: './build/gulp/license-header.txt',
        targetSubdir: './artifacts/js',
        separator: '',
        includePatterns: ['dx.aspnet.mvc.js'],
      },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const copiedContent = await readFileText(
      path.join(projectDir, 'artifacts', 'js', 'dx.aspnet.mvc.js'),
    );
    expect(copiedContent).toMatch(/^\/\*!/);
    expect(copiedContent).toContain('DevExtreme (dx.aspnet.mvc.js)');
  });
});
