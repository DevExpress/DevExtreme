import { logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';
import _ from 'lodash';
import { createExecutor } from '../../utils/create-executor';
import {
  loadProjectPackageJson,
  readFileText,
  writeFileText,
  readJson,
} from '../../utils/file-operations';
import { ApplyLicenseHeadersOption, LocalizationExecutorSchema } from './schema';
import { applyLicenseHeadersToDirectory } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';

interface CldrInstance {
  supplemental: {
    weekData: {
      firstDay: () => string;
    };
  };
}

interface CldrConstructor {
  load: (...data: unknown[]) => void;
  new (locale: string): CldrInstance;
}

interface CldrModuleDefinition {
  data: unknown;
  filename: string;
  exportName?: string;
  destination: string;
}

interface CldrDependencies {
  Cldr: CldrConstructor;
  locales: string[];
  weekData: unknown;
  likelySubtags: unknown;
  parentLocales: Record<string, string>;
  globalizeEnCldr: unknown;
  globalizeSupplementalCldr: unknown;
}

const DEFAULT_MESSAGES_DIR = './js/localization/messages';
const DEFAULT_MESSAGE_TEMPLATE = './build/gulp/localization-template.jst';
const DEFAULT_MESSAGE_OUTPUT_DIR = './artifacts/js/localization';
const DEFAULT_GENERATED_TEMPLATE = './build/gulp/generated_js.jst';
const DEFAULT_CLDR_DATA_OUTPUT_DIR = './js/__internal/core/localization/cldr-data';
const DEFAULT_DEFAULT_MESSAGES_OUTPUT_DIR = './js/__internal/core/localization';

const PARENT_LOCALE_SEPARATOR = '-';

const DAY_INDEXES = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
} as const;

const DEFAULT_DAY_OF_WEEK_INDEX = DAY_INDEXES.sun;

const ERROR_MESSAGES = {
  MESSAGES_DIR_NOT_FOUND: (directory: string) => `Messages directory not found: ${directory}`,
  MESSAGE_TEMPLATE_NOT_FOUND: (templatePath: string) =>
    `Message template not found: ${templatePath}`,
  GENERATED_TEMPLATE_NOT_FOUND: (templatePath: string) =>
    `Generated template not found: ${templatePath}`,
  CLDR_DEPENDENCIES_LOAD_FAILED: (error: string) =>
    `Failed to load CLDR dependencies. Ensure cldr-core, cldrjs, and devextreme-cldr-data `
    + `are installed in the project: ${error}`,
} as const;

const CLDR_MODULE_CONFIGS = {
  DEFAULT_MESSAGES: {
    filename: 'default_messages.ts',
    exportName: 'defaultMessages',
  },
  PARENT_LOCALES: {
    filename: 'parent_locales.ts',
  },
  FIRST_DAY_OF_WEEK: {
    filename: 'first_day_of_week_data.ts',
  },
  ACCOUNTING_FORMATS: {
    filename: 'accounting_formats.ts',
  },
  EN_CLDR: {
    filename: 'en.ts',
    exportName: 'enCldr',
  },
  SUPPLEMENTAL: {
    filename: 'supplemental.ts',
    exportName: 'supplementalCldr',
  },
} as const;

