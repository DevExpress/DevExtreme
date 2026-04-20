import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as terser from 'terser';
import { js as jsBeautify } from 'js-beautify';
import { CompressExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
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

async function minify(content: string, eulaUrl?: string): Promise<string> {
  const result = await terser.minify(content, {
    output: {
      ascii_only: true,
      comments: createCommentFilter(eulaUrl),
    },
  });

  return result.code || content;
}

async function beautify(content: string, eulaUrl?: string): Promise<string> {
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

  return jsBeautify(uglifyResult.code || content);
}

function stripDebugBlocks(content: string): string {
  return content.replace(REMOVE_DEBUG_REGEXP, '');
}

type CompressStrategy = (content: string, eulaUrl?: string) => Promise<string>;

const COMPRESS_STRATEGIES: Record<string, CompressStrategy> = {
  minify,
  beautify,
};

async function compressFile(
  filePath: string,
  mode: string,
  removeDebug: boolean,
  eulaUrl?: string,
): Promise<void> {
  const strategy = COMPRESS_STRATEGIES[mode];
  if (!strategy) {
    throw new Error(`Unknown compress mode: ${mode}`);
  }

  let content = await readFileText(filePath);
  if (removeDebug) {
    content = stripDebugBlocks(content);
  }
  content = await strategy(content, eulaUrl);
  content = ensureTrailingNewline(normalizeEol(content));
  await writeFileText(filePath, content);
}

const runExecutor: PromiseExecutor<CompressExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const { files, mode, removeDebug = false, eulaUrl } = options;

  try {
    for (const file of files) {
      const filePath = path.resolve(projectRoot, file);
      await compressFile(filePath, mode, removeDebug, eulaUrl);
      logger.verbose(`Compressed ${file} (${mode}${removeDebug ? ', removeDebug' : ''})`);
    }

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Compress failed: ${msg}`);
    return { success: false };
  }
};

export default runExecutor;
