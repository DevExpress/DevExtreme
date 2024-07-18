
const gulpFilter = require('gulp-filter');
const gulpRename = require('gulp-rename');
const replace = require('gulp-replace');
const lazyPipe = require('lazypipe');
const webpack = require('webpack');

const internalModules = [
    {
        dir: 'license',
        publicName: 'license_validation',
        internalName: 'license_validation_internal',
    },
]

const moduleReplacementPlugin = new webpack.NormalModuleReplacementPlugin(
    new RegExp('(.*)/(' + internalModules.map(e => `${e.dir}/${e.publicName}`).join('|') + ')'),
    resource => {
        const renaming = internalModules.find(e => resource.request.includes(e.publicName));
        if(renaming) {
            resource.request = resource.request.replace(renaming.publicName, renaming.internalName);
        }
    }
);

const overwriteInternalPackageName = lazyPipe()
    .pipe(() => replace(/"devextreme(-.*)?"/, '"devextreme$1-internal"'));

const useInternalModules = lazyPipe()
    .pipe(() => gulpFilter(['**'].concat(internalModules.map(e => `!**/${e.dir}/${e.publicName}.js`))))
    .pipe(() => gulpRename(path => {
        const renaming = internalModules.find(e => path.basename.includes(e.internalName));
        if(renaming) {
            path.basename = renaming.publicName;
        }
    }));

const usePublicModules = lazyPipe()
    .pipe(() => gulpFilter(['**'].concat(internalModules.map(e => `!**/${e.dir}/${e.internalName}.js`))));

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
