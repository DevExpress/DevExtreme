import { logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs';
import { createExecutor } from '../../utils/create-executor';
import { readFileText, writeFileText } from '../../utils/file-operations';
import { discoverFiles } from '../../utils/glob-discovery';
import { GenerateCommunityLocalesExecutorSchema } from './schema';

const DEFAULT_MESSAGES_DIR = './js/localization/messages';
const DEFAULT_LOCALE = 'en';
const TODO_MARKER = 'TODO';

const ERROR_MESSAGES = {
  MESSAGES_DIR_NOT_FOUND: (directory: string) => `Messages directory not found: ${directory}`,
  DEFAULT_LOCALE_NOT_FOUND: (filePath: string) => `Default locale file not found: ${filePath}`,
} as const;

interface LocaleDictionary {
  [key: string]: string;
}

function normalizeLocaleFile(
  defaultFile: string,
  defaultDictionaryKeys: string[],
  defaultLocale: string,
  fileContents: string,
): string {
  const parsedFile = JSON.parse(fileContents) as Record<string, LocaleDictionary>;

  const [locale] = Object.keys(parsedFile);
  const dictionary = parsedFile[locale];

  let newFile = defaultFile.replace(`"${defaultLocale}"`, `"${locale}"`);

  defaultDictionaryKeys.forEach((key) => {
    let replaceValue: string | null = null;
    // eslint-disable-next-line no-prototype-builtins
    if (dictionary.hasOwnProperty(key)) {
      const val = dictionary[key];
      if (!val.includes(TODO_MARKER)) {
        replaceValue = val.replace(/"/g, '\\"');
      }
    }

    if (replaceValue != null) {
      newFile = newFile.replace(new RegExp(`"${key}":.*"(,)?`), `"${key}": "${replaceValue}"$1`);
    }
  });

  return newFile;
}

interface ResolvedGenerateCommunityLocales {
  messagesDir: string;
  defaultLocale: string;
}

export default createExecutor<
  GenerateCommunityLocalesExecutorSchema,
  ResolvedGenerateCommunityLocales
>({
  name: 'Generate Community Locales',
  resolve: (options, { projectRoot }) => ({
    messagesDir: path.join(projectRoot, options.messagesDir || DEFAULT_MESSAGES_DIR),
    defaultLocale: options.defaultLocale || DEFAULT_LOCALE,
  }),
  run: async ({ messagesDir, defaultLocale }) => {
    if (!fs.existsSync(messagesDir)) {
      throw new Error(ERROR_MESSAGES.MESSAGES_DIR_NOT_FOUND(messagesDir));
    }

    const defaultFilePath = path.join(messagesDir, `${defaultLocale}.json`);
    if (!fs.existsSync(defaultFilePath)) {
      throw new Error(ERROR_MESSAGES.DEFAULT_LOCALE_NOT_FOUND(defaultFilePath));
    }

    const defaultFile = await readFileText(defaultFilePath);
    const defaultDictionaryKeys = Object.keys(
      (JSON.parse(defaultFile) as Record<string, LocaleDictionary>)[defaultLocale],
    );

    const localeFiles = await discoverFiles({
      cwd: messagesDir,
      includePatterns: ['*.json'],
      excludePatterns: [`${defaultLocale}.json`],
    });

    logger.verbose(`Normalizing ${localeFiles.length} community locale files...`);

    await Promise.all(
      localeFiles.map(async (filePath) => {
        const fileContents = await readFileText(filePath);
        const newFile = normalizeLocaleFile(
          defaultFile,
          defaultDictionaryKeys,
          defaultLocale,
          fileContents,
        );
        await writeFileText(filePath, newFile);
      }),
    );

    logger.verbose(`Community locale files normalized in ${messagesDir}`);
  },
});
