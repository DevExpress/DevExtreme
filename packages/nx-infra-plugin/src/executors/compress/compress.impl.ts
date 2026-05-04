import * as path from 'path';
import { logger } from '@nx/devkit';
import * as terser from 'terser';
import { js as jsBeautify } from 'js-beautify';
import { createExecutor } from '../../utils/create-executor';
import { expandEntries } from '../../utils/glob-discovery';
import {
  ensureTrailingNewline,
  normalizeEol,
  readFileText,
  writeFileText,
} from '../../utils/file-operations';
import { CompressExecutorSchema, CompressMode, CompressModeName } from './schema';

const STRIP_DEBUG_REGEX = /\/{2,}\s{0,}#DEBUG[\s\S]*?\/{2,}\s{0,}#ENDDEBUG/g;

export function stripDebug(content: string): string {
  return content.replace(STRIP_DEBUG_REGEX, '');
}

const ERROR_TERSER_MINIFY_NO_OUTPUT = 'Terser minification produced no output';
const ERROR_TERSER_BEAUTIFY_NO_OUTPUT = 'Terser beautification produced no output';
const ERROR_UNKNOWN_MODE = (name: string) => `Unknown compress mode: ${name}`;

const LICENSE_PREFIX_BANG = '!';
const LICENSE_PREFIX_SPACE_BANG = ' !';

function createCommentFilter(eulaUrl?: string) {
  return function saveLicenseComments(_node: unknown, comment: { value: string }): boolean {
    return (
      comment.value.charAt(0) === LICENSE_PREFIX_BANG
      || comment.value.startsWith(LICENSE_PREFIX_SPACE_BANG)
      || (!!eulaUrl && comment.value.indexOf(eulaUrl) > -1)
    );
  };
}

async function runMinify(content: string, eulaUrl?: string): Promise<string> {
  const result = await terser.minify(content, {
    output: {
      ascii_only: true,
      comments: createCommentFilter(eulaUrl),
    },
  });

  if (result.code == null) {
    throw new Error(ERROR_TERSER_MINIFY_NO_OUTPUT);
  }

  return result.code;
}

async function runBeautify(content: string, eulaUrl?: string): Promise<string> {
  const uglifyResult = await terser.minify(content, {
    mangle: false,
    compress: {
      sequences: false,
      properties: true,
      dead_code: true,
      drop_debugger: true,
      unsafe: false,
      conditionals: false,
      comparisons: false,
      evaluate: true,
      booleans: false,
      loops: false,
      unused: true,
      hoist_funs: false,
      hoist_vars: false,
      if_return: false,
      join_vars: false,
      collapse_vars: false,
      side_effects: false,
      global_defs: {},
    },
    output: {
      braces: true,
      ascii_only: true,
      comments: createCommentFilter(eulaUrl),
    },
  });

  if (uglifyResult.code == null) {
    throw new Error(ERROR_TERSER_BEAUTIFY_NO_OUTPUT);
  }

  return jsBeautify(uglifyResult.code);
}

function normalizeOutput(content: string, trailingNewline: boolean): string {
  const normalized = normalizeEol(content);
  return trailingNewline ? ensureTrailingNewline(normalized) : normalized;
}

interface ResolvedMode {
  name: CompressModeName;
  eulaUrl?: string;
  trailingNewline: boolean;
}

function resolveMode(mode: CompressMode): ResolvedMode {
  if (typeof mode === 'string') {
    return { name: mode, trailingNewline: true };
  }
  const trailingNewline = mode.trailingNewline ?? true;
  if (mode.name === 'minify' || mode.name === 'beautify') {
    return { name: mode.name, eulaUrl: mode.eulaUrl, trailingNewline };
  }
  return { name: mode.name, trailingNewline };
}

type CompressStrategy = (content: string, mode: ResolvedMode) => Promise<string>;

const STRATEGIES: Record<CompressModeName, CompressStrategy> = {
  minify: async (content, { eulaUrl, trailingNewline }) =>
    normalizeOutput(await runMinify(stripDebug(content), eulaUrl), trailingNewline),
  beautify: async (content, { eulaUrl, trailingNewline }) =>
    normalizeOutput(await runBeautify(content, eulaUrl), trailingNewline),
  'strip-debug': async (content) => stripDebug(content),
  normalize: async (content, { trailingNewline }) => normalizeOutput(content, trailingNewline),
};

async function compressFile(filePath: string, mode: CompressMode): Promise<void> {
  const resolved = resolveMode(mode);
  const runStrategy = STRATEGIES[resolved.name];
  if (!runStrategy) {
    throw new Error(ERROR_UNKNOWN_MODE(resolved.name));
  }

  const raw = await readFileText(filePath);
  await writeFileText(filePath, await runStrategy(raw, resolved));
}

interface ResolvedCompress {
  projectRoot: string;
  files: string[];
  mode: CompressMode;
  modeName: string;
}

export default createExecutor<CompressExecutorSchema, ResolvedCompress>({
  name: 'Compress',
  resolve: async (options, { projectRoot }) => {
    const expanded = await expandEntries(options.files, {
      projectRoot,
      excludePatterns: options.exclude,
    });
    return {
      projectRoot,
      files: expanded,
      mode: options.mode,
      modeName: typeof options.mode === 'string' ? options.mode : options.mode.name,
    };
  },
  run: async ({ projectRoot, files, mode, modeName }) => {
    for (const filePath of files) {
      await compressFile(filePath, mode);
      logger.verbose(`Compressed ${path.relative(projectRoot, filePath)} (${modeName})`);
    }
  },
});
