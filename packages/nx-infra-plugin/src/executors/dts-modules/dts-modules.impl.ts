import * as path from 'path';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import { loadProjectPackageJson, readFileText, writeFileText } from '../../utils/file-operations';
import { copyDirectory } from '../copy-files/copy-files.impl';
import { applyLicenseHeadersToFiles } from '../add-license-headers/add-license-headers.impl';
import { stripDebug } from '../compress/compress.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';
import type { PackageJson } from '../../utils/types';
import { DtsModulesExecutorSchema } from './schema';

const BUNDLES_PREFIX = 'bundles/';
const BACKSLASH_REGEX = /\\/g;
const FORWARD_SLASH = '/';

interface ResolvedDtsModules {
  pkg: PackageJson;
  templatePath: string;
  eulaUrl: string;
  sourceDir: string;
  outputDir: string;
  templatesDir: string;
  sourceDirRelative: string;
  outputDirRelative: string;
  templatesDirRelative: string;
}

function toRelativePosix(baseDir: string, filePath: string): string {
  return path.relative(baseDir, filePath).replace(BACKSLASH_REGEX, FORWARD_SLASH);
}

export default createExecutor<DtsModulesExecutorSchema, ResolvedDtsModules>({
  name: 'DtsModules',
  resolve: async (options, { projectRoot }) => {
    const pkg = await loadProjectPackageJson(projectRoot);
    const templatePath = resolveLicenseTemplate(projectRoot, options);

    return {
      pkg,
      templatePath,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      sourceDir: path.resolve(projectRoot, options.sourceDir),
      outputDir: path.resolve(projectRoot, options.outputDir),
      templatesDir: path.resolve(projectRoot, options.templatesDir),
      sourceDirRelative: options.sourceDir,
      outputDirRelative: options.outputDir,
      templatesDirRelative: options.templatesDir,
    };
  },
  run: async (resolved) => {
    await copyDirectory(resolved.templatesDir, resolved.outputDir);
    logger.verbose(`Copied templates from ${resolved.templatesDirRelative}`);

    await copyDirectory(resolved.sourceDir, resolved.outputDir, { include: ['**/*.d.ts'] });
    logger.verbose(
      `Copied .d.ts files from ${resolved.sourceDirRelative} to ${resolved.outputDirRelative}`,
    );

    const outputCwd = toPosixPath(resolved.outputDir);
    const dtsFiles = await glob('**/*.d.ts', { cwd: outputCwd, nodir: true, absolute: true });

    const templatesCwd = toPosixPath(resolved.templatesDir);
    const templateJsRelativePaths = await glob('**/*.js', {
      cwd: templatesCwd,
      nodir: true,
    });
    const jsFiles = templateJsRelativePaths.map((relative) =>
      path.resolve(resolved.outputDir, relative),
    );

    const bannerInputs = {
      pkg: resolved.pkg,
      templatePath: resolved.templatePath,
      eulaUrl: resolved.eulaUrl,
      commentType: '*' as const,
    };

    await Promise.all([
      applyLicenseHeadersToFiles({
        ...bannerInputs,
        files: dtsFiles,
        baseDir: resolved.outputDir,
        filenameMode: 'relative',
      }),
      applyLicenseHeadersToFiles({
        ...bannerInputs,
        files: jsFiles,
        baseDir: resolved.outputDir,
        filenameMode: 'basename',
      }),
    ]);
    logger.verbose('Applied star-license banners');

    const dtsNonBundles = dtsFiles.filter(
      (filePath) => !toRelativePosix(resolved.outputDir, filePath).startsWith(BUNDLES_PREFIX),
    );

    await Promise.all(
      dtsNonBundles.map(async (filePath) => {
        const content = await readFileText(filePath);
        const stripped = stripDebug(content);
        if (stripped !== content) {
          await writeFileText(filePath, stripped);
        }
      }),
    );
    logger.verbose('Stripped debug blocks from .d.ts files');
  },
});
