/// BUNDLER_PARTS

/* Core (dx.module-core.js) */
/* eslint-disable import/no-commonjs */
const DevExpress = require('../../../bundles/modules/core');
require('../../../bundles/modules/core.legacy');

/* Integrations (dx.module-core.js) */

require('../../../integration/jquery');
require('../../../integration/knockout');

require('../../../common/core/localization/globalize/core');
require('../../../common/core/localization/globalize/message');
require('../../../common/core/localization/globalize/number');
require('../../../common/core/localization/globalize/date');
require('../../../common/core/localization/globalize/currency');

/* Events (dx.module-core.js) */

require('../../../common/core/events/click');
require('../../../common/core/events/contextmenu');
require('../../../common/core/events/double_click');
require('../../../common/core/events/drag');
require('../../../common/core/events/hold');
require('../../../common/core/events/hover');
require('../../../common/core/events/pointer');
require('../../../common/core/events/swipe');
require('../../../common/core/events/transform');
/// BUNDLER_PARTS_END

module.exports = DevExpress;
