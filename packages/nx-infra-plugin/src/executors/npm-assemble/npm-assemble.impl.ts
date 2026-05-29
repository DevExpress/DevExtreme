import * as path from 'path';
import * as fs from 'fs/promises';
import { glob } from 'glob';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { toPosixPath } from '../../utils/path-resolver';
import {
  copyFile,
  ensureDir,
  loadProjectPackageJson,
  readFileText,
  writeFileText,
} from '../../utils/file-operations';
import { copyDirectory } from '../copy-files/copy-files.impl';
import { applyLicenseHeadersToDirectory } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';
import type { PackageJson } from '../../utils/types';
import {
  NpmAssembleExecutorSchema,
  NpmAssembleFlattenStep,
  NpmAssembleMetadataFile,
  NpmAssembleRename,
} from './schema';

function buildSrcExcludes(
  baseExcludes: readonly string[],
  excludeLicenseValidator: string | undefined,
): string[] {
  return excludeLicenseValidator ? [...baseExcludes, excludeLicenseValidator] : [...baseExcludes];
}

function buildSrcHeaderExcludes(srcExcludes: readonly string[]): string[] {
  return [...srcExcludes, 'dist/**/*', 'bin/**/*', 'license/**/*'];
}

async function copySourceJs(
  transpiledDir: string,
  outputDir: string,
  excludes: readonly string[],
): Promise<void> {
  await copyDirectory(transpiledDir, outputDir, {
    include: ['**/*.js'],
    exclude: [...excludes],
  });
}

async function applyRenameLicenseValidator(
  outputDir: string,
  rename: NpmAssembleRename,
): Promise<void> {
  const cwd = toPosixPath(outputDir);
  const matches = await glob(rename.fromGlob, { cwd, absolute: true });
  await Promise.all(
    matches.map(async (sourcePath) => {
      const targetPath = path.join(path.dirname(sourcePath), rename.toBasename);
      try {
        await fs.rename(sourcePath, targetPath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error;
        }
      }
    }),
  );
}

async function copyEsmPackageJsonFiles(
  transpiledDir: string,
  outputDir: string,
  nestedPackageJsonExcludes: readonly string[],
): Promise<void> {
  await copyDirectory(transpiledDir, outputDir, {
    include: ['**/*.json'],
    exclude: [...nestedPackageJsonExcludes],
  });
}

async function copyJsSrcJsonFiles(
  jsSrcDir: string,
  outputDir: string,
  nestedPackageJsonExcludes: readonly string[],
): Promise<void> {
  await copyDirectory(jsSrcDir, outputDir, {
    include: ['**/*.json'],
    exclude: [...nestedPackageJsonExcludes],
  });
}

async function copyAndNormalizeFiles(
  sourceDir: string,
  destinationDir: string,
  pattern: string,
): Promise<void> {
  const cwd = toPosixPath(sourceDir);
  const relativePaths = await glob(pattern, { cwd, nodir: true });
  await Promise.all(
    relativePaths.map(async (relative) => {
      const destination = path.join(destinationDir, relative);
      await ensureDir(path.dirname(destination));
      await fs.copyFile(path.join(sourceDir, relative), destination);
      const content = await readFileText(destination);
      const lfContent = content.replace(/\r\n/g, '\n');
      const withTrailingLf = lfContent.endsWith('\n') ? lfContent : `${lfContent}\n`;
      await writeFileText(destination, withTrailingLf);
    }),
  );
}

async function copyLicenseFiles(licenseSrcDir: string, outputDir: string): Promise<void> {
  await copyAndNormalizeFiles(licenseSrcDir, path.join(outputDir, 'license'), '**/*');
}

async function copyNpmBinFiles(npmBinDir: string, outputDir: string): Promise<void> {
  await copyAndNormalizeFiles(npmBinDir, path.join(outputDir, 'bin'), '*.js');
}

async function copyDistFiles(
  artifactsDir: string,
  outputDir: string,
  excludes: readonly string[],
): Promise<void> {
  await copyDirectory(artifactsDir, path.join(outputDir, 'dist'), {
    include: ['**/*'],
    exclude: [...excludes],
  });
}

interface ResolvedMetadataFile {
  from: string;
  to: string;
}

interface ResolvedFlattenStep {
  from: string;
  to: string;
}

interface ResolvedNpmAssemble {
  pkg: PackageJson;
  templatePath: string;
  eulaUrl: string;
  transpiledDir: string;
  jsSrcDir: string;
  licenseSrcDir: string;
  npmBinDir: string;
  webpackConfigSrc: string;
  artifactsDir: string;
  outputDir: string;
  metadataFiles: ResolvedMetadataFile[];
  flattenSteps: ResolvedFlattenStep[];
  srcExcludes: string[];
  srcHeaderExcludes: string[];
  distExcludes: readonly string[];
  nestedPackageJsonExcludes: readonly string[];
  renameLicenseValidator?: NpmAssembleRename;
}

