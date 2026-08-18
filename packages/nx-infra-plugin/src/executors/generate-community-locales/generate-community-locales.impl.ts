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
  INVALID_OUTPUT: (filePath: string, reason: string) =>
    `Normalized content for ${filePath} is not valid JSON: ${reason}`,
} as const;

// A single `"key": "value"` regexp
const ENTRY_LINE = /^(\s*)"((?:[^"\\]|\\.)*)":\s*"(?:[^"\\]|\\.)*"(,?)(\s*)$/;

interface LocaleDictionary {
  [key: string]: string;
}

function normalizeLocaleFile(
  defaultFile: string,
  defaultLocale: string,
  fileContents: string,
): string {
  const parsedFile = JSON.parse(fileContents) as Record<string, LocaleDictionary>;

  const [locale] = Object.keys(parsedFile);
  const dictionary = parsedFile[locale];

  return defaultFile
    .replace(`"${defaultLocale}"`, `"${locale}"`)
    .split('\n')
    .map((line) => {
      const match = ENTRY_LINE.exec(line);
      if (!match) {
        return line;
      }

      const [, indent, rawKey, comma, lineEnding] = match;
      const key = JSON.parse(`"${rawKey}"`) as string;

      if (!Object.prototype.hasOwnProperty.call(dictionary, key)) {
        return line;
      }

      const val = dictionary[key];
      if (val.includes(TODO_MARKER)) {
        return line;
      }

      // JSON.stringify adds the quotes and escapes backslashes, quotes and control characters.
      return `${indent}"${rawKey}": ${JSON.stringify(val)}${comma}${lineEnding}`;
    })
    .join('\n');
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

    const localeFiles = await discoverFiles({
      cwd: messagesDir,
      includePatterns: ['*.json'],
      excludePatterns: [`${defaultLocale}.json`],
    });

    logger.verbose(`Normalizing ${localeFiles.length} community locale files...`);

    await Promise.all(
      localeFiles.map(async (filePath) => {
        const fileContents = await readFileText(filePath);
        const newFile = normalizeLocaleFile(defaultFile, defaultLocale, fileContents);

        // Never write a file the next run could not read back.
        try {
          JSON.parse(newFile);
        } catch (error) {
          throw new Error(ERROR_MESSAGES.INVALID_OUTPUT(filePath, (error as Error).message));
        }

        await writeFileText(filePath, newFile);
      }),
    );

    logger.verbose(`Community locale files normalized in ${messagesDir}`);
  },
});
