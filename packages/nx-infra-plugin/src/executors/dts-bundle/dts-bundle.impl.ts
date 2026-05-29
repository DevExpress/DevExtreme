import * as path from 'path';
import { logger } from '@nx/devkit';
import { createExecutor } from '../../utils/create-executor';
import { loadProjectPackageJson, writeFileText } from '../../utils/file-operations';
import { concatFiles } from '../concatenate-files/concatenate-files.impl';
import { renderLicenseBannerForName } from '../add-license-headers/add-license-headers.impl';
import { DEFAULT_EULA_URL, resolveLicenseTemplate } from '../add-license-headers/defaults';
import type { PackageJson } from '../../utils/types';
import { DtsBundleExecutorSchema } from './schema';

const STRIP_DECLARE_GLOBAL = /^declare global\s*\{([\s\S]*?)^\}/gm;
const STRIP_JQUERY_INTERFACE_BODY = /(interface JQuery\b[\s\S]*?\{)[\s\S]+?(\})/gm;
const PACKAGE_FOOTER = '\nexport default DevExpress;';

interface ResolvedDtsBundle {
  pkg: PackageJson;
  templatePath: string;
  eulaUrl: string;
  resolvedSources: string[];
  artifactPath: string;
  packagePath: string;
  artifactRelative: string;
  packageRelative: string;
}

export default createExecutor<DtsBundleExecutorSchema, ResolvedDtsBundle>({
  name: 'DtsBundle',
  resolve: async (options, { projectRoot }) => {
    const pkg = await loadProjectPackageJson(projectRoot);
    const templatePath = resolveLicenseTemplate(projectRoot, options);
    const resolvedSources = options.bundleSources.map((source) =>
      path.resolve(projectRoot, source),
    );
    const artifactPath = path.resolve(projectRoot, options.artifactPath);
    const packagePath = path.resolve(projectRoot, options.packagePath);

    return {
      pkg,
      templatePath,
      eulaUrl: options.eulaUrl ?? DEFAULT_EULA_URL,
      resolvedSources,
      artifactPath,
      packagePath,
      artifactRelative: options.artifactPath,
      packageRelative: options.packagePath,
    };
  },
  run: async (resolved) => {
    const concatContent = await concatFiles({
      sourceFiles: resolved.resolvedSources,
      normalizeLineEndings: false,
    });

    const bannerInputs = {
      pkg: resolved.pkg,
      templatePath: resolved.templatePath,
      eulaUrl: resolved.eulaUrl,
    };

    const [artifactBanner, packageBanner] = await Promise.all([
      renderLicenseBannerForName(
        { ...bannerInputs, commentType: '!' },
        path.basename(resolved.artifactPath),
      ),
      renderLicenseBannerForName(
        { ...bannerInputs, commentType: '*' },
        path.basename(resolved.packagePath),
      ),
    ]);

    const artifactContent = artifactBanner + concatContent.replace(STRIP_DECLARE_GLOBAL, '$1');
    const packageContent =
      packageBanner + concatContent.replace(STRIP_JQUERY_INTERFACE_BODY, '$1$2') + PACKAGE_FOOTER;

    await Promise.all([
      writeFileText(resolved.artifactPath, artifactContent),
      writeFileText(resolved.packagePath, packageContent),
    ]);

    logger.verbose(`Written artifact bundle: ${resolved.artifactRelative}`);
    logger.verbose(`Written package bundle: ${resolved.packageRelative}`);
  },
});
