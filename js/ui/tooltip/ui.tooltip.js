const $ = require('../../core/renderer');
const Tooltip = require('./tooltip');
const extend = require('../../core/utils/extend').extend;
const Deferred = require('../../core/utils/deferred').Deferred;
const viewPortUtils = require('../../core/utils/view_port');

let tooltip = null;
let removeTooltipElement = null;

const createTooltip = function(options) {
    options = extend({ position: 'top' }, options);

    const content = options.content;
    delete options.content;

    const $tooltip = $('<div>')
        .html(content)
        .appendTo(viewPortUtils.value());

    removeTooltipElement = function() {
        $tooltip.remove();
    };

    tooltip = new Tooltip($tooltip, options);
};

const removeTooltip = function() {
    if(!tooltip) {
        return;
    }

    removeTooltipElement();
    tooltip = null;
};

exports.show = function(options) {
    removeTooltip();
    createTooltip(options);
    return tooltip.show();
};

exports.hide = function() {
    if(!tooltip) {
        return new Deferred().resolve();
    }

    return tooltip.hide()
        .done(removeTooltip)
        .promise();
};
