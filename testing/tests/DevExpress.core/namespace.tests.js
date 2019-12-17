var testGlobalExports = require('../../helpers/publicModulesHelper.js'),
    version = require('core/version');

require('bundles/modules/core');

testGlobalExports({
    'DevExpress': DevExpress
}, {
    'VERSION': version
});
