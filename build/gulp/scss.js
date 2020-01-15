const gulp = require('gulp');
const path = require('path');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const del = require('del');
const sass = require('gulp-dart-sass');
const sassLint = require('gulp-sass-lint');
const through = require('through2');
const exec = require('child_process').exec;

const fs = require('fs');

const outputPath = 'scss';
const unfixedScssPath = 'styles';

const importReplacement = /@import \((once|reference|)\) (".*\/)(.*?)\.(generic|material).scss(";)/gm;
const compactMixinReplacementIndex = /@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}/g;
const compactMixinReplacementSizes = /[\w\W]*?@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}([\w\W]*)/g;

const compactMixinUsageReplacement = /@include\s+dx-size-(compact|default);/g;

let widgetsColorVariables = {};

gulp.task('fix-scss-clean', () => del([outputPath]));

gulp.task('less2sass', (callback) => {
    exec('npx less2sass styles', (e, out, err) => {
        console.log(out);
        console.log(err);
        callback(e);
    });
});

gulp.task('fix-bundles', () => {
    // TODO make as in spike
    return gulp
        .src(`${unfixedScssPath}/bundles/*.scss`)
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(gulp.dest(`${outputPath}/bundles`));
});

gulp.task('fix-base', () => {
    // the same code for different themes
    return gulp
        .src(`${unfixedScssPath}/widgets/base/*.scss`)
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(gulp.dest(`${outputPath}/widgets/base`));
});

gulp.task('fix-common', () => {
    // for dx.common.css
    return gulp
        .src(`${unfixedScssPath}/widgets/common/*.scss`)
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(gulp.dest(`${outputPath}/widgets/common`));
});

gulp.task('fix-themes', () => {
    return gulp
        .src([`${unfixedScssPath}/widgets/generic/*.scss`, `${unfixedScssPath}/widgets/material/*.scss`], { base: `${unfixedScssPath}/` })
        .pipe(replace(importReplacement, '@use "../$3";'))
        // .pipe(replace.apply(gulp, compactMixinReplacement))
        .pipe(replace(compactMixinUsageReplacement, ''))
        .pipe(rename((path) => {
            const widgetName = path.basename.replace(/\.(material|generic)/g, '');
            path.dirname += `/${widgetName}`;
            path.basename = `_index`;
        }))
        .pipe(gulp.dest(outputPath))
        .pipe(through.obj((chunk, enc, callback) => {
            const folder = chunk.path.replace('_index.scss', '');
            const content = chunk.contents.toString();
            const isGeneric = folder.indexOf('generic') >= 0;

            // remove size mixins from _index
            let indexContent = '$color-scheme: null !default;\n';
            indexContent += '$size: null !default;\n';
            if(!isGeneric) {
                indexContent += '$mode: null !default;\n\n';
                indexContent += '@use "colors" with ($color-scheme: $color-scheme, $mode: $mode);\n';
            } else {
                indexContent += '\n';
                indexContent += '@use "colors" with ($color-scheme: $color-scheme);\n';
            }

            indexContent += '@use "sizes" with ($size: $size);\n';
            indexContent += content.replace(compactMixinReplacementIndex, '');
            chunk.contents = new Buffer(indexContent);

            // TODO - what about widget-specific color vars
            let colorsContent = '@use "sass:color";\n$color-scheme: null !default;\n';
            if(!isGeneric) {
                colorsContent += '$mode: null !default;\n\n';
                colorsContent += '@forward "../base/colors" with ($color-scheme: $color-scheme, $mode: $mode);\n';
                colorsContent += '@use "../base/colors" with ($color-scheme: $color-scheme, $mode: $mode);\n\n';
            } else {
                colorsContent += '\n';
                colorsContent += '@forward "../base/colors" with ($color-scheme: $color-scheme);\n';
                colorsContent += '@use "../base/colors" with ($color-scheme: $color-scheme);\n\n';
            }
            fs.writeFileSync(path.join(folder, '_colors.scss'), colorsContent);

            // add size mixins into _sizes
            // TODO - @forward base/sizes; @use base/sizes;
            let sizesContent = '$size: null !default;\n\n';
            if(compactMixinReplacementSizes.test(content)) {
                sizesContent += content.replace(compactMixinReplacementSizes, (match, defaultSize, compactSize) => {
                    const defaultDefinition = defaultSize.replace(/^\s*(\$.*?):.*?;/gm, '$1: null !default;');
                    return `${defaultDefinition}\n@if $size == "default" {${defaultSize}}\n@else if $size == "compact" {${compactSize}}`;
                });
            }

            fs.writeFileSync(path.join(folder, '_sizes.scss'), sizesContent);

            callback(null, chunk);
        }))
        .pipe(gulp.dest(outputPath));
});


