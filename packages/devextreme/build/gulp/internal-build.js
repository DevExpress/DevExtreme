
const gulpFilter = require('gulp-filter');
const gulpRename = require('gulp-rename');
const replace = require('gulp-replace');
const lazyPipe = require('lazypipe');
const webpack = require('webpack');

const moduleReplacementPlugin = new webpack.NormalModuleReplacementPlugin(/(.*)\/license_validation/, resource => {
    resource.request = resource.request.replace('license_validation', 'license_validation_internal');
});

const overwriteInternalPackageName = lazyPipe()
    .pipe(() => replace(/"devextreme(-.*)?"/, '"devextreme$1-internal"'));

const useInternalModules = lazyPipe()
    .pipe(() => gulpFilter(['**', '!**/license/license_validation.js']))
    .pipe(() => gulpRename(path => {
        if(path.basename.includes('license_validation_internal')) {
            path.basename = 'license_validation';
        }
    }));

const usePublicModules = lazyPipe()
    .pipe(() => gulpFilter(['**', '!**/license/license_validation_internal.js']));

module.exports = {
    INTERNAL_PACKAGE: 'BUILD_INTERNAL_PACKAGE',
    TEST_INTERNAL_PACKAGE: 'BUILD_TEST_INTERNAL_PACKAGE',
    INTERNAL_PACKAGE_DIR: 'devextreme-internal',
    INTERNAL_PACKAGE_DIST_DIR: 'devextreme-dist-internal',
    moduleReplacementPlugin,
    overwriteInternalPackageName,
    useInternalModules,
    usePublicModules,
};
