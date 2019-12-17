/**
 * @name dxTooltip
 * @inherits dxPopover
 * @hasTranscludedContent
 * @module ui/tooltip
 * @export default
 */
module.exports = require('./tooltip/tooltip');

// NOTE: internal api: dashboards
module.exports.show = require('./tooltip/ui.tooltip').show;
module.exports.hide = require('./tooltip/ui.tooltip').hide;