const getBaseContent = (content) => content.replace(/\/\/[\w\W]*/, '');
const getVariableNames = (content) => {
    const variableRegex = /^(\$[\w-_].*?):/gm;
    const variables = [];

    let tmp;
    while((tmp = variableRegex.exec(content)) !== null) {
        const varName = tmp[1];
        if(variables.indexOf(varName) < 0) variables.push(varName);
    }

    return variables;
};
const generateDefaultVariablesBlock = (variables) => {
    let content = '';
    variables.forEach(variable => {
        content += `${variable}: null !default;\n`;
    });
    return content;
};

const createBaseWidgetFolder = (theme) => {
    const baseWidgetPath = path.join(__dirname, '../..', outputPath, 'widgets', theme, 'base');
    if(!fs.existsSync(baseWidgetPath)) fs.mkdirSync(baseWidgetPath);
    return baseWidgetPath;
};

const makeIndent = (content) => {
    return content.replace(/(^.*)/gm, '    $1');
};

const fillWidgetColors = (theme) => {
    Object.keys(widgetsColorVariables).forEach(widget => {
        const targetFilePath = path.join(__dirname, '../..', outputPath, 'widgets', theme, widget, '_colors.scss');

        if(!fs.existsSync(targetFilePath)) {
            console.log('Widget file not found: ', targetFilePath);
            return;
        }

        const currentContent = fs.readFileSync(targetFilePath).toString();
        let additionalContent = '';
        let widgetVariablesContent = '';

        Object.keys(widgetsColorVariables[widget]).forEach(colorScheme => {
            const variableName = theme === 'material' ? 'mode' : 'color-scheme';
            const variablesContent = widgetsColorVariables[widget][colorScheme];
            widgetVariablesContent += variablesContent;
            additionalContent += `@if $${variableName} == "${colorScheme}" {\n${makeIndent(variablesContent)}\n}\n\n`;
        });

        const widgetVariablesForDefine = getVariableNames(widgetVariablesContent);

        fs.writeFileSync(targetFilePath, [
            currentContent,
            generateDefaultVariablesBlock(widgetVariablesForDefine),
            additionalContent
        ].join('\n\n'));
    });
};

const collectWidgetColorVariables = (content, schemeName) => {
    const widgetContentRegex = /\/\/\s?(?!TODO)(dx)?(\w.*)([\w\W]*?)(\n\/\/|$)/g;
    const aliases = {
        'normal button': 'button',
        'default button': 'button',
        'danger button': 'button',
        'success button': 'button',
        'flat button': 'button',
        'badges': 'badge',
        'color view': 'colorview'
    };

    let regResult;
    while((regResult = widgetContentRegex.exec(content)) !== null) {
        let widget = regResult[2].toLowerCase();
        if(aliases[widget]) widget = aliases[widget];
        const widgetContent = regResult[3];
        widgetContentRegex.lastIndex -= 2;

        widgetsColorVariables[widget] = widgetsColorVariables[widget] || {};
        widgetsColorVariables[widget][schemeName] = widgetsColorVariables[widget][schemeName] || '';
        widgetsColorVariables[widget][schemeName] += widgetContent;
    }
};

const cleanWidgetColorVariables = () => {
    widgetsColorVariables = {};
};

gulp.task('create-base-widget-generic-colors', (callback) => {
    const baseWidgetPath = createBaseWidgetFolder('generic');

    // _colors

    // read all base variables (to the first widget-specific comment)
    const sourcePath = path.join(__dirname, '../..', unfixedScssPath, 'widgets', 'generic', 'color-schemes');
    const genericLightPath = path.join(sourcePath, 'light', 'generic.light.scss');
    const genericLightIconsPath = path.join(sourcePath, 'light', 'generic.light.icons.scss');
    const themeIconsContent = fs.readFileSync(genericLightIconsPath).toString();
    const genericContent = fs.readFileSync(genericLightPath).toString();
    const genericBaseContent = getBaseContent(genericContent) + '\n' + themeIconsContent;
    const genericBaseVariables = getVariableNames(genericBaseContent);

    let colorsContent = '@use "sass:color";\n$color-scheme: null !default;\n\n';
    colorsContent += generateDefaultVariablesBlock(genericBaseVariables);
    colorsContent += '\n';

    fs.readdir(sourcePath, (e, files) => {
        files.forEach(file => {
            const themeDir = path.join(sourcePath, file);
            const themeContent = fs.readFileSync(path.join(themeDir, `generic.${file}.scss`)).toString();
            const themeIconsContent = fs.readFileSync(path.join(themeDir, `generic.${file}.icons.scss`)).toString();
            const baseThemeContent = getBaseContent(themeContent);
            colorsContent += `@if $color-scheme == "${file}" {\n${makeIndent(baseThemeContent + themeIconsContent)}\n}\n\n`;

            collectWidgetColorVariables(themeContent, file);
        });

        fs.writeFileSync(path.join(baseWidgetPath, '_colors.scss'), colorsContent);
        fillWidgetColors('generic');
        cleanWidgetColorVariables();
        callback();
    });
});

