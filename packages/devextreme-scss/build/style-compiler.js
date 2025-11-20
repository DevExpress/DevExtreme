import gulp from 'gulp';
const { task, src, parallel, series, dest, watch } = gulp;

import { join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import replace from 'gulp-replace';
import plumber from 'gulp-plumber';
import gulpSass from 'gulp-sass';
import sassEmbedded from 'sass-embedded';
import CleanCss from 'clean-css';
import through from 'through2';
import parseArguments from 'minimist';
import autoprefixer from 'gulp-autoprefixer';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const cleanCssSanitizeOptions = require('./clean-css-options.json');
const cleanCssOptions = require('../../devextreme-themebuilder/src/data/clean-css-options.json');
const { starLicense } = require('../../devextreme/build/gulp/header-pipes.js');

const { getThemes } = require('./theme-options.cjs');
import { sassFunctions } from './gulp-data-uri.js';

const sass = gulpSass(sassEmbedded);

const cssArtifactsPath = join(process.cwd(), '..', 'devextreme', 'artifacts', 'css');

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

const getBundleSourcePath = name => `scss/bundles/dx.${name}.scss`;

const compileBundles = (bundles, isDevBundle) => {
    return src(bundles)
        .pipe(plumber(e => {
            console.log(e);
            this.emit('end');
        }))
        .on('data', (chunk) => console.log('Build: ', chunk.path))
        .pipe(sass({
            functions: sassFunctions
        }))
        .pipe(autoprefixer())
        .pipe(through.obj((file, enc, callback) => {
            const content = file.contents.toString();
            new CleanCss(isDevBundle ? cleanCssOptions : cleanCssSanitizeOptions).minify(content, (_, css) => {
                file.contents = new Buffer.from(css.styles);
                callback(null, file);
            });
        }))
        .pipe(starLicense())
        .pipe(replace(/([\s\S]*)(@charset.*?;\s)/, '$2$1'))
        .pipe(dest(cssArtifactsPath));
};

function saveBundleFile(folder, fileName, content) {
    const bundlePath = join(folder, fileName);
    if(!existsSync(folder)) mkdirSync(folder);
    writeFileSync(bundlePath, content);
}

function generateScssBundleName(theme, size, color, mode) {
    return 'dx' +
        (theme === 'material' || theme === 'fluent'
            ? `.${theme}`
            : '')
                + `.${color}` +
                (mode ? `.${mode}` : '') +
                (size === 'default' ? '' : '.compact') +
                '.scss';
}

function generateScssBundles(bundlesFolder, getBundleContent) {
    const saveBundle = (theme, size, color, mode) => {
        const bundleName = generateScssBundleName(theme, size, color, mode);
        const content = getBundleContent(theme, size, color, mode);

        saveBundleFile(bundlesFolder, bundleName, content);
    };

    getThemes().forEach(([theme, size, color, mode]) => saveBundle(theme, size, color, mode));
}

function createBundles(callback) {
    const bundlesFolder = join(process.cwd(), 'scss', 'bundles');
    const readTemplate = (theme) => readFileSync(join(__dirname, `bundle-template.${theme}.scss`), 'utf8');
    const getBundleContent = (theme, size, color, mode) => {
        const bundleTemplate = readTemplate(theme);
        const bundleContent = bundleTemplate
            .replace('$COLOR', color)
            .replace('$SIZE', size)
            .replace('$MODE', mode);
        return bundleContent;
    };

    generateScssBundles(bundlesFolder, getBundleContent);
    saveBundleFile(bundlesFolder, 'dx.common.scss', readTemplate('common'));

    if(callback) callback();
}

task('create-scss-bundles', createBundles);

task('copy-fonts-and-icons', () => {
    return src(['fonts/**/*', 'icons/**/*'], { base: '.' })
        .pipe(dest(cssArtifactsPath));
});

task('compile-themes-all', () => compileBundles(getBundleSourcePath('*')));
task('compile-themes-dev', () => compileBundles(DEFAULT_DEV_BUNDLE_NAMES.map(getBundleSourcePath), true));

task('style-compiler-themes', series(
    'create-scss-bundles',
    parallel(
        'compile-themes-all',
        'copy-fonts-and-icons'
    )
));

task('style-compiler-themes-ci', series(
    'create-scss-bundles',
    parallel(
        'compile-themes-dev',
        'copy-fonts-and-icons'
    )
));

task('style-compiler-themes-watch', () => {
    const args = parseArguments(process.argv);
    const bundlesArg = args['bundles'];

    const bundles = (
        bundlesArg
            ? bundlesArg.split(',')
            : DEFAULT_DEV_BUNDLE_NAMES)
        .map((bundle) => {
            const sourcePath = getBundleSourcePath(bundle);
            if(existsSync(sourcePath)) {
                return sourcePath;
            }
            console.log(`${sourcePath} file does not exists`);
            return null;
        });

    watch('scss/**/*', parallel(() => compileBundles(bundles), 'copy-fonts-and-icons'))
        .on('ready', () => console.log('style-compiler-themes task is watching for changes...'));
});
