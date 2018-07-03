"use strict";

var _extend = require("../../core/utils/extend").extend,
    isFunction = require("../../core/utils/type").isFunction;

export function setTooltipCustomOptions(sankey) {
    sankey.prototype._setTooltipOptions = function() {
        var tooltip = this._tooltip,
            options = tooltip && this._getOption("tooltip");
        tooltip && tooltip.update(_extend({}, options, {
            customizeTooltip: function(args) {
                if(args.type === 'node' && isFunction(options.customizeNodeTooltip)) {
                    return options.customizeNodeTooltip(args.info);
                } else if(args.type === 'link' && isFunction(options.customizeLinkTooltip)) {
                    return options.customizeLinkTooltip(args.info);
                }
                return {};
            },
            enabled: options.enabled
        }));
    };
}
