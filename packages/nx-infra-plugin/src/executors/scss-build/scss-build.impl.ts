import { logger } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { glob } from 'glob';
import { createExecutor } from '../../utils/create-executor';
import { normalizeGlobPathForWindows } from '../../utils/path-resolver';
import { ensureDir, exists, readFileText, writeFileText } from '../../utils/file-operations';
import { encodeDataUriContent } from '../../utils/scss-data-uri';
import { DEFAULT_EULA_URL } from '../add-license-headers/defaults';
import { copyDirectory } from '../copy-files/copy-files.impl';
import { ScssBuildExecutorSchema } from './schema';

const DEFAULT_BUNDLES_DIR = './scss/bundles';
const DEFAULT_CSS_OUTPUT_DIR = '../devextreme/artifacts/css';
const DEFAULT_DEV_BUNDLE_NAMES = [
  'light',
  'light.compact',
  'dark',
  'contrast',
  'material.blue.light',
  'material.blue.light.compact',
  'material.blue.dark',
  'fluent.blue.light',
  'fluent.blue.light.compact',
  'fluent.blue.dark',
  'fluent.saas.light',
  'fluent.saas.dark',
];

interface BuildDependencies {
  sass: any;
  postcss: any;
  autoprefixer: (options?: { overrideBrowserslist?: string[] }) => any;
  chokidar: {
    watch: (
      paths: string | string[],
      options?: Record<string, unknown>,
    ) => {
      on: (event: string, handler: (...args: any[]) => void) => unknown;
      close: () => Promise<void> | void;
    };
  };
  CleanCss: new (options: unknown) => { minify: (input: string) => { styles: string } };
  themeOptions: { getThemes: () => Array<[string, string, string, string?]> };
  cleanCssSanitizeOptions: unknown;
  cleanCssDevOptions: unknown;
  devextremeVersion: string;
}

type MinifyProfile = 'all' | 'ci';

interface ResolvedScssBuild {
  projectRoot: string;
  options: ScssBuildExecutorSchema;
  deps: BuildDependencies;
}

function readFileDataUri(filePath: string, svgEncoding?: string): string {
  const buffer = fs.readFileSync(filePath);
  return encodeDataUriContent(buffer, filePath, svgEncoding);
}

function createStarLicenseHeader(fileName: string, version: string): string {
  return [
    '/**',
    `* DevExtreme (${fileName.replace(/\\/g, '/')})`,
    `* Version: ${version}`,
    `* Build date: ${new Date().toDateString()}`,
    '*',
    `* Copyright (c) 2012 - ${new Date().getFullYear()} Developer Express Inc. ALL RIGHTS RESERVED`,
    `* Read about DevExtreme licensing here: ${DEFAULT_EULA_URL}`,
    '*/',
    '',
  ].join('\n');
}

function prependLicenseAndMoveCharsetFirst(minifiedCss: string, license: string): string {
  const withLicense = `${license}${minifiedCss}`;
  return withLicense.replace(/([\s\S]*)(@charset[^;]+;\s*)/, '$2$1');
}

function generateBundleName(theme: string, size: string, color: string, mode?: string): string {
  return (
    'dx'
    + (theme === 'material' || theme === 'fluent' ? `.${theme}` : '')
    + `.${color}`
    + (mode ? `.${mode}` : '')
    + (size === 'default' ? '' : '.compact')
    + '.scss'
  );
}

async function generateScssBundles(
  projectRoot: string,
  bundlesDir: string,
  deps: BuildDependencies,
): Promise<void> {
  const resolvedBundlesDir = path.resolve(projectRoot, bundlesDir);
  const buildDir = path.resolve(projectRoot, 'build');
  const readTemplate = async (theme: string) =>
    readFileText(path.join(buildDir, `bundle-template.${theme}.scss`));

  await ensureDir(resolvedBundlesDir);

  const themes = deps.themeOptions.getThemes();
  for (const [theme, size, color, mode] of themes) {
    const template = await readTemplate(theme);
    const content = template
      .replace('$COLOR', color)
      .replace('$SIZE', size)
      .replace('$MODE', mode || '');
    const fileName = generateBundleName(theme, size, color, mode);
    await writeFileText(path.join(resolvedBundlesDir, fileName), content);
  }

  const commonTemplate = await readTemplate('common');
  await writeFileText(path.join(resolvedBundlesDir, 'dx.common.scss'), commonTemplate);
}

