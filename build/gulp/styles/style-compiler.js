'use strict';

const { task, src, parallel, series, dest, watch } = require('gulp');
const { join } = require('path');
const { existsSync, readFileSync, writeFileSync, mkdirSync } = require('fs');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass')(require('sass-embedded'));

const CleanCss = require('clean-css');
const through = require('through2');
const autoPrefix = require('gulp-autoprefixer');
const parseArguments = require('minimist');

const cleanCssOptions = require('../../../themebuilder-scss/src/data/clean-css-options.json');
const { sizes, materialColors, materialModes, genericColors } = require('./theme-options');
const functions = require('../gulp-data-uri').sassFunctions;
const starLicense = require('../header-pipes').starLicense;

const cssArtifactsPath = join(process.cwd(), 'artifacts', 'css');

const DEFAULT_DEV_BUNDLE_NAMES = [
    'light',
    'light.compact',
    'dark',
    'contrast',
    'material.blue.light',
    'material.blue.light.compact',
    'material.blue.dark',
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
            functions
        }))
        .pipe(autoPrefix())
        .pipe(through.obj((file, enc, callback) => {
            const content = file.contents.toString();
            new CleanCss(cleanCssOptions).minify(content, (_, css) => {
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
        (theme === 'material' ? '.material' : '') +
        `.${color}` +
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

    sizes.forEach(size => {
        materialModes.forEach(mode => {
            materialColors.forEach(color => saveBundle('material', size, color, mode));
        });

        genericColors.forEach(color => saveBundle('generic', size, color));
    });
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
task('compile-themes-dev', () => compileBundles(DEFAULT_DEV_BUNDLE_NAMES.map(getBundleSourcePath)));

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

module.exports = {
    generateScssBundleName,
    generateScssBundles
};
