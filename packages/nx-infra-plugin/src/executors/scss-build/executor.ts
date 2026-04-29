import { PromiseExecutor, logger } from '@nx/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import { glob } from 'glob';
import { ScssBuildExecutorSchema } from './schema';
import { normalizeGlobPathForWindows, resolveProjectPath } from '../../utils/path-resolver';
import { ensureDir, readFileText, writeFileText } from '../../utils/file-operations';

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

const EULA_URL = 'https://js.devexpress.com/Licensing/';

interface BuildDependencies {
  sass: any;
  postcss: any;
  autoprefixer: () => any;
  CleanCss: new (options: unknown) => { minify: (input: string) => { styles: string } };
  themeOptions: { getThemes: () => Array<[string, string, string, string?]> };
  cleanCssSanitizeOptions: unknown;
  cleanCssDevOptions: unknown;
  devextremeVersion: string;
}

type MinifyProfile = 'all' | 'ci';

function resolveDataUri(filePath: string, svgEncoding?: string): string {
  const ext = path.extname(filePath).replace('.', '');
  const data = fs.readFileSync(filePath);

  if (ext === 'svg') {
    const encoding = svgEncoding || 'image/svg+xml;charset=UTF-8';
    return `data:${encoding},${encodeURIComponent(data.toString())}`;
  }

  return `data:image/${ext};base64,${data.toString('base64')}`;
}

function createLicenseHeader(fileName: string, version: string): string {
  return [
    '/*!',
    `* DevExtreme (${fileName.replace(/\\/g, '/')})`,
    `* Version: ${version}`,
    `* Build date: ${new Date().toDateString()}`,
    '*',
    `* Copyright (c) 2012 - ${new Date().getFullYear()} Developer Express Inc. ALL RIGHTS RESERVED`,
    `* Read about DevExtreme licensing here: ${EULA_URL}`,
    '*/',
    '',
  ].join('\n');
}

function moveCharsetToTop(css: string): string {
  const match = css.match(/@charset\s+[^;]+;\s*/);
  if (!match) {
    return css;
  }

  const charset = match[0];
  const withoutCharset = css.replace(charset, '');
  return charset + withoutCharset;
}

function generateBundleName(theme: string, size: string, color: string, mode?: string): string {
  return 'dx'
    + (theme === 'material' || theme === 'fluent' ? `.${theme}` : '')
    + `.${color}`
    + (mode ? `.${mode}` : '')
    + (size === 'default' ? '' : '.compact')
    + '.scss';
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
    const content = template.replace('$COLOR', color).replace('$SIZE', size).replace('$MODE', mode || '');
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
    CleanCss: workspaceRequire('clean-css'),
    themeOptions: projectRequire(path.resolve(projectRoot, 'build/theme-options.cjs')) as {
      getThemes: () => Array<[string, string, string, string?]>;
    },
    cleanCssSanitizeOptions: projectRequire(path.resolve(projectRoot, 'build/clean-css-options.json')),
    cleanCssDevOptions: workspaceRequire(
      path.resolve(projectRoot, '../devextreme-themebuilder/src/data/clean-css-options.json'),
    ),
    devextremeVersion: workspaceRequire(path.resolve(projectRoot, '../devextreme/package.json')).version,
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

    const dataUri = resolveDataUri(absolutePath, encoding);
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
    from: undefined,
  });

  const minifierOptions = minifyProfile === 'ci' ? deps.cleanCssDevOptions : deps.cleanCssSanitizeOptions;
  const minifier = new deps.CleanCss(minifierOptions);
  const minified = minifier.minify(prefixed.css).styles;

  const outFileName = path.basename(sourceFile, '.scss') + '.css';
  const withHeader = createLicenseHeader(outFileName, deps.devextremeVersion) + moveCharsetToTop(minified);
  await writeFileText(path.join(outputDir, outFileName), withHeader);
}

async function copyAssets(projectRoot: string, cssOutputDir: string): Promise<void> {
  const fontsFrom = path.resolve(projectRoot, 'fonts');
  const iconsFrom = path.resolve(projectRoot, 'icons');
  const fontsTo = path.resolve(cssOutputDir, 'fonts');
  const iconsTo = path.resolve(cssOutputDir, 'icons');

  if (fs.existsSync(fontsFrom)) {
    await ensureDir(fontsTo);
    fs.cpSync(fontsFrom, fontsTo, { recursive: true });
  }

  if (fs.existsSync(iconsFrom)) {
    await ensureDir(iconsTo);
    fs.cpSync(iconsFrom, iconsTo, { recursive: true });
  }
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
): Promise<{ success: boolean }> {
  const bundlesDir = options.bundlesDir || DEFAULT_BUNDLES_DIR;
  const cssOutputDir = path.resolve(projectRoot, options.cssOutputDir || DEFAULT_CSS_OUTPUT_DIR);
  const watchDir = path.resolve(projectRoot, 'scss');
  const watchBundleNames = getWatchBundleNames(options);

  const rebuild = async (): Promise<void> => {
    await generateScssBundles(projectRoot, bundlesDir, deps);
    await ensureDir(cssOutputDir);

    const sources = resolveSourcesByBundleNames(projectRoot, bundlesDir, watchBundleNames);
    for (const source of sources) {
      await compileFile(source, cssOutputDir, 'all', deps, projectRoot);
    }

    await copyAssets(projectRoot, cssOutputDir);
  };

  await rebuild();
  logger.info('scss-build watch mode is watching for changes...');

  return await new Promise<{ success: boolean }>((resolve) => {
    let timer: NodeJS.Timeout | undefined;
    let busy = false;

    const scheduleRebuild = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        if (busy) {
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
        }
      }, 200);
    };

    const watcher = fs.watch(
      watchDir,
      { recursive: true },
      (_eventType, fileName) => {
        if (!fileName || !fileName.endsWith('.scss')) {
          return;
        }
        scheduleRebuild();
      },
    );

    const stopWatcher = () => {
      watcher.close();
      if (timer) {
        clearTimeout(timer);
      }
      resolve({ success: true });
    };

    process.once('SIGINT', stopWatcher);
    process.once('SIGTERM', stopWatcher);
  });
}

const runExecutor: PromiseExecutor<ScssBuildExecutorSchema> = async (options, context) => {
  const projectRoot = resolveProjectPath(context);

  try {
    const deps = loadDependencies(projectRoot);
    if (options.watch) {
      return await runWatchBuild(projectRoot, options, deps);
    }

    await runSingleBuild(projectRoot, options, deps);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`SCSS build failed: ${message}`);
    return { success: false };
  }
};

export default runExecutor;