function loadCldrDependencies(projectRequire: NodeRequire): CldrDependencies {
  try {
    return {
      Cldr: projectRequire('cldrjs') as CldrConstructor,
      locales: projectRequire('cldr-core/availableLocales.json').availableLocales.full,
      weekData: projectRequire('cldr-core/supplemental/weekData.json'),
      likelySubtags: projectRequire('cldr-core/supplemental/likelySubtags.json'),
      parentLocales: projectRequire('cldr-core/supplemental/parentLocales.json').supplemental
        .parentLocales.parentLocale,
      globalizeEnCldr: projectRequire('devextreme-cldr-data/en.json'),
      globalizeSupplementalCldr: projectRequire('devextreme-cldr-data/supplemental.json'),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(ERROR_MESSAGES.CLDR_DEPENDENCIES_LOAD_FAILED(message));
  }
}

function validateInputPaths(
  messagesDir: string,
  messageTemplate: string,
  generatedTemplate: string,
  skipMessageGeneration: boolean,
  skipCldrGeneration: boolean,
): void {
  if (!fs.existsSync(messagesDir)) {
    throw new Error(ERROR_MESSAGES.MESSAGES_DIR_NOT_FOUND(messagesDir));
  }
  if (!skipMessageGeneration && !fs.existsSync(messageTemplate)) {
    throw new Error(ERROR_MESSAGES.MESSAGE_TEMPLATE_NOT_FOUND(messageTemplate));
  }
  if (!skipCldrGeneration && !fs.existsSync(generatedTemplate)) {
    throw new Error(ERROR_MESSAGES.GENERATED_TEMPLATE_NOT_FOUND(generatedTemplate));
  }
}

function shouldIncludeLocaleInFirstDayData(
  firstDayIndex: number,
  parentLocale: string | false,
  getFirstIndex: (locale: string) => number,
): boolean {
  if (firstDayIndex === DEFAULT_DAY_OF_WEEK_INDEX) {
    return false;
  }
  if (!parentLocale) {
    return true;
  }
  return firstDayIndex !== getFirstIndex(parentLocale);
}

function createCldrModuleDefinitions(
  enMessages: unknown,
  dependencies: CldrDependencies,
  firstDayData: Record<string, number>,
  accountingFormats: Record<string, string>,
  cldrDataOutputDir: string,
  defaultMessagesOutputDir: string,
): CldrModuleDefinition[] {
  return [
    {
      data: enMessages,
      ...CLDR_MODULE_CONFIGS.DEFAULT_MESSAGES,
      destination: defaultMessagesOutputDir,
    },
    {
      data: dependencies.parentLocales,
      ...CLDR_MODULE_CONFIGS.PARENT_LOCALES,
      destination: cldrDataOutputDir,
    },
    {
      data: firstDayData,
      ...CLDR_MODULE_CONFIGS.FIRST_DAY_OF_WEEK,
      destination: cldrDataOutputDir,
    },
    {
      data: accountingFormats,
      ...CLDR_MODULE_CONFIGS.ACCOUNTING_FORMATS,
      destination: cldrDataOutputDir,
    },
    {
      data: dependencies.globalizeEnCldr,
      ...CLDR_MODULE_CONFIGS.EN_CLDR,
      destination: cldrDataOutputDir,
    },
    {
      data: dependencies.globalizeSupplementalCldr,
      ...CLDR_MODULE_CONFIGS.SUPPLEMENTAL,
      destination: cldrDataOutputDir,
    },
  ];
}

function getLocales(directory: string): string[] {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace('.json', ''));
}

function serializeObject(value: unknown, shift = false): string {
  const tab = '    ';
  let result = JSON.stringify(value, null, tab);

  if (shift) {
    result = result.replace(/(\n)/g, '$1' + tab);
  }

  return result;
}

function getParentLocale(parentLocales: Record<string, string>, locale: string): string | false {
  const parentLocale = parentLocales[locale];

  if (parentLocale) {
    return parentLocale !== 'root' && parentLocale;
  }

  const lastSeparatorIndex = locale.lastIndexOf(PARENT_LOCALE_SEPARATOR);
  return lastSeparatorIndex > 0 ? locale.substring(0, lastSeparatorIndex) : false;
}

async function generateMessageFiles(
  messagesDir: string,
  templatePath: string,
  outputDir: string,
): Promise<void> {
  const templateContent = await readFileText(templatePath);
  const compiled = _.template(templateContent);

  const locales = getLocales(messagesDir);

  logger.verbose(`Processing ${locales.length} locales...`);

  await Promise.all(
    locales.map(async (locale) => {
      const messagesPath = path.join(messagesDir, `${locale}.json`);
      const messages = await readJson(messagesPath);
      const json = serializeObject(messages, true);

      const content = compiled({ json });

      const outputPath = path.join(outputDir, `dx.messages.${locale}.js`);
      await writeFileText(outputPath, content);
    }),
  );
}

