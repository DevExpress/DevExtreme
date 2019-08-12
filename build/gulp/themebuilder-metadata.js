const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const lessCompiler = require('less');

const context = require('./context.js'); // TODO read version from context
const themes = require('../../themebuilder/modules/themes');

const capitalize = (key) => key.charAt(0).toUpperCase() + key.slice(1);

const parseComments = (comments) => {
    const commentRegex = /@(type|name|typeValues)\s(.+)/g;
    const metaItem = {};

    let matches;
    while((matches = commentRegex.exec(comments)) !== null) {
        const key = capitalize(matches[1]);
        metaItem[key] = matches[2];
    }

    return metaItem;
};

const getMetaItems = (less) => {
    const commentBlockRegex = /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-@a-z_0-9]+):/gm;
    const metaItems = [];

    let matches;
    while((matches = commentBlockRegex.exec(less)) !== null) {
        const metaItem = {
            'Key': matches[2]
        };
        metaItems.push(Object.assign(metaItem, parseComments(matches[1])));
    }

    return metaItems;
};

gulp.task('style-compiler-tb-metadata', () => {
    const promises = [];
    const veryBigMetaObject = {};
    const resultPath = path.join(__dirname, '..', '..', 'themebuilder', 'data', 'metadata', '1.js');

    themes.forEach((theme) => {
        const colorScheme = theme.colorScheme.replace(/-/g, '.');
        const themeName = theme.name;
        const themePart = (themeName === 'generic' ? '' : themeName + '.');
        const bundlePath = path.join(__dirname, '..', '..', 'styles', 'bundles', themeName, `dx.${themePart}${colorScheme}.less`);
        const propertyName = [themeName, colorScheme.replace(/\./g, '_')].join('_');

        veryBigMetaObject[propertyName] = [];

        promises.push(lessCompiler.render(fs.readFileSync(bundlePath).toString(), {
            filename: bundlePath,
            plugins: [{
                install: function(_, pluginManager) {
                    pluginManager.addPreProcessor({
                        process: (less) => {
                            veryBigMetaObject[propertyName] = veryBigMetaObject[propertyName].concat(getMetaItems(less));
                            return less;
                        }
                    });
                }
            }]
        }));
    });

    return Promise.all(promises).then(() => {
        veryBigMetaObject['_metadata_version'] = context.version.package;
        const meta = 'module.exports = ' + JSON.stringify(veryBigMetaObject) + ';';
        fs.writeFileSync(resultPath, meta);
    });
});
