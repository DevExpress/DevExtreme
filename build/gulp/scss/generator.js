const gulp = require('gulp');
const path = require('path');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const del = require('del');


const through = require('through2');
const exec = require('child_process').exec;

const fs = require('fs');

const outputPath = require('./config').outputPath;
const unfixedScssPath = require('./config').unfixedScssPath;
const repositoryRoot = path.join(__dirname, '../../..');

const importReplacement = /@import \((once|reference|)\) (".*\/)(.*?)\.(generic|material).scss(";)/gm;
const compactMixinReplacementIndex = /@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}/g;
const compactMixinReplacementSizes = /[\w\W]*?@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}([\w\W]*)/g;

const compactMixinUsageReplacement = /@include\s+dx-size-(compact|default);/g;

let widgetsColorVariables = {};

gulp.task('fix-scss-clean', () => del([outputPath, `${unfixedScssPath}/**/*.scss`]));

gulp.task('less2sass', (callback) => {
    exec('npx less2sass styles', (e, out, err) => {
        console.log(out);
        console.log(err);
        callback(e);
    });
});

gulp.task('fix-bundles', () => {
    return gulp
        .src(`${unfixedScssPath}/bundles/*.scss`)
        // next replaces make @use "../widgets/generic" with ();
        .pipe(replace(/@import \(once\).*/, ''))
        .pipe(replace(/\$base-theme:\s*"(generic|material|ios7)";/, '@use "../widgets/$1" with ('))
        .pipe(replace(/;/g, ','))
        .pipe(replace(/,[\W]*$/g, '\n);\n'))
        .pipe(replace(/\$light/, '$mode'))
        .pipe(gulp.dest(`${outputPath}/bundles`));
});

