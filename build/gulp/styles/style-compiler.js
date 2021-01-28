'use strict';

const { task, src, parallel, series, dest, watch } = require('gulp');
const { join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const sass = require('gulp-dart-sass');

const fiber = require('fibers');
const cleanCss = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const parseArguments = require('minimist');

const cleanCssOptions = require('../../../themebuilder-scss/src/data/clean-css-options.json');
const functions = require('../gulp-data-uri').sassFunctions;
const starLicense = require('../header-pipes').starLicense;

const cssArtifactsPath = join(process.cwd(), 'artifacts', 'css');
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

const DEFAULT_DEV_BUNDLE_NAMES = [
    'common',
    'light',
    'material.blue.light'
];

const getBundleSourcePath = name => `scss/bundles/dx.${name}.scss`;

const compileBundles = (bundles) => {
    return src(bundles)
        .pipe(plumber(e => {
            console.log(e);
            this.emit('end');
        }))
        .on('data', (chunk) => console.log('Build: ', chunk.path))
        .pipe(sass({
            fiber,
            functions
        }))
        .pipe(autoPrefix())
        .pipe(cleanCss(cleanCssOptions))
        .pipe(replace(commentsRegex, ''))
        .pipe(starLicense())
        .pipe(replace(/([\s\S]*)(@charset.*?;\s)/, '$2$1'))
        .pipe(dest(cssArtifactsPath));
};

function createBundles(callback) {
    const sizes = ['default', 'compact'];
    const materialColors = ['blue', 'lime', 'orange', 'purple', 'teal'];
    const materialModes = ['light', 'dark'];
    const genericColors = ['carmine', 'contrast', 'dark', 'darkmoon', 'darkviolet', 'greenmist', 'light', 'softblue'];

    const saveBundleFile = (fileName, content) => {
        const bundlePath = join(process.cwd(), 'scss', 'bundles', fileName);
        writeFileSync(bundlePath, content);
    };

    const saveBundle = (theme, size, color, mode) => {
        const bundleTemplate = readFileSync(join(__dirname, `bundle-template.${theme}.scss`), 'utf8');
        const bundleContent = bundleTemplate
            .replace('$COLOR', color)
            .replace('$SIZE', size)
            .replace('$MODE', mode);

        const bundleName =
            'dx' +
            (theme === 'material' ? '.material' : '') +
            `.${color}` +
            (mode ? `.${mode}` : '') +
            (size === 'default' ? '' : '.compact') +
            '.scss';

        saveBundleFile(bundleName, bundleContent);
    };

    sizes.forEach(size => {
        materialModes.forEach(mode => {
            materialColors.forEach(color => saveBundle('material', size, color, mode));
        });

        genericColors.forEach(color => saveBundle('generic', size, color));
    });

    if(callback) callback();
}

task('create-scss-bundles', createBundles);

task('copy-fonts-and-icons', () => {
    return src(['fonts/**/*', 'icons/**/*'], { base: '.' })
        .pipe(dest(cssArtifactsPath));
});

task('style-compiler-themes', series(
    'create-scss-bundles',
    parallel(
        () => compileBundles(getBundleSourcePath('*')),
        'copy-fonts-and-icons'
    )
));

task('style-compiler-themes-ci', series(
    'create-scss-bundles',
    parallel(
        () => compileBundles(DEFAULT_DEV_BUNDLE_NAMES.map(getBundleSourcePath)),
        'copy-fonts-and-icons'
    )
));

task('style-compiler-themes-dev', () => {
    createBundles();
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