function resolveMetadataFiles(
  entries: NpmAssembleMetadataFile[] | undefined,
  projectRoot: string,
  outputDir: string,
): ResolvedMetadataFile[] {
  if (!entries) {
    return [];
  }
  return entries.map((entry) => ({
    from: path.resolve(projectRoot, entry.from),
    to: path.resolve(outputDir, entry.to),
  }));
}

function resolveFlattenSteps(
  entries: NpmAssembleFlattenStep[] | undefined,
  projectRoot: string,
  outputDir: string,
): ResolvedFlattenStep[] {
  if (!entries) {
    return [];
  }
  return entries.map((entry) => ({
    from: path.resolve(outputDir, entry.from),
    to: path.resolve(projectRoot, entry.to),
  }));
}

async function copyMetadataFiles(entries: ResolvedMetadataFile[]): Promise<void> {
  await Promise.all(entries.map((entry) => copyFile(entry.from, entry.to)));
}

async function applyFlattenSteps(entries: ResolvedFlattenStep[]): Promise<void> {
  for (const entry of entries) {
    await copyDirectory(entry.from, entry.to);
  }
}

export default createExecutor<NpmAssembleExecutorSchema, ResolvedNpmAssemble>({
  name: 'NpmAssemble',
  resolve: async (options, { projectRoot }) => {
    const pkg = await loadProjectPackageJson(projectRoot);
    const templatePath = resolveLicenseTemplate(projectRoot, options);
    const outputDir = path.resolve(projectRoot, options.outputDir);
    const srcExcludes = buildSrcExcludes(
      options.srcExcludes ?? [],
      options.excludeLicenseValidator,
    );

    return {
      pkg,
      templatePath,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      transpiledDir: path.resolve(projectRoot, options.transpiledDir),
      jsSrcDir: path.resolve(projectRoot, options.jsSrcDir),
      licenseSrcDir: path.resolve(projectRoot, options.licenseSrcDir),
      npmBinDir: path.resolve(projectRoot, options.npmBinDir),
      webpackConfigSrc: path.resolve(projectRoot, options.webpackConfig),
      artifactsDir: path.resolve(projectRoot, options.artifactsDir),
      outputDir,
      metadataFiles: resolveMetadataFiles(options.metadataFiles, projectRoot, outputDir),
      flattenSteps: resolveFlattenSteps(options.flatten, projectRoot, outputDir),
      srcExcludes,
      srcHeaderExcludes: buildSrcHeaderExcludes(srcExcludes),
      distExcludes: options.distExcludes ?? [],
      nestedPackageJsonExcludes: options.nestedPackageJsonExcludes ?? [],
      renameLicenseValidator: options.renameLicenseValidator,
    };
  },
  run: async (resolved) => {
    const webpackConfigDestination = path.join(
      resolved.outputDir,
      'bin',
      path.basename(resolved.webpackConfigSrc),
    );

    await Promise.all([
      copySourceJs(resolved.transpiledDir, resolved.outputDir, resolved.srcExcludes),
      copyEsmPackageJsonFiles(
        resolved.transpiledDir,
        resolved.outputDir,
        resolved.nestedPackageJsonExcludes,
      ),
      copyJsSrcJsonFiles(resolved.jsSrcDir, resolved.outputDir, resolved.nestedPackageJsonExcludes),
      copyLicenseFiles(resolved.licenseSrcDir, resolved.outputDir),
      copyNpmBinFiles(resolved.npmBinDir, resolved.outputDir),
      copyFile(resolved.webpackConfigSrc, webpackConfigDestination),
      copyDistFiles(resolved.artifactsDir, resolved.outputDir, resolved.distExcludes),
    ]);
    logger.verbose('Assembled npm package contents');

    if (resolved.renameLicenseValidator) {
      await applyRenameLicenseValidator(resolved.outputDir, resolved.renameLicenseValidator);
      logger.verbose('Renamed license validator');
    }

    await applyLicenseHeadersToDirectory({
      targetDir: resolved.outputDir,
      pkg: resolved.pkg,
      templatePath: resolved.templatePath,
      eulaUrl: resolved.eulaUrl,
      commentType: '*',
      includePatterns: ['**/*.js'],
      excludePatterns: resolved.srcHeaderExcludes,
      filenameMode: 'relative',
    });
    logger.verbose('Applied star-license banners to source JS files');

    if (resolved.metadataFiles.length > 0) {
      await copyMetadataFiles(resolved.metadataFiles);
      logger.verbose('Copied metadata files to output directory');
    }

    if (resolved.flattenSteps.length > 0) {
      await applyFlattenSteps(resolved.flattenSteps);
      logger.verbose('Applied flatten steps from output directory');
    }
  },
});
