var $ = require('../../core/renderer'),
    Tooltip = require('./tooltip'),
    extend = require('../../core/utils/extend').extend,
    Deferred = require('../../core/utils/deferred').Deferred,
    viewPortUtils = require('../../core/utils/view_port');

var tooltip = null;
var removeTooltipElement = null;

var createTooltip = function(options) {
    options = extend({ position: 'top' }, options);

    var content = options.content;
    delete options.content;

    var $tooltip = $('<div>')
        .html(content)
        .appendTo(viewPortUtils.value());

    removeTooltipElement = function() {
        $tooltip.remove();
    };

    tooltip = new Tooltip($tooltip, options);
};

var removeTooltip = function() {
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
