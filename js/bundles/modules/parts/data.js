var DevExpress = require('./core');

/// BUNDLER_PARTS
/* Data (dx.module-core.js) */

var data = DevExpress.data = require('../../../bundles/modules/data');

data.odata = require('../../../bundles/modules/data.odata');
/// BUNDLER_PARTS_END

module.exports = data;