gulp.task('fix-base', () => {
    // the same code for different themes
    return gulp
        .src(`${unfixedScssPath}/widgets/base/*.scss`)
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(replace(/\.dx-font-icon\("/g, '@include dx-font-icon("'))
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

gulp.task('fix-mixins', () => {
    return gulp
        .src(`${unfixedScssPath}/mixins.scss`)
        .pipe(replace('user-select: $value;', 'user-select: $value;\n    @if $value == none {\n        -webkit-touch-callout: none;\n    }'))
        .pipe(replace(/@mixin user-select\(\$value\) when \(\$value = none\)[\w\W]*?}/g, ''))
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(gulp.dest(`${outputPath}/widgets/base`));
});

const specificReplacement = (content, folder) => {
    const widget = path.basename(folder);
    const replacementTable = require('./replacements');

    if(replacementTable[widget]) {
        replacementTable[widget].forEach(r => {
            if(r.regex) {
                content = content.replace(r.regex, r.replacement);
            } else if(r.import && r.type === 'simple') {
                content = content.replace(/\/\/\sadduse/, `// adduse\n@use "${r.import}" as *; // TODO refactor '*'`);
            }
        });
    }

    return content;
};

gulp.task('fix-themes', () => {
    return gulp
        .src([`${unfixedScssPath}/widgets/generic/*.scss`, `${unfixedScssPath}/widgets/material/*.scss`], { base: `${unfixedScssPath}/` })
        .pipe(replace(importReplacement, '@use "../$3";'))
        // .pipe(replace.apply(gulp, compactMixinReplacement))
        .pipe(replace(compactMixinUsageReplacement, ''))
        .pipe(rename((path) => {
            const widgetName = path.basename.replace(/\.(material|generic)/g, '');
            path.dirname += `/${widgetName}`;
            path.basename = '_index';
        }))
        .pipe(gulp.dest(outputPath))
        .pipe(through.obj((chunk, enc, callback) => {
            const folder = chunk.path.replace('_index.scss', '');
            const content = chunk.contents.toString();

            // remove size mixins from _index
            let indexContent = '@use "colors" as *;\n';
            indexContent += '@use "sizes" as *;\n';
            indexContent += '// adduse\n';
            indexContent += content.replace(compactMixinReplacementIndex, '');
            indexContent = specificReplacement(indexContent, folder);
            chunk.contents = new Buffer(indexContent);

            let colorsContent = '@use "sass:color";\n';
            colorsContent += '@forward "../base/colors";\n';
            colorsContent += '@use "../base/colors" as *;\n\n';

            fs.writeFileSync(path.join(folder, '_colors.scss'), colorsContent);

            // add size mixins into _sizes
            let sizesContent = '@forward "../base/sizes";\n';
            sizesContent += '@use "../base/sizes" as *;\n\n';
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
    const baseWidgetPath = path.join(repositoryRoot, outputPath, 'widgets', theme, 'base');
    if(!fs.existsSync(baseWidgetPath)) fs.mkdirSync(baseWidgetPath);
    return baseWidgetPath;
};

const makeIndent = (content) => {
    return content.replace(/(^.*)/gm, '    $1');
};

const fillWidgetColors = (theme) => {
    Object.keys(widgetsColorVariables).forEach(widget => {
        const targetFilePath = path.join(repositoryRoot, outputPath, 'widgets', theme, widget, '_colors.scss');

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
    const sourcePath = path.join(repositoryRoot, unfixedScssPath, 'widgets', 'generic', 'color-schemes');
    const genericLightPath = path.join(sourcePath, 'light', 'generic.light.scss');
    const genericLightIconsPath = path.join(sourcePath, 'light', 'generic.light.icons.scss');
    const themeIconsContent = fs.readFileSync(genericLightIconsPath).toString();
    const genericContent = fs.readFileSync(genericLightPath).toString();
    const genericBaseContent = getBaseContent(genericContent) + '\n' + themeIconsContent;
    const genericBaseVariables = getVariableNames(genericBaseContent);

    let colorsContent = '@use "sass:color";\n$color: null !default;\n\n';
    colorsContent += generateDefaultVariablesBlock(genericBaseVariables);
    colorsContent += '\n';

    fs.readdir(sourcePath, (e, files) => {
        files.forEach(file => {
            const themeDir = path.join(sourcePath, file);
            const themeContent = fs.readFileSync(path.join(themeDir, `generic.${file}.scss`)).toString();
            const themeIconsContent = fs.readFileSync(path.join(themeDir, `generic.${file}.icons.scss`)).toString();
            const baseThemeContent = getBaseContent(themeContent);
            colorsContent += `@if $color == "${file}" {\n${makeIndent(baseThemeContent + themeIconsContent)}\n}\n\n`;

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
    const sourcePath = path.join(repositoryRoot, unfixedScssPath, 'widgets', 'material', 'color-schemes');
    const materialLightPath = path.join(sourcePath, 'material.light.scss');
    const materialLightIconsPath = path.join(sourcePath, 'material.light.icons.scss');
    const materialLightColorPath = path.join(sourcePath, 'blue/material.blue.scss');
    const themeIconsContent = fs.readFileSync(materialLightIconsPath).toString();
    const materialContent = fs.readFileSync(materialLightPath).toString();
    const materialColorContent = fs.readFileSync(materialLightColorPath).toString();
    const materialBaseContent = [materialColorContent, getBaseContent(materialContent), themeIconsContent].join('\n');
    const materialBaseVariables = getVariableNames(materialBaseContent);

    let colorsContent = '@use "sass:color";\n$color: null !default;\n$mode: null !default;\n\n';
    colorsContent += generateDefaultVariablesBlock(materialBaseVariables);
    colorsContent += '\n';

    fs.readdir(sourcePath, { withFileTypes: true }, (e, files) => {
        files.forEach(file => {
            if(file.isFile()) return;
            const themeDir = path.join(sourcePath, file.name);
            const themeContent = fs.readFileSync(path.join(themeDir, `material.${file.name}.scss`)).toString();
            colorsContent += `@if $color == "${file.name}" {\n${makeIndent(themeContent)}\n}\n\n`;
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
        const sourcePath = path.join(repositoryRoot, unfixedScssPath, 'widgets', theme, 'size-schemes');
        const sharedBasePath = path.join(sourcePath, 'shared/base.scss');
        const sharedMobilePath = path.join(sourcePath, 'shared/mobile.scss');
        const sharedBaseContent = fs.readFileSync(sharedBasePath).toString();
        const sharedMobileContent = fs.existsSync(sharedMobilePath) ? fs.readFileSync(sharedMobilePath).toString() : '';

        const defaultSizePath = path.join(sourcePath, 'default.scss');
        const defaultSizeContent = fs.readFileSync(defaultSizePath).toString();
        const defaultSizeVariables = getVariableNames(defaultSizeContent);

        let sizesContent = '$size: null !default;\n@use "colors" as *;\n\n';
        sizesContent += generateDefaultVariablesBlock(defaultSizeVariables);

        ['default', 'compact'].forEach(size => {
            let sizeContent = fs.readFileSync(path.join(sourcePath, `${size}.scss`)).toString();
            sizeContent = sizeContent.replace(/^@(import|include).*/gm, '');
            sizesContent += `@if $size == "${size}" {\n${makeIndent(sizeContent)}\n}\n\n`;
        });

        sizesContent += [sharedBaseContent, sharedMobileContent].join('\n');

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

// TODO - mixin - we need to @use it where we need
// TODO - ui - need only into dx.common.css bundle
// TODO - core to the index

gulp.task('generate-indexes', (callback) => {
    const source = require('./index-data');

    const themes = ['generic', 'material'];

    themes.forEach(theme => {
        const fileName = path.join(repositoryRoot, outputPath, 'widgets', theme, '_index.scss');
        let content = '$color: null !default;\n';
        content += '$size: null !default;\n';
        if(theme === 'material') {
            content += '$mode: null !default;\n\n';
        } else {
            content += '\n';
        }

        const modePart = theme === 'material' ? ', $mode: $mode' : '';
        content += `@use "./base/colors" with ($color: $color${modePart});\n@use "./base/sizes" with ($size: $size);`;

        source.forEach(item => {
            if(item.task === 'comment') {
                content += `// ${item.content}\n`;
            } else if(item.task === 'widget') {
                content += `@use "./${item.content}";\n`;
            } else if(item.task === 'newline') {
                content += '\n';
            }
        });

        fs.writeFileSync(fileName, content);
    });

    callback();
});
