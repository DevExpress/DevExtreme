/* global DevExpress */

require('./core');

module.exports = DevExpress.ui = {};

/* Visual Studio Designer Callback (Find better place) */
DevExpress.ui.templateRendered = require('../../ui/widget/ui.template_base').renderedCallbacks;
