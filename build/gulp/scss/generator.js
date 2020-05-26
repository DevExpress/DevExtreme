'use strict';

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const del = require('del');
const through = require('through2');
const exec = require('child_process').exec;

const outputPath = require('./config').outputPath;
const unfixedScssPath = require('./config').unfixedScssPath;
const repositoryRoot = path.join(__dirname, '../../..');

const allImportReplacement = /@import \((once|reference|)\) (".*\/)(.*?).scss(";)/g;

const compactMixinReplacementIndex = /@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}/g;
const compactMixinReplacementSizes = /[\w\W]*?@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}([\w\W]*)/g;
const compactMixinUsageReplacement = /@include\s+dx-size-(compact|default);/g;

// replacement for parent selector (https://github.com/sass/sass/issues/1425)
const parentSelectorRegex = /^(\s*)([.\w\s-]*[\w])&/mg;
const parentSelectorReplacement = '$1@at-root #{selector-append("$2", &)}';

let widgetsColorVariables = {};

gulp.task('scss-raw-scss-clean', () => del(`${unfixedScssPath}/**/*.scss`));
gulp.task('scss-clean', gulp.series(
    'scss-raw-scss-clean',
    () => del(outputPath)
));

gulp.task('less2sass', (callback) => {
    exec('npx less2sass styles', (e, out, err) => {
        console.log(out);
        console.log(err);
        callback(e);
    });
});

