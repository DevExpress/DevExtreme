import * as fs from 'fs';
import * as path from 'path';
import executor from './executor';
import { LocalizationExecutorSchema } from './schema';
import {
  writeFileText,
  writeJson,
  cleanupTempDir,
  readFileText,
  createTempDir,
  createMockContext,
  findWorkspaceRoot,
} from '../../utils';

const WORKSPACE_ROOT = findWorkspaceRoot();

const PROJECT_SUBPATH = ['packages', 'test-lib'] as const;

const MESSAGE_FILE = {
  EN: 'dx.messages.en.js',
  DE: 'dx.messages.de.js',
} as const;

const TEMPLATE_FILE = {
  LOCALIZATION: 'localization-template.jst',
  GENERATED_JS: 'generated_js.jst',
} as const;

const GENERATED_FILE = {
  DEFAULT_MESSAGES: 'default_messages.ts',
  PARENT_LOCALES: 'parent_locales.ts',
  FIRST_DAY_OF_WEEK: 'first_day_of_week_data.ts',
  ACCOUNTING_FORMATS: 'accounting_formats.ts',
  EN_CLDR: 'en.ts',
  SUPPLEMENTAL: 'supplemental.ts',
} as const;

const EXPECTED_CLDR_FILES = [
  GENERATED_FILE.PARENT_LOCALES,
  GENERATED_FILE.FIRST_DAY_OF_WEEK,
  GENERATED_FILE.ACCOUNTING_FORMATS,
  GENERATED_FILE.EN_CLDR,
  GENERATED_FILE.SUPPLEMENTAL,
] as const;

const LOCALIZATION_TEMPLATE = `(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define(function(require) {
            factory(require("devextreme/common/core/localization"));
        });
    } else if(typeof module === "object" && module.exports) {
        factory(require("devextreme/common/core/localization"));
    } else {
        factory(DevExpress.localization);
    }
}(this, function(localization) {
    localization.loadMessages(<%= json %>);
}));
`;

const GENERATED_JS_TEMPLATE = `/* eslint-disable @stylistic/quotes,@stylistic/indent,@stylistic/quote-props,@stylistic/max-len,@stylistic/comma-dangle,i18n/no-russian-character */
// !!! AUTO-GENERATED FILE, DO NOT EDIT
export <%= exportName ? 'const ' + exportName + ' =' : 'default' %> <%= json %>;
`;

interface LocalizationTestFixture {
  projectDir: string;
  messagesDir: string;
  buildDir: string;
  artifactsDir: string;
  cldrDataDir: string;
  localizationDir: string;
}

async function createLocalizationTestFixture(tempDir: string): Promise<LocalizationTestFixture> {
  const projectDir = path.join(tempDir, ...PROJECT_SUBPATH);
  const messagesDir = path.join(projectDir, 'js', 'localization', 'messages');
  const buildDir = path.join(projectDir, 'build', 'gulp');
  const artifactsDir = path.join(projectDir, 'artifacts', 'js', 'localization');
  const cldrDataDir = path.join(
    projectDir,
    'js',
    '__internal',
    'core',
    'localization',
    'cldr-data',
  );
  const localizationDir = path.join(projectDir, 'js', '__internal', 'core', 'localization');

  fs.mkdirSync(messagesDir, { recursive: true });
  fs.mkdirSync(buildDir, { recursive: true });
  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.mkdirSync(cldrDataDir, { recursive: true });
  fs.mkdirSync(localizationDir, { recursive: true });

  await writeJson(path.join(messagesDir, 'en.json'), {
    en: {
      Yes: 'Yes',
      No: 'No',
      Cancel: 'Cancel',
      Loading: 'Loading...',
    },
  });

  await writeJson(path.join(messagesDir, 'de.json'), {
    de: {
      Yes: 'Ja',
      No: 'Nein',
      Cancel: 'Abbrechen',
      Loading: 'Wird geladen...',
    },
  });

  await writeFileText(path.join(buildDir, TEMPLATE_FILE.LOCALIZATION), LOCALIZATION_TEMPLATE);
  await writeFileText(path.join(buildDir, TEMPLATE_FILE.GENERATED_JS), GENERATED_JS_TEMPLATE);

  await writeJson(path.join(projectDir, 'package.json'), {
    name: 'devextreme',
    version: '25.2.0',
  });

  return { projectDir, messagesDir, buildDir, artifactsDir, cldrDataDir, localizationDir };
}

