'use strict';

const lazyPipe = require('lazypipe');
const gulpEach = require('gulp-each');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');
const renovatedComponents = require('../../js/bundles/modules/parts/renovation');

const renovatedFileNames = renovatedComponents.map(component => component.name);

function isOldComponentRenovated(file) {
    const isRenovatedName = !!file.basename.match(new RegExp(renovatedFileNames.map(fileName => ('^' + fileName + '\\b')).join('|'), 'i')); // only renovated file names
    const isNotRenovationFolder = file.path.match(/renovation/g) === null; // without renovation folder
    const isJsFile = file.extname === '.js';
    const isCorrectFilePath = !!file.path.match(new RegExp(renovatedFileNames.map(fileName => ('ui\\/' + fileName)).join('|'), 'i')); // without ui/text_box/../button.js

    return isRenovatedName && isNotRenovationFolder && isJsFile && isCorrectFilePath;
}

module.exports = {
    TEMP_PATH: 'artifacts/_renovation-temp',
    replaceWidgets: lazyPipe()
        .pipe(function() {
            return gulpIf(isOldComponentRenovated, gulpEach((content, file, callback) => {
                const component = renovatedComponents.find(component => component.name.toLowerCase() === file.stem);
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
