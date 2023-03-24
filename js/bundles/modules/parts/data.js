import DevExpress from './core';

/// BUNDLER_PARTS
/* Data (dx.module-core.js) */

import data from '../../../bundles/modules/data';
import odata from '../../../bundles/modules/data.odata';

DevExpress.data = data;

data.odata = odata;
/// BUNDLER_PARTS_END

export default data;
