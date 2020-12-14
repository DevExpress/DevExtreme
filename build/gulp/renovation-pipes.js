'use strict';

const path = require('path');
const lazyPipe = require('lazypipe');
const gulpEach = require('gulp-each');
const gulpIf = require('gulp-if');
const replace = require('gulp-replace');

const renovatedComponents = require('../../js/bundles/modules/parts/renovation');

const overwriteWidgetTemplate = require('./overwrite-renovation-widget.js');
const overwriteQUnitWidgetTemplate = require('./overwrite-qunit-renovation-widget.js');

const fileToComponentMap = {};
renovatedComponents.forEach((component) => {
    fileToComponentMap[path.resolve(path.join('./js/', component.pathInJSFolder))] = component;
});

module.exports = {
    TEMP_PATH: 'artifacts/_renovation-temp',
    replaceWidgets: (wrapWidgetForQUnit) => (lazyPipe()
        .pipe(function() {
            return gulpIf((file) => fileToComponentMap[file.path], gulpEach((content, file, callback) => {
                const component = fileToComponentMap[file.path];
                const fileContext = wrapWidgetForQUnit ? overwriteQUnitWidgetTemplate(component) : overwriteWidgetTemplate(component);
                callback(null, fileContext);
            }));
        })
        .pipe(function() { // Workaround for scheduler `renovateRender` property.
            return gulpIf(function(file) {
                return file.basename === 'ui.scheduler.work_space.js';
            }, replace('renovateRender: false', 'renovateRender: true'));
        }))()
};
