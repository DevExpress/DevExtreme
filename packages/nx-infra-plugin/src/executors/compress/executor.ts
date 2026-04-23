import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as terser from 'terser';
import { js as jsBeautify } from 'js-beautify';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import { CompressExecutorSchema } from './schema';
import { resolveProjectPath, normalizeGlobPathForWindows } from '../../utils/path-resolver';
import { isWindowsOS, containsGlobPattern } from '../../utils/common';
import {
  readFileText,
  writeFileText,
  normalizeEol,
  ensureTrailingNewline,
} from '../../utils/file-operations';

// NOTE:
// Removes the #DEBUG section from the code in the production build.
// E.g. removes the next code:
// //#DEBUG
// // some code.
// //#ENDDEBUG
// Between comment slashes (/) and # may be space symbols (count doesn't matter).
const REMOVE_DEBUG_REGEXP = /\/{2,}\s{0,}#DEBUG[\s\S]*?\/{2,}\s{0,}#ENDDEBUG/g;

function createCommentFilter(eulaUrl?: string) {
  return function saveLicenseComments(_node: any, comment: { value: string }): boolean {
    return (
      comment.value.charAt(0) === '!'
      // Workaround for rrule, on v2.7.1 the space char was added to the license header https://github.com/jakubroztocil/rrule/commit/803c03b85ac074d92d443306805a68e104069c02#diff-a2a171449d862fe29692ce031981047d7ab755ae7f84c707aef80701b3ea0c80R1
      || comment.value.startsWith(' !')
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
    throw new Error('Terser minification produced no output');
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
    throw new Error('Terser beautification produced no output');
  }

  return jsBeautify(uglifyResult.code);
}

function stripDebugBlocks(content: string): string {
  return content.replace(REMOVE_DEBUG_REGEXP, '');
}

type CompressStrategy = (content: string, eulaUrl?: string) => Promise<string>;

const STRATEGIES: Record<CompressExecutorSchema['mode'], CompressStrategy> = {
  minify: async (content, eulaUrl) => runMinify(stripDebugBlocks(content), eulaUrl),
  beautify: async (content, eulaUrl) => runBeautify(content, eulaUrl),
  'strip-debug': async (content) => stripDebugBlocks(content),
  normalize: async (content) => content,
};

async function compressFile(
  filePath: string,
  mode: CompressExecutorSchema['mode'],
  eulaUrl?: string,
): Promise<void> {
  const strategy = STRATEGIES[mode];
  if (!strategy) {
    throw new Error(`Unknown compress mode: ${mode}`);
  }

  const raw = await readFileText(filePath);
  const transformed = await strategy(raw, eulaUrl);
  await writeFileText(filePath, ensureTrailingNewline(normalizeEol(transformed)));
}

async function expandFileList(
  files: string[],
  exclude: string[] | undefined,
  projectRoot: string,
): Promise<string[]> {
  const toPosixIfWindows = (p: string) => (isWindowsOS() ? normalizeGlobPathForWindows(p) : p);

  const ignorePatterns = exclude?.map((p) => toPosixIfWindows(path.resolve(projectRoot, p)));

  const isExcluded = (absolutePath: string): boolean =>
    !!ignorePatterns?.some((pattern) =>
      minimatch(toPosixIfWindows(absolutePath), pattern, { dot: true }),
    );

  const resolved: string[] = [];
  for (const entry of files) {
    const absolute = path.resolve(projectRoot, entry);
    if (containsGlobPattern(entry)) {
      const pattern = toPosixIfWindows(absolute);
      const matches = await glob(pattern, { nodir: true, ignore: ignorePatterns });
      resolved.push(...matches);
    } else if (!isExcluded(absolute)) {
      resolved.push(absolute);
    }
  }
  return [...new Set(resolved)];
}

const runExecutor: PromiseExecutor<CompressExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const { files, mode, eulaUrl, exclude } = options;

  try {
    const expanded = await expandFileList(files, exclude, projectRoot);
    for (const filePath of expanded) {
      await compressFile(filePath, mode, eulaUrl);
      logger.verbose(`Compressed ${path.relative(projectRoot, filePath)} (${mode})`);
    }

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Compress failed: ${msg}`);
    return { success: false };
  }
};

export default runExecutor;
