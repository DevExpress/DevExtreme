'use strict';

const path = require('path');
const lazyPipe = require('lazypipe');
const gulpEach = require('gulp-each');
const gulpIf = require('gulp-if');

const renovatedComponentsPath = 'js/renovation/components';
const fullRenovatedComponentsPath = '../../' + renovatedComponentsPath;


const overwriteWidgetTemplate = require('./overwrite-renovation-widget.js');
const overwriteQUnitWidgetTemplate = require('./overwrite-qunit-renovation-widget.js');

let fileToComponentMap = {};

function requireWithoutCache(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

function loadConfig() {
    const renovatedComponents = requireWithoutCache(fullRenovatedComponentsPath);
    fileToComponentMap = {};
    renovatedComponents.forEach((component) => {
        const oldComponentFileName = path.join('./js/', component.pathInJSFolder);
        fileToComponentMap[path.resolve(oldComponentFileName)] = {
            ...component,
            pathToComponentRegistrator: path.relative(
                path.dirname(oldComponentFileName),
                './js/core/component_registrator'
            ).replace(/\\/g, '/'),
            pathInRenovationFolder: path
                .relative(
                    path.dirname(oldComponentFileName),
                    path.join('./js/renovation', component.pathInRenovationFolder)
                ).replace(/\\/g, '/'),
        };
    });
}

loadConfig();

module.exports = {
    renovatedComponentsPath: renovatedComponentsPath,
    reloadConfig: (done) => {
        loadConfig();
        done();
    },
    replaceWidgets: (wrapWidgetForQUnit) => (lazyPipe()
        .pipe(function() {
            return gulpIf((file) => fileToComponentMap[file.path], gulpEach((content, file, callback) => {
                const component = fileToComponentMap[file.path];
                const fileContext = wrapWidgetForQUnit ? overwriteQUnitWidgetTemplate(component) : overwriteWidgetTemplate(component);
                callback(null, fileContext);
            }));
        })
    )()
};