const replaceColorFunctions = (content) => {
    // TODO lighten and darken is not included directly in the new module system (https://sass-lang.com/documentation/modules/color#lighten), but it works
    // change fade($color, 20%) to the color.change($color, $alpha: 0.20), $color can be other function
    // change fadein($color, 20%) to the color.adjust($color, $alpha: 0.20), $color can be other function

    content = content.replace(/(fadein|fadeout|fade)\(([$\d\w-#]*|[\w]*\(.*\)),\s*([\d.]+)%?\)(;|,|\)|\s)/g, (match, func, color, percent, sign) => {
        const colorFunction = func === 'fade' ? 'change' : 'adjust';
        percent = func === 'fadeout' ? -percent : percent;
        return `color.${colorFunction}(${color}, $alpha: ${percent / 100})${sign}`;
    });

    content = content.replace(/(\s)(screen|difference)\(/g, '$1extcolor.$2(');
    return content;
};

const replaceInterpolatedCalcContent = (content) => {
    return content.replace(/calc\(([\d]+%) - ((round|\$).*)\);/g, 'calc($1 - #{$2});');
};

gulp.task('fix-bundles', gulp.parallel(
    () => gulp
        .src([
            `${unfixedScssPath}/bundles/*.scss`,
            `!${unfixedScssPath}/bundles/dx.common.scss`,
            `!${unfixedScssPath}/bundles/dx.ios7.default.scss`,
        ])
        .pipe(replace(/@import \(once\).*/, ''))
        .pipe(replace(/\$base-theme:\s*"(generic|material|ios7)";/, '@use "../widgets/$1" with ('))
        .pipe(replace(/;/g, ','))
        .pipe(replace(/,[\W]*$/g, '\n);\n'))
        .pipe(replace(/\$light/, '$mode'))
        .pipe(gulp.dest(`${outputPath}/bundles`)),

    () => gulp
        .src(`${unfixedScssPath}/bundles/dx.common.scss`)
        .pipe(replace(/@import \(reference\).*/g, ''))
        .pipe(replace(/@import \(once\)(.*)/g, '@use $1'))
        .pipe(replace(/\.scss/g, ''))
        .pipe(replace(/widgets\/ui/, 'widgets/common/ui'))
        // .pipe(replace('@use  "../widgets/common/htmlEditor";', '')) // TODO enable htmlEditor
        .pipe(through.obj((chunk, enc, callback) => {
            // add 'private' widgets to the bundle
            const widgets = [
                'scrollable',
                'badge',
                'textEditor',
                'dropDownEditor',
                'dateView',
                'timeView',
                'dropDownList',
                'overlay',
                'dropDownMenu',
                'radioButton',
                'colorView',
                'pager',
                'menuBase',
                'recurrenceEditor',
                'splitter'
            ];
            let content = chunk.contents.toString();
            widgets.forEach(widget => content += `@use "../widgets/common/${widget}";\n`);
            chunk.contents = new Buffer.from(content);
            callback(null, chunk);
        }))
        .pipe(gulp.dest(`${outputPath}/bundles`))
));

gulp.task('fix-base', () => {
    return gulp
        .src([`${unfixedScssPath}/widgets/base/*.scss`, 'build/gulp/scss/snippets/string.scss'])
        // .pipe(replace(/\.dx-font-icon\("/g, '@include dx-font-icon("'))
        // icons
        .pipe(replace('@mixin dx-icon-sizing', '@use "sass:map";\n\n@mixin dx-icon-sizing'))
        .pipe(replace('@mixin dx-font-icon($icons[$$name]),', '@include dx-font-icon(map.get($icons, $name));'))
        .pipe(replace(/\$icons:\s{([\w\W]*?)}/, (_, codes) => {
            return `$icons: (${codes.replace(/;/g, ',')});`;
        }))
        .pipe(replace('f11d",', 'f11d"'))
        .pipe(replace(/each\(\$icons,\s{([\w\W]*)}\);/, '@each $key, $val in $icons {$1}'))

        // dataGrid
        .pipe(replace('.dx-datagrid-borders', '@use "sass:color";\n@use "./mixins" as *;\n@use "./icons" as *;\n\n.dx-datagrid-borders'))

        // treeList
        .pipe(replace(/\$treelist-border/, '@use "sass:color";\n@use "./mixins" as *;\n@use "./icons" as *;\n\n$treelist-border'))

        // pivotGrid
        .pipe(replace(/^\$PIVOTGRID_DRAG_HEADER_BORDER/, '@use "./mixins" as *;\n@use "./icons" as *;\n\n$PIVOTGRID_DRAG_HEADER_BORDER'))

        // scheduler
        .pipe(replace(/(@mixin |\.)dx-scheduler-group-mixin\((.*?)\),/g, '@include dx-scheduler-group-mixin($2);'))
        .pipe(replace(/(@mixin |\.)set-size-timeline-horizontal-grouping-mixin\((.*?)\),/g, '@include set-size-timeline-horizontal-grouping-mixin($2);'))
        .pipe(replace(/(@mixin |\.)set-size-timeline-group-table-mixin\((.*?)\),/g, '@include set-size-timeline-group-table-mixin($2);'))
        .pipe(replace(/(@mixin |\.)set-size-vertical-group-table-mixin\((.*?)\),/g, '@include set-size-vertical-group-table-mixin($2);'))
        .pipe(replace(/(@mixin |\.)dx-icon\((.*?)\),/g, '@include dx-icon($2);'))
        .pipe(replace(/& when (not )?\((.*?)\)/g, '@if $1$2'))
        .pipe(replace(/(_TOP|_LEFT|100%|absolute|inherit|""|0|_COLOR|none|_BORDER|relative|inline-block|hidden|left),$/gm, '$1;'))
        .pipe(replace(/^\$SCHEDULER_NAVIGATOR_OFFSET/, '@use "./mixins" as *;\n@use "./icons" as *;\n\n$SCHEDULER_NAVIGATOR_OFFSET'))

        // fileManager, diagram, gantt
        .pipe(replace(/\.(filemanager|diagram|gantt)-icon-colored\(d/g, '@include $1-icon-colored(d'))
        .pipe(replace(/@mixin (filemanager|diagram|gantt)-icon-colored/, '@use "sass:string";\n@use "./string" as *;\n\n@mixin $1-icon-colored'))
        .pipe(replace(/, "gi"/g, ''))
        .pipe(replace(/(\W)e\(/g, '$1string.unquote('))

        // sortable
        .pipe(replace('.dx-sortable-placeholder', '@use "sass:color";\n\n.dx-sortable-placeholder'))

        // filterBuilder
        .pipe(replace(/^.dx-filterbuilder/, '@use "./icons" as *;\n\n.dx-filterbuilder'))

        .pipe(replace(parentSelectorRegex, parentSelectorReplacement))
        .pipe(through.obj((file, enc, callback) => {
            let content = file.contents.toString();
            content = replaceColorFunctions(content);
            content = replaceInterpolatedCalcContent(content);
            file.contents = Buffer.from(content);
            callback(null, file);
        }))
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(gulp.dest(`${outputPath}/widgets/base`));
});

gulp.task(function fixCommon() {
    return gulp
        .src([`${unfixedScssPath}/widgets/common/*.scss`, `${unfixedScssPath}/widgets/ui.scss`])
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(replace(/@import \(once\)(.*)/g, ''))
        .pipe(replace(parentSelectorRegex, parentSelectorReplacement))
        .pipe(replace(/(\W)e\(/g, '$1string.unquote('))
        .pipe(through.obj((chunk, enc, callback) => {
            let content = chunk.contents.toString();
            content = `@use "../base/mixins" as *;\n// adduse\n${content}`;
            content = commonSpecificReplacement(content, chunk.path);
            content = replaceInterpolatedCalcContent(content);
            chunk.contents = Buffer.from(content);
            callback(null, chunk);
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

const getRealFileName = (sassModuleName) => {
    if(fs.existsSync(sassModuleName)) return sassModuleName;

    const indexFileName = path.join(sassModuleName, '_index.scss');
    if(fs.existsSync(indexFileName)) return indexFileName;

    const moduleFileName = '_' + path.basename(sassModuleName) + '.scss';
    const moduleDirName = path.dirname(sassModuleName);
    const moduleRealFileName = path.join(moduleDirName, moduleFileName);
    if(fs.existsSync(moduleRealFileName)) return moduleRealFileName;

    throw new Error(`Module ${sassModuleName} not found`);
};

const addImportedVariables = (r, folder) => {
    if(!r.withVars || r.withVars.length === 0) return '';

    let variables = '';
    let withPart = '';
    let definitions = '';
    r.withVars.forEach((variable) => {
        variables += `    $${variable}: $${variable},\n`;
        definitions += `$${variable}: null !default;\n`;
    });
    withPart = ` with (\n${variables})`;

    const targetFileName = getRealFileName(path.join(folder, r.import));
    let content = fs.readFileSync(targetFileName).toString();
    if(content.indexOf(definitions) !== 0) {
        content = definitions + content;
    }
    fs.writeFileSync(targetFileName, content);
    return withPart;
};

const specificReplacement = (content, folder, file) => {
    const widget = path.basename(folder);
    const replacementTable = require('./theme-replacements');

    if(replacementTable[widget]) {
        replacementTable[widget].forEach(r => {
            if(r.regex && file === 'index') {
                content = content.replace(r.regex, r.replacement);
            } else if(r.import && r.type === file) {
                const withPart = addImportedVariables(r, folder);
                const alias = r.alias || '*';
                content = content.replace(/\/\/\sadduse/, `@use "${r.import}" as ${alias}${withPart};\n// adduse`);
            }

        });
    }

    return content;
};

const commonSpecificReplacement = (content, fileName) => {
    const widget = path.basename(fileName).replace(/(.scss|_)/g, '');
    const replacementTable = require('./common-replacements');

    if(replacementTable[widget]) {
        replacementTable[widget].forEach(r => {
            if(r.regex) {
                content = content.replace(r.regex, r.replacement);
            } else if(r.import) {
                // const withPart = addImportedVariables(r, folder); // it seems we do not need it in common
                const alias = r.alias || '*';
                content = content.replace(/\/\/\sadduse/, `@use "${r.import}" as ${alias};\n// adduse`);
            }
        });
    }

    return content;
};

gulp.task('create-widgets', () => {
    return gulp
        .src([`${unfixedScssPath}/widgets/generic/*.scss`, `${unfixedScssPath}/widgets/material/*.scss`], { base: `${unfixedScssPath}/` })
        .pipe(replace(compactMixinUsageReplacement, ''))
        // remove all dependency imports
        .pipe(replace(allImportReplacement, ''))
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
            let indexContent = '@use "sass:color";\n';
            indexContent += '@use "colors" as *;\n';
            indexContent += '@use "../colors" as *;\n';
            indexContent += '@use "sizes" as *;\n';
            indexContent += '@use "../sizes" as *;\n';

            indexContent += '// adduse\n';
            indexContent += content.replace(compactMixinReplacementIndex, '');
            indexContent = specificReplacement(indexContent, folder, 'index');
            indexContent = replaceColorFunctions(indexContent);
            indexContent = replaceInterpolatedCalcContent(indexContent);
            indexContent = indexContent.replace(parentSelectorRegex, parentSelectorReplacement);
            chunk.contents = Buffer.from(indexContent);

            let colorsContent = '@use "sass:color";\n';
            colorsContent += '@use "../sizes" as *;\n';
            colorsContent += '@use "../colors" as *;\n';
            colorsContent += '// adduse\n\n';
            colorsContent = specificReplacement(colorsContent, folder, 'colors');

            fs.writeFileSync(path.join(folder, '_colors.scss'), colorsContent);

            // add size mixins into _sizes
            let sizesContent = '@use "../sizes" as *;\n';
            sizesContent += '// adduse\n\n';
            sizesContent = specificReplacement(sizesContent, folder, 'sizes');
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

const createThemeFolder = (theme) => {
    const themePath = path.join(repositoryRoot, outputPath, 'widgets', theme);
    if(!fs.existsSync(themePath)) fs.mkdirSync(themePath);
    return themePath;
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
            const variableName = theme === 'material' ? 'mode' : 'color';
            let variablesContent = widgetsColorVariables[widget][colorScheme];
            variablesContent = replaceColorFunctions(variablesContent);
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

const makeVariableDefinitionDefault = (content) => content.replace(/(\$.*?)( !default)*;(\s)/gm, '$1 !default;$3');

const collectWidgetColorVariables = (content, schemeName) => {
    const widgetContentRegex = /\/\/\s?(?!TODO)(dx)?(\w.*)([\w\W]*?)(\n\/\/|$)/g;
    const aliases = {
        'normal button': 'button',
        'default button': 'button',
        'danger button': 'button',
        'success button': 'button',
        'flat button': 'button',
        'badges': 'badge',
        'color view': 'colorView',
        'normal button (buttongroup)': 'buttonGroup',
        'default button (buttongroup)': 'buttonGroup',
        'danger button (buttongroup)': 'buttonGroup',
        'success button (buttongroup)': 'buttonGroup',
        'checkbox': 'checkBox',
        'fileuploader': 'fileUploader',
        'selectbox': 'selectBox',
        'datagrid': 'gridBase'
    };

    let regResult;
    while((regResult = widgetContentRegex.exec(content)) !== null) {
        let widget = regResult[2];
        widget = widget[0].toLowerCase() + widget.slice(1);
        const lowerCaseWidget = widget.toLowerCase();
        if(aliases[lowerCaseWidget]) widget = aliases[lowerCaseWidget];
        const widgetContent = regResult[3];
        widgetContentRegex.lastIndex -= 2;

        widgetsColorVariables[widget] = widgetsColorVariables[widget] || {};
        widgetsColorVariables[widget][schemeName] = widgetsColorVariables[widget][schemeName] || '';
        widgetsColorVariables[widget][schemeName] += makeVariableDefinitionDefault(widgetContent);
    }
};

const cleanWidgetColorVariables = () => {
    widgetsColorVariables = {};
};

gulp.task('create-base-widget-generic-colors', (callback) => {
    const themePath = createThemeFolder('generic');

    // _colors

    // read all base variables (to the first widget-specific comment)
    const sourcePath = path.join(repositoryRoot, unfixedScssPath, 'widgets', 'generic', 'color-schemes');
    const genericCarminePath = path.join(sourcePath, 'carmine', 'generic.carmine.scss');
    const genericLightIconsPath = path.join(sourcePath, 'light', 'generic.light.icons.scss');
    const themeIconsContent = fs.readFileSync(genericLightIconsPath).toString();
    const genericContent = fs.readFileSync(genericCarminePath).toString();
    const genericBaseContent = getBaseContent(genericContent) + '\n' + themeIconsContent;
    const genericBaseVariables = getVariableNames(genericBaseContent);

    // additional variables
    Array.prototype.push.apply(genericBaseVariables, [
        // contrast
        '$base-default',
        '$base-info',
        // darkmoon
        '$screen-text-color',
        '$base-grid-selected-border-color',
        // darkviolet
        '$base-accent-highlight-color',
        '$base-row-alternation-background',
        '$base-selected-border',
        // softblue
        '$base-webwidget-hover-background',
        '$base-grid-selection-background',
        '$base-grid-selectedrow-border-color'
    ]);

    let colorsContent = '@use "sass:color";\n@use "./color" as extcolor;\n$color: null !default;\n\n';
    colorsContent += generateDefaultVariablesBlock(genericBaseVariables);
    colorsContent += '\n';

    fs.readdir(sourcePath, (e, files) => {
        files.forEach(file => {
            const themeDir = path.join(sourcePath, file);
            const themeContent = fs.readFileSync(path.join(themeDir, `generic.${file}.scss`)).toString();
            const themeIconsContent = fs.readFileSync(path.join(themeDir, `generic.${file}.icons.scss`)).toString();
            const baseThemeContent = getBaseContent(themeContent);
            colorsContent += `@if $color == "${file}" {\n${makeIndent(baseThemeContent + themeIconsContent)}\n}\n\n`;
            colorsContent = makeVariableDefinitionDefault(colorsContent);
            colorsContent = replaceColorFunctions(colorsContent);

            collectWidgetColorVariables(themeContent, file);
        });

        fs.writeFileSync(path.join(themePath, '_colors.scss'), colorsContent);
        fs.copyFileSync(path.join(__dirname, 'snippets', 'color.scss'), path.join(themePath, 'color.scss'));
        fillWidgetColors('generic');
        cleanWidgetColorVariables();
        callback();
    });
});

gulp.task('create-base-widget-material-colors', (callback) => {
    const themePath = createThemeFolder('material');

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
            colorsContent = makeVariableDefinitionDefault(colorsContent);
        });

        ['light', 'dark'].forEach(mode => {
            let themeContent = fs.readFileSync(path.join(sourcePath, `material.${mode}.scss`)).toString();
            const themeIconsContent = fs.readFileSync(path.join(sourcePath, `material.${mode}.icons.scss`)).toString();
            themeContent = themeContent.replace(/#F44336;/, '#F44336 !default; /* TODO move outside @if */');
            colorsContent += `@if $mode == "${mode}" {\n${makeIndent([getBaseContent(themeContent), themeIconsContent].join('\n'))}\n}\n\n`;
            colorsContent = replaceColorFunctions(colorsContent);
            colorsContent = makeVariableDefinitionDefault(colorsContent);

            collectWidgetColorVariables(themeContent, mode);
        });

        fs.writeFileSync(path.join(themePath, '_colors.scss'), colorsContent);
        fs.copyFileSync(path.join(__dirname, 'snippets', 'color.scss'), path.join(themePath, 'color.scss'));
        fillWidgetColors('material');
        cleanWidgetColorVariables();
        callback();
    });
});

gulp.task('create-base-widget-sizes', (callback) => {
    ['generic', 'material'].forEach(theme => {
        const baseWidgetPath = createThemeFolder(theme);
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
    'create-base-widget-generic-colors',
    'create-base-widget-material-colors',
    'create-base-widget-sizes'
));

gulp.task('create-theme-index', (callback) => {
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
        content += `@use "colors" with ($color: $color${modePart});\n@use "sizes" with ($size: $size);`;

        source.forEach(item => {
            if(item.task === 'comment') {
                content += `// ${item.content}\n`;
            } else if(item.task === 'widget') {
                const privateComment = item.private ? ' // private' : '';
                content += `@use "./${item.content}";${privateComment}\n`;
            } else if(item.task === 'newline') {
                content += '\n';
            }
        });

        fs.writeFileSync(fileName, content);
    });

    callback();
});

gulp.task('lint-scss', (callback) => {
    exec('npx stylelint scss --fix', () => callback());
});
