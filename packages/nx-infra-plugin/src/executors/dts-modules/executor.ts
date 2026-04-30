import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { glob } from 'glob';
import { DtsModulesExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readJson, readFileText, writeFileText } from '../../utils/file-operations';
import { copyDirectory } from '../../utils/copy-directory';
import { buildLicenseBannerRenderer } from '../../utils/license-banner';
import { stripDebug } from '../../utils/debug-strip';

interface PackageJson {
  name: string;
  version: string;
  repository?: string | { url?: string };
}

const runExecutor: PromiseExecutor<DtsModulesExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const sourceDir = path.resolve(projectRoot, options.sourceDir);
  const outputDir = path.resolve(projectRoot, options.outputDir);
  const legacyTemplatesDir = path.resolve(projectRoot, options.legacyTemplatesDir);
  const licenseTemplatePath = path.resolve(projectRoot, options.licenseTemplateFile);

  try {
    await copyDirectory(legacyTemplatesDir, outputDir);
    logger.verbose(`Copied legacy templates from ${options.legacyTemplatesDir}`);

    await copyDirectory(sourceDir, outputDir, { include: ['**/*.d.ts'] });
    logger.verbose(`Copied .d.ts files from ${options.sourceDir} to ${options.outputDir}`);

    let pkg: PackageJson;
    try {
      pkg = await readJson<PackageJson>(path.join(projectRoot, 'package.json'));
    } catch (pkgError) {
      logError('Failed to read package.json', pkgError);
      return { success: false };
    }

    const bannerBase = { templatePath: licenseTemplatePath, pkg, eulaUrl: options.eulaUrl };

    const dtsFiles = await glob('**/*.d.ts', { cwd: outputDir, nodir: true, absolute: true });
    const jsFiles = await glob('bundles/*.js', { cwd: outputDir, nodir: true, absolute: true });

    const renderBanner = await buildLicenseBannerRenderer({ ...bannerBase, commentType: '*' });

    await Promise.all([
      ...dtsFiles.map(async (filePath) => {
        const fileRelative = path.relative(outputDir, filePath).replace(/\\/g, '/');
        const banner = renderBanner(fileRelative);
        const content = await readFileText(filePath);
        await writeFileText(filePath, banner + content);
      }),
      ...jsFiles.map(async (filePath) => {
        const fileRelative = path.basename(filePath);
        const banner = renderBanner(fileRelative);
        const content = await readFileText(filePath);
        await writeFileText(filePath, banner + content);
      }),
    ]);
    logger.verbose('Applied star-license banners');

    const dtsNonBundles = dtsFiles.filter((f) => {
      const rel = path.relative(outputDir, f).replace(/\\/g, '/');
      return !rel.startsWith('bundles/');
    });

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

    return { success: true };
  } catch (error) {
    logError('DtsModules executor failed', error);
    return { success: false };
  }
};

export default runExecutor;
