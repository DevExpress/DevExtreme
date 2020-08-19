'use strict';

const lazyPipe = require('lazypipe');
const gulpEach = require('gulp-each');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');
const renovatedComponents = require('../../js/bundles/modules/parts/renovation');

const toUnderscoreCase = str => str.replace(/\.?([A-Z])/g, (x, y) => '_' + y.toLowerCase()).replace(/^_/, '');
const renovatedComponentsMeta = renovatedComponents.map(component => ({ name: component.name, fileName: toUnderscoreCase(component.name), ...component }));
const renovatedNamesRegEx = new RegExp(renovatedComponentsMeta.map(({ fileName }) => ('^' + fileName + '\\b')).join('|'), 'i');
const renovationFolder = /renovation/g;
const renovationFileRegEx = new RegExp(renovatedComponentsMeta.map(({ fileName }) => ('ui(\\\\|\\/)' + fileName)).join('|'), 'i');
const jsFileExtension = '.js';

function isOldComponentRenovated(file) {
    const isRenovatedName = !!file.basename.match(renovatedNamesRegEx); // only renovated file names
    const isNotRenovationFolder = file.path.match(renovationFolder) === null; // without renovation folder
    const isJsFile = file.extname === jsFileExtension;
    const isCorrectFilePath = !!file.path.match(renovationFileRegEx); // without ui/text_box/../button.js

    return isRenovatedName && isNotRenovationFolder && isJsFile && isCorrectFilePath;
}

module.exports = {
    TEMP_PATH: 'artifacts/_renovation-temp',
    replaceWidgets: lazyPipe()
        .pipe(function() {
            return gulpIf(isOldComponentRenovated, gulpEach((content, file, callback) => {
                const component = renovatedComponentsMeta.find(component => component.fileName === file.stem);
                const fileContext = 'import Widget from "../renovation/' + component.pathInRenovationFolder + '";export default Widget;';
                callback(null, fileContext);
            }));
        })
        .pipe(function() { // Workaround for scheduler `renovateRender` property.
            return gulpIf(function(file) {
                return file.basename === 'ui.scheduler.work_space.js';
            }, replace('renovateRender: false', 'renovateRender: true'));
        })
};
