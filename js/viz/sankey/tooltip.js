const _extend = require('../../core/utils/extend').extend;
const isFunction = require('../../core/utils/type').isFunction;
const defaultCustomizeLinkTooltip = function(info) {
    return { html: `<strong>${info.source} > ${info.target}</strong><br/>Weight: ${info.weight}` };
};
const defaultCustomizeNodeTooltip = function(info) {
    return { html: `<strong>${info.title}</strong><br/>Incoming weight: ${info.weightIn}<br/>Outgoing weight: ${info.weightOut}` };
};
const generateCustomCallback = function(customCallback, defaultCallback) {
    return function(objectInfo) {
        let res = isFunction(customCallback) ? customCallback.call(objectInfo, objectInfo) : {};
        const hasOwnProperty = Object.prototype.hasOwnProperty.bind(res);
        if(!hasOwnProperty('html') && !hasOwnProperty('text')) {
            res = _extend(res, defaultCallback.call(objectInfo, objectInfo));
        }
        return res;
    };
};

export function setTooltipCustomOptions(sankey) {
    sankey.prototype._setTooltipOptions = function() {
        const tooltip = this._tooltip;
        const options = tooltip && this._getOption('tooltip');
        tooltip && tooltip.update(_extend({}, options, {
            customizeTooltip: function(args) {
                if(args.type === 'node') {
                    return generateCustomCallback(options.customizeNodeTooltip, defaultCustomizeNodeTooltip)(args.info);
                } else if(args.type === 'link') {
                    return generateCustomCallback(options.customizeLinkTooltip, defaultCustomizeLinkTooltip)(args.info);
                }
                return {};
            },
            enabled: options.enabled
        }));
    };
    sankey.prototype.hideTooltip = function() {
        this._tooltip && this._tooltip.hide();
    };
}
