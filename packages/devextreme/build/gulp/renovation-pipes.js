'use strict';

const env = require('./env-variables');
const path = require('path');
const lazyPipe = require('lazypipe');
const gulpEach = require('gulp-each');
const gulpIf = require('gulp-if');

const renovatedComponentsPath = 'src/js/renovation/components';
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
        if(component.inProgress && !env.BUILD_INPROGRESS_RENOVATION || !component.pathInJSFolder) {
            return;
        }

        const oldComponentFileName = path.join('./src/js/', component.pathInJSFolder);
        fileToComponentMap[path.resolve(oldComponentFileName)] = {
            ...component,
            pathToComponentRegistrator: path.relative(
                path.dirname(oldComponentFileName),
                './src/js/core/component_registrator'
            ).replace(/\\/g, '/'),
            pathInRenovationFolder: path
                .relative(
                    path.dirname(oldComponentFileName),
                    path.join('./src/js/renovation', component.pathInRenovationFolder)
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
