import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { ConcatenateFilesExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, readFileText } from '../../utils';

describe('ConcatenateFilesExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let projectDir: string;

  beforeEach(async () => {
    tempDir = createTempDir('nx-concatenate-e2e-');
    context = createMockContext({ root: tempDir });
    projectDir = path.join(tempDir, 'packages', 'test-lib');
    fs.mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should handle devextreme-bundler-config use case', async () => {
    const partsDir = path.join(projectDir, 'build', 'gulp', 'bundler-config');
    fs.mkdirSync(partsDir, { recursive: true });

    await writeFileText(
      path.join(partsDir, '01-header.js'),
      `// Some preamble to ignore\r\n/// BUNDLER_PARTS\r\n    const VERSION = '24.2';\r\n/// BUNDLER_PARTS_END\r\n// trailing code`,
    );

    await writeFileText(
      path.join(partsDir, '02-core.js'),
      `/// BUNDLER_PARTS\r\n    require('./ui/core');\r\n    require('./ui/widgets');\r\n/// BUNDLER_PARTS_END`,
    );

    await writeFileText(
      path.join(partsDir, '03-footer.js'),
      `/// BUNDLER_PARTS\r\n    module.exports = DevExpress;\r\n/// BUNDLER_PARTS_END`,
    );

    const options: ConcatenateFilesExecutorSchema = {
      sourceFiles: [
        './build/gulp/bundler-config/01-header.js',
        './build/gulp/bundler-config/02-core.js',
        './build/gulp/bundler-config/03-footer.js',
      ],
      outputFile: './artifacts/js/bundler-config.js',
      header: '/* DevExtreme Bundler Config */\n/* Generated file - do not edit */\n\n',
      footer: '\n\n/* End of bundler config */\n',
      separator: '\n',
      extractPattern: '[^]*BUNDLER_PARTS.*?$([^]*)^.*?BUNDLER_PARTS_END[^]*',
      extractPatternFlags: 'gm',
      transforms: [
        { find: '^[ ]{4}', replace: '', flags: 'gm' },
        { find: '\\n{3,}', replace: '\n\n', flags: 'g' },
      ],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const output = await readFileText(
      path.join(projectDir, 'artifacts', 'js', 'bundler-config.js'),
    );

    expect(output.startsWith('/* DevExtreme Bundler Config */')).toBe(true);

    expect(output.endsWith('/* End of bundler config */\n')).toBe(true);

    expect(output).not.toContain('BUNDLER_PARTS');
    expect(output).not.toContain('Some preamble to ignore');
    expect(output).not.toContain('trailing code');

    expect(output).toContain("const VERSION = '24.2';");
    expect(output).toContain("require('./ui/core');");
    expect(output).toContain("require('./ui/widgets');");
    expect(output).toContain('module.exports = DevExpress;');

    expect(output).not.toMatch(/^    /m);

    expect(output).not.toContain('\r\n');

    const versionPos = output.indexOf("VERSION = '24.2'");
    const requirePos = output.indexOf("require('./ui/core')");
    const exportPos = output.indexOf('module.exports');
    expect(versionPos).toBeLessThan(requirePos);
    expect(requirePos).toBeLessThan(exportPos);
  });
});
