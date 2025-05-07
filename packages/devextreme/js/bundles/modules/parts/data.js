/* eslint-disable import/no-commonjs */
const DevExpress = require('./core');

/// BUNDLER_PARTS
/* Data (dx.module-core.js) */

const data = DevExpress.data = require('../../../bundles/modules/data');
require('../../../bundles/modules/data.legacy');

data.odata = require('../../../bundles/modules/data.odata');
require('../../../bundles/modules/data.odata.legacy');
/// BUNDLER_PARTS_END

module.exports = data;
