import { extend as _extend } from '../../core/utils/extend';
import { isFunction } from '../../core/utils/type';
import numberLocalization from '../../localization/number';

const defaultCustomizeLinkTooltip = (format) => function(info) {
    const weight = numberLocalization.format(info.weight ?? 0, format);
    return { html: `<strong>${info.source} > ${info.target}</strong><br/>Weight: ${weight}` };
};
const defaultCustomizeNodeTooltip = (format) => function(info) {
    const [weightIn, weightOut] = [info.weightIn, info.weightOut].map(value => numberLocalization.format(value ?? 0, format));
    return { html: `<strong>${info.label}</strong><br/>Incoming weight: ${weightIn}<br/>Outgoing weight: ${weightOut}` };
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

        let linkTemplate;
        let nodeTemplate;
        if(options.linkTooltipTemplate) {
            linkTemplate = this._getTemplate(options.linkTooltipTemplate);
        }
        if(options.nodeTooltipTemplate) {
            nodeTemplate = this._getTemplate(options.nodeTooltipTemplate);
        }

        tooltip && tooltip.update(_extend({}, options, {
            customizeTooltip: function(args) {
                if(!(linkTemplate && args.type === 'link' || nodeTemplate && args.type === 'node')) {
                    args.skipTemplate = true;
                }
                const format = options.format || (_ => _);
                if(args.type === 'node') {
                    return generateCustomCallback(options.customizeNodeTooltip, defaultCustomizeNodeTooltip(format))(args.info);
                } else if(args.type === 'link') {
                    return generateCustomCallback(options.customizeLinkTooltip, defaultCustomizeLinkTooltip(format))(args.info);
                }

                return {};
            },
            contentTemplate(arg, div) {
                const templateArgs = { model: arg.info, container: div };
                if(linkTemplate && arg.type === 'link') {
                    return linkTemplate.render(templateArgs);
                }
                if(nodeTemplate && arg.type === 'node') {
                    return nodeTemplate.render(templateArgs);
                }
            },
            enabled: options.enabled
        }));
    };
    sankey.prototype.hideTooltip = function() {
        this._tooltip && this._tooltip.hide();
    };
}
