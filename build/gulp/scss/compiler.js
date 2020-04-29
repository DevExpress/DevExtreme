const sass = require('gulp-dart-sass');
const gulp = require('gulp');
const del = require('del');
const through = require('through2');
const path = require('path');
const fs = require('fs');
const replace = require('gulp-replace');
const config = require('./config');
const dataUri = require('../gulp-data-uri').gulpPipe;
const cleanCss = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const cleanCssOptions = require('../../../themebuilder-scss/dist/modules/clean-css-options');
const MetadataGenerator = require('../../../themebuilder-scss/dist/modules/metadata-generator');
const generatorScss = new MetadataGenerator();

const outputPath = config.outputPath;
const tmpPath = `${outputPath}/tmp`;

function compileBundle(bundleName) {
    return gulp.src(bundleName)
        .pipe(sass())
        .pipe(autoPrefix())
        .pipe(cleanCss(cleanCssOptions))
        .pipe(gulp.dest('artifacts/scss-css'));
}

function processDataUri() {
    return gulp.src(`${outputPath}/**/*`)
        .pipe(dataUri())
        .pipe(gulp.dest(tmpPath));
}

function compile() {
    return compileBundle([
        `${tmpPath}/bundles/*`,
        `!${tmpPath}/bundles/dx.ios7.default.scss`
    ]);
}

function clean() {
    return del(`${tmpPath}`);
}

gulp.task('compile-scss', gulp.series(
    processDataUri,
    compile,
    clean
));

// metadata/scss generator for themebuilder on scss
const context = require('../context');
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

gulp.task('style-compiler-tb-scss-assets', gulp.series(
    function generateScss() {
        const assetsPath = path.join(process.cwd(), 'themebuilder-scss', 'data', 'scss');
        return gulp.src('scss/**/*.scss')
            .pipe(through.obj((chunk, enc, callback) => {
                const content = generatorScss.collectMetadata(
                    process.cwd(),
                    chunk.path,
                    chunk.contents.toString()
                );

                chunk.contents = Buffer.from(content);
                callback(null, chunk);
            }))
            .pipe(replace(commentsRegex, ''))
            .pipe(dataUri())
            .pipe(gulp.dest(assetsPath));
    },
    function saveMetadata(callback) {
        const metadataPath = path.join(process.cwd(), 'themebuilder-scss', 'data', 'metadata', 'dx-theme-builder-metadata.ts');
        const metadata = generatorScss.getMetadata();
        const version = context.version.package;
        let meta = 'export const metadata: Array<MetaItem> = ' + JSON.stringify(metadata) + ';\n';
        meta += `export const version: string = '${version}';\n`;
        fs.mkdirSync(path.dirname(metadataPath), { recursive: true });
        fs.writeFileSync(metadataPath, meta);
        callback();
    }
));
