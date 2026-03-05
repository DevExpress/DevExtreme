import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';
import _ from 'lodash';
import { LocalizationExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readFileText, writeFileText, readJson } from '../../utils/file-operations';

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
  MESSAGES_DIR_NOT_FOUND: (dir: string) => `Messages directory not found: ${dir}`,
  MESSAGE_TEMPLATE_NOT_FOUND: (path: string) => `Message template not found: ${path}`,
  GENERATED_TEMPLATE_NOT_FOUND: (path: string) => `Generated template not found: ${path}`,
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
  deps: CldrDependencies,
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
      data: deps.parentLocales,
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
      data: deps.globalizeEnCldr,
      ...CLDR_MODULE_CONFIGS.EN_CLDR,
      destination: cldrDataOutputDir,
    },
    {
      data: deps.globalizeSupplementalCldr,
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

function serializeObject(obj: unknown, shift = false): string {
  const tab = '    ';
  let result = JSON.stringify(obj, null, tab);

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
  const deps = loadCldrDependencies(projectRequire);
  const enMessages = await readJson(path.join(messagesDir, 'en.json'));

  const firstDayData = computeFirstDayOfWeekData(deps);
  const accountingFormats = computeAccountingFormats(deps.locales, projectRequire);

  const modules = createCldrModuleDefinitions(
    enMessages,
    deps,
    firstDayData,
    accountingFormats,
    cldrDataOutputDir,
    defaultMessagesOutputDir,
  );

  await Promise.all(
    modules.map(async (module) => {
      const json = serializeObject(module.data);
      const content = compiled({
        exportName: module.exportName,
        json,
      });
      const outputPath = path.join(module.destination, module.filename);
      await writeFileText(outputPath, content);
    }),
  );

  if (lintGeneratedFiles) {
    await lintFiles(cldrDataOutputDir, defaultMessagesOutputDir, projectRoot, projectRequire);
  }
}

function computeFirstDayOfWeekData(deps: CldrDependencies): Record<string, number> {
  const { Cldr, locales, weekData, likelySubtags, parentLocales } = deps;
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
      // Skip locales without numbers data
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

const runExecutor: PromiseExecutor<LocalizationExecutorSchema> = async (options, context) => {
  const absoluteProjectRoot = resolveProjectPath(context);

  const messagesDir = path.join(absoluteProjectRoot, options.messagesDir || DEFAULT_MESSAGES_DIR);
  const messageTemplate = path.join(
    absoluteProjectRoot,
    options.messageTemplate || DEFAULT_MESSAGE_TEMPLATE,
  );
  const messageOutputDir = path.join(
    absoluteProjectRoot,
    options.messageOutputDir || DEFAULT_MESSAGE_OUTPUT_DIR,
  );
  const generatedTemplate = path.join(
    absoluteProjectRoot,
    options.generatedTemplate || DEFAULT_GENERATED_TEMPLATE,
  );
  const cldrDataOutputDir = path.join(
    absoluteProjectRoot,
    options.cldrDataOutputDir || DEFAULT_CLDR_DATA_OUTPUT_DIR,
  );
  const defaultMessagesOutputDir = path.join(
    absoluteProjectRoot,
    options.defaultMessagesOutputDir || DEFAULT_DEFAULT_MESSAGES_OUTPUT_DIR,
  );

  const skipCldrGeneration = options.skipCldrGeneration ?? false;
  const skipMessageGeneration = options.skipMessageGeneration ?? false;
  const lintGeneratedFiles = options.lintGeneratedFiles ?? true;

  try {
    validateInputPaths(
      messagesDir,
      messageTemplate,
      generatedTemplate,
      skipMessageGeneration,
      skipCldrGeneration,
    );

    if (!skipMessageGeneration) {
      fs.mkdirSync(messageOutputDir, { recursive: true });
    }
    if (!skipCldrGeneration) {
      fs.mkdirSync(cldrDataOutputDir, { recursive: true });
      fs.mkdirSync(defaultMessagesOutputDir, { recursive: true });
    }

    if (!skipMessageGeneration) {
      logger.verbose('Generating localization message files...');
      await generateMessageFiles(messagesDir, messageTemplate, messageOutputDir);
      logger.verbose(`Message files generated in ${messageOutputDir}`);
    }

    if (!skipCldrGeneration) {
      logger.verbose('Generating CLDR TypeScript modules...');
      await generateCldrModules(
        absoluteProjectRoot,
        messagesDir,
        generatedTemplate,
        cldrDataOutputDir,
        defaultMessagesOutputDir,
        lintGeneratedFiles,
      );
      logger.verbose(`CLDR modules generated in ${cldrDataOutputDir}`);
    }

    logger.verbose('Localization generation completed successfully');
    return { success: true };
  } catch (error) {
    logError('Localization executor failed', error);
    return { success: false };
  }
};

export default runExecutor;
