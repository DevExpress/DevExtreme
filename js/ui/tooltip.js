
module.exports = require('./tooltip/tooltip');

// NOTE: internal api: dashboards
module.exports.show = require('./tooltip/ui.tooltip').show;
module.exports.hide = require('./tooltip/ui.tooltip').hide;
