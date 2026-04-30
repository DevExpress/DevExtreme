import { PromiseExecutor, logger } from '@nx/devkit';
import * as path from 'path';
import { DtsBundleExecutorSchema } from './schema';
import { resolveProjectPath } from '../../utils/path-resolver';
import { logError } from '../../utils/error-handler';
import { readJson, writeFileText } from '../../utils/file-operations';
import { concatFiles } from '../../utils/concat-content';
import { buildLicenseBannerRenderer } from '../../utils/license-banner';

interface PackageJson {
  name: string;
  version: string;
  repository?: string | { url?: string };
}

const runExecutor: PromiseExecutor<DtsBundleExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);
  const licenseTemplatePath = path.resolve(projectRoot, options.licenseTemplateFile);

  let pkg: PackageJson;
  try {
    pkg = await readJson<PackageJson>(path.join(projectRoot, 'package.json'));
  } catch (error) {
    logError('Failed to read package.json', error);
    return { success: false };
  }

  try {
    const resolvedSources = options.bundleSources.map((s) => path.resolve(projectRoot, s));

    const concatContent = await concatFiles({
      sourceFiles: resolvedSources,
      normalizeLineEndings: false,
    });

    const bannerBase = { templatePath: licenseTemplatePath, pkg, eulaUrl: options.eulaUrl };

    const [renderArtifactBanner, renderPackageBanner] = await Promise.all([
      buildLicenseBannerRenderer({ ...bannerBase, commentType: '!' }),
      buildLicenseBannerRenderer({ ...bannerBase, commentType: '*' }),
    ]);

    const artifactPath = path.resolve(projectRoot, options.artifactPath);
    const artifactContent = concatContent.replace(/^declare global\s*\{([\s\S]*?)^\}/gm, '$1');
    const artifactBanner = renderArtifactBanner(path.basename(artifactPath));
    await writeFileText(artifactPath, artifactBanner + artifactContent);
    logger.verbose(`Written artifact bundle: ${options.artifactPath}`);

    const packagePath = path.resolve(projectRoot, options.packagePath);
    const packageContent = concatContent.replace(
      /(interface JQuery\b[\s\S]*?\{)[\s\S]+?(\})/gm,
      '$1$2',
    );
    const packageBanner = renderPackageBanner(path.basename(packagePath));
    await writeFileText(
      packagePath,
      packageBanner + packageContent + '\nexport default DevExpress;',
    );
    logger.verbose(`Written package bundle: ${options.packagePath}`);

    return { success: true };
  } catch (error) {
    logError('DtsBundle executor failed', error);
    return { success: false };
  }
};

export default runExecutor;