function loadDependencies(projectRoot: string): BuildDependencies {
  const projectRequire = createRequire(path.join(projectRoot, 'package.json'));
  const workspaceRequire = createRequire(path.join(projectRoot, '..', '..', 'package.json'));

  return {
    sass: projectRequire('sass-embedded'),
    postcss: workspaceRequire('postcss'),
    autoprefixer: workspaceRequire('autoprefixer'),
    chokidar: workspaceRequire('chokidar'),
    CleanCss: workspaceRequire('clean-css'),
    themeOptions: projectRequire(path.resolve(projectRoot, 'build/theme-options.cjs')) as {
      getThemes: () => Array<[string, string, string, string?]>;
    },
    cleanCssSanitizeOptions: projectRequire(
      path.resolve(projectRoot, 'build/clean-css-options.json'),
    ),
    cleanCssDevOptions: workspaceRequire(
      path.resolve(projectRoot, '../devextreme-themebuilder/src/data/clean-css-options.json'),
    ),
    devextremeVersion: workspaceRequire(path.resolve(projectRoot, '../devextreme/package.json'))
      .version,
  };
}

function normalizeBundlesOption(bundles?: string[] | string): string[] | undefined {
  if (!bundles) {
    return undefined;
  }

  if (Array.isArray(bundles)) {
    return bundles;
  }

  return bundles
    .split(',')
    .map((bundle) => bundle.trim())
    .filter(Boolean);
}

function resolveSourceFiles(
  projectRoot: string,
  options: ScssBuildExecutorSchema,
): Promise<string[]> {
  const bundlesDir = path.resolve(projectRoot, options.bundlesDir || DEFAULT_BUNDLES_DIR);

  if (options.mode === 'ci') {
    const bundleNames = options.devBundles || DEFAULT_DEV_BUNDLE_NAMES;
    return Promise.resolve(bundleNames.map((name) => path.join(bundlesDir, `dx.${name}.scss`)));
  }

  const pattern = normalizeGlobPathForWindows(path.join(bundlesDir, 'dx.*.scss'));
  return glob(pattern, { nodir: true });
}

function createDataUriFunction(projectRoot: string, sass: any): (args: any[]) => any {
  return (args: any[]) => {
    const argList = args[0].asList;
    const hasEncoding = argList.size === 2;
    const encoding = hasEncoding ? argList.get(0).assertString().text : undefined;
    const url = argList.get(hasEncoding ? 1 : 0).assertString().text;
    const absolutePath = path.resolve(projectRoot, url);

    const dataUri = readFileDataUri(absolutePath, encoding);
    return new sass.SassString(`url("${dataUri}")`, { quotes: false });
  };
}

async function compileFile(
  sourceFile: string,
  outputDir: string,
  minifyProfile: MinifyProfile,
  deps: BuildDependencies,
  projectRoot: string,
): Promise<void> {
  const dataUriFunction = createDataUriFunction(projectRoot, deps.sass);
  const compiled = deps.sass.compile(sourceFile, {
    functions: {
      'data-uri($args...)': dataUriFunction,
    },
  });

  const postcssFactory = (deps.postcss as unknown as { default?: any }).default || deps.postcss;
  const prefixed = await postcssFactory([deps.autoprefixer()]).process(compiled.css, {
    from: sourceFile,
  });

  const minifierOptions =
    minifyProfile === 'ci' ? deps.cleanCssDevOptions : deps.cleanCssSanitizeOptions;
  const minifier = new deps.CleanCss(minifierOptions);
  const minified = minifier.minify(prefixed.css).styles;

  const outFileName = path.basename(sourceFile, '.scss') + '.css';
  const license = createStarLicenseHeader(outFileName, deps.devextremeVersion);
  const withHeader = prependLicenseAndMoveCharsetFirst(minified, license);
  await writeFileText(path.join(outputDir, outFileName), withHeader);
}

async function copyThemeAssets(projectRoot: string, cssOutputDir: string): Promise<void> {
  const fontsFrom = path.resolve(projectRoot, 'fonts');
  const iconsFrom = path.resolve(projectRoot, 'icons');
  const fontsTo = path.resolve(cssOutputDir, 'fonts');
  const iconsTo = path.resolve(cssOutputDir, 'icons');

  await Promise.all([
    (async () => {
      if (await exists(fontsFrom)) {
        await copyDirectory(fontsFrom, fontsTo);
      }
    })(),
    (async () => {
      if (await exists(iconsFrom)) {
        await copyDirectory(iconsFrom, iconsTo);
      }
    })(),
  ]);
}

