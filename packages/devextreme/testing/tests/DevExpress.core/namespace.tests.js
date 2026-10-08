import testGlobalExports from '../../helpers/publicModulesHelper.js';
import { version } from 'core/version';

import 'bundles/modules/core';

testGlobalExports({
    'DevExpress': DevExpress
}, {
    'VERSION': version
});
