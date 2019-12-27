const testGlobalExports = require('../../helpers/publicModulesHelper.js');
const version = require('core/version');

require('bundles/modules/core');

testGlobalExports({
    'DevExpress': DevExpress
}, {
    'VERSION': version
});
