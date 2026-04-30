import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import * as fs from 'fs/promises';
import { glob } from 'glob';
import { ScssAssembleExecutorSchema } from './schema';
import { resolveProjectPath, toPosixPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readFileText, writeFileText, ensureDir } from '../../utils/file-operations';
import { copyDirectory } from '../../utils/copy-directory';

const DATA_URI_REGEX = /data-uri\((?:'(image\/svg\+xml;charset=UTF-8)',\s)?['"]?([^)'"]+)['"]?\)/g;

const SCSS_EXTENSIONS = new Set(['.scss', '.css']);

function encodeSvg(buffer: Buffer, svgEncoding?: string): string {
  const encoding = svgEncoding ?? 'image/svg+xml;charset=UTF-8';
  return `"data:${encoding},${encodeURIComponent(buffer.toString())}"`;
}

function encodeImage(buffer: Buffer, ext: string): string {
  return `"data:image/${ext};base64,${buffer.toString('base64')}"`;
}

async function inlineDataUri(content: string, scssRoot: string): Promise<string> {
  const matches = [...content.matchAll(DATA_URI_REGEX)];
  if (matches.length === 0) return content;

  const replacements = new Map<string, string>();

  await Promise.all(
    matches.map(async (match) => {
      const matchStr = match[0];
      if (replacements.has(matchStr)) return;

      const svgEncoding = match[1];
      const fileName = match[2];
      const filePath = path.resolve(scssRoot, fileName);
      const ext = path.extname(filePath).slice(1);
      const buffer = await fs.readFile(filePath);
      const escapedString =
        ext === 'svg' ? encodeSvg(buffer, svgEncoding) : encodeImage(buffer, ext);
      replacements.set(matchStr, `url(${escapedString})`);
    }),
  );

  return content.replace(DATA_URI_REGEX, (match) => replacements.get(match) ?? match);
}

async function copyScssWithInlineDataUri(
  scssPackagePath: string,
  outputDir: string,
): Promise<void> {
  const scssSourceDir = path.join(scssPackagePath, 'scss');
  const cwd = toPosixPath(scssSourceDir);
  const relPaths = await glob('**/*', { cwd, nodir: true });

  await Promise.all(
    relPaths.map(async (relPath) => {
      const src = path.join(scssSourceDir, relPath);
      const dest = path.join(outputDir, relPath);
      const ext = path.extname(relPath).toLowerCase();

      if (SCSS_EXTENSIONS.has(ext)) {
        const content = await readFileText(src);
        const inlined = await inlineDataUri(content, scssPackagePath);
        await writeFileText(dest, inlined);
      } else {
        await ensureDir(path.dirname(dest));
        await fs.copyFile(src, dest);
      }
    }),
  );
}

async function copyFonts(scssPackagePath: string, outputDir: string): Promise<void> {
  await copyDirectory(
    path.join(scssPackagePath, 'fonts'),
    path.join(outputDir, 'widgets/material/typography/fonts'),
  );
}

async function copyIcons(scssPackagePath: string, outputDir: string): Promise<void> {
  await copyDirectory(
    path.join(scssPackagePath, 'icons'),
    path.join(outputDir, 'widgets/base/icons'),
  );
}

const runExecutor: PromiseExecutor<ScssAssembleExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const scssPackagePath = path.resolve(projectRoot, options.scssPackagePath);
  const outputDir = path.resolve(projectRoot, options.outputDir);

  try {
    await copyScssWithInlineDataUri(scssPackagePath, outputDir);
    logger.verbose('Copied SCSS files with data-uri inlining');

    await copyFonts(scssPackagePath, outputDir);
    logger.verbose('Copied fonts to widgets/material/typography/fonts');

    await copyIcons(scssPackagePath, outputDir);
    logger.verbose('Copied icons to widgets/base/icons');

    return { success: true };
  } catch (error) {
    logError('ScssAssemble executor failed', error);
    return { success: false };
  }
};

export default runExecutor;