describe('LocalizationExecutor E2E', () => {
  let tempDir: string;
  let context = createMockContext();
  let fixture: LocalizationTestFixture;

  beforeEach(async () => {
    tempDir = createTempDir('nx-localization-e2e-');
    context = createMockContext({ root: tempDir });
    fixture = await createLocalizationTestFixture(tempDir);

    const devextremeNodeModules = path.join(
      WORKSPACE_ROOT,
      'packages',
      'devextreme',
      'node_modules',
    );

    const tempNodeModules = path.join(fixture.projectDir, 'node_modules');
    fs.symlinkSync(devextremeNodeModules, tempNodeModules, 'junction');
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  it('should generate message files for all locales', async () => {
    const options: LocalizationExecutorSchema = {
      messagesDir: './js/localization/messages',
      messageTemplate: './build/gulp/localization-template.jst',
      messageOutputDir: './artifacts/js/localization',
      skipCldrGeneration: true,
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const enFile = path.join(fixture.artifactsDir, MESSAGE_FILE.EN);
    const deFile = path.join(fixture.artifactsDir, MESSAGE_FILE.DE);

    expect(fs.existsSync(enFile)).toBe(true);
    expect(fs.existsSync(deFile)).toBe(true);

    const enContent = await readFileText(enFile);
    expect(enContent).toContain('localization.loadMessages');
    expect(enContent).toContain('"Yes"');
    expect(enContent).toContain('"No"');
    expect(enContent).toContain('define.amd');

    const deContent = await readFileText(deFile);
    expect(deContent).toContain('"Ja"');
    expect(deContent).toContain('"Nein"');
  });

  it('should generate CLDR TypeScript modules', async () => {
    const options: LocalizationExecutorSchema = {
      messagesDir: './js/localization/messages',
      messageTemplate: './build/gulp/localization-template.jst',
      messageOutputDir: './artifacts/js/localization',
      generatedTemplate: './build/gulp/generated_js.jst',
      cldrDataOutputDir: './js/__internal/core/localization/cldr-data',
      defaultMessagesOutputDir: './js/__internal/core/localization',
    };

    const result = await executor(options, context);

    expect(result.success).toBe(true);

    const defaultMessagesFile = path.join(fixture.localizationDir, GENERATED_FILE.DEFAULT_MESSAGES);
    expect(fs.existsSync(defaultMessagesFile)).toBe(true);

    const defaultMessagesContent = await readFileText(defaultMessagesFile);
    expect(defaultMessagesContent).toContain('export const defaultMessages');
    expect(defaultMessagesContent).toContain('AUTO-GENERATED FILE');

    for (const file of EXPECTED_CLDR_FILES) {
      const filePath = path.join(fixture.cldrDataDir, file);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = await readFileText(filePath);
      expect(content).toContain('AUTO-GENERATED FILE');
    }
  });

  it('should forward applyLicenseHeaders option to license header pipeline', async () => {
    const licenseTemplatePath = path.join(fixture.buildDir, 'license-header.txt');
    await writeFileText(
      licenseTemplatePath,
      `/*<%= commentType %>\n* DevExtreme (<%= file.relative %>)\n*/\n`,
    );

    const options: LocalizationExecutorSchema = {
      messagesDir: './js/localization/messages',
      messageTemplate: './build/gulp/localization-template.jst',
      messageOutputDir: './artifacts/js/localization',
      skipCldrGeneration: true,
      applyLicenseHeaders: {
        licenseTemplateFile: './build/gulp/license-header.txt',
        separator: '',
        includePatterns: ['**/*.js'],
      },
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const enContent = await readFileText(path.join(fixture.artifactsDir, MESSAGE_FILE.EN));
    expect(enContent).toMatch(/^\/\*!/);
    expect(enContent).toContain('DevExtreme (dx.messages.en.js)');
  });

  it('should have correct output structure', async () => {
    const options: LocalizationExecutorSchema = {
      messagesDir: './js/localization/messages',
      messageTemplate: './build/gulp/localization-template.jst',
      messageOutputDir: './artifacts/js/localization',
      generatedTemplate: './build/gulp/generated_js.jst',
      cldrDataOutputDir: './js/__internal/core/localization/cldr-data',
      defaultMessagesOutputDir: './js/__internal/core/localization',
    };

    const result = await executor(options, context);
    expect(result.success).toBe(true);

    const expectedStructure = {
      [`artifacts/js/localization/${MESSAGE_FILE.EN}`]: true,
      [`artifacts/js/localization/${MESSAGE_FILE.DE}`]: true,
      [`js/__internal/core/localization/${GENERATED_FILE.DEFAULT_MESSAGES}`]: true,
      [`js/__internal/core/localization/cldr-data/${GENERATED_FILE.PARENT_LOCALES}`]: true,
      [`js/__internal/core/localization/cldr-data/${GENERATED_FILE.FIRST_DAY_OF_WEEK}`]: true,
      [`js/__internal/core/localization/cldr-data/${GENERATED_FILE.ACCOUNTING_FORMATS}`]: true,
      [`js/__internal/core/localization/cldr-data/${GENERATED_FILE.EN_CLDR}`]: true,
      [`js/__internal/core/localization/cldr-data/${GENERATED_FILE.SUPPLEMENTAL}`]: true,
    };

    for (const [relativePath, shouldExist] of Object.entries(expectedStructure)) {
      const absolutePath = path.join(fixture.projectDir, relativePath);
      expect(fs.existsSync(absolutePath)).toBe(shouldExist);
    }
  });
});