function computeFirstDayOfWeekData(dependencies: CldrDependencies): Record<string, number> {
  const { Cldr, locales, weekData, likelySubtags, parentLocales } = dependencies;
  const result: Record<string, number> = {};

  Cldr.load(weekData, likelySubtags);

  const getFirstIndex = (locale: string): number => {
    const firstDay = new Cldr(locale).supplemental.weekData.firstDay();
    return DAY_INDEXES[firstDay as keyof typeof DAY_INDEXES];
  };

  for (const locale of locales) {
    const firstDayIndex = getFirstIndex(locale);
    const parentLocale = getParentLocale(parentLocales, locale);

    if (shouldIncludeLocaleInFirstDayData(firstDayIndex, parentLocale, getFirstIndex)) {
      result[locale] = firstDayIndex;
    }
  }

  return result;
}

function computeAccountingFormats(
  locales: string[],
  projectRequire: NodeRequire,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const locale of locales) {
    try {
      const numbersData = projectRequire(`cldr-numbers-full/main/${locale}/numbers.json`);
      const accounting =
        numbersData.main[locale].numbers['currencyFormats-numberSystem-latn'].accounting;
      result[locale] = accounting;
    } catch {
      void 0;
    }
  }

  return result;
}

async function lintFiles(
  cldrDataOutputDir: string,
  defaultMessagesOutputDir: string,
  projectRoot: string,
  projectRequire: NodeRequire,
): Promise<void> {
  try {
    const { ESLint } = projectRequire('eslint');

    const eslint = new ESLint({
      fix: true,
      cwd: projectRoot,
      overrideConfig: {
        linterOptions: {
          reportUnusedDisableDirectives: 'off',
        },
      },
    });

    const filesToLint = [
      path.join(cldrDataOutputDir, '*.ts'),
      path.join(defaultMessagesOutputDir, 'default_messages.ts'),
    ];

    const results = await eslint.lintFiles(filesToLint);

    await ESLint.outputFixes(results);

    const errorCount = results.reduce(
      (sum: number, result: { errorCount: number }) => sum + result.errorCount,
      0,
    );
    if (errorCount > 0) {
      logger.warn(`ESLint found ${errorCount} errors in generated files`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn(`ESLint not available, skipping linting of generated files: ${errorMessage}`);
  }
}

async function generateCldrModules(
  projectRoot: string,
  messagesDir: string,
  templatePath: string,
  cldrDataOutputDir: string,
  defaultMessagesOutputDir: string,
  lintGeneratedFiles: boolean,
): Promise<void> {
  const templateContent = await readFileText(templatePath);
  const compiled = _.template(templateContent);

  const projectRequire = createRequire(path.join(projectRoot, 'package.json'));
  const dependencies = loadCldrDependencies(projectRequire);
  const enMessages = await readJson(path.join(messagesDir, 'en.json'));

  const firstDayData = computeFirstDayOfWeekData(dependencies);
  const accountingFormats = computeAccountingFormats(dependencies.locales, projectRequire);

  const modules = createCldrModuleDefinitions(
    enMessages,
    dependencies,
    firstDayData,
    accountingFormats,
    cldrDataOutputDir,
    defaultMessagesOutputDir,
  );

  await Promise.all(
    modules.map(async (moduleDefinition) => {
      const json = serializeObject(moduleDefinition.data);
      const content = compiled({
        exportName: moduleDefinition.exportName,
        json,
      });
      const outputPath = path.join(moduleDefinition.destination, moduleDefinition.filename);
      await writeFileText(outputPath, content);
    }),
  );

  if (lintGeneratedFiles) {
    await lintFiles(cldrDataOutputDir, defaultMessagesOutputDir, projectRoot, projectRequire);
  }
}

async function applyLicenseHeadersIfRequested(
  applyLicenseHeaders: ApplyLicenseHeadersOption | undefined,
  projectRoot: string,
  defaultTargetDir: string,
): Promise<void> {
  if (!applyLicenseHeaders) {
    return;
  }
  const pkg = await loadProjectPackageJson(projectRoot);
  const templatePath = resolveLicenseTemplate(projectRoot, applyLicenseHeaders);
  const targetDir = applyLicenseHeaders.targetSubdir
    ? path.join(projectRoot, applyLicenseHeaders.targetSubdir)
    : defaultTargetDir;
  await applyLicenseHeadersToDirectory({
    targetDir,
    pkg,
    templatePath,
    eulaUrl: applyLicenseHeaders.eulaUrl ?? DEFAULT_EULA_URL,
    mode: applyLicenseHeaders.mode,
    version: applyLicenseHeaders.version,
    commentType: applyLicenseHeaders.commentType,
    separator: applyLicenseHeaders.separator,
    prependAfterLicense: applyLicenseHeaders.prependAfterLicense,
    filenameMode: applyLicenseHeaders.filenameMode,
    includePatterns: applyLicenseHeaders.includePatterns,
    excludePatterns: applyLicenseHeaders.excludePatterns,
  });
}

interface ResolvedLocalization {
  projectRoot: string;
  messagesDir: string;
  messageTemplate: string;
  messageOutputDir: string;
  generatedTemplate: string;
  cldrDataOutputDir: string;
  defaultMessagesOutputDir: string;
  skipCldrGeneration: boolean;
  skipMessageGeneration: boolean;
  lintGeneratedFiles: boolean;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
}

export default createExecutor<LocalizationExecutorSchema, ResolvedLocalization>({
  name: 'Localization',
  resolve: (options, { projectRoot }) => {
    const messagesDir = path.join(projectRoot, options.messagesDir || DEFAULT_MESSAGES_DIR);
    const messageTemplate = path.join(
      projectRoot,
      options.messageTemplate || DEFAULT_MESSAGE_TEMPLATE,
    );
    const messageOutputDir = path.join(
      projectRoot,
      options.messageOutputDir || DEFAULT_MESSAGE_OUTPUT_DIR,
    );
    const generatedTemplate = path.join(
      projectRoot,
      options.generatedTemplate || DEFAULT_GENERATED_TEMPLATE,
    );
    const cldrDataOutputDir = path.join(
      projectRoot,
      options.cldrDataOutputDir || DEFAULT_CLDR_DATA_OUTPUT_DIR,
    );
    const defaultMessagesOutputDir = path.join(
      projectRoot,
      options.defaultMessagesOutputDir || DEFAULT_DEFAULT_MESSAGES_OUTPUT_DIR,
    );

    return {
      projectRoot,
      messagesDir,
      messageTemplate,
      messageOutputDir,
      generatedTemplate,
      cldrDataOutputDir,
      defaultMessagesOutputDir,
      skipCldrGeneration: options.skipCldrGeneration ?? false,
      skipMessageGeneration: options.skipMessageGeneration ?? false,
      lintGeneratedFiles: options.lintGeneratedFiles ?? true,
      applyLicenseHeaders: options.applyLicenseHeaders,
    };
  },
  run: async (resolved) => {
    validateInputPaths(
      resolved.messagesDir,
      resolved.messageTemplate,
      resolved.generatedTemplate,
      resolved.skipMessageGeneration,
      resolved.skipCldrGeneration,
    );

    if (!resolved.skipMessageGeneration) {
      fs.mkdirSync(resolved.messageOutputDir, { recursive: true });
    }
    if (!resolved.skipCldrGeneration) {
      fs.mkdirSync(resolved.cldrDataOutputDir, { recursive: true });
      fs.mkdirSync(resolved.defaultMessagesOutputDir, { recursive: true });
    }

    if (!resolved.skipMessageGeneration) {
      logger.verbose('Generating localization message files...');
      await generateMessageFiles(
        resolved.messagesDir,
        resolved.messageTemplate,
        resolved.messageOutputDir,
      );
      logger.verbose(`Message files generated in ${resolved.messageOutputDir}`);
    }

    if (!resolved.skipCldrGeneration) {
      logger.verbose('Generating CLDR TypeScript modules...');
      await generateCldrModules(
        resolved.projectRoot,
        resolved.messagesDir,
        resolved.generatedTemplate,
        resolved.cldrDataOutputDir,
        resolved.defaultMessagesOutputDir,
        resolved.lintGeneratedFiles,
      );
      logger.verbose(`CLDR modules generated in ${resolved.cldrDataOutputDir}`);
    }

    await applyLicenseHeadersIfRequested(
      resolved.applyLicenseHeaders,
      resolved.projectRoot,
      resolved.messageOutputDir,
    );

    logger.verbose('Localization generation completed successfully');
  },
});
