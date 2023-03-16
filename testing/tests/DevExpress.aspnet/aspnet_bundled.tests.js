// SystemJS.config({
//     meta: {
//         '/testing/*': { format: 'global' },
//         '/testing/helpers/jQueryEventsPatch.js': { format: 'system' },
//         '/testing/helpers/ajaxMock.js': { format: 'cjs' },
//         '/testing/helpers/dataPatch.js': { format: 'system' },
//         '/testing/helpers/wrapRenovatedWidget.js': { format: 'cjs' },
//         '/testing/helpers/renovationPagerHelper.js': { format: 'cjs' },
//         '/testing/helpers/renovationScrollableHelper.js': { format: 'cjs' },
//         '/testing/helpers/renovationScrollViewHelper.js': { format: 'cjs' },
//         'aspnet.js': { format: 'global' }
//     }
// });

import widgetErrors from 'ui/widget/ui.errors';
import ajaxMock from '/testing/helpers/ajaxMock.js';

window.DevExpress_ui_widget_errors = widgetErrors;
window.ajaxMock = ajaxMock;
// import 'bundles/dx.web.js';
import 'aspnet.js';
import '/testing/tests/DevExpress.aspnet/aspnet.tests.js';