function resolveSourcesByBundleNames(
  projectRoot: string,
  bundlesDir: string,
  bundleNames: string[],
): string[] {
  const resolvedBundlesDir = path.resolve(projectRoot, bundlesDir);
  const sources: string[] = [];

  for (const bundleName of bundleNames) {
    const source = path.join(resolvedBundlesDir, `dx.${bundleName}.scss`);
    if (fs.existsSync(source)) {
      sources.push(source);
    } else {
      logger.warn(`${source} file does not exist`);
    }
  }

  return sources;
}

function getWatchBundleNames(options: ScssBuildExecutorSchema): string[] {
  const explicitBundles = normalizeBundlesOption(options.bundles);
  if (explicitBundles && explicitBundles.length > 0) {
    return explicitBundles;
  }

  return options.devBundles || DEFAULT_DEV_BUNDLE_NAMES;
}

async function runSingleBuild(
  projectRoot: string,
  options: ScssBuildExecutorSchema,
  deps: BuildDependencies,
): Promise<void> {
  const bundlesDir = options.bundlesDir || DEFAULT_BUNDLES_DIR;
  const cssOutputDir = path.resolve(projectRoot, options.cssOutputDir || DEFAULT_CSS_OUTPUT_DIR);

  await generateScssBundles(projectRoot, bundlesDir, deps);
  await ensureDir(cssOutputDir);

  const sources = await resolveSourceFiles(projectRoot, options);
  const existingSources = sources.filter((source) => fs.existsSync(source));
  const minifyProfile: MinifyProfile = options.mode === 'ci' ? 'ci' : 'all';

  for (const source of existingSources) {
    logger.verbose(`Compiling ${source}`);
    await compileFile(source, cssOutputDir, minifyProfile, deps, projectRoot);
  }
}

async function runWatchBuild(
  projectRoot: string,
  options: ScssBuildExecutorSchema,
  deps: BuildDependencies,
): Promise<void> {
  const bundlesDir = options.bundlesDir || DEFAULT_BUNDLES_DIR;
  const cssOutputDir = path.resolve(projectRoot, options.cssOutputDir || DEFAULT_CSS_OUTPUT_DIR);
  const watchDir = path.resolve(projectRoot, 'scss');
  const watchBundleNames = getWatchBundleNames(options);
  const minifyProfile: MinifyProfile = options.mode === 'ci' ? 'ci' : 'all';

  const rebuild = async (): Promise<void> => {
    await generateScssBundles(projectRoot, bundlesDir, deps);
    await ensureDir(cssOutputDir);

    const sources = resolveSourcesByBundleNames(projectRoot, bundlesDir, watchBundleNames);
    for (const source of sources) {
      await compileFile(source, cssOutputDir, minifyProfile, deps, projectRoot);
    }

    await copyThemeAssets(projectRoot, cssOutputDir);
  };

  await rebuild();
  logger.info('scss-build watch mode is watching for changes...');

  await new Promise<void>((resolve) => {
    let timer: NodeJS.Timeout | undefined;
    let busy = false;
    let pending = false;

    const runRebuild = async (): Promise<void> => {
      if (busy) {
        pending = true;
        return;
      }

      busy = true;
      try {
        await rebuild();
        logger.info('scss-build watch: rebuild complete');
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`scss-build watch rebuild failed: ${message}`);
      } finally {
        busy = false;
        if (pending) {
          pending = false;
          void runRebuild();
        }
      }
    };

    const scheduleRebuild = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        void runRebuild();
      }, 200);
    };

    const watcher = deps.chokidar.watch(path.join(watchDir, '**/*.scss'), {
      ignoreInitial: true,
    });
    watcher.on('all', scheduleRebuild);

    const stopWatcher = () => {
      void watcher.close();
      if (timer) {
        clearTimeout(timer);
      }
      resolve();
    };

    process.once('SIGINT', stopWatcher);
    process.once('SIGTERM', stopWatcher);
  });
}

export default createExecutor<ScssBuildExecutorSchema, ResolvedScssBuild>({
  name: 'ScssBuild',
  resolve: (options, { projectRoot }) => ({
    projectRoot,
    options,
    deps: loadDependencies(projectRoot),
  }),
  run: async ({ projectRoot, options, deps }) => {
    if (options.watch) {
      await runWatchBuild(projectRoot, options, deps);
      return;
    }

    await runSingleBuild(projectRoot, options, deps);
  },
});
