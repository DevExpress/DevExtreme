import * as path from 'path';
import { logger } from '@nx/devkit';
import * as terser from 'terser';
import { js as jsBeautify } from 'js-beautify';
import { createExecutor } from '../../utils/create-executor';
import { expandEntries } from '../../utils/glob-discovery';
import {
  ensureTrailingNewline,
  loadProjectPackageJson,
  normalizeEol,
  readFileText,
  writeFileText,
} from '../../utils/file-operations';
import { CompressExecutorSchema, CompressMode, CompressModeName } from './schema';
import { applyLicenseHeadersToDirectory } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';
import type { ApplyLicenseHeadersOption } from '../add-license-headers/schema';

const ERROR_APPLY_LICENSE_HEADERS_TARGET_SUBDIR_REQUIRED =
  'Compress: applyLicenseHeaders.targetSubdir is required to specify the directory to apply headers to';

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
    return { name: mode.name, eulaUrl: mode.eulaUrl ?? DEFAULT_EULA_URL, trailingNewline };
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

async function applyLicenseHeadersIfRequested(
  applyLicenseHeaders: ApplyLicenseHeadersOption | undefined,
  projectRoot: string,
): Promise<void> {
  if (!applyLicenseHeaders) {
    return;
  }
  if (!applyLicenseHeaders.targetSubdir) {
    throw new Error(ERROR_APPLY_LICENSE_HEADERS_TARGET_SUBDIR_REQUIRED);
  }
  const pkg = await loadProjectPackageJson(projectRoot);
  const templatePath = resolveLicenseTemplate(projectRoot, applyLicenseHeaders);
  const targetDir = path.join(projectRoot, applyLicenseHeaders.targetSubdir);
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

interface ResolvedCompress {
  projectRoot: string;
  files: string[];
  mode: CompressMode;
  modeName: string;
  applyLicenseHeaders?: ApplyLicenseHeadersOption;
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
      applyLicenseHeaders: options.applyLicenseHeaders,
    };
  },
  run: async ({ projectRoot, files, mode, modeName, applyLicenseHeaders }) => {
    for (const filePath of files) {
      await compressFile(filePath, mode);
      logger.verbose(`Compressed ${path.relative(projectRoot, filePath)} (${modeName})`);
    }
    await applyLicenseHeadersIfRequested(applyLicenseHeaders, projectRoot);
  },
});