gulp.task('create-base-widget-material-colors', (callback) => {
    const baseWidgetPath = createBaseWidgetFolder('material');

    // _colors

    // read all base variables (to the first widget-specific comment)
    const sourcePath = path.join(__dirname, '../..', unfixedScssPath, 'widgets', 'material', 'color-schemes');
    const materialLightPath = path.join(sourcePath, 'material.light.scss');
    const materialLightIconsPath = path.join(sourcePath, 'material.light.icons.scss');
    const materialLightColorPath = path.join(sourcePath, 'blue/material.blue.scss');
    const themeIconsContent = fs.readFileSync(materialLightIconsPath).toString();
    const materialContent = fs.readFileSync(materialLightPath).toString();
    const materialColorContent = fs.readFileSync(materialLightColorPath).toString();
    const materialBaseContent = [materialColorContent, getBaseContent(materialContent), themeIconsContent].join('\n');
    const materialBaseVariables = getVariableNames(materialBaseContent);

    let colorsContent = '@use "sass:color";\n$color-scheme: null !default;\n$mode: null !default;\n\n';
    colorsContent += generateDefaultVariablesBlock(materialBaseVariables);
    colorsContent += '\n';

    fs.readdir(sourcePath, { withFileTypes: true }, (e, files) => {
        files.forEach(file => {
            if(file.isFile()) return;
            const themeDir = path.join(sourcePath, file.name);
            const themeContent = fs.readFileSync(path.join(themeDir, `material.${file.name}.scss`)).toString();
            colorsContent += `@if $color-scheme == "${file.name}" {\n${makeIndent(themeContent)}\n}\n\n`;
        });

        ['light', 'dark'].forEach(mode => {
            const themeContent = fs.readFileSync(path.join(sourcePath, `material.${mode}.scss`)).toString();
            const themeIconsContent = fs.readFileSync(path.join(sourcePath, `material.${mode}.icons.scss`)).toString();
            colorsContent += `@if $mode == "${mode}" {\n${makeIndent([getBaseContent(themeContent), themeIconsContent].join('\n'))}\n}\n\n`;

            collectWidgetColorVariables(themeContent, mode);
        });

        fs.writeFileSync(path.join(baseWidgetPath, '_colors.scss'), colorsContent);
        fillWidgetColors('material');
        cleanWidgetColorVariables();
        callback();
    });
});

gulp.task('create-base-widget-sizes', (callback) => {
    ['generic', 'material'].forEach(theme => {
        const baseWidgetPath = createBaseWidgetFolder(theme);
        const sourcePath = path.join(__dirname, '../..', unfixedScssPath, 'widgets', theme, 'size-schemes');
        const sharedBasePath = path.join(sourcePath, 'shared/base.scss');
        const sharedMobilePath = path.join(sourcePath, 'shared/mobile.scss');
        const sharedBaseContent = fs.readFileSync(sharedBasePath).toString();
        const sharedMobileContent = fs.existsSync(sharedMobilePath) ? fs.readFileSync(sharedMobilePath).toString() : '';

        const defaultSizePath = path.join(sourcePath, 'default.scss');
        const defaultSizeContent = fs.readFileSync(defaultSizePath).toString();
        const defaultSizeVariables = getVariableNames(defaultSizeContent);

        let sizesContent = '$size: null !default;\n\n';
        sizesContent += generateDefaultVariablesBlock(defaultSizeVariables);
        sizesContent += [sharedBaseContent, sharedMobileContent].join('\n');

        ['default', 'compact'].forEach(size => {
            let sizeContent = fs.readFileSync(path.join(sourcePath, `${size}.scss`)).toString();
            sizeContent = sizeContent.replace(/^@(import|include).*/gm, '');
            sizesContent += `@if $size == "${size}" {\n${makeIndent(sizeContent)}\n}\n\n`;
        });

        fs.writeFileSync(path.join(baseWidgetPath, '_sizes.scss'), sizesContent);
    });
    callback();
});

gulp.task('create-base-widget', gulp.series(
    gulp.parallel(
        'create-base-widget-generic-colors',
        'create-base-widget-material-colors'
    ),
    'create-base-widget-sizes'
));

gulp.task('fix-lint', () => { // this does not work
    return gulp.src(`${outputPath}/**/*.scss`)
        .pipe(sassLint({
            options: {
                // formatter: 'stylish',
                formatter: 'checkstyle',
                'merge-default-rules': false
            },
            rules: {
                'final-newline': true,
                'indentation': { size: 4 }
            }
        }))
        .pipe(sassLint.format())
        .pipe(gulp.dest(outputPath + '1'));
});

gulp.task('convert-scss', gulp.series(
    'fix-scss-clean',
    'less2sass',
    gulp.parallel(
        'fix-bundles',
        'fix-base',
        'fix-common',
        'fix-themes'
        // TODO - create common bundle
    ),
    'create-base-widget'
    // 'fix-lint'
));


gulp.task('sass', () => {
    return gulp.src(`${outputPath}/bundles/dx.light.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('scss-css'));
});

gulp.task('sass1', () => {
    return gulp.src(`spike-scss/bundles/dx.light.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('scss-css'));
});
