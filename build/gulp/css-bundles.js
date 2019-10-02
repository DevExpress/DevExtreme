const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const through = require('through2');
const replace = require('gulp-replace');

const headerPipes = require('./header-pipes.js');

const outputDirectory = path.join(__dirname, '../../artifacts/npm/devextreme/less');
const sourcesPath = path.join(outputDirectory, 'sources');
const bundlesPath = path.join(outputDirectory, 'bundles');
const widgetsPath = path.join(outputDirectory, 'widgets');
const iconsPath = path.join(sourcesPath, 'widgets', 'base', 'icons');
const fontsPath = path.join(sourcesPath, 'widgets', 'material', 'fonts');

const ModulesHandler = require('../../themebuilder/modules/modules-handler');
const themesFileContent = fs.readFileSync(path.join(__dirname, '../../styles', 'theme.less'), 'utf8');
const widgets = new ModulesHandler().availableWidgets(themesFileContent);

gulp.task('copy-less', () => {
    return gulp.src([
        'themebuilder/data/less/**/*',
        '!themebuilder/data/less/bundles',
        '!themebuilder/data/less/bundles/*.less'
    ])
        .pipe(headerPipes.starLicense())
        .pipe(gulp.dest(sourcesPath));
});

gulp.task('copy-bundles', () => {
    return gulp.src([
        'themebuilder/data/less/bundles/*.less',
        '!themebuilder/data/less/bundles/dx.common.less'
    ])
        .pipe(replace('@import (once) "../theme.less";', '@import (once) "../sources/theme.less";'))
        .pipe(headerPipes.starLicense())
        .pipe(gulp.dest(bundlesPath));
});

gulp.task('copy-fonts', gulp.parallel(
    () => gulp.src('icons/**/*').pipe(gulp.dest(iconsPath)),
    () => gulp.src('fonts/**/*').pipe(gulp.dest(fontsPath))
));

gulp.task('create-widgets', () => {
    return gulp.src([
        'styles/bundles/*',
        '!styles/bundles/dx.common.less',
        '!styles/bundles/dx.ios7.default.less'
    ])
        .pipe(headerPipes.starLicense())
        .pipe(replace('@import (once) "../theme.less";', ''))
        .pipe(through.obj((chunk, enc, callback) => {
            const bundleName = path.basename(chunk.path);
            const themeName = bundleName.replace('dx.', '').replace('.less', '');
            const destDirectory = path.join(widgetsPath, themeName);
            fs.mkdirSync(destDirectory, { recursive: true });

            widgets.forEach((widget) => {
                let lessContent = chunk.contents;
                lessContent += '@import (once) "../../sources/core.less";\n';
                lessContent += widget.import.replace('./widgets', '../../sources/widgets');
                lessContent += '\n';
                const fileName = `dx.${widget.name}.less`;
                // headerPipes.starLicense set the bundle name in license header. Need to change.
                lessContent = lessContent.replace(bundleName, fileName);

                fs.writeFileSync(path.join(destDirectory, fileName), lessContent);
            });

            callback(null, chunk);
        }));
});

gulp.task('npm-less', gulp.parallel('copy-less', 'copy-bundles', 'copy-fonts', 'create-widgets'));
