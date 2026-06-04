import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { AddLicenseHeadersExecutorSchema } from './schema';
import { createTempDir, cleanupTempDir, createMockContext } from '../../utils/test-utils';
import { writeFileText, writeJson, readFileText } from '../../utils';

describe('AddLicenseHeadersExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();

  async function setupLicenseHeaderTemplate(): Promise<void> {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const buildDir = path.join(projectDir, 'build', 'gulp');
    fs.mkdirSync(buildDir, { recursive: true });
    await writeFileText(
      path.join(buildDir, 'license-header.txt'),
      `/*<%= commentType %>
* DevExtreme (<%= file.relative %>)
* Version: <%= version %>
* Build date: <%= date %>
*
* Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: <%= eula %>
*/
`,
    );
  }

  beforeEach(async () => {
    tempDir = createTempDir('nx-license-e2e-');
    context = createMockContext({ root: tempDir });

    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const npmDir = path.join(projectDir, 'npm');

    await setupLicenseHeaderTemplate();

    fs.mkdirSync(npmDir, { recursive: true });

    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'test-package',
      version: '1.0.0',
      repository: 'https://github.com/DevExpress/test-package',
    });

    await writeFileText(
      path.join(npmDir, 'index.js'),
      `export function hello() {\n  return 'Hello';\n}\n`,
    );

    await writeFileText(path.join(npmDir, 'utils.js'), `export const add = (a, b) => a + b;\n`);

    fs.mkdirSync(path.join(npmDir, 'components'), { recursive: true });
    await writeFileText(
      path.join(npmDir, 'components', 'button.js'),
      `export const Button = () => {};\n`,
    );

    await writeFileText(
      path.join(npmDir, 'types.ts'),
      `export interface Config { name: string; }\n`,
    );
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should add license headers to all JS and TS files', async () => {
    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');

    const indexContent = await readFileText(path.join(npmDir, 'index.js'));
    expect(indexContent).toMatch(/^\/\*!/);
    expect(indexContent).toContain('DevExtreme (index.js)');
    expect(indexContent).toContain('Version: 1.0.0');
    expect(indexContent).toContain('Developer Express Inc.');
    const currentYear = new Date().getFullYear();
    expect(indexContent).toContain(`2012 - ${currentYear}`);
    expect(indexContent).toMatch(/Build date:/);

    const utilsContent = await readFileText(path.join(npmDir, 'utils.js'));
    expect(utilsContent).toMatch(/^\/\*!/);

    const typesContent = await readFileText(path.join(npmDir, 'types.ts'));
    expect(typesContent).toMatch(/^\/\*!/);
  });

  it('should add headers to nested files', async () => {
    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');
    const buttonContent = await readFileText(path.join(npmDir, 'components', 'button.js'));

    expect(buttonContent).toMatch(/^\/\*!/);
    expect(buttonContent).toContain('components/button.js');
  });

  it('should preserve original file content after header', async () => {
    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
    };

    const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');
    const originalContent = await readFileText(path.join(npmDir, 'index.js'));

    await executor(options, context);

    const newContent = await readFileText(path.join(npmDir, 'index.js'));

    expect(newContent).toMatch(/^\/\*!/);

    expect(newContent).toContain(originalContent.trim());
  });

  it('should support custom license template', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const buildDir = path.join(projectDir, 'build', 'gulp');
    fs.mkdirSync(buildDir, { recursive: true });

    await writeFileText(
      path.join(buildDir, 'license-header.txt'),
      `/*!
* DevExtreme (<%= file.relative %>)
* Version: <%= version %>
* Build date: <%= date %>
*
* Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: <%= eula %>
*/
`,
    );

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      licenseTemplateFile: './build/gulp/license-header.txt',
      eulaUrl: 'https://js.devexpress.com/Licensing/',
      prependAfterLicense: '"use strict";\n\n',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const npmDir = path.join(projectDir, 'npm');
    const content = await readFileText(path.join(npmDir, 'index.js'));

    expect(content).toMatch(/^\/\*!/);
    expect(content).toContain('DevExtreme (index.js)');
    expect(content).toContain('https://js.devexpress.com/Licensing/');
    expect(content).toContain('"use strict";');
    expect(content).toContain("return 'Hello'");
  });

  it('should fail gracefully with missing package.json', async () => {
    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './nonexistent-package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(false);
  });

  it('should fail gracefully with invalid package.json', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    await writeFileText(path.join(projectDir, 'package.json'), 'not valid json {{{}');

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(false);
  });

  it('should handle empty target directory', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const emptyDir = path.join(projectDir, 'empty');
    fs.mkdirSync(emptyDir, { recursive: true });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './empty',
      packageJsonPath: './package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);
  });

  it('should work with custom target directory', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const customDir = path.join(projectDir, 'dist');
    fs.mkdirSync(customDir, { recursive: true });

    await writeFileText(path.join(customDir, 'custom.js'), `export const custom = true;\n`);

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './dist',
      packageJsonPath: './package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const content = await readFileText(path.join(customDir, 'custom.js'));
    expect(content).toMatch(/^\/\*!/);
    expect(content).toContain('custom.js');
  });

  it('should work with custom package.json path', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');

    await writeJson(path.join(projectDir, 'custom-package.json'), {
      name: 'custom-package-name',
      version: '2.0.0',
      repository: 'https://github.com/DevExpress/custom-package',
    });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './custom-package.json',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const npmDir = path.join(projectDir, 'npm');
    const content = await readFileText(path.join(npmDir, 'index.js'));

    expect(content).toContain('Version: 2.0.0');
  });

  it('should preserve formatting and whitespace', async () => {
    const npmDir = path.join(tempDir, 'packages', 'test-lib', 'npm');

    const originalContent = `export function complex() {
  if (true) {
    return 'formatted';
  }
}

export const value = 42;
`;

    await writeFileText(path.join(npmDir, 'formatted.js'), originalContent);

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      separatorBetweenBannerAndContent: '\n',
    };

    await executor(options, context);

    const newContent = await readFileText(path.join(npmDir, 'formatted.js'));

    const contentWithoutHeader = newContent.replace(/^\/\*![\s\S]*?\*\/\n\n/, '');

    expect(contentWithoutHeader).toBe(originalContent);
  });

  it('should produce /** banner when commentType is *', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const npmDir = path.join(projectDir, 'npm');
    await setupLicenseHeaderTemplate();

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      licenseTemplateFile: './build/gulp/license-header.txt',
      eulaUrl: 'https://js.devexpress.com/Licensing/',
      includePatterns: ['**/*.js'],
      commentType: '*',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const content = await readFileText(path.join(npmDir, 'index.js'));
    expect(content).toMatch(/^\/\*\*/);
    expect(content).not.toMatch(/^\/\*!/);
  });

  it('should default to ! when commentType is not specified', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const npmDir = path.join(projectDir, 'npm');
    await setupLicenseHeaderTemplate();

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      licenseTemplateFile: './build/gulp/license-header.txt',
      eulaUrl: 'https://js.devexpress.com/Licensing/',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const content = await readFileText(path.join(npmDir, 'index.js'));
    expect(content).toMatch(/^\/\*!/);
    expect(content).not.toMatch(/^\/\*\*/);
  });

  it('should fall back to DEFAULT_LICENSE_TEMPLATE_EULA when licenseTemplateFile is omitted', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const npmDir = path.join(projectDir, 'npm');

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      commentType: '*',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const content = await readFileText(path.join(npmDir, 'index.js'));
    expect(content).toMatch(/^\/\*\*/);
    expect(content).not.toMatch(/^\/\*!/);
    expect(content).toContain('DevExtreme');
  });

  it('should use the bundled MIT template when mode=mit and no licenseTemplateFile is provided', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'test-pkg',
      version: '1.2.3',
      repository: { url: 'git+https://github.com/test/repo.git' },
    });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      mode: 'mit',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const npmDir = path.join(projectDir, 'npm');
    const content = await readFileText(path.join(npmDir, 'index.js'));
    const firstLine = content.split('\n')[0];
    const currentYear = new Date().getFullYear();

    expect(firstLine).toBe('/*!');
    expect(content).toContain(' * test-pkg');
    expect(content).toContain(' * Version: 1.2.3');
    expect(content).toContain(
      ` * Copyright (c) 2012 - ${currentYear} Developer Express Inc. ALL RIGHTS RESERVED`,
    );
    expect(content).toContain(' * This software may be modified and distributed under the terms');
    expect(content).toContain(' * https://github.com/test/repo');
    expect(content).not.toContain('DevExtreme (');
    expect(content).not.toContain('Read about DevExtreme licensing here');
  });

  it('should use the bundled EULA template when mode=eula and no licenseTemplateFile is provided', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'devextreme',
      version: '26.1.0',
      repository: { url: 'https://github.com/DevExpress/DevExtreme.git' },
    });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      mode: 'eula',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const npmDir = path.join(projectDir, 'npm');
    const content = await readFileText(path.join(npmDir, 'index.js'));

    expect(content).toContain('DevExtreme (');
    expect(content).toContain('Version: 26.1.0');
    expect(content).toContain('Read about DevExtreme licensing here:');
    expect(content).not.toContain('modified and distributed');
  });

  it('should default to mode=eula when neither mode nor licenseTemplateFile is provided', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'devextreme',
      version: '26.1.0',
      repository: { url: 'https://github.com/DevExpress/DevExtreme.git' },
    });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const npmDir = path.join(projectDir, 'npm');
    const content = await readFileText(path.join(npmDir, 'index.js'));

    expect(content).toContain('DevExtreme (');
    expect(content).toContain('Version: 26.1.0');
    expect(content).toContain('Read about DevExtreme licensing here:');
    expect(content).not.toContain('modified and distributed');
  });

  it('should respect licenseTemplateFile precedence over mode', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const buildDir = path.join(projectDir, 'build');
    fs.mkdirSync(buildDir, { recursive: true });
    await writeFileText(
      path.join(buildDir, 'custom-template.txt'),
      `/*-CUSTOM-<%= pkg.name %>-CUSTOM-*/\n`,
    );
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'test-pkg',
      version: '1.0.0',
      repository: { url: 'https://github.com/test/repo.git' },
    });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      licenseTemplateFile: './build/custom-template.txt',
      mode: 'mit',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const npmDir = path.join(projectDir, 'npm');
    const content = await readFileText(path.join(npmDir, 'index.js'));
    const firstLine = content.split('\n')[0];
    expect(firstLine).toMatch(/^\/\*-CUSTOM-/);
  });

  it('should not require repository when licenseTemplateFile overrides mode=mit', async () => {
    const projectDir = path.join(tempDir, 'packages', 'test-lib');
    const buildDir = path.join(projectDir, 'build');
    fs.mkdirSync(buildDir, { recursive: true });
    await writeFileText(
      path.join(buildDir, 'custom-template.txt'),
      `/*-CUSTOM-<%= pkg.name %>-CUSTOM-*/\n`,
    );
    await writeJson(path.join(projectDir, 'package.json'), {
      name: 'test-pkg',
      version: '1.0.0',
    });

    const options: AddLicenseHeadersExecutorSchema = {
      targetDirectory: './npm',
      packageJsonPath: './package.json',
      licenseTemplateFile: './build/custom-template.txt',
      mode: 'mit',
      includePatterns: ['**/*.js'],
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const content = await readFileText(path.join(projectDir, 'npm', 'index.js'));
    expect(content.split('\n')[0]).toMatch(/^\/\*-CUSTOM-test-pkg-CUSTOM-/);
  });
});
